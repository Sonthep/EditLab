# backend/api/practice.py
import subprocess
import json
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from backend.database.db import get_db_connection
from backend.services.video.ffmpeg_service import FFmpegService

router = APIRouter(prefix="/api/practice", tags=["practice"])

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

CURATED_SOURCES = [
    {
        "name": "Pexels Talking Head & Podcast Clips",
        "name_th": "Pexels: ฟุตเทจคนพูดหน้ากล้อง & บทสัมภาษณ์ 4K",
        "url": "https://www.pexels.com/search/videos/talking%20head/",
        "category": "Raw Footage / A-Roll",
        "description": "Free high-resolution talking head video clips suitable for pacing and dialogue practice.",
        "description_th": "คลิปวิดีโอคนพูดหน้ากล้องความละเอียดสูง ฟรีไม่มีลิขสิทธิ์ เหมาะมากสำหรับฝึกคัตช่องไฟบทสนทนา"
    },
    {
        "name": "Mixkit Free B-Roll & Cutaways",
        "name_th": "Mixkit: คลิปภาพประกอบ B-Roll & Transitions ฟรี",
        "url": "https://mixkit.co/free-stock-video/",
        "category": "B-Roll Cutaways",
        "description": "Cinematic B-roll shots to insert over dialogue cuts and cover jump cuts.",
        "description_th": "คลิปภาพตัดแทรก B-roll สวยๆ คมชัด ใช้แทรกคั่นคำพูดและซ่อนรอยต่อช็อต"
    },
    {
        "name": "Pixabay SFX (Whoosh, Pop, Swoosh)",
        "name_th": "Pixabay: ซาวด์เอฟเฟกต์ (SFX) ตัดต่อฟรี",
        "url": "https://pixabay.com/sound-effects/search/whoosh/",
        "category": "Sound Effects",
        "description": "Essential swoosh, riser, and impact sound effects to emphasize visual cuts.",
        "description_th": "เสียง Whoosh, Swoosh, Click ช่วยเน้นจังหวะคัตและ Punch Zoom ให้น่าตื่นเต้น"
    },
    {
        "name": "EditStock Free Practice Scenes",
        "name_th": "EditStock: ฉากฟุตเทจสำหรับฝึกตัดต่อมืออาชีพ",
        "url": "https://editstock.com/collections/free-stuff",
        "category": "Pro Practice Project",
        "description": "Multi-take scene footage designed specifically for video editing students.",
        "description_th": "โปรเจกต์ฟุตเทจแท้หลายเทกสำหรับฝึกฝีมือตัดต่อระดับมาตรฐานสากล"
    }
]

def ensure_assets(exercise_id: str):
    practice_dir = DATA_DIR / "practice" / exercise_id
    practice_dir.mkdir(parents=True, exist_ok=True)
    raw_video = practice_dir / "raw_footage.mp4"
    sample_solution = practice_dir / "sample_edited.mp4"

    if not raw_video.exists():
        try:
            FFmpegService.generate_demo_video(str(raw_video), duration=40.0, cuts=False)
        except Exception as e:
            print(f"Error auto-generating demo raw video: {e}")

    if not sample_solution.exists():
        try:
            FFmpegService.generate_demo_video(str(sample_solution), duration=24.0, cuts=True)
        except Exception as e:
            print(f"Error auto-generating demo sample video: {e}")

    return raw_video, sample_solution, practice_dir

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

        raw_video, sample_solution, practice_dir = ensure_assets(exercise_id)

        data["raw_footage_exists"] = raw_video.exists()
        data["sample_solution_exists"] = sample_solution.exists()
        data["raw_footage_path"] = str(raw_video)
        data["sample_solution_path"] = str(sample_solution)
        data["raw_footage_filename"] = raw_video.name
        data["folder_path"] = str(practice_dir.resolve())
        data["download_raw_url"] = f"/api/practice/{exercise_id}/download-raw"
        data["stream_raw_url"] = f"/api/media/stream?path=practice/{exercise_id}/raw_footage.mp4"
        data["external_sources"] = CURATED_SOURCES

        return data

@router.get("/{exercise_id}/download-raw")
def download_raw_footage(exercise_id: str):
    raw_video, _, _ = ensure_assets(exercise_id)
    if not raw_video.exists():
        raise HTTPException(status_code=404, detail="Raw footage could not be generated")
    
    return FileResponse(
        path=raw_video,
        filename=f"EditLab_{exercise_id}_raw_footage.mp4",
        media_type="video/mp4"
    )

@router.get("/{exercise_id}/download-sample")
def download_sample_solution(exercise_id: str):
    _, sample_solution, _ = ensure_assets(exercise_id)
    if not sample_solution.exists():
        raise HTTPException(status_code=404, detail="Sample solution not found")
    
    return FileResponse(
        path=sample_solution,
        filename=f"EditLab_{exercise_id}_sample_edited.mp4",
        media_type="video/mp4"
    )

@router.post("/{exercise_id}/open-folder")
def open_practice_folder(exercise_id: str):
    _, _, practice_dir = ensure_assets(exercise_id)
    try:
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

    FFmpegService.generate_demo_video(str(raw_path), duration=40.0, cuts=False)
    FFmpegService.generate_demo_video(str(sample_path), duration=24.0, cuts=True)

    return {
        "status": "ready",
        "raw_footage_path": str(raw_path),
        "sample_solution_path": str(sample_path),
        "folder_path": str(practice_dir)
    }
