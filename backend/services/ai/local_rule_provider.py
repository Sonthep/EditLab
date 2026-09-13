# backend/services/ai/local_rule_provider.py
from typing import Dict, Any, Optional, List
from backend.models.schemas import (
    VideoMetrics,
    AnalysisResult,
    FeedbackEvent,
    NextPracticeRecommendation
)
from .provider import AIProvider

class LocalRuleBasedAIProvider(AIProvider):
    def analyze_edit(
        self,
        video_path: str,
        metrics: VideoMetrics,
        exercise_context: Optional[Dict[str, Any]] = None
    ) -> AnalysisResult:
        events: List[FeedbackEvent] = []
        strengths: List[str] = []
        improvements: List[str] = []

        dur = metrics.duration
        scenes = metrics.scenes
        silences = metrics.silences
        asl = metrics.average_shot_length

        # 1. Analyze Hook (0 - 3.0s)
        first_shot_dur = scenes[0].duration if scenes else dur
        if first_shot_dur <= 3.2:
            events.append(FeedbackEvent(
                start=0.0,
                end=round(first_shot_dur, 2),
                type="hook",
                severity="good",
                message="Hook starts immediately. Visual changes or speech engage the audience without slow throat-clearing intro.",
                suggestion=None
            ))
            strengths.append("Fast initial hook grabs attention in under 3 seconds.")
            hook_score = 86
        else:
            events.append(FeedbackEvent(
                start=0.0,
                end=round(first_shot_dur, 2),
                type="hook",
                severity="improve",
                message=f"Intro shot runs for {first_shot_dur:.1f}s before the first cut. Viewers decide to stay or leave in the first 2-3s.",
                suggestion="Trim the lead-in pause or introduce a punch zoom / B-roll within the first 2 seconds."
            ))
            improvements.append("Shorten the intro before the first cut to hook viewers faster.")
            hook_score = 58

        # 2. Analyze Shot Durations & Pacing Issues
        pacing_penalties = 0
        long_shots_found = 0
        for sc in scenes:
            if sc.duration > 3.8:
                long_shots_found += 1
                pacing_penalties += 7
                events.append(FeedbackEvent(
                    start=sc.start,
                    end=sc.end,
                    type="long_talking_head",
                    severity="improve",
                    message=f"Shot remains visually unchanged for {sc.duration:.1f} seconds. Energy dips during static stretches.",
                    suggestion="Add a B-roll cut, punch zoom (+15%), or cut to a tighter angle to reset viewer attention."
                ))
            elif 1.2 <= sc.duration <= 3.2 and sc.index > 1:
                # Good rhythmic shot
                if len([e for e in events if e.type == "good_cut"]) < 3:
                    events.append(FeedbackEvent(
                        start=sc.start,
                        end=sc.end,
                        type="good_cut",
                        severity="good",
                        message=f"Crisp rhythm (shot length {sc.duration:.1f}s). Maintains momentum cleanly.",
                        suggestion=None
                    ))

        if long_shots_found == 0:
            strengths.append("Consistent visual rhythm with no sluggish lingering shots.")
        else:
            improvements.append(f"Break up {long_shots_found} long talking head segment(s) using punch zooms or B-roll.")

        # 3. Analyze Audio & Silence Gaps (Dead Air)
        timing_penalties = 0
        significant_silences = 0
        for sil in silences:
            if sil.duration >= 0.8:
                significant_silences += 1
                timing_penalties += 8
                events.append(FeedbackEvent(
                    start=sil.start,
                    end=sil.end,
                    type="dead_air",
                    severity="improve",
                    message=f"Awkward pause of {sil.duration:.1f}s detected. In fast-paced edits, pauses over 0.7s drain conversational momentum.",
                    suggestion="Trim the silence down to 0.2–0.3s so words flow naturally without hesitations."
                ))

        if significant_silences == 0:
            strengths.append("Tight audio editing with no dead air or unnatural hesitations.")
        else:
            improvements.append(f"Trim {significant_silences} dead air pause(s) to accelerate momentum.")

        # 4. Check Duration Target
        target_min = 20.0
        target_max = 30.0
        if exercise_context and "target_metrics" in exercise_context:
            tm = exercise_context["target_metrics"]
            target_min = tm.get("target_duration_min", 20.0)
            target_max = tm.get("target_duration_max", 30.0)

        if target_min <= dur <= target_max:
            strengths.append(f"Perfect total runtime ({dur:.1f}s), hitting the {target_min:.0f}–{target_max:.0f}s challenge target.")
        elif dur > target_max:
            improvements.append(f"Video is {dur:.1f}s (target is {target_min:.0f}–{target_max:.0f}s). Tighten cuts to stay concise.")
            pacing_penalties += 8

        # Calculate Scores (0 - 100)
        pacing_score = max(40, min(95, 88 - pacing_penalties))
        timing_score = max(42, min(96, 86 - timing_penalties))
        story_score = 75 if dur <= target_max + 5 else 64
        audio_score = max(45, min(92, 85 - (significant_silences * 9)))
        broll_score = 78 if metrics.shot_count >= 5 else 58
        motion_score = 65

        overall = round(
            0.35 * pacing_score +
            0.25 * timing_score +
            0.15 * hook_score +
            0.15 * audio_score +
            0.10 * story_score
        )

        # Determine next practice recommendation
        if timing_score < pacing_score:
            rec = NextPracticeRecommendation(
                skill="timing",
                exercise_id="timing-02-practice",
                title="Practice: Cut on Thought & Dead Air Removal #02",
                reason="Your cut timing can be tightened to eliminate micro-hesitations between dialogue phrases."
            )
        else:
            rec = NextPracticeRecommendation(
                skill="pacing",
                exercise_id="pacing-02-practice",
                title="Practice: Dynamic Rhythm & Changing Pace #02",
                reason="Now that you understand shot trimming, practice contrasting fast hook cuts with breathing room."
            )

        # Sort events chronologically by start timestamp
        events.sort(key=lambda x: x.start)

        return AnalysisResult(
            video_path=video_path,
            duration=dur,
            overall_score=overall,
            skills={
                "pacing": pacing_score,
                "timing": timing_score,
                "story": story_score,
                "audio": audio_score,
                "broll": broll_score,
                "motion": motion_score,
                "hook": hook_score
            },
            strengths=strengths[:3],
            improvements=improvements[:3],
            events=events,
            metrics=metrics,
            next_practice=rec
        )
