# EditLab
## Personal AI Video Editing Coach

Version: MVP 0.1  
Mode: Local-first / Single User  
Primary NLE: DaVinci Resolve  
Platform: Windows Desktop-first Local Web App

---

# 1. Product Vision

สร้างเครื่องมือส่วนตัวสำหรับฝึกเป็น Video Editor

EditLab ไม่ใช่ Video Editor ที่มาแทน DaVinci Resolve

หน้าที่ของ EditLab คือ:

**Teach → Practice → Analyze → Feedback → Improve → Reverse Engineer**

ผู้ใช้เรียนหลักการตัดต่อใน EditLab แล้วลงมือตัดจริงใน DaVinci Resolve

หลังจากตัดเสร็จ ผู้ใช้ Export งานกลับมาให้ EditLab วิเคราะห์และให้ Feedback

เป้าหมายระยะยาวคือทำให้ EditLab เป็น

**Personal AI Editing Coach**

ที่รู้ว่า:

- ผู้ใช้เรียนอะไรแล้ว
- จุดแข็งคืออะไร
- จุดอ่อนคืออะไร
- ควรฝึกอะไรต่อ
- Style การตัดของผู้ใช้เป็นอย่างไร
- Reference ที่ผู้ใช้ชอบใช้เทคนิคอะไร
- ผู้ใช้พัฒนาขึ้นอย่างไรตามเวลา

---

# 2. Core Philosophy

EditLab ต้องเน้นสอน

**Editing Thinking**

ไม่ใช่สอนแค่ปุ่มในโปรแกรม

สิ่งที่ต้องสอน:

- When to cut
- Why to cut
- What to show
- What not to show
- Pacing
- Rhythm
- Story
- Attention
- Emotion
- Audio timing
- Visual hierarchy
- B-roll usage
- Pattern interrupt
- Hook
- Retention

DaVinci Resolve เป็นเครื่องมือ

EditLab เป็นครู

---

# 3. Main Workflow

```text
HOME
 ↓
FOUNDATION
 ↓
MICRO LESSON
 ↓
WORKSHOP
 ↓
PRACTICE CHALLENGE
 ↓
OPEN DAVINCI RESOLVE
 ↓
EDIT VIDEO
 ↓
EXPORT MP4
 ↓
SUBMIT TO EDITLAB
 ↓
ANALYSIS
 ↓
AI FEEDBACK
 ↓
SKILL SCORE
 ↓
NEXT PRACTICE
```

เมื่อ Foundation เริ่มแข็งแรงแล้ว:

```text
REFERENCE VIDEO
 ↓
REFERENCE LAB
 ↓
AI ANALYSIS
 ↓
EDITING DNA
 ↓
TECHNIQUES DETECTED
 ↓
WHY THIS EDIT WORKS
 ↓
RECREATE CHALLENGE
 ↓
EDIT IN DAVINCI
 ↓
SUBMIT
 ↓
COMPARE
 ↓
FEEDBACK
 ↓
SAVE AS BLUEPRINT
```

---

# 4. MVP Scope

## MVP 0.1 ต้องมี

### 4.1 Dashboard

แสดง:

- Continue Learning
- Current Level
- Recent Practice
- Recommended Practice
- Skill Scores
- Practice Streak
- Reference Lab

ตัวอย่าง:

```text
EDITLAB

Continue Learning

Pacing & Rhythm
Lesson 03 / 08

[ Continue ]

Your Skills

Cut Timing       72
Pacing           61
Story            68
Audio            42
B-roll           57
Motion           35

Recommended

Audio Timing #01

[ Start Practice ]
```

---

# 5. Foundation Curriculum

เริ่มด้วย 10 Modules

## Module 01 — Cut & Timing

เรียน:

- Why Cut
- Cutting on thought
- Cutting on movement
- Jump Cut
- Cut too early
- Cut too late
- Removing dead air

---

## Module 02 — Pacing & Rhythm

เรียน:

- Shot duration
- Fast vs slow pacing
- Rhythm
- Changing pace
- Energy
- Attention reset

