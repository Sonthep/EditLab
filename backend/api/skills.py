# backend/api/skills.py
from fastapi import APIRouter
from backend.database.db import get_db_connection

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("")
def get_skills_profile():
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, name, score, confidence, updated_at FROM skills ORDER BY score DESC;")
        skills = [dict(r) for r in cur.fetchall()]

        cur.execute("SELECT COUNT(*) as count FROM lessons WHERE completed = 1;")
        completed_lessons = cur.fetchone()["count"]

        avg_score = sum(s["score"] for s in skills) / len(skills) if skills else 50.0
        level = max(1, int(avg_score // 18) + (1 if completed_lessons > 0 else 0))

        strongest = skills[0] if skills else {"name": "Cut Timing", "score": 75}
        needs_practice = skills[-1] if skills else {"name": "Audio", "score": 45}

        # Recommendation mappings
        recommendations = {
            "pacing": {"title": "Pacing 01: Fast Talking Head", "exercise_id": "pacing-01-practice"},
            "audio": {"title": "Audio 01: The Power of the J-Cut", "exercise_id": "pacing-01-practice"},
            "cut_timing": {"title": "Cut & Timing 01: Cutting on Thought", "exercise_id": "pacing-01-practice"},
            "hook": {"title": "Hook & Retention 01: The First 3 Seconds", "exercise_id": "pacing-01-practice"},
            "broll": {"title": "B-roll 01: Show Instead of Tell", "exercise_id": "pacing-01-practice"}
        }

        rec = recommendations.get(needs_practice["id"], {"title": "Pacing 01: Fast Talking Head", "exercise_id": "pacing-01-practice"})

        return {
            "editor_level": f"Editor Level {level}",
            "average_score": round(avg_score, 1),
            "skills": skills,
            "strongest": strongest,
            "needs_practice": needs_practice,
            "recommended": rec
        }
