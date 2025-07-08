import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List
from langchain.docstore.document import Document

def chunk_file(file_path: str, preamble: str = "") -> List[Document]:
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Failed to read {file_path}: {e}")
        return []

    if not content.strip():
        print(f"⚠️ Skipping empty/whitespace-only file: {file_path}")
        return []

    content = preamble + content

    extension = os.path.splitext(file_path)[1]
    separators = {
        ".md": ["\n#", "\n##", "\n\n", "\n", " ", ""],
        ".py": ["\ndef ", "\nclass ", "\n\n", "\n", " ", ""],
        ".js": ["\ndef ", "\nclass ", "\n\n", "\n", " ", ""],
        ".ts": ["\ndef ", "\nclass ", "\n\n", "\n", " ", ""],
        ".java": ["\nclass ", "\n\n", "\n", " ", ""],
        ".cpp": ["\n", " ", ""],
        ".go": ["\n", " ", ""]
    }.get(extension, ["\n\n", "\n", " ", ""])

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
        separators=separators
    )

    chunks = splitter.create_documents([content], metadatas=[{"source": file_path}])
    print(f"✅ Chunked {len(chunks)} chunks from {file_path}")
    return chunks
