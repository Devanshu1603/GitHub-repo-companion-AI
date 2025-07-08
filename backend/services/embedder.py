from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
import logging

embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def get_embeddings(text_chunks: List[str]) -> List[List[float]]:
    try:
        embeddings = embedding_model.encode(text_chunks, show_progress_bar=True)
        return embeddings.tolist() if isinstance(embeddings, np.ndarray) else embeddings
    except Exception as e:
        logging.error(f"❌ Batch embedding failed: {e}")
        return []

def get_embedding(text: str) -> List[float]:
    try:
        embedding = embedding_model.encode(text)
        return embedding.tolist() if isinstance(embedding, np.ndarray) else embedding
    except Exception as e:
        logging.error(f"❌ Single embedding failed: {e}")
        return []
