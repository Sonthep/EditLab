# backend/api/analysis.py
import json
from fastapi import APIRouter, HTTPException, Response
from backend.database.db import get_db_connection
from backend.services.video.markers_service import generate_edl_markers, generate_csv_markers

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

@router.get("/{analysis_id}/export/markers.edl")
def export_markers_edl(analysis_id: str):
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM analyses WHERE id = ?;", (analysis_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Analysis not found")

        feedback_data = json.loads(row["feedback_json"])
        events = feedback_data.get("events", [])
        fps = feedback_data.get("metrics", {}).get("fps", 30.0) or 30.0

        edl_content = generate_edl_markers(analysis_id, events, fps=fps)
        filename = f"editlab_markers_{analysis_id[-6:]}.edl"

        return Response(
            content=edl_content,
            media_type="text/plain; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )

@router.get("/{analysis_id}/export/markers.csv")
def export_markers_csv(analysis_id: str):
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM analyses WHERE id = ?;", (analysis_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Analysis not found")

        feedback_data = json.loads(row["feedback_json"])
        events = feedback_data.get("events", [])
        fps = feedback_data.get("metrics", {}).get("fps", 30.0) or 30.0

        csv_content = generate_csv_markers(events, fps=fps)
        filename = f"editlab_markers_{analysis_id[-6:]}.csv"

        return Response(
            content=csv_content,
            media_type="text/csv; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )

