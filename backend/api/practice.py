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

TOPIC_SOURCES = {
    "broll": [
        {
            "name": "Mixkit Cinematic B-Roll & Cutaways",
            "name_th": "Mixkit: คลิปภาพประกอบ B-Roll & Cutaways คมชัดสูง ฟรี",
            "url": "https://mixkit.co/free-stock-video/",
            "category": "B-Roll Cutaways",
            "description": "High quality cinematic cutaways ideal for masking jump cuts.",
            "description_th": "คลิปตัดแทรกสวยงาม ใช้สำหรับซ่อนรอยต่อคำพูดและดึงดูดสายตา"
        },
        {
            "name": "Pexels B-Roll & Action Footage",
            "name_th": "Pexels: คลิป B-Roll ไลฟ์สไตล์และเทคโนโลยี 4K",
            "url": "https://www.pexels.com/search/videos/b-roll/",
            "category": "4K Stock Footage",
            "description": "Free modern B-roll clips for short-form video editors.",
            "description_th": "คลังคลิปสั้นฟรี 4K สำหรับสายตัดต่อ Short-form และ Reels"
        },
        {
            "name": "Coverr Free B-Roll Sequences",
            "name_th": "Coverr: ฟุตเทจคั่นฉากคุณภาพพรีเมียม",
            "url": "https://coverr.co/",
            "category": "Curated Stock",
            "description": "Carefully shot aesthetic footage for YouTube and social video.",
            "description_th": "คลิปคุณภาพพรีเมียมสำหรับเสริมมู้ดและอารมณ์ของวิดีโอ"
        }
    ],
    "audio": [
        {
            "name": "Pixabay Sound Effects (Whoosh & Transitions)",
            "name_th": "Pixabay: ซาวด์เอฟเฟกต์ (SFX) และเสียง Whoosh ฟรี",
            "url": "https://pixabay.com/sound-effects/search/whoosh/",
            "category": "Sound Effects",
            "description": "Essential audio swooshes and transitions for J-Cuts and scene shifts.",
            "description_th": "เสียง Whoosh และ Riser เสริมพลังให้รอยต่อเสียงแบบ J-Cut เนียนตา"
        },
        {
            "name": "Freesound Creative Commons SFX",
            "name_th": "Freesound: คลังเสียงบรรยากาศและ Foley โลกเสมือนจริง",
            "url": "https://freesound.org/",
            "category": "Foley & Ambience",
            "description": "Vast database of room tones, Foley, and dialogue sound beds.",
            "description_th": "เสียงบรรยากาศและเสียงประกอบฉาก ช่วยเชื่อมเสียงพูดให้ลื่นไหล"
        },
        {
            "name": "YouTube Audio Library",
            "name_th": "YouTube Studio: เพลงประกอบไม่ติดลิขสิทธิ์",
            "url": "https://studio.youtube.com/",
            "category": "Background Music",
            "description": "Royalty-free background music to glue cuts and audio stems together.",
            "description_th": "เพลงฟรีสำหรับทำ Background Audio เชื่อมต่อความรู้สึกข้ามช็อต"
        }
    ],
    "motion": [
        {
            "name": "Pixabay Dynamic Whooshes & Pops",
            "name_th": "Pixabay: เสียง Whoosh & Pop เสริมจังหวะ Punch Zoom",
            "url": "https://pixabay.com/sound-effects/search/pop/",
            "category": "Motion SFX",
            "description": "Subtle pop and zoom sound effects timed with punch zooms.",
            "description_th": "เสียง Pop และ Click เสริมพลังตอน Punch Zoom เน้นคำสำคัญ"
        },
        {
            "name": "Pexels Energetic Talking Head",
            "name_th": "Pexels: ฟุตเทจคนพูดพลังงานสูงสำหรับฝึก Punch Zoom",
            "url": "https://www.pexels.com/search/videos/speech/",
            "category": "High Energy Footage",
            "description": "Passionate speakers and podcast guests perfect for punch cuts.",
            "description_th": "คนพูดที่มีอารมณ์ขันและจุดเน้น เหมาะกับการฝึก Punch Zoom 115%"
        }
    ],
    "hook": [
        {
            "name": "Pexels High Energy Opening Hooks",
            "name_th": "Pexels: ฟุตเทจช็อตเปิดตัวสร้างความตื่นเต้น",
            "url": "https://www.pexels.com/search/videos/action/",
            "category": "Hook Shots",
            "description": "High curiosity and visually bold scenes to stop the scroll.",
            "description_th": "ช็อตภาพดึงดูดสายตาสำหรับตัดฮุก 3 วินาทีแรก"
        },
        {
            "name": "Mixkit Fast Motion Loops",
            "name_th": "Mixkit: วิดีโอลูปโมชันความเร็วสูง",
            "url": "https://mixkit.co/free-stock-video/motion/",
            "category": "Pattern Interrupt",
            "description": "Visual pattern interrupts to grab attention in the first 2 seconds.",
            "description_th": "ภาพเคลื่อนไหวสร้าง Pattern Interrupt หยุดนิ้วโป้งคนดู"
        }
    ],
    "color": [
        {
            "name": "Pexels Log & High Dynamic Range Clips",
            "name_th": "Pexels: ฟุตเทจความต่างแสงสูงสำหรับฝึกเกลี่ยสี",
            "url": "https://www.pexels.com/search/videos/cinematic/",
            "category": "Color Grading Footage",
            "description": "Diverse lighting setups to practice shot matching and exposure balance.",
            "description_th": "คลิปต่างสภาพแสงสำหรับฝึก Balance White Balance และ Contrast"
        },
        {
            "name": "EditStock Color Grading Practice",
            "name_th": "EditStock: ฉากฟุตเทจสำหรับฝึก Color Match มืออาชีพ",
            "url": "https://editstock.com/collections/free-stuff",
            "category": "Pro Project",
            "description": "Raw multi-camera clips to practice matching skin tones.",
            "description_th": "ฟุตเทจหลายกล้องสำหรับฝึกปรับโทนสีผิวให้เข้ากันอย่างแนบเนียน"
        }
    ]
}

