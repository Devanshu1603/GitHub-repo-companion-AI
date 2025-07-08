# 🤖 GitHub Repository Companion – AI Chatbot

An AI-powered chatbot that enables users to interact with the contents of any public GitHub repository in natural language. Simply provide a GitHub repo link, and the assistant can summarize code, explain logic, answer questions, and guide you through unfamiliar codebases — all powered by LLMs and a Retrieval-Augmented Generation (RAG) pipeline.

---

## 🚀 Features

- 🔗 Input any public GitHub repository URL
- 📁 Automatically clones and parses relevant code files
- 🧩 Recursive chunking of code using header-aware logic
- 🧠 Embeds content using Gemini 1.5 Flash LLM
- 🔍 Semantic search using ChromaDB (Vector DB)
- 💬 Chat interface for asking contextual questions about the code
- ☁️ Dockerized backend, deployable on AWS EC2

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** – Python-based backend API
- **GitPython** – GitHub repo cloning and file extraction
- **LangChain** – RAG pipeline and LLM orchestration
- **Gemini 1.5 Flash** – Google’s LLM for embeddings and response generation
- **ChromaDB** – Lightweight vector store for semantic search
- **Docker** – Containerized deployment
- **AWS EC2** – Cloud deployment (optional)

### Frontend *(optional)*
- **React.js** – Chat UI and file input (if applicable)

---

## 🧠 How It Works

```
User inputs GitHub URL
        ↓
Clone repo with GitPython
        ↓
Extract relevant source files (.py, .js, .md, etc.)
        ↓
Chunk files recursively (header-aware)
        ↓
Generate embeddings via Gemini LLM
        ↓
Store chunks & embeddings in ChromaDB
        ↓
User sends a query via chat
        ↓
Top relevant chunks retrieved from ChromaDB
        ↓
Gemini generates context-aware answer
        ↓
Response returned to frontend
```

---

## 📁 Project Structure

```
📦github-repo-chatbot/
├── backend/
│   ├── main.py
│   ├── services/
│   │   ├── repo_processor.py
│   │   ├── chunker.py
│   │   ├── embedder.py
│   │   ├── vector_db.py
│   │   ├── llm_wrapper.py
│   └── routes/
│       ├── upload_repo.py
│       ├── rag_query.py
├── frontend/ (optional)
│   └── ...
└── README.md
```

---

## 🔧 Setup Instructions

### 📦 Backend Setup

```bash
git clone https://github.com/yourusername/github-repo-chatbot.git
cd github-repo-chatbot/backend
```

1. **Install dependencies**

```bash
pip install -r requirements.txt
```

2. **Create a `.env` file**

```env
GEMINI_API_KEY=your_gemini_key
```

3. **Run the API server**

```bash
uvicorn main:app --reload
```

---

### 🐳 Docker Deployment (Optional)

```bash
docker build -t github-chatbot .
docker run -d -p 8000:8000 github-chatbot
```

---

## 📬 API Endpoints

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| POST   | `/upload-repo/`   | Clone and process GitHub repository |
| POST   | `/query/`         | Ask questions about the codebase    |

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Author

**Devanshu Kumar Singh**  
📧 singhdevanshu0803@gmail.com  
🌐 [LinkedIn](https://linkedin.com/in/devanshu0803) | [GitHub](https://github.com/Devanshu1603)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues, pull requests, or fork the project to improve its capabilities.
