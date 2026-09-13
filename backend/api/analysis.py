# backend/api/analysis.py
import json
from fastapi import APIRouter, HTTPException
from backend.database.db import get_db_connection

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.get("/{analysis_id}")
def get_analysis(analysis_id: str):
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM analyses WHERE id = ?;", (analysis_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Analysis not found")

        feedback_data = json.loads(row["feedback_json"])
        feedback_data["id"] = row["id"]
        feedback_data["created_at"] = row["created_at"]
        return feedback_data