---

## Module 03 — Story & Sequence

เรียน:

- Setup
- Conflict
- Progression
- Payoff
- Shot order
- Information hierarchy

---

## Module 04 — B-roll

เรียน:

- Why use B-roll
- Cover cuts
- Explain information
- Show instead of tell
- Visual reset

---

## Module 05 — Audio

เรียน:

- Dialogue
- Music
- SFX
- Silence
- J-Cut
- L-Cut
- Audio transition

---

## Module 06 — Text & Caption

เรียน:

- Caption timing
- Keyword emphasis
- Visual hierarchy
- Readability
- Caption density

---

## Module 07 — Motion

เรียน:

- Punch zoom
- Scale
- Position
- Camera movement
- Motion emphasis

---

## Module 08 — Hook & Retention

เรียน:

- First 1–3 seconds
- Curiosity
- Question
- Pattern interrupt
- Open loop
- Attention reset

---

## Module 09 — Color & Visual Consistency

เรียน:

- Exposure
- Contrast
- White balance
- Shot matching
- Basic look

ไม่ต้องสอน Advanced Color Grading ใน MVP

---

## Module 10 — Complete Edit

ผู้ใช้ได้รับ Raw Footage

โจทย์:

สร้างวิดีโอ 30–60 วินาที

ต้องใช้:

- Hook
- Dialogue editing
- B-roll
- Music
- SFX
- Captions
- Pacing

จากนั้น EditLab วิเคราะห์ทั้งงาน

---

# 6. Lesson Structure

แต่ละ Lesson ต้องสั้นและเน้นการลงมือทำ

Structure:

```text
Concept
 ↓
Example
 ↓
Bad Example
 ↓
Good Example
 ↓
Why?
 ↓
Mini Quiz
 ↓
Practice
```

Lesson ไม่ควรเป็นบทความยาว

เป้าหมายคือ:

**Learn → Do**

---

# 7. Workshop System

Workshop มี 3 รูปแบบใน MVP

## Type A — Choose

ตัวอย่าง:

```text
Which cut feels better?

A
00:02.1

B
00:03.4

C
00:05.7
```

หลังตอบ:

```text
Best choice: B

WHY?

Speaker finishes one thought at 00:03.3.

Cutting around this point preserves meaning
while maintaining momentum.
```

---

## Type B — Fix This Edit

ให้ Video ที่ตั้งใจตัดไม่ดี

ตัวอย่าง:

```text
Talking Head   5.4 sec
B-roll         0.6 sec
Talking Head   7.2 sec
```

Task:

```text
Make this edit feel faster
without changing the dialogue.
```

---

## Type C — Real Practice

ให้:

```text
/raw/practice-001/
```

ผู้ใช้เปิดไฟล์ใน DaVinci

Task:

```text
Create a 30-second edit.

Requirements:

Hook < 3 sec
At least 3 B-roll shots
Remove unnecessary pauses
Use at least 1 J-Cut
```

เสร็จแล้ว Export MP4

นำกลับเข้า EditLab

---

# 8. Submission System

หน้า Practice ต้องมี:

```text
Practice: Pacing #03

Instructions
Reference
Raw Footage
Checklist

[ Open Practice Folder ]

After editing:

[ Select Exported Video ]

Optional:
[ Select Timeline File ]

[ Analyze My Edit ]
```

MVP ต้องรองรับ:

- MP4
- MOV

Optional ใน Phase หลัง:

- FCPXML
- EDL
- Timeline metadata

---

# 9. Video Analysis Pipeline

เมื่อผู้ใช้ Submit Video:

```text
VIDEO
 ↓
FFPROBE
 ↓
Metadata
 ↓
FFMPEG
 ↓
Audio Extraction
 ↓
Frame Sampling
 ↓
Scene Detection
 ↓
Speech Transcription
 ↓
Silence Detection
 ↓
Motion Analysis
 ↓
Shot Analysis
 ↓
AI Interpretation
 ↓
Score
 ↓
Feedback
```

---

# 10. Metrics

