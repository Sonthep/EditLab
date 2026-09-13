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

        # Seed initial exercise for Pacing 01 (Demo Scenario Section 40)
        cursor.execute("SELECT COUNT(*) as count FROM exercises WHERE id = 'pacing-01-practice';")
        if cursor.fetchone()["count"] == 0:
            target_metrics = {
                "target_duration_min": 20.0,
                "target_duration_max": 30.0,
                "max_shot_duration": 4.0,
                "target_asl_min": 1.5,
                "target_asl_max": 3.0,
                "min_cuts": 6,
                "max_silence_gap": 0.8
            }
            checklist = [
                "Hook: Visual and auditory interest within the first 3 seconds",
                "Trim all silent pauses and hesitations over 0.8 seconds",
                "Keep talking head shots under 3.5 seconds before a cut or visual change",
                "Total edited video length between 20 and 30 seconds",
                "Preserve the natural conversational clarity of the dialogue"
            ]
            cursor.execute("""
            INSERT INTO exercises (id, lesson_id, title, type, instructions, assets_path, target_metrics_json, checklist_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                "pacing-01-practice",
                "pacing-01",
                "Practice Challenge: Pacing #01 — Fast Talking Head",
                "practice",
                "Edit the provided raw talking head footage down to an energetic 20–30 second short. Remove dead air, tighten pauses, and maintain conversational momentum.",
                "data/practice/pacing-01",
                json.dumps(target_metrics),
                json.dumps(checklist)
            ))
            conn.commit()

        # Seed lessons from curriculum.json if empty
        cursor.execute("SELECT COUNT(*) as count FROM lessons;")
        if cursor.fetchone()["count"] == 0:
            curriculum_file = DATABASE_DIR.parent / "content" / "curriculum.json"
            if curriculum_file.exists():
                with open(curriculum_file, "r", encoding="utf-8") as f:
                    curr_data = json.load(f)
                    order_idx = 0
                    for mod in curr_data.get("modules", []):
                        for les in mod.get("lessons", []):
                            order_idx += 1
                            cursor.execute("""
                            INSERT INTO lessons (id, module_id, module_title, module_number, title, description, duration, difficulty, skill, content_json, completed, sort_order)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
                                0,
                                order_idx
                            ))
                    conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
