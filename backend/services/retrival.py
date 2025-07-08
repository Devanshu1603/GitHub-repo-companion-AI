from typing import List, Dict

def log_retrieved_chunks(results: Dict):
    documents = results.get("documents", [])
    metadatas = results.get("metadatas", [])

    print(f"🔎 Retrieved {len(documents)} chunks:")
    for i, (doc, meta) in enumerate(zip(documents, metadatas)):
        source = meta.get("source", "unknown")
        snippet = doc[:100].replace("\n", " ")
        print(f"  {i+1}. Source: {source} | Snippet: {snippet}...")
