# backend/models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SceneSegment(BaseModel):
    index: int
    start: float
    end: float
    duration: float
    thumbnail: Optional[str] = None

class SilenceInterval(BaseModel):
    start: float
    end: float
    duration: float

class VideoMetrics(BaseModel):
    duration: float
    shot_count: int
    average_shot_length: float
    longest_shot: float
    shortest_shot: float
    cuts_per_minute: float
    silence_seconds: float
    speech_ratio: float
    width: Optional[int] = None
    height: Optional[int] = None
    fps: Optional[float] = None
    scenes: List[SceneSegment] = Field(default_factory=list)
    silences: List[SilenceInterval] = Field(default_factory=list)

class FeedbackEvent(BaseModel):
    start: float
    end: float
    type: str # e.g. "hook", "good_cut", "pacing_issue", "dead_air", "long_talking_head", "audio_issue"
    severity: str # "good", "improve", "warning", "info"
    message: str
    suggestion: Optional[str] = None

class NextPracticeRecommendation(BaseModel):
    skill: str
    exercise_id: str
    title: str
    reason: str

class AnalysisResult(BaseModel):
    id: Optional[str] = None
    video_path: str
    duration: float
    overall_score: int
    skills: Dict[str, int] # e.g. {"pacing": 76, "timing": 83, "story": 71, "audio": 54, "broll": 80, "motion": 62}
    strengths: List[str]
    improvements: List[str]
    events: List[FeedbackEvent]
    metrics: VideoMetrics
    next_practice: NextPracticeRecommendation

class SubmissionResponse(BaseModel):
    submission_id: str
    video_url: str
    status: str
    message: str

class SkillItem(BaseModel):
    id: str
    name: str
    score: float
    confidence: float
    updated_at: str

class LessonSummary(BaseModel):
    id: str
    module_id: str
    module_title: str
    module_number: int
    title: str
    description: Optional[str]
    duration: str
    difficulty: str
    skill: str
    completed: bool

class ExerciseDetail(BaseModel):
    id: str
    lesson_id: Optional[str]
    title: str
    type: str
    instructions: str
    assets_path: Optional[str]
    target_metrics: Dict[str, Any]
    checklist: List[str]
