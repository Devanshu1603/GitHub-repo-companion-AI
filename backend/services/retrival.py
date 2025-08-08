from services.vector_db import ChromaDBWrapper
from services.embedder import get_embedding

# Initialize ChromaDB instance
db = ChromaDBWrapper()

def retrieve_relevant_context(query: str, top_k: int = 10) -> str:
    """
    Retrieves the top-k most relevant code/document chunks from the vector DB
    using the RAG pipeline.

    Args:
        query (str): The user query (natural language or code-related).
        top_k (int): Number of top similar chunks to retrieve.

    Returns:
        str: Combined formatted context string from retrieved chunks.
    """
    try:
        # Step 1: Embed the query
        query_embedding = get_embedding(query)

        # Step 2: Perform similarity search
        search_results = db.similarity_search(query_embedding, top_k=top_k)

        documents = search_results["documents"][0]
        metadatas = search_results["metadatas"][0]

        # Step 3: Format context
        context_blocks = [
            f"From {meta.get('source')}:\n{doc.strip()}"
            for doc, meta in zip(documents, metadatas)
        ]
        full_context = "\n\n".join(context_blocks)
        return full_context
    
    except Exception as e:
        return f"❌ Retrieval error: {str(e)}"
