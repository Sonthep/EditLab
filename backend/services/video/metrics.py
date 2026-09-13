# backend/services/video/metrics.py
import uuid
from pathlib import Path
from typing import Dict, Any, List, Optional
from .ffmpeg_service import FFmpegService
from .scene_detector import SceneDetector
from .audio_analyzer import AudioAnalyzer
from backend.models.schemas import VideoMetrics, SceneSegment, SilenceInterval

class MetricsService:
    @staticmethod
    def analyze_video(video_path: str, thumbnail_dir: Optional[str] = None) -> VideoMetrics:
        """
        Runs the full deterministic video analysis pipeline using FFprobe, SceneDetector, and AudioAnalyzer.
        """
        metadata = FFmpegService.run_ffprobe_metadata(video_path)
        duration = metadata["duration"]

        # Scene cuts
        raw_scenes = SceneDetector.detect_scenes(video_path, duration)
        
        # Silence intervals
        silences, total_silence, speech_ratio = AudioAnalyzer.detect_silence(video_path, duration)

        shot_count = len(raw_scenes)
        durations = [s["duration"] for s in raw_scenes] if raw_scenes else [duration]
        asl = round(duration / shot_count, 2) if shot_count > 0 else duration
        longest = max(durations) if durations else duration
        shortest = min(durations) if durations else duration
        cuts_per_min = round((shot_count - 1) / (duration / 60.0), 1) if duration > 0 and shot_count > 1 else 0.0

        # Generate thumbnails for scenes if thumbnail_dir is provided
        scene_segments: List[SceneSegment] = []
        if thumbnail_dir:
            t_dir = Path(thumbnail_dir)
            t_dir.mkdir(parents=True, exist_ok=True)
            for sc in raw_scenes:
                thumb_name = f"thumb_{uuid.uuid4().hex[:8]}_{sc['index']}.jpg"
                thumb_path = t_dir / thumb_name
                # Sample 0.2s after cut point
                sample_time = min(sc["start"] + 0.2, sc["end"] - 0.1) if sc["end"] > sc["start"] + 0.3 else sc["start"]
                extracted = FFmpegService.extract_thumbnail(video_path, sample_time, str(thumb_path))
                thumb_url = f"/api/media/thumbnails/{thumb_name}" if extracted else None
                scene_segments.append(SceneSegment(
                    index=sc["index"],
                    start=sc["start"],
                    end=sc["end"],
                    duration=sc["duration"],
                    thumbnail=thumb_url
                ))
        else:
            for sc in raw_scenes:
                scene_segments.append(SceneSegment(
                    index=sc["index"],
                    start=sc["start"],
                    end=sc["end"],
                    duration=sc["duration"]
                ))

        silence_intervals = [
            SilenceInterval(start=sil["start"], end=sil["end"], duration=sil["duration"])
            for sil in silences
        ]

        return VideoMetrics(
            duration=duration,
            shot_count=shot_count,
            average_shot_length=asl,
            longest_shot=longest,
            shortest_shot=shortest,
            cuts_per_minute=cuts_per_min,
            silence_seconds=total_silence,
            speech_ratio=speech_ratio,
            width=metadata.get("width"),
            height=metadata.get("height"),
            fps=metadata.get("fps"),
            scenes=scene_segments,
            silences=silence_intervals
        )