ระบบต้องเก็บข้อมูลพื้นฐาน เช่น:

```json
{
  "duration": 42.6,
  "shot_count": 21,
  "average_shot_length": 2.02,
  "longest_shot": 5.8,
  "shortest_shot": 0.4,
  "cuts_per_minute": 29.5,
  "silence_seconds": 3.2,
  "speech_ratio": 0.72
}
```

---

# 11. Skill Scoring

คะแนน 0–100

เริ่มจาก:

```text
Cut Timing
Pacing
Story
Audio
B-roll
Hook
Text
Motion
Overall
```

ตัวอย่าง:

```text
Pacing        76
Cut Timing    83
Story         71
Audio         54
B-roll        80
Motion        62

Overall       71
```

IMPORTANT:

คะแนน AI ไม่ควรถูกแสดงว่าเป็น Absolute Truth

ต้องมี:

```text
Score
Confidence
Reason
Evidence
```

ตัวอย่าง:

```json
{
  "skill": "pacing",
  "score": 76,
  "confidence": 0.82,
  "reason": "Most sections maintain consistent energy but the middle section slows noticeably.",
  "evidence": [
    {
      "start": 12.4,
      "end": 18.1,
      "issue": "long_talking_head_segment"
    }
  ]
}
```

---

# 12. Feedback Format

AI ห้ามตอบกว้าง ๆ เช่น:

```text
Your edit is good.
Try improving pacing.
```

ต้องให้ Feedback ที่ Actionable

ตัวอย่าง:

```text
00:00–00:02.4

GOOD

Hook starts immediately.
No unnecessary intro.
```

```text
00:08.3–00:11.7

IMPROVE

Talking head remains unchanged for 3.4 seconds.

Try:
- B-roll
- Punch-in
- Reaction
- Earlier cut
```

```text
00:17.2

GOOD

Audio begins before the next visual.

This creates a J-Cut and makes the transition smoother.
```

---

# 13. Feedback Screen

Layout:

```text
┌──────────────────────────────────────────┐
│                 VIDEO                    │
│                                          │
└──────────────────────────────────────────┘

00:00 ─────────────▲──────────────── 00:42

Feedback Timeline

✓ Hook
✓ Good Cut
! Slow Section
✓ J-Cut
! Long Talking Head
✓ B-roll

-------------------------------------------

Overall Score

71 / 100

Pacing       76
Timing       83
Story        71
Audio        54

-------------------------------------------

Top Improvement

Audio transitions

[ Practice Audio Timing ]
```

คลิก Feedback แล้ว Video ต้อง Seek ไป Timestamp นั้น

---

# 14. Skill Profile

ต้องมีหน้า:

```text
My Editor Profile
```

ตัวอย่าง:

```text
EDITOR LEVEL 4

Cut Timing       ████████░░ 82
Pacing           ███████░░░ 74
Story            ██████░░░░ 65
Audio            ████░░░░░░ 43
B-roll           ███████░░░ 72
Motion           ████░░░░░░ 46
Hook             ████████░░ 81
```

ใต้คะแนน:

```text
Strongest:
Cut Timing

Needs Practice:
Audio

Recommended:
J-Cut Workshop #02
```

---

# 15. Progress System

เก็บ:

- Completed lessons
- Practice attempts
- Scores
- Score history
- Feedback history
- Weak skills
- Strong skills
- Recent activity

ไม่ต้องมี:

- Login
- Authentication
- Cloud sync
- Multiple users

---

# 16. Reference Lab

หลัง MVP Foundation ใช้งานได้แล้ว ให้สร้าง Module นี้

หน้า:

```text
REFERENCE LAB

[ Select Reference Video ]
```

Analysis:

```text
Duration
Shots
Average shot length
Cut frequency
Speech
Silence
Music
B-roll
Zoom
Motion
Captions
Scene changes
```

แล้ว AI สร้าง:

# Editing DNA

ตัวอย่าง:

