import google.generativeai as genai
from config.env import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
chat_model = genai.GenerativeModel("gemini-2.0-flash")

def generate_answer_from_context(user_query: str, context: str) -> str:
    try:
        prompt = f"""You are an AI assistant that helps developers understand GitHub repositories.

Context:
{context}

User Question: {user_query}

Answer:"""

        response = chat_model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"❌ Error in LLM response: {e}"
