import logging
from fastapi import APIRouter, HTTPException, Request
from services.repo_processor import clone_repo, get_relevant_files
from services.chunker import chunk_file
from services.embedder import get_embedding
from services.vector_db import ChromaDBWrapper
from utils.file_tree_builder import build_file_tree
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

router = APIRouter()
db = ChromaDBWrapper()

SKIP_FILENAMES = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml"}
SKIP_DIR_NAMES = {"node_modules", "__pycache__", ".git", ".venv", "venv"}

def is_file_allowed(file_path: str) -> bool:
    filename = os.path.basename(file_path)
    if filename in SKIP_FILENAMES:
        logging.info(f"⏭️ Skipping unwanted file: {filename}")
        return False
    parts = set(file_path.split(os.sep))
    if parts.intersection(SKIP_DIR_NAMES):
        logging.info(f"⏭️ Skipping file inside ignored dir: {file_path}")
        return False
    return True

@router.post("/upload-repo")
async def upload_repo(request: Request):
    try:
        data = await request.json()
        repo_url = data.get("repo_url")

        if not repo_url or not repo_url.startswith("https://github.com/"):
            raise HTTPException(status_code=400, detail="Invalid GitHub URL")
        
        db.clear()

        logging.info(f"📦 Cloning repo from {repo_url}")
        repo_path = clone_repo(repo_url)
        logging.info(f"✅ Repo cloned at {repo_path}")



        files = get_relevant_files(repo_path)
        files = [f for f in files if is_file_allowed(f)]

        logging.info(f"🔍 {len(files)} relevant files found after filtering.")
        for file_path in files:
            logging.info(f"➡ File: {file_path}")

        if not files:
            raise HTTPException(status_code=400, detail="No relevant files found.")

        all_chunks, all_embeddings, all_meta = [], [], []

        for file_path in files:
            logging.info(f"📄 Processing file: {file_path}")
            preamble = f"This chunk is from the file: {file_path}\n\n"
            chunks = chunk_file(file_path, preamble=preamble)

            if not chunks:
                logging.warning(f"⚠️ No chunks generated from {file_path}")
                continue

            logging.info(f"✂️ {len(chunks)} chunks created from {file_path}")

            for i, chunk in enumerate(chunks):
                logging.info(f"🧩 Chunk {i+1}/{len(chunks)} from {file_path}:\n{chunk.page_content[:300]}...\n")
                all_chunks.append(chunk.page_content)

                try:
                    embedding = get_embedding(chunk.page_content)
                    all_embeddings.append(embedding)
                    all_meta.append(chunk.metadata)
                except Exception as embed_err:
                    logging.error(f"❌ Embedding failed for {file_path}: {embed_err}")
                    continue

        logging.info(f"📦 Total chunks to store: {len(all_chunks)}")
        db.add_chunks(all_chunks, all_embeddings, all_meta)

        file_tree = build_file_tree(repo_path)
        logging.info("🌲 File tree built.")

        return {
            "message": f"✅ Processed {len(all_chunks)} chunks.",
            "file_tree": file_tree
        }

    except Exception as e:
        logging.error("🔥 Exception in /upload-repo", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error: {e}")