```text
Duration
42 sec

Shots
27

Average Shot Length
1.55 sec

Hook
0–2.3 sec

Pattern Interrupts
6

B-roll
9

Punch Zoom
5

Major SFX
8
```

---

# 17. Reference Timeline

แสดง:

```text
00:00
HOOK

00:01.2
Jump Cut

00:02.8
Punch Zoom

00:04.1
B-roll

00:06.4
SFX

00:08.7
J-Cut

00:11.2
Pattern Interrupt
```

---

# 18. WHY Analysis

นี่คือ Feature สำคัญ

AI ต้องพยายามอธิบายว่า

**ทำไม Editor ถึงเลือกทำแบบนี้**

ตัวอย่าง:

```text
00:03.2

Punch Zoom

WHY?

The speaker introduces the key claim here.

The visual emphasis helps signal
that this information is important.
```

หรือ:

```text
00:07.8

B-roll begins.

WHY?

The talking head has remained visually unchanged
for approximately 3 seconds.

B-roll acts as an attention reset
while also illustrating the spoken idea.
```

---

# 19. Technique Detection

Reference Lab ต้องระบุ:

```text
Techniques Detected

✓ Jump Cut
✓ B-roll
✓ Punch Zoom
✓ J-Cut
✓ Pattern Interrupt
✓ Caption Emphasis
```

ระบบตรวจ Skill Profile

ถ้ายังไม่เรียน:

```text
J-Cut

You have not practiced this technique yet.

[ Start J-Cut Workshop ]
```

---

# 20. Recreate Challenge

หลังวิเคราะห์ Reference:

```text
[ Create Practice From Reference ]
```

ระบบสร้างโจทย์:

```text
REFERENCE STYLE

Fast educational short

TARGET

30–45 sec

GOALS

Average shot length:
1.5–2.0 sec

Hook:
< 2 sec

Pattern Interrupt:
every 3–5 sec

B-roll:
6+

Punch Zoom:
3+
```

ผู้ใช้ตัดใน DaVinci

แล้ว Submit

---

# 21. Compare Mode

แสดง:

```text
REFERENCE

|--1.2--|-.8-|---1.7---|-1.1-|


YOUR EDIT

|---1.9---|--1.5--|----2.8----|
```

และ:

```text
Reference ASL
1.55 sec

Your ASL
2.31 sec
```

AI Feedback:

```text
Your version is approximately
32% slower in pacing.

Largest difference:

00:08–00:15
```

---

# 22. Editing Blueprint

Reference ที่วิเคราะห์แล้วสามารถ:

```text
Save as Blueprint
```

Example:

```text
Blueprint:
Fast Talking Head #01

HOOK
0–2 sec

FAST CUT
2–6 sec

B-ROLL
6–8 sec

PUNCH ZOOM
8 sec

PATTERN INTERRUPT
12 sec

B-ROLL
16 sec
```

เก็บใน:

```text
My Blueprints
```

---

# 23. Technology Stack

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
```

ใช้ current stable versions

ไม่ lock version โดยไม่จำเป็น

---

## Backend

```text
Python
FastAPI
```

Backend responsible for:

- Video analysis
- FFmpeg
- AI providers
- Database
- File management
- Scoring
- Reference analysis

---

## Database

```text
SQLite
```

ไฟล์:

```text
data/editlab.db
```

---

## Video

```text
FFmpeg
ffprobe
OpenCV
```

ใช้สำหรับ:

- Metadata
- Scene detection
- Audio extraction
- Silence detection
- Thumbnail generation
- Frame extraction
- Motion estimation

---

# 24. AI Provider Architecture

ห้ามผูกระบบกับ AI Provider ตัวเดียว

สร้าง Interface:

```text
AIProvider
```

Methods:

```text
analyze_edit()
analyze_reference()
generate_feedback()
explain_technique()
generate_practice()
```

ตัวอย่าง:

```python
class AIProvider:
    def analyze_edit(self, context):
        ...

    def analyze_reference(self, context):
        ...

    def generate_feedback(self, context):
        ...
