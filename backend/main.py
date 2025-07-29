from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload_repo, chat, file_viewer
import os
import uvicorn

app = FastAPI(
    title="GitHub Repo AI Chatbot",
    description="Chat with any GitHub repository using RAG + Gemini",
    version="1.0.0"
)

origins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5174",
    "http://13.60.137.213:8000",  # Optional, if directly accessing IP in browser
    "https://exam-preparation-ai.vercel.app/",  # Vercel deployment
]

# ✅ Updated CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 👈 REPLACED "*" with actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_repo.router)
app.include_router(chat.router)
app.include_router(file_viewer.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the GitHub Repo AI Chatbot API!"}    

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)