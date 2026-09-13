# backend/services/ai/feedback_service.py
import json
import uuid
from pathlib import Path
from typing import Optional, Dict, Any
from backend.models.schemas import AnalysisResult, VideoMetrics
from backend.services.video.metrics import MetricsService
from backend.services.ai.local_rule_provider import LocalRuleBasedAIProvider
from backend.database.db import get_db_connection

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
THUMBNAIL_DIR = DATA_DIR / "thumbnails"

class FeedbackService:
    def __init__(self):
        self.local_provider = LocalRuleBasedAIProvider()

    def analyze_submission(self, video_path: str, exercise_id: Optional[str] = None) -> AnalysisResult:
        """
        Full pipeline: Video metrics -> AI / Rule Analysis -> DB persistence -> Skill score update
        """
        # 1. Deterministic video analysis
        metrics: VideoMetrics = MetricsService.analyze_video(video_path, str(THUMBNAIL_DIR))

        # 2. Fetch exercise context if exercise_id provided
        exercise_context = None
        if exercise_id:
            with get_db_connection() as conn:
                cur = conn.cursor()
                cur.execute("SELECT * FROM exercises WHERE id = ?;", (exercise_id,))
                row = cur.fetchone()
                if row:
                    exercise_context = {
                        "id": row["id"],
                        "title": row["title"],
                        "target_metrics": json.loads(row["target_metrics_json"]) if row["target_metrics_json"] else {},
                        "checklist": json.loads(row["checklist_json"]) if row["checklist_json"] else []
                    }

        # 3. AI / Rule Analysis
        analysis = self.local_provider.analyze_edit(video_path, metrics, exercise_context)
        analysis_id = f"ana_{uuid.uuid4().hex[:12]}"
        analysis.id = analysis_id

        # 4. Save to Database
        with get_db_connection() as conn:
            cur = conn.cursor()
            cur.execute("""
            INSERT INTO analyses (id, video_path, duration, metrics_json, feedback_json, overall_score)
            VALUES (?, ?, ?, ?, ?, ?);
            """, (
                analysis_id,
                video_path,
                analysis.duration,
                analysis.metrics.model_dump_json(),
                analysis.model_dump_json(),
                analysis.overall_score
            ))

            # Record practice attempt if exercise_id given
            if exercise_id:
                attempt_id = f"att_{uuid.uuid4().hex[:10]}"
                cur.execute("""
                INSERT INTO practice_attempts (id, exercise_id, video_path, analysis_id, score)
                VALUES (?, ?, ?, ?, ?);
                """, (
                    attempt_id,
                    exercise_id,
                    video_path,
                    analysis_id,
                    analysis.overall_score
                ))

            # Update skills with running average
            skill_map = {
                "pacing": "pacing",
                "timing": "cut_timing",
                "story": "story",
                "audio": "audio",
                "broll": "broll",
                "motion": "motion",
                "hook": "hook"
            }
            for skill_key, new_val in analysis.skills.items():
                db_skill_id = skill_map.get(skill_key, skill_key)
                cur.execute("SELECT score, confidence FROM skills WHERE id = ?;", (db_skill_id,))
                existing = cur.fetchone()
                if existing:
                    old_score = existing["score"]
                    updated_score = round(old_score * 0.4 + new_val * 0.6, 1)
                    cur.execute("""
                    UPDATE skills
                    SET score = ?, confidence = MIN(1.0, confidence + 0.1), updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?;
                    """, (updated_score, db_skill_id))
                else:
                    cur.execute("""
                    INSERT INTO skills (id, name, score, confidence)
                    VALUES (?, ?, ?, ?);
                    """, (db_skill_id, skill_key.capitalize(), float(new_val), 0.6))

            conn.commit()

        return analysis
