# backend/api/practice.py
import subprocess
import json
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from backend.database.db import get_db_connection
from backend.services.video.ffmpeg_service import FFmpegService

router = APIRouter(prefix="/api/practice", tags=["practice"])

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

@router.get("/{exercise_id}")
def get_exercise(exercise_id: str):
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM exercises WHERE id = ?;", (exercise_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Exercise not found")

        data = dict(row)
        data["target_metrics"] = json.loads(data["target_metrics_json"]) if data.get("target_metrics_json") else {}
        data["checklist"] = json.loads(data["checklist_json"]) if data.get("checklist_json") else []

        # Check raw footage file existence
        practice_dir = DATA_DIR / "practice" / exercise_id
        practice_dir.mkdir(parents=True, exist_ok=True)
        raw_video = practice_dir / "raw_footage.mp4"
        sample_solution = practice_dir / "sample_edited.mp4"

        data["raw_footage_exists"] = raw_video.exists()
        data["sample_solution_exists"] = sample_solution.exists()
        data["raw_footage_path"] = str(raw_video)
        data["sample_solution_path"] = str(sample_solution)
        data["folder_path"] = str(practice_dir.resolve())

        return data

@router.post("/{exercise_id}/open-folder")
def open_practice_folder(exercise_id: str):
    practice_dir = (DATA_DIR / "practice" / exercise_id).resolve()
    practice_dir.mkdir(parents=True, exist_ok=True)
    try:
        # Open in Windows Explorer
        os.startfile(str(practice_dir))
        return {"status": "opened", "path": str(practice_dir)}
    except Exception as e:
        return {"status": "error", "message": str(e), "path": str(practice_dir)}

@router.post("/{exercise_id}/generate-demo-assets")
def generate_demo_assets(exercise_id: str):
    practice_dir = (DATA_DIR / "practice" / exercise_id).resolve()
    practice_dir.mkdir(parents=True, exist_ok=True)

    raw_path = practice_dir / "raw_footage.mp4"
    sample_path = practice_dir / "sample_edited.mp4"

    # Generate 40s raw talking head video with intentional hesitations/pauses
    FFmpegService.generate_demo_video(str(raw_path), duration=40.0, cuts=False)

    # Generate 24s edited video with cuts and minimal pauses
    FFmpegService.generate_demo_video(str(sample_path), duration=24.0, cuts=True)

    return {
        "status": "ready",
        "raw_footage_path": str(raw_path),
        "sample_solution_path": str(sample_path),
        "folder_path": str(practice_dir)
    }
