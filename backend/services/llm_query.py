import google.generativeai as genai
from config.env import GEMINI_API_KEY
import re

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the Gemini model
chat_model = genai.GenerativeModel("gemini-2.0-flash")


def clean_response(text: str) -> str:
    """
    Cleans Gemini's response by removing formatting artifacts.
    """
    return re.sub(r'^AI Assistant.*\n?', '', text).strip()


def generate_response_from_prompt(prompt: str) -> str:
    """
    Sends a pre-formatted prompt to Gemini and returns the cleaned response.
    """
    try:
        response = chat_model.generate_content(prompt)
        return clean_response(response.text)
    except Exception as e:
        return f"❌ Error in LLM response: {e}"
