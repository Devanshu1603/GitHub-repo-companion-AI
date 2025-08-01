from fastapi import APIRouter, Request
from services.vector_db import ChromaDBWrapper
from services.embedder import get_embedding
from services.llm_query import generate_answer_from_context, code_debugger_agent, code_reviewer_agent, document_generator_agent

router = APIRouter()
db = ChromaDBWrapper()

@router.post("/chat")
async def chat_with_repo(request: Request):
    data = await request.json()
    query = data.get("query")

    if not query:
        return {"answer": "❌ No query provided."}

    try:
        query_embedding = get_embedding(query)
        search_results = db.similarity_search(query_embedding, top_k=4)

        documents = search_results["documents"][0]
        metadatas = search_results["metadatas"][0]

        context_blocks = [
            f"From {meta.get('source')}: \n{doc}"
            for doc, meta in zip(documents, metadatas)
        ]
        full_context = "\n\n".join(context_blocks)

        answer = generate_answer_from_context(query, full_context)
        return {"answer": answer}

    except Exception as e:
        return {"answer": f"❌ Error while generating response: {e}"}


# ✅ New route for Code Debugger Agent
@router.post("/debug")
async def debug_code_file(request: Request):
    data = await request.json()
    file_path = data.get("file_path")

    if not file_path:
        return {"answer": "❌ No file path provided."}

    try:
        debug_response = code_debugger_agent(file_path)
        return {"answer": debug_response}
    except Exception as e:
        return {"answer": f"❌ Error while debugging file: {e}"}
    

@router.post("/review")
async def debug_code_file(request: Request):
    data = await request.json()
    file_path = data.get("file_path")

    if not file_path:
        return {"answer": "❌ No file path provided."}

    try:
        debug_response = code_reviewer_agent(file_path)
        return {"answer": debug_response}
    except Exception as e:
        return {"answer": f"❌ Error while debugging file: {e}"}
    
@router.post("/docgen")
async def debug_code_file(request: Request):
    data = await request.json()
    file_path = data.get("file_path")

    if not file_path:
        return {"answer": "❌ No file path provided."}

    try:
        debug_response = document_generator_agent(file_path)
        return {"answer": debug_response}
    except Exception as e:
        return {"answer": f"❌ Error while debugging file: {e}"}

