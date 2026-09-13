# backend/api/submissions.py
import uuid
import shutil
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.services.ai.feedback_service import FeedbackService

router = APIRouter(prefix="/api/submissions", tags=["submissions"])

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
SUBMISSIONS_DIR = DATA_DIR / "submissions"
feedback_service = FeedbackService()

@router.post("")
async def create_submission(
    file: Optional[UploadFile] = File(None),
    local_path: Optional[str] = Form(None),
    exercise_id: Optional[str] = Form(None)
):
    SUBMISSIONS_DIR.mkdir(parents=True, exist_ok=True)
    target_video_path = None

    if local_path:
        p = Path(local_path)
        if not p.exists():
            # Check relative to DATA_DIR
            alt = (DATA_DIR / local_path).resolve()
            if alt.exists():
                p = alt
            else:
                raise HTTPException(status_code=400, detail=f"Local video file not found at: {local_path}")
        target_video_path = str(p)

    elif file:
        filename = file.filename or "uploaded_video.mp4"
        suffix = Path(filename).suffix.lower()
        if suffix not in [".mp4", ".mov", ".m4v", ".mkv"]:
            raise HTTPException(status_code=400, detail="Only MP4 or MOV files are supported in MVP 0.1")

        save_name = f"sub_{uuid.uuid4().hex[:8]}_{filename}"
        dest_path = SUBMISSIONS_DIR / save_name

        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        target_video_path = str(dest_path)

    else:
        raise HTTPException(status_code=400, detail="Must provide either an uploaded file or a local video path")

    # Run analysis pipeline
    try:
        analysis = feedback_service.analyze_submission(target_video_path, exercise_id)
        return {
            "submission_id": analysis.id,
            "analysis_id": analysis.id,
            "overall_score": analysis.overall_score,
            "video_path": target_video_path,
            "message": "Analysis completed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video analysis failed: {str(e)}")
