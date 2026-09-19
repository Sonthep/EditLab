# backend/services/video/markers_service.py
import csv
import io
import math
from typing import List, Dict, Any, Optional

RESOLVE_COLOR_MAP = {
    "good": "ResolveColorGreen",
    "improve": "ResolveColorYellow",
    "warning": "ResolveColorRed",
    "dead_air": "ResolveColorRed",
    "audio": "ResolveColorCyan",
    "speech": "ResolveColorCyan",
    "hook": "ResolveColorPurple",
    "motion": "ResolveColorPink",
    "broll": "ResolveColorSky",
    "pacing": "ResolveColorYellow",
    "pacing_issue": "ResolveColorYellow",
    "good_cut": "ResolveColorGreen",
}

RESOLVE_COLOR_NAME_MAP = {
    "ResolveColorGreen": "Green",
    "ResolveColorYellow": "Yellow",
    "ResolveColorRed": "Red",
    "ResolveColorCyan": "Cyan",
    "ResolveColorPurple": "Purple",
    "ResolveColorPink": "Pink",
    "ResolveColorSky": "Sky",
    "ResolveColorBlue": "Blue",
}

def seconds_to_smpte(seconds: float, fps: float = 30.0) -> str:
    """Convert float seconds into SMPTE timecode (HH:MM:SS:FF)."""
    if seconds < 0:
        seconds = 0.0
    
    total_frames = int(round(seconds * fps))
    fps_int = int(round(fps)) if round(fps) > 0 else 30
    
    ff = total_frames % fps_int
    total_seconds = total_frames // fps_int
    ss = total_seconds % 60
    mm = (total_seconds // 60) % 60
    hh = total_seconds // 3600
    
    return f"{hh:02d}:{mm:02d}:{ss:02d}:{ff:02d}"

def get_resolve_color(event_type: str, severity: str) -> str:
    """Determine the DaVinci Resolve color identifier from event type and severity."""
    clean_type = event_type.lower().strip()
    clean_sev = severity.lower().strip()
    
    if clean_sev == "good":
        return "ResolveColorGreen"
    if clean_type in RESOLVE_COLOR_MAP:
        return RESOLVE_COLOR_MAP[clean_type]
    if clean_sev == "warning":
        return "ResolveColorRed"
    if clean_sev == "improve":
        return "ResolveColorYellow"
    return "ResolveColorBlue"

def generate_edl_markers(
    analysis_id: str,
    events: List[Dict[str, Any]],
    fps: float = 30.0,
    clip_name: str = "EditLab Video"
) -> str:
    """
    Generate standard CMX 3600 EDL with DaVinci Resolve marker comments.
    Format:
    TITLE: <title>
    FCM: NON-DROP FRAME
    
    001  AX       V     C        00:00:04:15 00:00:04:15 00:00:04:15 00:00:04:15
    * FROM CLIP NAME: <clip_name>
     |C:<ResolveColor> |M:<Comment> |D:<DurationInFrames>
    """
    lines = [
        f"TITLE: EditLab Coaching Markers - {analysis_id[-8:] if analysis_id else 'Session'}",
        "FCM: NON-DROP FRAME",
        ""
    ]
    
    for idx, ev in enumerate(events, start=1):
        start_sec = float(ev.get("start", 0.0))
        end_sec = float(ev.get("end", start_sec))
        dur_sec = max(0.0, end_sec - start_sec)
        dur_frames = max(1, int(round(dur_sec * fps)))
        
        tc_start = seconds_to_smpte(start_sec, fps)
        
        # In marker EDL, IN and OUT on the event line are identical or span duration
        ev_type = ev.get("type", "note")
        severity = ev.get("severity", "info")
        color = get_resolve_color(ev_type, severity)
        
        msg = ev.get("message", "").replace("|", "-").replace("\n", " ")
        sug = ev.get("suggestion", "")
        if sug:
            sug_clean = sug.replace("|", "-").replace("\n", " ")
            marker_text = f"[{ev_type.upper()}] {msg} - Suggestion: {sug_clean}"
        else:
            marker_text = f"[{ev_type.upper()}] {msg}"
            
        # Clean marker text length to avoid NLE line truncation
        marker_text = marker_text[:120]
        
        event_num = f"{idx:03d}"
        lines.append(f"{event_num}  AX       V     C        {tc_start} {tc_start} {tc_start} {tc_start}")
        lines.append(f"* FROM CLIP NAME: {clip_name}")
        lines.append(f" |C:{color} |M:{marker_text} |D:{dur_frames}")
        lines.append("")
        
    return "\n".join(lines)

def generate_csv_markers(
    events: List[Dict[str, Any]],
    fps: float = 30.0
) -> str:
    """
    Generate DaVinci Resolve and Premiere Pro compatible Marker CSV.
    Header: Marker Name,Description,In,Out,Duration,Marker Color
    """
    output = io.StringIO()
    writer = csv.writer(output, quoting=csv.QUOTE_ALL)
    writer.writerow(["Marker Name", "Description", "In", "Out", "Duration", "Marker Color"])
    
    for ev in events:
        start_sec = float(ev.get("start", 0.0))
        end_sec = float(ev.get("end", start_sec))
        dur_sec = max(0.0, end_sec - start_sec)
        
        tc_start = seconds_to_smpte(start_sec, fps)
        tc_out = seconds_to_smpte(end_sec if end_sec > start_sec else start_sec + (1.0 / fps), fps)
        tc_dur = seconds_to_smpte(dur_sec if dur_sec > 0 else (1.0 / fps), fps)
        
        ev_type = ev.get("type", "EditLab Note").replace("_", " ").title()
        msg = ev.get("message", "")
        sug = ev.get("suggestion", "")
        desc = f"{msg} | Suggestion: {sug}" if sug else msg
        
        color_tag = get_resolve_color(ev.get("type", ""), ev.get("severity", ""))
        color_name = RESOLVE_COLOR_NAME_MAP.get(color_tag, "Blue")
        
        writer.writerow([
            f"EditLab: {ev_type}",
            desc,
            tc_start,
            tc_out,
            tc_dur,
            color_name
        ])
        
    return output.getvalue()
