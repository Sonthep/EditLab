# EditLab — Personal AI Video Editing Coach

> **Teach → Practice in DaVinci → Submit Exported MP4 → Analyze → Actionable Feedback → Skill Score**

EditLab is a local-first video editing mentor for Windows that helps you master the thinking behind cuts, pacing, rhythm, story, and attention resets.

## Quick Start

### 1. Prerequisites
- **FFmpeg & ffprobe**: Installed and in PATH (or verified via `scripts/check_ffmpeg.ps1`)
- **Python 3.11+**
- **Node.js v18+ & npm**

### 2. Setup
Run the setup script in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup.ps1
```

### 3. Launch
Launch both backend and frontend:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\run.ps1
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Key Features
- **Foundation Curriculum**: 10 targeted modules covering Cut & Timing, Pacing, Story, Audio, B-roll, Captions, Motion, and Hooks.
- **DaVinci Resolve Workflow**: Built to operate alongside your NLE. Open exercise folders, edit footage, export MP4, and submit back to EditLab.
- **Deterministic + AI Analysis**: FFmpeg scene cut detection, silence analysis, and actionable coaching with clickable timestamps that seek the video directly.
- **Skill Profile**: Tracks your evolving scores in Cut Timing, Pacing, Audio, Story, Hook, and B-roll.
