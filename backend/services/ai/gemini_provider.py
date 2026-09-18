# backend/services/ai/gemini_provider.py
import json
import logging
from typing import Dict, Any, Optional, List
import httpx
from backend.models.schemas import (
    VideoMetrics,
    AnalysisResult,
    FeedbackEvent,
    NextPracticeRecommendation
)
from .provider import AIProvider
from .local_rule_provider import LocalRuleBasedAIProvider

logger = logging.getLogger("editlab.gemini")

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

class GeminiAIProvider(AIProvider):
    def __init__(self, api_key: str, model: str = "gemini-3.6-flash"):
        self.api_key = api_key.strip()
        self.model = model.strip() if model else "gemini-3.6-flash"
        self.fallback_provider = LocalRuleBasedAIProvider()

    @staticmethod
    def test_connection(api_key: str, model: str = "gemini-3.6-flash") -> Dict[str, Any]:
        """
        Quick probe to check if the provided Gemini API key and model work.
        """
        if not api_key or not api_key.strip():
            return {"status": "error", "message": "API key cannot be empty."}

        clean_key = api_key.strip()
        clean_model = model.strip() if model else "gemini-3.6-flash"
        
        candidates = [clean_model]
        for fallback in ["gemini-3.6-flash", "gemini-3-flash-preview", "gemini-flash-latest"]:
            if fallback not in candidates:
                candidates.append(fallback)

        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": clean_key
        }
        params = {}
        if clean_key.startswith("AIza"):
            params["key"] = clean_key

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": "Respond with JSON: {\"status\": \"ok\", \"echo\": \"editlab_connected\"}"}
                    ]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2
            }
        }

        last_err = ""
        try:
            with httpx.Client(timeout=10.0) as client:
                for cand in candidates:
                    url = f"{GEMINI_API_BASE}/{cand}:generateContent"
                    resp = client.post(url, headers=headers, params=params, json=payload)
                    if resp.status_code == 200:
                        return {
                            "status": "success",
                            "model": cand,
                            "message": f"Successfully connected to Gemini API ({cand})."
                        }
                    elif resp.status_code in [404, 503]:
                        last_err = f"Model {cand} returned {resp.status_code}: {resp.text[:100]}"
                        continue # try next model candidate
                    else:
                        err_msg = resp.text
                        try:
                            err_json = resp.json()
                            err_msg = err_json.get("error", {}).get("message", resp.text)
                        except Exception:
                            pass
                        return {
                            "status": "error",
                            "code": resp.status_code,
                            "message": f"Gemini API returned error {resp.status_code}: {err_msg}"
                        }
                return {
                    "status": "error",
                    "message": f"Could not connect to candidate models: {last_err}"
                }
        except httpx.TimeoutException:
            return {"status": "error", "message": "Connection to Google Gemini timed out (10s)."}
        except Exception as e:
            return {"status": "error", "message": f"Failed to connect to Gemini API: {str(e)}"}

    def analyze_edit(
        self,
        video_path: str,
        metrics: VideoMetrics,
        exercise_context: Optional[Dict[str, Any]] = None
    ) -> AnalysisResult:
        """
        Sends deterministic metrics, shot cuts, and exercise requirements to Gemini
        and parses the response into an AnalysisResult.
        Falls back to LocalRuleBasedAIProvider if any error occurs.
        """
        if not self.api_key:
            logger.warning("No Gemini API key provided, falling back to Local Rule Provider.")
            return self.fallback_provider.analyze_edit(video_path, metrics, exercise_context)

        try:
            return self._call_gemini_analysis(video_path, metrics, exercise_context)
        except Exception as e:
            logger.error(f"Gemini API analysis failed: {e}. Falling back to Local Rule Provider.", exc_info=True)
            fallback_res = self.fallback_provider.analyze_edit(video_path, metrics, exercise_context)
            # Add a notice so user knows fallback was triggered
            fallback_res.improvements.insert(0, f"(Notice: Gemini API analysis encountered an issue ({type(e).__name__}). Using local offline analysis.)")
            return fallback_res

    def _call_gemini_analysis(
        self,
        video_path: str,
        metrics: VideoMetrics,
        exercise_context: Optional[Dict[str, Any]] = None
    ) -> AnalysisResult:
        url = f"{GEMINI_API_BASE}/{self.model}:generateContent"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key
        }
        params = {}
        if self.api_key.startswith("AIza"):
            params["key"] = self.api_key

        # Construct scenes snippet for prompt
        scenes_data = [
            {
                "index": s.index,
                "start": round(s.start, 2),
                "end": round(s.end, 2),
                "duration": round(s.duration, 2)
            }
            for s in metrics.scenes[:30] # cap to 30 to keep token count compact
        ]

        silences_data = [
            {
                "start": round(s.start, 2),
                "end": round(s.end, 2),
                "duration": round(s.duration, 2)
            }
            for s in metrics.silences[:20]
        ]

        context_info = ""
        if exercise_context:
            context_info = f"""
Target Practice Challenge: {exercise_context.get('title', 'General Practice')}
Target Criteria: {json.dumps(exercise_context.get('target_metrics', {}))}
Checklist: {json.dumps(exercise_context.get('checklist', []))}
"""

        system_instruction = (
            "You are EditLab's master video editing coach. You evaluate video edits based on "
            "established professional editing principles (Walter Murch's Rule of Six, pacing rhythm, "
            "attention resets, 3-second hook retention, cut timing on thought/action, and dead air trimming). "
            "Analyze the editor's video metrics and shot breakdown, then output your evaluation strictly as JSON conforming to the requested schema."
        )

        user_prompt = f"""
Evaluate this student's video edit based on the following deterministic metrics and timeline data:

VIDEO METRICS:
- Total Duration: {metrics.duration:.2f} seconds
- Total Shot Count: {metrics.shot_count}
- Average Shot Length (ASL): {metrics.average_shot_length:.2f} seconds
- Longest Shot: {metrics.longest_shot:.2f} seconds
- Shortest Shot: {metrics.shortest_shot:.2f} seconds
- Cuts Per Minute: {metrics.cuts_per_minute:.1f}
- Silence/Dead Air Seconds: {metrics.silence_seconds:.2f}s (Speech ratio: {metrics.speech_ratio * 100:.1f}%)

TIMELINE SCENE SHOTS:
{json.dumps(scenes_data, indent=2)}

DETECTED SILENCES / DEAD AIR:
{json.dumps(silences_data, indent=2)}
{context_info}

COACHING INSTRUCTIONS:
1. Overall Score (0-100): Calculated from pacing, cut timing, hook, audio, and story adherence.
2. Skill Breakdown (each 0-100):
   - pacing: Rhythm, dynamic variety, avoiding stagnant talking heads.
   - timing: Cutting on finished thoughts/action, lack of hesitation before speech.
   - story: Setup, development, and payoff within the time limit.
   - audio: Clean speech flow, absence of jarring dead air or awkward pauses.
   - broll: Variety of visual inserts or cutaways.
   - motion: Punch zooms, framing changes, or energy.
   - hook: First 1-3 seconds engaging without slow throat-clearing.
3. Strengths: 2 to 3 bullet points highlighting what the editor did well.
4. Improvements: 2 to 3 actionable, specific bullet points on how to improve.
5. Events: Array of timestamped feedback cards. Each event MUST have:
   - start (number in seconds)
   - end (number in seconds)
   - type ("hook" | "good_cut" | "pacing_issue" | "dead_air" | "long_talking_head" | "audio_issue")
   - severity ("good" | "improve")
   - message (concise explanation of what happens here)
   - suggestion (optional concrete instruction, e.g. "Trim 0.4s pause before next phrase" or null if good)
6. Next Practice Recommendation: Recommend an exercise_id, skill, title, and reason.

OUTPUT JSON FORMAT ONLY:
{{
  "overall_score": 82,
  "skills": {{
    "pacing": 80,
    "timing": 84,
    "story": 75,
    "audio": 82,
    "broll": 78,
    "motion": 70,
    "hook": 85
  }},
  "strengths": [
    "Punchy hook in the first 2.5 seconds grabs attention immediately.",
    "Clean cuts on speech pauses keep dialogue moving."
  ],
  "improvements": [
    "Trim shot at 00:08 - 00:12 which lingers for 4.2 seconds without visual change.",
    "Eliminate the 0.8s dead air gap at 00:15."
  ],
  "events": [
    {{
      "start": 0.0,
      "end": 2.4,
      "type": "hook",
      "severity": "good",
      "message": "Strong opening hook stops the scroll.",
      "suggestion": null
    }},
    {{
      "start": 8.1,
      "end": 12.3,
      "type": "pacing_issue",
      "severity": "improve",
      "message": "Shot runs 4.2s without a cut or punch zoom, slowing down the pacing.",
      "suggestion": "Insert a 115% punch zoom or cut to B-roll at second 10."
    }}
  ],
  "next_practice": {{
    "skill": "pacing",
    "exercise_id": "pacing-01-practice",
    "title": "Practice Challenge: Pacing #01 — Fast Talking Head",
    "reason": "Practice maintaining dynamic rhythm with punch zooms on key phrases."
  }}
}}
"""

        payload = {
            "contents": [
                {
                    "parts": [{"text": user_prompt}]
                }
            ],
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.3
            }
        }

        with httpx.Client(timeout=30.0) as client:
            resp = client.post(url, headers=headers, params=params, json=payload)
            resp.raise_for_status()
            resp_data = resp.json()

        # Extract text from candidate
        candidates = resp_data.get("candidates", [])
        if not candidates:
            raise ValueError("Gemini API returned no candidates.")

        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            raise ValueError("Gemini response missing content parts.")

        raw_text = parts[0].get("text", "{}")
        parsed = json.loads(raw_text)

        # Parse and sanitize skills
        skills_raw = parsed.get("skills", {})
        skills = {
            "pacing": int(skills_raw.get("pacing", 75)),
            "timing": int(skills_raw.get("timing", 75)),
            "story": int(skills_raw.get("story", 75)),
            "audio": int(skills_raw.get("audio", 75)),
            "broll": int(skills_raw.get("broll", 70)),
            "motion": int(skills_raw.get("motion", 65)),
            "hook": int(skills_raw.get("hook", 80))
        }

        # Parse events
        events: List[FeedbackEvent] = []
        for ev in parsed.get("events", []):
            try:
                events.append(FeedbackEvent(
                    start=float(ev.get("start", 0.0)),
                    end=float(ev.get("end", 0.0)),
                    type=str(ev.get("type", "pacing_issue")),
                    severity=str(ev.get("severity", "improve")),
                    message=str(ev.get("message", "")),
                    suggestion=ev.get("suggestion")
                ))
            except Exception as e:
                logger.debug(f"Skipping malformed event from Gemini: {e}")

        # Ensure events are sorted
        events.sort(key=lambda x: x.start)

        # Parse next practice recommendation
        np_data = parsed.get("next_practice", {})
        rec = NextPracticeRecommendation(
            skill=str(np_data.get("skill", "pacing")),
            exercise_id=str(np_data.get("exercise_id", "pacing-01-practice")),
            title=str(np_data.get("title", "Practice Challenge: Pacing #01")),
            reason=str(np_data.get("reason", "Continue refining cut pacing and attention resets."))
        )

        overall = int(parsed.get("overall_score", 75))

        return AnalysisResult(
            video_path=video_path,
            duration=metrics.duration,
            overall_score=max(0, min(100, overall)),
            skills=skills,
            strengths=parsed.get("strengths", ["Good adherence to video editing rhythm."]),
            improvements=parsed.get("improvements", ["Tighten shot pacing and eliminate remaining pauses."]),
            events=events,
            metrics=metrics,
            next_practice=rec
        )