def get_sources_for_exercise(exercise_id: str):
    for prefix, sources in TOPIC_SOURCES.items():
        if prefix in exercise_id.lower():
            return sources + CURATED_SOURCES[:1]
    return CURATED_SOURCES

def ensure_assets(exercise_id: str):
    practice_dir = DATA_DIR / "practice" / exercise_id
    practice_dir.mkdir(parents=True, exist_ok=True)
    raw_video = practice_dir / "raw_footage.mp4"
    sample_solution = practice_dir / "sample_edited.mp4"

    # Set tailored duration based on exercise
    raw_duration = 40.0
    sample_duration = 24.0

    if "hook" in exercise_id:
        raw_duration = 28.0
        sample_duration = 16.0
    elif "timing" in exercise_id:
        raw_duration = 32.0
        sample_duration = 18.0
    elif "complete" in exercise_id:
        raw_duration = 65.0
        sample_duration = 42.0
    elif "story" in exercise_id:
        raw_duration = 38.0
        sample_duration = 22.0

    if not raw_video.exists():
        try:
            FFmpegService.generate_demo_video(str(raw_video), duration=raw_duration, cuts=False)
        except Exception as e:
            print(f"Error auto-generating demo raw video for {exercise_id}: {e}")

    if not sample_solution.exists():
        try:
            FFmpegService.generate_demo_video(str(sample_solution), duration=sample_duration, cuts=True)
        except Exception as e:
            print(f"Error auto-generating demo sample video for {exercise_id}: {e}")

    return raw_video, sample_solution, practice_dir

@router.get("")
def list_exercises():
    """List all available practice challenges across all curriculum modules."""
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
        SELECT e.*, l.module_id, l.module_title, l.module_number, l.skill, l.difficulty
        FROM exercises e
        LEFT JOIN lessons l ON e.lesson_id = l.id
        ORDER BY l.module_number, e.id;
        """)
        rows = cur.fetchall()

        results = []
        for r in rows:
            item = dict(r)
            item["target_metrics"] = json.loads(item["target_metrics_json"]) if item.get("target_metrics_json") else {}
            item["checklist"] = json.loads(item["checklist_json"]) if item.get("checklist_json") else []

            # Check attempt count & best score
            cur.execute("""
            SELECT COUNT(*) as count, MAX(score) as best_score
            FROM practice_attempts
            WHERE exercise_id = ?;
            """, (item["id"],))
            stat = cur.fetchone()
            item["attempts_count"] = stat["count"] if stat else 0
            item["best_score"] = stat["best_score"] if stat and stat["best_score"] is not None else None

            practice_dir = DATA_DIR / "practice" / item["id"]
            item["raw_footage_exists"] = (practice_dir / "raw_footage.mp4").exists()
            results.append(item)

        return {"exercises": results}

@router.get("/{exercise_id}")
def get_exercise(exercise_id: str):
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
        SELECT e.*, l.module_id, l.module_title, l.module_number, l.skill, l.difficulty
        FROM exercises e
        LEFT JOIN lessons l ON e.lesson_id = l.id
        WHERE e.id = ?;
        """, (exercise_id,))
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
        data["external_sources"] = get_sources_for_exercise(exercise_id)

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
