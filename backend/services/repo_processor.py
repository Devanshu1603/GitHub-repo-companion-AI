import os
import shutil
import time
from git import Repo
from typing import List
import stat

# ✅ Extensions you want to keep
VALID_EXTENSIONS = [".py", ".js", ".ts", ".java", ".go", ".cpp", ".md", ".txt", ".json", ".yaml", ".yml"]

# ✅ Unwanted directories to skip
SKIP_DIRS = {".git", "__pycache__", ".venv", "venv", "node_modules"}


def handle_remove_readonly(func, path, exc):
    """
    Fix Windows error: Access denied when trying to remove read-only .git files.
    """
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception as e:
        print(f"⚠️ Failed to delete: {path}, even after removing read-only. Error: {e}")


def clone_repo(repo_url: str, repo_name: str = "cloned_repo") -> str:
    """
    Clones the repo from GitHub to ./temp/{repo_name}, cleaning up the old one safely.
    """
    temp_dir = os.path.join("temp", repo_name)
    print(f"📁 Target directory: {temp_dir}")

    if os.path.exists(temp_dir):
        print(f"🧹 Removing existing folder: {temp_dir}")
        try:
            shutil.rmtree(temp_dir, onexc=handle_remove_readonly)
        except Exception as e:
            print(f"⚠️ Could not remove folder, retrying after delay: {e}")
            time.sleep(1)
            shutil.rmtree(temp_dir, onexc=handle_remove_readonly)

    print(f"📦 Cloning repo {repo_url} into {temp_dir} ...")
    Repo.clone_from(repo_url, temp_dir)
    print("✅ Clone complete.")

    return temp_dir


def get_relevant_files(repo_path: str) -> List[str]:
    """
    Walks through the repo and collects only relevant code/text files, skipping system dirs.
    """
    relevant_files = []

    for root, dirs, files in os.walk(repo_path):
        # Remove unwanted directories from traversal
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for file in files:
            if any(file.endswith(ext) for ext in VALID_EXTENSIONS):
                full_path = os.path.join(root, file)
                relevant_files.append(full_path)

    print(f"🔍 Found {len(relevant_files)} relevant files for processing.")
    return relevant_files
