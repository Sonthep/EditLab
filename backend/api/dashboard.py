# backend/api/dashboard.py
from fastapi import APIRouter
from backend.database.db import get_db_connection
import json

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("")
def get_dashboard_data():
    with get_db_connection() as conn:
        cur = conn.cursor()

        # Fetch skills
        cur.execute("SELECT id, name, score, confidence FROM skills ORDER BY score ASC;")
        skills = [dict(row) for row in cur.fetchall()]

        # Continue learning: find first incomplete lesson, or default to pacing-01
        cur.execute("""
        SELECT id, module_id, module_title, module_number, title, duration, difficulty, skill, completed
        FROM lessons
        ORDER BY completed ASC, sort_order ASC
        LIMIT 1;
        """)
        active_lesson_row = cur.fetchone()
        active_lesson = dict(active_lesson_row) if active_lesson_row else {
            "id": "pacing-01",
            "module_id": "mod-02",
            "module_title": "Pacing & Rhythm",
            "module_number": 2,
            "title": "Shot Duration & Dead Air (Pacing 01)",
            "duration": "6 min"
        }

        # Calculate total completed
        cur.execute("SELECT COUNT(*) as count FROM lessons WHERE completed = 1;")
        completed_lessons = cur.fetchone()["count"]

        # Fetch recent practice attempts with analysis score
        cur.execute("""
        SELECT pa.id, pa.exercise_id, pa.analysis_id, pa.created_at, pa.score, e.title as exercise_title
        FROM practice_attempts pa
        LEFT JOIN exercises e ON pa.exercise_id = e.id
        ORDER BY pa.created_at DESC
        LIMIT 5;
        """)
        recent_practice = [dict(row) for row in cur.fetchall()]

        # Average skill score
        avg_score = sum(s["score"] for s in skills) / len(skills) if skills else 50.0
        level = max(1, int(avg_score // 18) + (1 if completed_lessons > 0 else 0))

        # Lowest skill recommendation
        weakest_skill = skills[0] if skills else {"name": "Pacing & Rhythm", "id": "pacing"}
        
        return {
            "level": f"Editor Level {level}",
            "completed_lessons_count": completed_lessons,
            "streak_days": 3,
            "continue_learning": active_lesson,
            "skills": skills,
            "recent_practice": recent_practice,
            "recommended_practice": {
                "skill": weakest_skill["name"],
                "exercise_id": "pacing-01-practice",
                "title": f"Sharpen {weakest_skill['name']}: Fast Talking Head #01",
                "description": "Focus on tightening cut timing and removing unneeded silence to boost your score."
            }
        }
