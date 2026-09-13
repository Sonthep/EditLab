# backend/services/video/ffmpeg_service.py
import subprocess
import json
import os
import re
from pathlib import Path
from typing import Dict, Any, Optional, List

class FFmpegService:
    @staticmethod
    def run_ffprobe_metadata(video_path: str) -> Dict[str, Any]:
        """Extract duration, resolution, fps, bitrate and audio/video stream details using ffprobe."""
        path = Path(video_path)
        if not path.exists():
            raise FileNotFoundError(f"Video file not found: {video_path}")

        cmd = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            str(path)
        ]

        try:
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
            data = json.loads(result.stdout)
        except Exception as e:
            raise RuntimeError(f"FFprobe execution failed: {e}")

        format_data = data.get("format", {})
        duration = float(format_data.get("duration", 0.0))
        bitrate = int(format_data.get("bit_rate", 0))

        width = None
        height = None
        fps = None
        has_audio = False

        for stream in data.get("streams", []):
            if stream.get("codec_type") == "video" and width is None:
                width = int(stream.get("width", 0))
                height = int(stream.get("height", 0))
                r_frame_rate = stream.get("r_frame_rate", "30/1")
                if "/" in r_frame_rate:
                    num, den = r_frame_rate.split("/")
                    fps = float(num) / float(den) if float(den) > 0 else 30.0
                else:
                    fps = float(r_frame_rate)
            elif stream.get("codec_type") == "audio":
                has_audio = True

        return {
            "duration": round(duration, 2),
            "width": width or 1920,
            "height": height or 1080,
            "fps": round(fps, 2) if fps else 30.0,
            "bitrate": bitrate,
            "has_audio": has_audio
        }

    @staticmethod
    def extract_thumbnail(video_path: str, timestamp: float, output_path: str) -> Optional[str]:
        """Extract a single frame thumbnail at timestamp."""
        out_file = Path(output_path)
        out_file.parent.mkdir(parents=True, exist_ok=True)

        cmd = [
            "ffmpeg",
            "-y",
            "-ss", str(max(0.0, timestamp)),
            "-i", str(video_path),
            "-vframes", "1",
            "-vf", "scale=320:-1",
            "-q:v", "3",
            str(out_file)
        ]

        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode == 0 and out_file.exists():
            return str(out_file)
        return None

    @staticmethod
    def generate_demo_video(output_path: str, duration: float = 40.0, cuts: bool = False) -> str:
        """
        Generate a test MP4 video file with synthetic visuals and audio tone.
        If cuts=False, creates an uncut talking head video with long silence pauses.
        If cuts=True, creates a tight edit with 6 distinct scenes/cuts and minimal dead air.
        """
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        if out.exists():
            try:
                out.unlink()
            except Exception:
                pass

        if not cuts:
            # Uncut raw video: 40 seconds total
            # 3 visual blocks with long pauses: 10s speech, 3.5s silence, 11.5s speech, 2.5s silence, 12.5s speech
            filter_complex = (
                "color=c=0x1e293b:s=1280x720:d=10[v1];"
                "color=c=0x0f172a:s=1280x720:d=3.5[v2];"
                "color=c=0x1e293b:s=1280x720:d=11.5[v3];"
                "color=c=0x0f172a:s=1280x720:d=2.5[v4];"
                "color=c=0x1e293b:s=1280x720:d=12.5[v5];"
                "[v1][v2][v3][v4][v5]concat=n=5:v=1:a=0[v];"
                "sine=frequency=440:duration=10[a1];"
                "aevalsrc=0:d=3.5[a2];"
                "sine=frequency=520:duration=11.5[a3];"
                "aevalsrc=0:d=2.5[a4];"
                "sine=frequency=440:duration=12.5[a5];"
                "[a1][a2][a3][a4][a5]concat=n=5:v=0:a=1[a]"
            )
        else:
            # Edited version: 24s, 7 distinct scene colors representing tight cuts and dynamic pacing
            filter_complex = (
                "color=c=0x0f172a:s=1280x720:d=2.8[v0];" # Hook (0-2.8s)
                "color=c=0x1e293b:s=1280x720:d=3.2[v1];" # Cut 1 (2.8-6.0s)
                "color=c=0x0284c7:s=1280x720:d=2.5[v2];" # B-roll 1 (6.0-8.5s)
                "color=c=0x1e293b:s=1280x720:d=3.5[v3];" # Cut 2 (8.5-12.0s)
                "color=c=0x059669:s=1280x720:d=3.0[v4];" # B-roll 2 (12.0-15.0s)
                "color=c=0x1e293b:s=1280x720:d=4.0[v5];" # Main point (15.0-19.0s)
                "color=c=0x4f46e5:s=1280x720:d=5.0[v6];" # Climax/Outro (19.0-24.0s)
                "[v0][v1][v2][v3][v4][v5][v6]concat=n=7:v=1:a=0[v];"
                "sine=frequency=480:duration=24[a]"
            )

        cmd = [
            "ffmpeg", "-y",
            "-filter_complex", filter_complex,
            "-map", "[v]", "-map", "[a]",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
            str(out)
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return str(out)