```

ทำให้เปลี่ยนระหว่าง:

```text
OpenAI
Local Model
Other Provider
```

ได้ภายหลัง

---

# 25. Transcription Provider

แยก:

```text
TranscriptionProvider
```

รองรับภายหลัง:

```text
Cloud transcription
Whisper
whisper.cpp
Other local model
```

MVP ใช้ Provider ที่ setup ง่ายที่สุดก่อน

---

# 26. Project Structure

```text
editlab/
│
├─ frontend/
│  ├─ app/
│  │  ├─ page.tsx
│  │  ├─ learn/
│  │  ├─ practice/
│  │  ├─ feedback/
│  │  ├─ skills/
│  │  ├─ references/
│  │  └─ settings/
│  │
│  ├─ components/
│  │  ├─ video/
│  │  ├─ timeline/
│  │  ├─ feedback/
│  │  ├─ lessons/
│  │  └─ skills/
│  │
│  └─ lib/
│
├─ backend/
│  ├─ main.py
│  │
│  ├─ api/
│  │  ├─ lessons.py
│  │  ├─ practice.py
│  │  ├─ submissions.py
│  │  ├─ analysis.py
│  │  ├─ references.py
│  │  └─ skills.py
│  │
│  ├─ services/
│  │  ├─ video/
│  │  │  ├─ ffmpeg_service.py
│  │  │  ├─ scene_detector.py
│  │  │  ├─ audio_analyzer.py
│  │  │  ├─ frame_analyzer.py
│  │  │  └─ thumbnail_service.py
│  │  │
│  │  ├─ ai/
│  │  │  ├─ provider.py
│  │  │  ├─ feedback_service.py
│  │  │  └─ reference_analyzer.py
│  │  │
│  │  ├─ transcription/
│  │  │
│  │  └─ scoring/
│  │     ├─ pacing.py
│  │     ├─ timing.py
│  │     ├─ audio.py
│  │     └─ overall.py
│  │
│  ├─ models/
│  │
│  └─ database/
│
├─ content/
│  ├─ lessons/
│  ├─ exercises/
│  └─ curriculum.json
│
├─ data/
│  ├─ editlab.db
│  ├─ practice/
│  ├─ submissions/
│  ├─ references/
│  ├─ thumbnails/
│  └─ cache/
│
├─ scripts/
│  ├─ setup.ps1
│  ├─ run.ps1
│  └─ check_ffmpeg.ps1
│
├─ docs/
│  ├─ PRODUCT.md
│  ├─ ARCHITECTURE.md
│  ├─ DATABASE.md
│  └─ AI_ANALYSIS.md
│
├─ README.md
└─ AGENTS.md
```

---

# 27. Database Models

## Lesson

```text
id
module
title
description
order
content
difficulty
```

## Exercise

```text
id
lesson_id
title
type
instructions
assets_path
target_metrics
```

## PracticeAttempt

```text
id
exercise_id
created_at
video_path
analysis_id
score
```

## Skill

```text
id
name
score
confidence
updated_at
```

## Analysis

```text
id
video_path
duration
metrics_json
feedback_json
created_at
```

## Reference

```text
id
video_path
title
analysis_json
blueprint_json
created_at
```

---

# 28. Local File Structure

Default:

```text
D:\EditLab\
```

Folders:

```text
D:\EditLab\
│
├─ Practice\
├─ References\
├─ Submissions\
├─ Projects\
├─ Blueprints\
├─ Cache\
└─ Exports\
```

Path ต้องแก้ได้ใน Settings

---

# 29. API Examples

```text
GET
/api/dashboard

GET
/api/lessons

GET
/api/lessons/{id}

GET
/api/exercises/{id}

POST
/api/submissions

POST
/api/submissions/{id}/analyze

GET
/api/analysis/{id}

GET
/api/skills

POST
/api/references

POST
/api/references/{id}/analyze

