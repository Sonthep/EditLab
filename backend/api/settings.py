# backend/api/settings.py
import shutil
from pathlib import Path
from fastapi import APIRouter
from backend.database.db import get_db_connection

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

    return {
        "ffmpeg_installed": ffmpeg_found,
        "ffprobe_installed": ffprobe_found,
        "data_directory": db_settings.get("data_directory", str(DATA_DIR.resolve())),
        "ai_provider": db_settings.get("ai_provider", "local_rule"),
        "gemini_api_key_set": bool(db_settings.get("gemini_api_key")),
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
