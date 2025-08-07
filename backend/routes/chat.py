from fastapi import APIRouter, Request
from tools.agent_executor import get_agent_executor

router = APIRouter()
agent_executor = get_agent_executor()

@router.post("/chat")
async def chat_with_repo(request: Request):
    data = await request.json()
    query = data.get("query")

    if not query:
        return {"answer": "❌ No query provided."}

    try:
        result = await agent_executor.ainvoke({"input": query})
        return {"answer": result.get("output")}
    except Exception as e:
        return {"answer": f"❌ Error: {str(e)}"}
