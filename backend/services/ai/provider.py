# backend/services/ai/provider.py
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from backend.models.schemas import VideoMetrics, AnalysisResult

class AIProvider(ABC):
    @abstractmethod
    def analyze_edit(
        self,
        video_path: str,
        metrics: VideoMetrics,
        exercise_context: Optional[Dict[str, Any]] = None
    ) -> AnalysisResult:
        """
        Analyze the edit based on deterministic video metrics and exercise requirements.
        Returns a structured AnalysisResult conforming to Section 30 JSON contract.
        """
        pass
