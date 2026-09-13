# EditLab Architecture & Engineering Guide

## 1. System Overview
EditLab is a local-first desktop application designed to coach video editors. It couples a modern dark NLE-style web UI with an intelligent video analysis backend.

```text
EditLab (Next.js 15)
  ↓ (HTTP / REST + Video Range Streaming)
FastAPI Backend (Python 3.11)
  ├── SQLite (data/editlab.db - WAL Mode)
  ├── Video Pipeline (FFprobe + FFmpeg Scene & Silence Detection)
  └── AI Feedback Engine (Local Rule-Based + Cloud Providers)
```

## 2. Video Analysis Pipeline
1. **FFprobe**: Container verification, streams inspection, width/height, fps, duration, audio presence.
2. **Scene Detection**: FFmpeg `select='gt(scene,0.3)'` filter with `showinfo` parses cut timestamps without requiring heavy computer vision libraries.
3. **Audio & Silence Analysis**: FFmpeg `silencedetect=noise=-30dB:d=0.5` captures pause intervals, dead air, and calculates speech ratios.
4. **Thumbnail Extraction**: Keyframes extracted at cut boundaries for timeline scrub visuals.
5. **Deterministic Metrics**: Duration, ASL (Average Shot Length), cuts per minute, longest/shortest shots, dead air percentage.

## 3. Coaching & Feedback Engine
- Conforms to Section 30 JSON contract:
  - `overall_score`: 0–100
  - `skills`: breakdown across pacing, timing, hook, audio, story, broll, motion
  - `events`: timestamped cards with `start`, `end`, `severity` (good/improve), and actionable suggestions
  - `strengths` & `improvements`: bulleted insights
  - `next_practice`: targeted follow-up challenge
- Clickable Timestamps: Every event with a timestamp seeks the HTML5 player directly (`video.currentTime = timestamp`).
