import os
import shutil
from pathlib import Path
from fastapi import APIRouter
from backend.database.db import get_db_connection
from backend.services.ai.gemini_provider import GeminiAIProvider

router = APIRouter(prefix="/api/settings", tags=["settings"])

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

@router.get("")
def get_settings():
    ffmpeg_found = shutil.which("ffmpeg") is not None
    ffprobe_found = shutil.which("ffprobe") is not None

    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT key, value FROM settings;")
        db_settings = {row["key"]: row["value"] for row in cur.fetchall()}

    has_env_key = bool(os.getenv("GEMINI_API_KEY"))
    has_db_key = bool(db_settings.get("gemini_api_key"))

    return {
        "ffmpeg_installed": ffmpeg_found,
        "ffprobe_installed": ffprobe_found,
        "data_directory": db_settings.get("data_directory", str(DATA_DIR.resolve())),
        "ai_provider": db_settings.get("ai_provider", "local_rule"),
        "gemini_model": db_settings.get("gemini_model", "gemini-2.5-flash"),
        "gemini_api_key_set": has_db_key or has_env_key,
    }

@router.post("")
def update_settings(payload: dict):
    with get_db_connection() as conn:
        cur = conn.cursor()
        for k, v in payload.items():
            if k == "gemini_api_key" and not v:
                continue # don't clear if empty
            cur.execute("""
            INSERT INTO settings (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value;
            """, (k, str(v)))
        conn.commit()
    return {"status": "saved"}

@router.post("/test-gemini")
def test_gemini(payload: dict):
    api_key = payload.get("gemini_api_key", "").strip()
    model = payload.get("gemini_model", "gemini-2.5-flash").strip()

    # If key wasn't explicitly passed in payload, check DB or env
    if not api_key:
        with get_db_connection() as conn:
            cur = conn.cursor()
            cur.execute("SELECT value FROM settings WHERE key = 'gemini_api_key';")
            row = cur.fetchone()
            if row and row["value"]:
                api_key = row["value"]
            else:
                api_key = os.getenv("GEMINI_API_KEY", "")

    if not api_key:
        return {
            "status": "error",
            "message": "No API key provided or found. Please paste your Gemini API key."
        }

    return GeminiAIProvider.test_connection(api_key, model)

