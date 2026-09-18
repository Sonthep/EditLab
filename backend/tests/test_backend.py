# backend/tests/test_backend.py
import pytest
from fastapi.testclient import TestClient
from pathlib import Path
from backend.main import app
from backend.services.video.ffmpeg_service import FFmpegService
from backend.services.video.metrics import MetricsService
from backend.services.ai.feedback_service import FeedbackService

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ffmpeg"] == "available"
    assert data["ffprobe"] == "available"

def test_dashboard_api():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "level" in data
    assert "skills" in data
    assert len(data["skills"]) > 0

def test_lessons_api():
    response = client.get("/api/lessons")
    assert response.status_code == 200
    data = response.json()
    assert "modules" in data
    assert len(data["modules"]) == 10

    # Check pacing-01
    res_lesson = client.get("/api/lessons/pacing-01")
    assert res_lesson.status_code == 200
    lesson_data = res_lesson.json()
    assert lesson_data["id"] == "pacing-01"
    assert "quiz" in lesson_data["content"]

def test_synthetic_video_and_analysis():
    # Generate a temporary 10s video for pipeline testing
    temp_dir = Path(__file__).resolve().parent.parent.parent / "data" / "cache" / "test"
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_video = temp_dir / "test_clip.mp4"

    created_path = FFmpegService.generate_demo_video(str(temp_video), duration=10.0, cuts=True)
    assert Path(created_path).exists()

    # Test ffprobe
    meta = FFmpegService.run_ffprobe_metadata(created_path)
    assert meta["duration"] > 0
    assert meta["width"] > 0

    # Test FeedbackService
    feedback_svc = FeedbackService()
    analysis = feedback_svc.analyze_submission(created_path, "pacing-01-practice")
    assert analysis.overall_score > 0
    assert "pacing" in analysis.skills
    assert len(analysis.events) > 0
    assert len(analysis.strengths) > 0

def test_settings_gemini_api():
    # Verify GET /api/settings includes gemini_model
    res = client.get("/api/settings")
    assert res.status_code == 200
    data = res.json()
    assert "gemini_model" in data
    assert "gemini" in data["gemini_model"]

    # Verify POST /api/settings/test-gemini with invalid key
    res_test = client.post("/api/settings/test-gemini", json={"gemini_api_key": "invalid_dummy_key", "gemini_model": "gemini-2.5-flash"})
    assert res_test.status_code == 200
    test_data = res_test.json()
    assert test_data["status"] == "error"
    assert "error" in test_data["message"].lower() or "not valid" in test_data["message"].lower()

def test_gemini_provider_fallback():
    from backend.services.ai.gemini_provider import GeminiAIProvider
    # Instantiating with invalid/empty key triggers fallback safely
    provider = GeminiAIProvider(api_key="", model="gemini-2.5-flash")
    
    # Generate a demo video for metrics
    temp_dir = Path(__file__).resolve().parent.parent.parent / "data" / "cache" / "test"
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_video = temp_dir / "gemini_fallback_test.mp4"
    created_path = FFmpegService.generate_demo_video(str(temp_video), duration=6.0, cuts=True)
    
    metrics = MetricsService.analyze_video(created_path, str(temp_dir))
    analysis = provider.analyze_edit(created_path, metrics)
    assert analysis.overall_score > 0
    assert "pacing" in analysis.skills

