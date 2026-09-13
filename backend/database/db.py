# backend/database/db.py
import sqlite3
import json
import os
from pathlib import Path
from typing import Optional, Dict, Any, List

DATABASE_DIR = Path(__file__).resolve().parent.parent.parent / "data"
DATABASE_FILE = DATABASE_DIR / "editlab.db"

def get_db_connection():
    DATABASE_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    DATABASE_DIR.mkdir(parents=True, exist_ok=True)
    with get_db_connection() as conn:
        cursor = conn.cursor()

        # Lessons table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS lessons (
            id TEXT PRIMARY KEY,
            module_id TEXT NOT NULL,
            module_title TEXT NOT NULL,
            module_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            duration TEXT,
            difficulty TEXT,
            skill TEXT,
            content_json TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            sort_order INTEGER DEFAULT 0
        );
        """)

        # Exercises table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS exercises (
            id TEXT PRIMARY KEY,
            lesson_id TEXT,
            title TEXT NOT NULL,
            type TEXT DEFAULT 'practice',
            instructions TEXT NOT NULL,
            assets_path TEXT,
            target_metrics_json TEXT,
            checklist_json TEXT
        );
        """)

        # Skills table (Section 27 & 11)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            score REAL DEFAULT 50.0,
            confidence REAL DEFAULT 0.5,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Analyses table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            video_path TEXT NOT NULL,
            duration REAL NOT NULL,
            metrics_json TEXT NOT NULL,
            feedback_json TEXT NOT NULL,
            overall_score INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Practice attempts table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS practice_attempts (
            id TEXT PRIMARY KEY,
            exercise_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            video_path TEXT NOT NULL,
            analysis_id TEXT,
            score INTEGER,
            FOREIGN KEY (analysis_id) REFERENCES analyses (id)
        );
        """)

        # References table (for Milestone 5-7 Reference Lab)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS references_lab (
            id TEXT PRIMARY KEY,
            video_path TEXT NOT NULL,
            title TEXT NOT NULL,
            analysis_json TEXT,
            blueprint_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Settings table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        """)

        conn.commit()

        # Seed initial skills if empty
        cursor.execute("SELECT COUNT(*) as count FROM skills;")
        if cursor.fetchone()["count"] == 0:
            initial_skills = [
                ("cut_timing", "Cut Timing", 65.0, 0.6),
                ("pacing", "Pacing & Rhythm", 60.0, 0.6),
                ("story", "Story & Sequence", 55.0, 0.5),
                ("audio", "Audio Transitions", 50.0, 0.5),
                ("broll", "B-roll Usage", 58.0, 0.5),
                ("motion", "Motion & Zoom", 48.0, 0.4),
                ("hook", "Hook & Retention", 62.0, 0.5),
                ("text", "Text & Captions", 50.0, 0.4),
                ("color", "Color Consistency", 50.0, 0.4)
            ]
            cursor.executemany(
                "INSERT INTO skills (id, name, score, confidence) VALUES (?, ?, ?, ?);",
                initial_skills
            )
            conn.commit()

        # Seed all 10 exercises for curriculum modules
        all_exercises = [
            {
                "id": "timing-01-practice",
                "lesson_id": "timing-01",
                "title": "Practice Challenge: Cut Timing #01 — Cutting on Finished Thought",
                "type": "practice",
                "instructions": "Trim the dialogue right as each thought completes. Eliminate trailing dead air and awkward blinking pauses (> 0.6s) while keeping natural speech rhythm.",
                "assets_path": "data/practice/timing-01-practice",
                "target_metrics": {
                    "target_duration_min": 16.0,
                    "target_duration_max": 24.0,
                    "max_shot_duration": 3.5,
                    "target_asl_min": 1.5,
                    "target_asl_max": 2.8,
                    "min_cuts": 6,
                    "max_silence_gap": 0.6
                },
                "checklist": [
                    "Cut immediately when speech thought completes without lingering dead air",
                    "Trim silence gaps over 0.6 seconds",
                    "Keep individual shot holds under 3.5 seconds",
                    "Total edit duration between 16 and 24 seconds",
                    "Dialogue flows smoothly without jarring mid-word cutoffs"
                ]
            },
            {
                "id": "pacing-01-practice",
                "lesson_id": "pacing-01",
                "title": "Practice Challenge: Pacing #01 — Fast Talking Head",
                "type": "practice",
                "instructions": "Edit the provided raw talking head footage down to an energetic 20–30 second short. Remove dead air, tighten pauses, and maintain conversational momentum.",
                "assets_path": "data/practice/pacing-01-practice",
                "target_metrics": {
                    "target_duration_min": 20.0,
                    "target_duration_max": 30.0,
                    "max_shot_duration": 4.0,
                    "target_asl_min": 1.5,
                    "target_asl_max": 3.0,
                    "min_cuts": 6,
                    "max_silence_gap": 0.8
                },
                "checklist": [
                    "Hook: Visual and auditory interest within the first 3 seconds",
                    "Trim all silent pauses and hesitations over 0.8 seconds",
                    "Keep talking head shots under 3.5 seconds before a cut or visual change",
                    "Total edited video length between 20 and 30 seconds",
                    "Preserve conversational momentum without feeling rushed"
                ]
            },
            {
                "id": "story-01-practice",
                "lesson_id": "story-01",
                "title": "Practice Challenge: Story #01 — 3-Part Micro-Narrative",
                "type": "practice",
                "instructions": "Assemble a punchy narrative sequence structured in 3 clear parts: Hook statement (0–3s), Context explanation (3–18s), and Payoff resolution (18–25s).",
                "assets_path": "data/practice/story-01-practice",
                "target_metrics": {
                    "target_duration_min": 20.0,
                    "target_duration_max": 28.0,
                    "max_shot_duration": 4.5,
                    "target_asl_min": 2.0,
                    "target_asl_max": 3.5,
                    "min_cuts": 5,
                    "max_silence_gap": 0.7
                },
                "checklist": [
                    "Clear 3-part hierarchy: Hook → Conflict/Context → Payoff",
                    "First shot establishes premise within 3 seconds",
                    "Order cuts logically so viewer never feels disoriented",
                    "Keep story tight between 20 and 28 seconds",
                    "Conclude cleanly on the final punchline without trailing silence"
                ]
            },
            {
                "id": "broll-01-practice",
                "lesson_id": "broll-01",
                "title": "Practice Challenge: B-Roll #01 — Covering Jump Cuts",
                "type": "practice",
                "instructions": "Insert B-roll cutaway footage over talking head jump cuts to hide edits and illustrate key concepts visually.",
                "assets_path": "data/practice/broll-01-practice",
                "target_metrics": {
                    "target_duration_min": 20.0,
                    "target_duration_max": 28.0,
                    "max_shot_duration": 3.8,
                    "target_asl_min": 1.8,
                    "target_asl_max": 3.0,
                    "min_cuts": 7,
                    "max_silence_gap": 0.7
                },
                "checklist": [
                    "Place B-roll directly over awkward jump cuts on A-roll",
                    "Time B-roll cuts to match the exact word or concept spoken",
                    "Hold B-roll shots between 1.5s and 3.0s for optimal readability",
                    "Ensure dialogue track stays uninterrupted beneath cutaways",
                    "Total duration maintained between 20 and 28 seconds"
                ]
            },
            {
                "id": "audio-01-practice",
                "lesson_id": "audio-01",
                "title": "Practice Challenge: Audio #01 — Dialogue J-Cut & L-Cut",
                "type": "practice",
                "instructions": "Create smooth auditory transitions using J-Cuts and L-Cuts so cuts feel invisible and speech carries momentum across scene shifts.",
                "assets_path": "data/practice/audio-01-practice",
                "target_metrics": {
                    "target_duration_min": 18.0,
                    "target_duration_max": 26.0,
                    "max_shot_duration": 4.0,
                    "target_asl_min": 1.8,
                    "target_asl_max": 3.2,
                    "min_cuts": 5,
                    "max_silence_gap": 0.5
                },
                "checklist": [
                    "Apply at least 1 J-Cut where audio precedes visual change by 0.3–0.5s",
                    "Apply at least 1 L-Cut where dialogue trails cleanly into next shot",
                    "Smooth dialogue audio transitions with tiny crossfades",
                    "No abrupt audio pops, clicks, or hard volume drops",
                    "Total duration within 18–26 seconds"
                ]
            },
            {
                "id": "text-01-practice",
                "lesson_id": "text-01",
                "title": "Practice Challenge: Text #01 — Kinetic Caption Timing",
                "type": "practice",
                "instructions": "Add on-screen text and captions synchronized tightly with spoken words, highlighting 1–2 power keywords to guide visual focus.",
                "assets_path": "data/practice/text-01-practice",
                "target_metrics": {
                    "target_duration_min": 18.0,
                    "target_duration_max": 26.0,
                    "max_shot_duration": 3.5,
                    "target_asl_min": 1.5,
                    "target_asl_max": 2.8,
                    "min_cuts": 6,
                    "max_silence_gap": 0.7
                },
                "checklist": [
                    "Captions appear within 0.1s of spoken word audio",
                    "Highlight key emphasis words with contrasting color or size",
                    "Limit captions to 2–4 words per line to prevent reading fatigue",
                    "Place text in safe zone without obscuring speaker's face",
                    "Total duration between 18 and 26 seconds"
                ]
            },
            {
                "id": "motion-01-practice",
                "lesson_id": "motion-01",
                "title": "Practice Challenge: Motion #01 — Punch Zoom on Emphasis",
                "type": "practice",
                "instructions": "Simulate a multi-camera setup using punch zooms (115–120% scale) on punchlines and pivotal words to break visual stillness.",
                "assets_path": "data/practice/motion-01-practice",
                "target_metrics": {
                    "target_duration_min": 18.0,
                    "target_duration_max": 26.0,
                    "max_shot_duration": 3.2,
                    "target_asl_min": 1.5,
                    "target_asl_max": 2.6,
                    "min_cuts": 6,
                    "max_silence_gap": 0.7
                },
                "checklist": [
                    "Apply punch zoom precisely on high-energy or emotional words",
                    "Scale punch zoom between 115% and 120% centered on subject eyes",
                    "Avoid continuous jarring zooms; keep zooms intentional",
                    "Alternate between wide framing (100%) and punched frame",
                    "Maintain total video length between 18 and 26 seconds"
                ]
            },
            {
                "id": "hook-01-practice",
                "lesson_id": "hook-01",
                "title": "Practice Challenge: Hook #01 — First 3-Second Retention Hook",
                "type": "practice",
                "instructions": "Re-edit the opening 3 seconds. Delete all greetings and slow intros. Hook the viewer immediately with curiosity or bold visual action.",
                "assets_path": "data/practice/hook-01-practice",
                "target_metrics": {
                    "target_duration_min": 15.0,
                    "target_duration_max": 22.0,
                    "max_shot_duration": 3.0,
                    "target_asl_min": 1.2,
                    "target_asl_max": 2.4,
                    "min_cuts": 5,
                    "max_silence_gap": 0.5
                },
                "checklist": [
                    "First spoken word starts within 0.3s of video start",
                    "Eliminate generic greetings ('Hey guys, today we are...') and intros",
                    "Introduce a visual reset or cut within the first 2.5 seconds",
                    "Raise curiosity or deliver instant value before second 3",
                    "Total hook short between 15 and 22 seconds"
                ]
            },
            {
                "id": "color-01-practice",
                "lesson_id": "color-01",
                "title": "Practice Challenge: Color #01 — Shot Matching & Exposure",
                "type": "practice",
                "instructions": "Balance exposure, contrast, and white balance across multiple shots so skin tones and lighting appear seamless across cuts.",
                "assets_path": "data/practice/color-01-practice",
                "target_metrics": {
                    "target_duration_min": 20.0,
                    "target_duration_max": 30.0,
                    "max_shot_duration": 4.0,
                    "target_asl_min": 2.0,
                    "target_asl_max": 3.5,
                    "min_cuts": 5,
                    "max_silence_gap": 0.8
                },
                "checklist": [
                    "Normalize exposure between darker and lighter clips",
                    "Match white balance so background and skin tones do not shift color",
                    "Check waveform/scopes to ensure shadows and highlights do not clip",
                    "Maintain consistent visual aesthetic across all sequence cuts",
                    "Total edit between 20 and 30 seconds"
                ]
            },
            {
                "id": "complete-01-practice",
                "lesson_id": "complete-01",
                "title": "Practice Challenge: Master #01 — The 45-Second Full Short",
                "type": "practice",
                "instructions": "Synthesize all 9 disciplines into a master short: powerful 3s hook, tight dialogue pacing, intentional B-roll, J-Cut audio, and captions.",
                "assets_path": "data/practice/complete-01-practice",
                "target_metrics": {
                    "target_duration_min": 38.0,
                    "target_duration_max": 48.0,
                    "max_shot_duration": 3.8,
                    "target_asl_min": 1.6,
                    "target_asl_max": 2.8,
                    "min_cuts": 10,
                    "max_silence_gap": 0.7
                },
                "checklist": [
                    "Instant hook in first 3s with no dead air",
                    "Tight dialogue with average shot length under 2.8s",
                    "At least 3 well-placed B-roll cutaways illustrating key thoughts",
                    "Audio J-Cuts smoothing sound across shot transitions",
                    "Clean finish with high energy and cohesive narrative payoff"
                ]
            }
        ]

        for ex in all_exercises:
            cursor.execute("""
            INSERT OR REPLACE INTO exercises (id, lesson_id, title, type, instructions, assets_path, target_metrics_json, checklist_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                ex["id"],
                ex["lesson_id"],
                ex["title"],
                ex["type"],
                ex["instructions"],
                ex["assets_path"],
                json.dumps(ex["target_metrics"]),
                json.dumps(ex["checklist"])
            ))
        conn.commit()

        # Seed or refresh lessons from curriculum.json
        curriculum_file = DATABASE_DIR.parent / "content" / "curriculum.json"
        if curriculum_file.exists():
            with open(curriculum_file, "r", encoding="utf-8") as f:
                curr_data = json.load(f)
                order_idx = 0
                for mod in curr_data.get("modules", []):
                    for les in mod.get("lessons", []):
                        order_idx += 1
                        cursor.execute("""
                        INSERT OR REPLACE INTO lessons (id, module_id, module_title, module_number, title, description, duration, difficulty, skill, content_json, completed, sort_order)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
                            COALESCE((SELECT completed FROM lessons WHERE id = ?), 0),
                            ?);
                        """, (
                            les["id"],
                            mod["id"],
                            mod["title"],
                            mod["number"],
                            les["title"],
                            les.get("concept", "")[:120] + "...",
                            les.get("duration", "5 min"),
                            les.get("difficulty", "Beginner"),
                            les.get("skill", "general"),
                            json.dumps(les),
                            les["id"],
                            order_idx
                        ))
                conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
