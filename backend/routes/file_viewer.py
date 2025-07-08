from fastapi import APIRouter, Query
from fastapi.responses import PlainTextResponse
import os

router = APIRouter()

@router.get("/view-file", response_class=PlainTextResponse)
def view_file(file_path: str = Query(...)):
    """
    Returns the raw contents of a file given its path (must be inside ./temp/)
    """
    if not file_path.startswith("./temp/"):
        return "❌ Invalid file path."

    if not os.path.exists(file_path):
        return "❌ File not found."

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"❌ Could not read file: {str(e)}"
