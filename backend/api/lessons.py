# backend/api/lessons.py
from fastapi import APIRouter, HTTPException
from backend.database.db import get_db_connection
import json

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

@router.get("")
def list_lessons():
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
        SELECT id, module_id, module_title, module_number, title, description, duration, difficulty, skill, completed, sort_order
        FROM lessons
        ORDER BY module_number ASC, sort_order ASC;
        """)
        rows = [dict(r) for r in cur.fetchall()]

        # Group by modules
        modules_map = {}
        for r in rows:
            m_id = r["module_id"]
            if m_id not in modules_map:
                modules_map[m_id] = {
                    "module_id": m_id,
                    "title": r["module_title"],
                    "number": r["module_number"],
                    "lessons": []
                }
            modules_map[m_id]["lessons"].append(r)

        return {"modules": list(modules_map.values())}

@router.get("/{lesson_id}")
def get_lesson(lesson_id: str):
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM lessons WHERE id = ?;", (lesson_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Lesson not found")

        data = dict(row)
        data["content"] = json.loads(data["content_json"]) if data.get("content_json") else {}
        return data

@router.post("/{lesson_id}/complete")
def mark_lesson_complete(lesson_id: str):
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("UPDATE lessons SET completed = 1 WHERE id = ?;", (lesson_id,))
        conn.commit()
    return {"status": "success", "lesson_id": lesson_id, "completed": True}
