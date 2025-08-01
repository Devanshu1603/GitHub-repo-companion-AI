import google.generativeai as genai
from config.env import GEMINI_API_KEY
import re
import os

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the Gemini model
chat_model = genai.GenerativeModel("gemini-2.0-flash")

# Clean Gemini's response from unwanted formatting
def clean_response(text: str) -> str:
    # Remove lines like "AI Assistant06:05 PM" or similar timestamped headers
    return re.sub(r'^AI Assistant.*\n?', '', text).strip()

# Function to generate answer using Gemini with context and a user query
def generate_answer_from_context(user_query: str, context: str) -> str:
    try:
        prompt = f"""
You are an AI assistant that helps developers understand GitHub repositories.

Given the context from repository files and a user question, analyze and respond accordingly.
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

# Code debugger agent for analyzing code files
def code_debugger_agent(file_path: str) -> str:
    if not os.path.exists(file_path):
        return "❌ File not found."

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            code = f.read()
    except Exception as e:
        return f"❌ Error reading file: {e}"

    prompt = "Act as a software debugging assistant. Identify any potential bugs or logical flaws in the following Python code. Explain clearly what is wrong and how to fix it."
    return generate_answer_from_context(prompt, code)


def code_reviewer_agent(file_path: str) -> str:
    if not os.path.exists(file_path):
        return "❌ File not found."

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            code = f.read()
    except Exception as e:
        return f"❌ Error reading file: {e}"

    prompt = "Act as a senior code reviewer. Review the context for best practices, code style, and suggest improvements."
    return generate_answer_from_context(prompt, code)


def document_generator_agent(file_path: str) -> str:
    if not os.path.exists(file_path):
        return "❌ File not found."

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            code = f.read()
    except Exception as e:
        return f"❌ Error reading file: {e}"

    prompt = "Analyze the code and generate helpful documentation, comments, or docstrings as needed based on the user's query."
    return generate_answer_from_context(prompt, code)