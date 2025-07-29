import google.generativeai as genai
from config.env import GEMINI_API_KEY
import re

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model
chat_model = genai.GenerativeModel("gemini-2.0-flash")

# Optional: Clean any assistant-style headers from response
def clean_response(text: str) -> str:
    # Remove lines like "AI Assistant06:05 PM" or similar timestamped headers
    return re.sub(r'^AI Assistant.*\n?', '', text).strip()

# Generate answer using Gemini model
def generate_answer_from_context(user_query: str, context: str) -> str:
    try:
        prompt = f"""
You are an AI assistant that helps developers understand GitHub repositories.

Given the context from repository files and a user question. 
Do **not** include your name, timestamps, or any assistant formatting.

Context:
{context}

User Question: {user_query}

Answer:
"""
        response = chat_model.generate_content(prompt)
        return clean_response(response.text)

    except Exception as e:
        return f"❌ Error in LLM response: {e}"
