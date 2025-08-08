# 🤖 GitHub Repository Companion – AI Chatbot
```
This project implements an AI-powered GitHub assistant that combines retrieval-augmented generation (RAG), LangChain agents, and OpenAI's GPT-4o to provide natural language interaction with public GitHub repositories.
Upon receiving a GitHub URL, the system clones the repository, parses and chunks the source code, generates vector embeddings, and stores them in a semantic vector database (ChromaDB). Users can then ask questions like "explain this file," "find bugs," or "optimize performance," and the assistant uses a ReAct-based agent framework to route the query to the most appropriate tool (e.g., code explainer, bug finder, optimizer).
The system ensures minimal token usage through smart chunk-level retrieval and includes conversational memory to maintain multi-turn context. This allows developers to explore, understand, and refactor unfamiliar codebases quickly and intuitively — all through natural language queries.

```
---

## 📁 Project Structure

```
📦 github-repo-companion-AI/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── config/
│   │   └── env.py              # Setting up .env contents
│   ├── services/
│   │   ├── repo_processor.py   # Clones and filters repo files
│   │   ├── chunker.py          # Header-aware recursive chunking logic
│   │   ├── embedder.py         # Embedding generation using Gemini
│   │   ├── vector_db.py        # Search and storage logic for ChromaDB
│   │   ├── llm_wrapper.py      # Gemini LLM API integration
│   │   └── retrieval.py        # Retrieves relevant code chunks for queries
│   ├── tools/                  # LangChain tools + agents
│   │   ├── agent_executor.py   # Creates ReAct agent with tools + memory
│   │   ├── file_tree_builder.py# Create the cloned repo file directory
│   │   ├── multi_tool.py       # Contains functions for all tools to be used
│   │   └── tool_registry.py    # Combines all tools into a unified list
│   ├── routes/
│   │   ├── upload_repo.py      # Upload repo + process endpoints
│   │   ├── chat.py             # Conversational endpoint using ReAct agent
│   │   └── file_viewer.py      # Returns file structure + content
├── project/
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components for UI
│   │   ├── App.tsx             # Main app component
│   │   └── ...                 # Other UI utilities
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
├── README.md                   # Project documentation
```


---

## 🔧 Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

1. Create a `.env` file

```env
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

2. Run the FastAPI server

```bash
uvicorn main:app --reload
```

---

## 🔧 Frontend Setup

```bash
cd project
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---
## Dependencies

This project requires the following Python packages:

- fastapi
- uvicorn
- gitpython
- langchain
- chromadb
- google-generativeai
- python-dotenv
- tiktoken
- sentence-transformers

Make sure to install these packages using the `requirements.txt` file.

## 📬 API Endpoints

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| POST   | `/upload-repo/`   | Clone and process GitHub repository |
| POST   | `/chat`           | Ask questions about the codebase |

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
