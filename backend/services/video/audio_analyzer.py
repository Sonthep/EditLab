# backend/services/video/audio_analyzer.py
import subprocess
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple

class AudioAnalyzer:
    @staticmethod
    def detect_silence(video_path: str, total_duration: float, noise_db: str = "-30dB", min_duration: float = 0.5) -> Tuple[List[Dict[str, Any]], float, float]:
        """
        Detect silence intervals in the audio using ffmpeg silencedetect filter.
        Returns:
            intervals: list of {"start": float, "end": float, "duration": float}
            total_silence_seconds: float
            speech_ratio: float (0.0 to 1.0)
        """
        path = Path(video_path)
        if not path.exists():
            return [], 0.0, 1.0

        cmd = [
            "ffmpeg",
            "-i", str(path),
            "-af", f"silencedetect=noise={noise_db}:d={min_duration}",
            "-f", "null",
            "-"
        ]

        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        output = proc.stderr

        intervals = []
        # Match lines like: [silencedetect @ 0000...] silence_start: 10.123
        # and [silencedetect @ 0000...] silence_end: 13.456 | silence_duration: 3.333
        start_pattern = re.compile(r"silence_start:\s*([0-9.]+)")
        end_pattern = re.compile(r"silence_end:\s*([0-9.]+)\s*\|\s*silence_duration:\s*([0-9.]+)")

        current_start = None
        for line in output.splitlines():
            start_m = start_pattern.search(line)
            if start_m:
                current_start = float(start_m.group(1))
                continue

            end_m = end_pattern.search(line)
            if end_m and current_start is not None:
                end_time = float(end_m.group(1))
                duration = float(end_m.group(2))
                intervals.append({
                    "start": round(current_start, 2),
                    "end": round(end_time, 2),
                    "duration": round(duration, 2)
                })
                current_start = None

        total_silence = sum(item["duration"] for item in intervals)
        total_silence = round(min(total_silence, total_duration), 2)
        speech_time = max(0.0, total_duration - total_silence)
        speech_ratio = round(speech_time / total_duration, 2) if total_duration > 0 else 1.0

        return intervals, total_silence, speech_ratio