GET
/api/references/{id}
```

---

# 30. Analysis JSON Contract

AI output ห้ามส่ง Free-form อย่างเดียว

ต้อง return Structured JSON

Example:

```json
{
  "overall_score": 74,
  "skills": {
    "timing": 82,
    "pacing": 73,
    "story": 69,
    "audio": 58
  },
  "strengths": [
    "Fast hook",
    "Good use of b-roll"
  ],
  "improvements": [
    "Middle section loses momentum",
    "Audio transitions need improvement"
  ],
  "events": [
    {
      "start": 8.2,
      "end": 11.4,
      "type": "pacing_issue",
      "severity": "medium",
      "message": "Talking head remains visually unchanged for 3.2 seconds."
    }
  ],
  "next_practice": {
    "skill": "audio",
    "exercise_id": "audio-002"
  }
}
```

Validate response with schema before storing.

---

# 31. UI Design Direction

Dark UI

Inspired by professional editing software

Main colors should be neutral.

Avoid:

- Gaming UI
- excessive gradients
- excessive animations
- childish gamification

Use:

- Large video preview
- Clear timeline
- compact cards
- progress bars
- waveform
- timestamps
- keyboard-friendly navigation

---

# 32. Important UX Rule

Feedback ทุกอย่างที่มี Timestamp ต้อง Click ได้

Example:

```text
00:12.4
Pacing slows here
```

เมื่อกด:

```text
video.currentTime = 12.4
```

Video player ต้องกระโดดไปยังตำแหน่งนั้นทันที

---

# 33. MVP Development Order

Agent ต้องพัฒนาตามลำดับนี้

## Milestone 0

Project bootstrap

ต้องได้:

```text
Frontend runs
Backend runs
SQLite works
FFmpeg detected
Health check works
```

---

## Milestone 1

Foundation System

ต้องได้:

```text
Dashboard
Curriculum
Lesson page
Progress saving
Skill page
```

ยังไม่ต้อง AI

---

## Milestone 2

Practice System

ต้องได้:

```text
Exercise
Practice assets
Select exported video
Video player
Submission history
```

---

## Milestone 3

Basic Video Analysis

ต้องได้:

```text
ffprobe metadata
scene detection
shot duration
silence detection
thumbnails
basic metrics
```

---

## Milestone 4

AI Feedback

ต้องได้:

```text
Structured feedback
Timestamp feedback
Skill scoring
Recommended practice
```

---

## Milestone 5

Reference Lab

ต้องได้:

```text
Import reference
Analyze
Timeline events
Editing DNA
WHY explanation
Technique detection
```

---

## Milestone 6

Recreate

ต้องได้:

```text
Reference metrics
User submission
Comparison
Similarity metrics
Feedback
```

---

## Milestone 7

Blueprint

ต้องได้:

```text
Save reference style
Blueprint library
Reuse blueprint
```

---

# 34. DaVinci Integration

ห้ามเริ่มจาก DaVinci Integration

MVP workflow:

```text
EditLab
 ↓
Open Practice Folder
 ↓
DaVinci
 ↓
Edit
 ↓
Export MP4
 ↓
EditLab
```

หลัง Core Product ใช้งานได้แล้วค่อยเพิ่ม Integration

Possible future architecture:

```text
EditLab
 ↕
Resolve Bridge
 ↕
DaVinci Resolve
```

Resolve Bridge:

```text
Python
DaVinci Resolve Scripting API
```

Future possibilities:

- detect current project
- detect current timeline
- read timeline metadata
- read markers
- inspect clips
- export timeline information
- create markers from AI feedback
- send feedback timestamps back to Resolve

ทั้งหมดนี้เป็น Phase หลัง

---

# 35. Future Feature — Feedback Markers

ตัวอย่าง:

EditLab วิเคราะห์ว่า:

```text
00:08.4
Pacing issue

00:16.7
Good J-Cut

00:27.2
Audio issue
```

อนาคต Resolve Bridge สามารถสร้าง Marker บน DaVinci Timeline

เช่น:

```text
RED
Improve

GREEN
Good

BLUE
Suggestion
```

ทำให้ Workflow เป็น:

```text
Analyze
 ↓
Open DaVinci
 ↓
Markers already appear
 ↓
