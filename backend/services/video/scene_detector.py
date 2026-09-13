# backend/services/video/scene_detector.py
import subprocess
import re
from pathlib import Path
from typing import List, Dict, Any

class SceneDetector:
    @staticmethod
    def detect_scenes(video_path: str, total_duration: float, threshold: float = 0.3) -> List[Dict[str, Any]]:
        """
        Detect cuts/scene changes in the video using FFmpeg select='gt(scene,threshold)' filter.
        Returns a list of shot segments with start, end, duration.
        """
        path = Path(video_path)
        if not path.exists():
            return [{"index": 1, "start": 0.0, "end": total_duration, "duration": total_duration}]

        # Run ffmpeg with select filter and showinfo to capture scene change points
        cmd = [
            "ffmpeg",
            "-i", str(path),
            "-filter_complex", f"select='gt(scene,{threshold})',showinfo",
            "-f", "null",
            "-"
        ]

        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        combined_output = proc.stderr + "\n" + proc.stdout

        # Extract pts_time from showinfo lines: e.g., pts_time:3.03333
        cut_points = [0.0]
        pts_matches = re.findall(r"pts_time:\s*([0-9.]+)", combined_output)
        for pts_str in pts_matches:
            try:
                t = float(pts_str)
                # Avoid duplicates within 0.3s
                if t > 0.3 and (t - cut_points[-1]) >= 0.3 and t < (total_duration - 0.2):
                    cut_points.append(round(t, 2))
            except ValueError:
                continue

        if total_duration > cut_points[-1]:
            cut_points.append(round(total_duration, 2))
        else:
            cut_points[-1] = round(total_duration, 2)

        # Build segments
        segments = []
        for i in range(len(cut_points) - 1):
            start = cut_points[i]
            end = cut_points[i+1]
            dur = round(end - start, 2)
            if dur > 0:
                segments.append({
                    "index": i + 1,
                    "start": start,
                    "end": end,
                    "duration": dur
                })

        if not segments and total_duration > 0:
            segments.append({
                "index": 1,
                "start": 0.0,
                "end": round(total_duration, 2),
                "duration": round(total_duration, 2)
            })

        return segments
