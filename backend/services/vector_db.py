from chromadb import PersistentClient
from chromadb.config import Settings
from typing import List
import logging

class ChromaDBWrapper:
    def __init__(self, persist_path="./chroma_store", collection_name="repo_chunks"):
        self.client = PersistentClient(path=persist_path, settings=Settings(allow_reset=True))
        self.collection = self.client.get_or_create_collection(name=collection_name)
        logging.info(f"📚 Connected to Chroma collection: {collection_name} at {persist_path}")

    def add_chunks(self, chunks: List[str], embeddings: List[List[float]], metadatas: List[dict]):
        if not chunks:
            logging.warning("⚠️ No chunks to add to ChromaDB.")
            return

        ids = [f"doc-{i}" for i in range(len(chunks))]
        logging.info(f"📥 Adding {len(chunks)} documents to ChromaDB.")
        try:
            self.collection.add(
                documents=chunks,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            logging.info("✅ Chunks added to ChromaDB.")
        except Exception as e:
            logging.error(f"❌ Failed to add to ChromaDB: {e}")

    def similarity_search(self, query_embedding: List[float], top_k=5):
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            docs = results.get("documents", [[]])[0]
            metadatas = results.get("metadatas", [[]])[0]
            logging.info(f"🔍 Retrieved {len(docs)} documents.")
            for i, doc in enumerate(docs):
                logging.info(f"🔗 Result {i+1}: {metadatas[i].get('source', 'unknown file')} - {doc[:150]}...")
            return results
        except Exception as e:
            logging.error(f"❌ Failed similarity search: {e}")
            return {}

    def clear(self):
        try:
        # Trick: match everything where "id" is not null
           self.collection.delete(where={"id": {"$ne": "nonexistent"}})
           logging.info("🧹 Cleared all existing documents from ChromaDB.")
        except Exception as e:
           logging.error(f"❌ Failed to clear ChromaDB collection: {e}")