Fix edit
```

---

# 36. Non-Goals

MVP ห้ามสร้าง:

- Full video editor
- Premiere replacement
- DaVinci replacement
- Cloud storage
- Accounts
- Payment
- Social platform
- Marketplace
- Collaboration
- Multi-user
- Mobile App

ถ้า Feature ไม่ช่วยให้

**Learn / Practice / Analyze / Improve**

อย่าใส่ใน MVP

---

# 37. Engineering Rules

Agent ต้อง:

1. Build small working increments.
2. Do not implement all features at once.
3. Keep frontend and video-analysis logic separated.
4. Use typed API contracts.
5. Validate AI JSON outputs.
6. Never delete original user video.
7. Store generated files only inside configured EditLab directories.
8. Cache expensive analysis.
9. Log FFmpeg commands and errors.
10. Make AI provider replaceable.
11. Keep application usable even if AI API is unavailable.
12. Prefer deterministic analysis before asking AI.
13. AI interprets metrics; AI should not invent metrics.
14. Every feedback timestamp must trace back to analysis evidence.

---

# 38. Agent Testing Requirements

Agent must test:

```text
App starts from clean machine configuration
Database initializes
Missing FFmpeg shows helpful error
Video can be selected
Video can be played
Metadata analysis works
Scene detection works
Analysis survives app restart
Lesson progress persists
Skill scores persist
Invalid AI output does not crash app
Timestamp feedback seeks video correctly
```

---

# 39. Definition of MVP Done

MVP is considered successful when I can:

```text
1. Open EditLab
2. Choose a Foundation lesson
3. Learn one editing concept
4. Start a Practice challenge
5. Open raw footage
6. Edit it in DaVinci Resolve
7. Export MP4
8. Submit it to EditLab
9. Receive timestamp-based feedback
10. See my skill score change
11. Receive a recommended next exercise
```

If these 11 steps work reliably, stop adding features.

Use the tool personally before expanding scope.

---

# 40. First Demo Scenario

Implement this scenario first.

Lesson:

```text
Pacing 01
```

Raw Footage:

```text
Talking head ~40 sec
```

Task:

```text
Create a 20–30 second version.

Remove dead air.

Keep the story understandable.

Use cuts to maintain momentum.
```

User edits in DaVinci.

Exports:

```text
pacing-01.mp4
```

EditLab analyzes:

```text
Duration
Shot count
Average shot duration
Long sections
Silence
Speech
```

Then returns:

```text
Pacing Score: 72

GOOD
00:00–00:03
Strong opening.

IMPROVE
00:08–00:12
This section loses momentum.

IMPROVE
00:18
Pause can be shortened.

NEXT
Practice Cut Timing #02
```

Build this complete vertical slice before implementing additional lessons.

---

# 41. AGENT MASTER INSTRUCTION

You are the lead engineer for EditLab.

Read this entire specification before writing code.

Your objective is NOT to build a full video editor.

EditLab is a local-first personal AI video editing coach that works alongside DaVinci Resolve.

Implement the product incrementally according to the Milestone order.

Start with the smallest complete vertical slice:

Pacing Lesson
→ Practice
→ DaVinci export
→ Upload/select MP4
→ Analyze
→ Feedback
→ Skill progress

Do not prematurely implement Reference Lab, DaVinci scripting integration, cloud services, authentication, payments, or multi-user features.

Before implementing each milestone:

1. Review existing architecture.
2. Write a short implementation plan.
3. Identify files that will change.
4. Implement.
5. Run tests.
6. Fix errors.
7. Verify the user flow manually.
8. Update documentation.

Do not replace working architecture without a clear technical reason.

Prefer simple implementations.

The application must remain runnable after every milestone.

When requirements are ambiguous, choose the solution that best supports:

Learn → Practice → Analyze → Improve.

The user is the only user of the MVP.

Optimize for:

- simplicity
- learning value
- local performance
- maintainability
- experimentation

Do not optimize prematurely for public scale.

Begin with Milestone 0, then build the First Demo Scenario described in Section 40.