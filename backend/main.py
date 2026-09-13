# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import shutil

from backend.database.db import init_db
from backend.api.dashboard import router as dashboard_router
from backend.api.lessons import router as lessons_router
from backend.api.practice import router as practice_router
from backend.api.submissions import router as submissions_router
from backend.api.analysis import router as analysis_router
from backend.api.skills import router as skills_router
from backend.api.media import router as media_router
from backend.api.settings import router as settings_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    init_db()
    yield

app = FastAPI(
    title="EditLab API",
    description="Personal AI Video Editing Coach",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration for local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(dashboard_router)
app.include_router(lessons_router)
app.include_router(practice_router)
app.include_router(submissions_router)
app.include_router(analysis_router)
app.include_router(skills_router)
app.include_router(media_router)
app.include_router(settings_router)

@app.get("/api/health")
def health_check():
    ffmpeg_ok = shutil.which("ffmpeg") is not None
    ffprobe_ok = shutil.which("ffprobe") is not None
    return {
        "status": "healthy",
        "service": "EditLab Backend",
        "version": "0.1.0",
        "ffmpeg": "available" if ffmpeg_ok else "missing",
        "ffprobe": "available" if ffprobe_ok else "missing"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
