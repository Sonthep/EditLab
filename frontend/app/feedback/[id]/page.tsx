"use client";
import React, { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  BarChart2,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface SceneSegment {
  index: number;
  start: number;
  end: number;
  duration: number;
  thumbnail?: string;
}

interface SilenceInterval {
  start: number;
  end: number;
  duration: number;
}

interface VideoMetrics {
  duration: number;
  shot_count: number;
  average_shot_length: number;
  longest_shot: number;
  shortest_shot: number;
  cuts_per_minute: number;
  silence_seconds: number;
  speech_ratio: number;
  scenes: SceneSegment[];
  silences: SilenceInterval[];
}

interface FeedbackEvent {
  start: number;
  end: number;
  type: string;
  severity: "good" | "improve" | "warning" | "info";
  message: string;
  suggestion?: string;
}

interface AnalysisData {
  id: string;
  video_path: string;
  duration: number;
  overall_score: number;
  skills: Record<string, number>;
  strengths: string[];
  improvements: string[];
  events: FeedbackEvent[];
  metrics: VideoMetrics;
  next_practice: {
    skill: string;
    exercise_id: string;
    title: string;
    reason: string;
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds % 1) * 10);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${tenths}`;
}

export default function FeedbackScreen({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const analysisId = resolvedParams.id;
  const { language, t } = useLanguage();

  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEventIndex, setActiveEventIndex] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetch(`/api/analysis/${analysisId}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load analysis:", err);
        setLoading(false);
      });
  }, [analysisId]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);

      if (data?.events) {
        const foundIdx = data.events.findIndex((e) => cur >= e.start && cur <= e.end);
        setActiveEventIndex(foundIdx !== -1 ? foundIdx : null);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const seekTo = (timestamp: number, eventIndex?: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, timestamp);
    setCurrentTime(timestamp);
    if (eventIndex !== undefined) {
      setActiveEventIndex(eventIndex);
    }
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const stepTime = (delta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(videoRef.current.duration || 100, videoRef.current.currentTime + delta));
    seekTo(newTime);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#2e7354] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-[#5e6d64] font-mono">
            {language === "th" ? "กำลังประมวลผลวิดีโอของคุณ..." : "Analyzing your cut..."}
          </span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-[#141f19]">Analysis Record Not Found</h2>
        <Link href="/" className="text-[#2e7354] text-sm mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const duration = data.metrics.duration || 1;
  const progressPercent = (currentTime / duration) * 100;

  // Thai message translator for common feedback patterns
  const translateFeedbackMessage = (msg: string): string => {
    if (language !== "th") return msg;
    if (msg.includes("Hook starts immediately")) {
      return "ฮุกเปิดหัวได้รวดเร็วทันที มีการเปลี่ยนภาพหรือเสียงที่ดึงดูดโดยไม่มีการเกริ่นนำชวนเบื่อ";
    }
    if (msg.includes("Intro shot runs for")) {
      return "ช็อตเปิดตัวยาวเกินไปก่อนจะมีคัตแรก ผู้ชมมักตัดสินใจเลื่อนผ่านใน 2-3 วินาทีแรก";
    }
    if (msg.includes("Shot remains visually unchanged")) {
      return "ช็อตแช่ภาพนิ่งนานเกินไป ทำให้ระดับพลังงานของวิดีโอดรอปและสายตาคนดูล้า";
    }
    if (msg.includes("Crisp rhythm")) {
      return "จังหวะคัตกระชับ คุมเวลาได้พอเหมาะ ทำให้เรื่องราวเดินหน้าอย่างลื่นไหล";
    }
    if (msg.includes("Awkward pause")) {
      return "ตรวจพบช่วงหยุดพูดที่ยาวนานเกินไป การเว้นวรรคเกิน 0.7 วินาทีทำให้บทสนทนาดูอืด";
    }
    return msg;
  };

  const translateFeedbackSuggestion = (sug?: string): string | undefined => {
    if (!sug || language !== "th") return sug;
    if (sug.includes("Add a B-roll cut")) {
      return "ใส่ภาพ B-roll เสริม, Punch zoom (+15%), หรือตัดไปมุมกล้องที่แคบลงเพื่อรีเซ็ตความสนใจของสายตา";
    }
    if (sug.includes("Trim the silence down")) {
      return "ตัดทอนช่วงหยุดพูดให้เหลือเพียง 0.2–0.3 วินาที เพื่อให้คำพูดไหลลื่นไม่มีสะดุด";
    }
    if (sug.includes("Trim the lead-in pause")) {
      return "ตัดช่วงหยุดคิดก่อนเริ่มพูด หรือใส่ Punch zoom / B-roll ภายใน 2 วินาทีแรก";
    }
    return sug;
  };

  const skillTranslationsTh: Record<string, string> = {
    pacing: "เพซซิ่ง (Pacing)",
    timing: "จังหวะคัต (Timing)",
    story: "การเล่าเรื่อง (Story)",
    audio: "ระบบเสียง (Audio)",
    broll: "การใช้ B-roll",
    motion: "โมชัน (Motion)",
    hook: "การฮุก (Hook)",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-[#2e7354] font-bold uppercase tracking-widest">
            {t("coach_session_badge")} #{data.id.slice(-6)}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#141f19]">{t("feedback_title")}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2 bg-[#f8faf8] px-4 py-2 rounded-xl border border-[#e2ece5]">
            <span className="text-xs text-[#5e6d64] font-medium">{t("overall_score_label")}</span>
            <span
              className={`text-2xl font-bold font-mono ${
                data.overall_score >= 75
                  ? "text-[#15803d]"
                  : data.overall_score >= 60
                  ? "text-[#163324]"
                  : "text-amber-700"
              }`}
            >
              {data.overall_score}
            </span>
            <span className="text-xs text-[#8a9990] font-mono">/ 100</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Player + Multi-Track Timeline + Feedback Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Video Player & Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {/* Video Player */}
          <div className="rounded-2xl overflow-hidden bg-[#0d1c14] border border-[#234937] relative group aspect-video flex items-center justify-center shadow-xs">
            <video
              ref={videoRef}
              src={`/api/media/stream?path=${encodeURIComponent(data.video_path)}`}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
              playsInline
            />

            {/* Timecode overlay */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white font-mono text-xs tracking-wider">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Player Controls */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#e5ede7] flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => stepTime(-1)}
                className="p-2 rounded-xl bg-[#f0f5f2] hover:bg-[#e2ece5] text-[#163324] transition cursor-pointer"
                title="Step -1s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-xl bg-[#163324] hover:bg-[#1e4230] text-white font-bold transition shadow-xs cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => stepTime(1)}
                className="p-2 rounded-xl bg-[#f0f5f2] hover:bg-[#e2ece5] text-[#163324] transition cursor-pointer"
                title="Step +1s"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Timeline Slider */}
            <div className="flex-1 flex items-center gap-3">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.05"
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-[#e2ece5] cursor-pointer"
              />
            </div>

            <div className="font-mono text-xs text-[#5e6d64] hidden sm:block">
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Interactive Multi-Track Visual Timeline */}
          <div className="p-5 rounded-2xl bg-white border border-[#e5ede7] space-y-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#141f19] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#2e7354]" />
                {t("timeline_title")}
              </span>
              <span className="text-[11px] text-[#718278] font-mono">{t("timeline_sub")}</span>
            </div>

            {/* Track 1: Scene Cuts */}
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-mono text-[#718278] font-semibold">{t("track_shots")}</div>
              <div className="w-full h-8 rounded-xl bg-[#163324] relative overflow-hidden flex border border-[#234937]">
                {data.metrics.scenes.map((sc, i) => {
                  const widthPct = (sc.duration / duration) * 100;
                  const isCurrent = currentTime >= sc.start && currentTime <= sc.end;
                  return (
                    <div
                      key={i}
                      onClick={() => seekTo(sc.start)}
                      style={{ width: `${widthPct}%` }}
                      className={`h-full border-r border-[#2e5d44] cursor-pointer transition-colors relative flex items-center justify-center text-[9px] font-mono select-none ${
                        isCurrent ? "bg-[#3e7859] text-[#e8f5ee] font-bold" : "hover:bg-[#224733] text-[#9fd6b5]"
                      }`}
                      title={`Shot ${sc.index}: ${sc.start.toFixed(1)}s - ${sc.end.toFixed(1)}s (${sc.duration.toFixed(1)}s)`}
                    >
                      {widthPct > 8 && `S${sc.index}`}
                    </div>
                  );
                })}

                {/* Amber Playhead Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 pointer-events-none z-10 shadow-sm"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Track 2: Silence & Pauses */}
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-mono text-[#718278] font-semibold">{t("track_silence")}</div>
              <div className="w-full h-3.5 rounded-lg bg-[#f0f5f2] border border-[#dcebe1] relative overflow-hidden">
                {data.metrics.silences.map((sil, i) => {
                  const leftPct = (sil.start / duration) * 100;
                  const widthPct = (sil.duration / duration) * 100;
                  return (
                    <div
                      key={i}
                      onClick={() => seekTo(sil.start)}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      className="absolute top-0 bottom-0 bg-rose-400 hover:bg-rose-500 cursor-pointer"
                      title={`Silence: ${sil.duration.toFixed(1)}s (${sil.start.toFixed(1)}s - ${sil.end.toFixed(1)}s)`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Track 3: Coaching Event Flags */}
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-mono text-[#718278] font-semibold">{t("track_markers")}</div>
              <div className="w-full h-5 rounded-lg bg-[#f0f5f2] border border-[#dcebe1] relative">
                {data.events.map((ev, i) => {
                  const leftPct = (ev.start / duration) * 100;
                  const isGood = ev.severity === "good";
                  const isSelected = activeEventIndex === i;

                  return (
                    <div
                      key={i}
                      onClick={() => seekTo(ev.start, i)}
                      style={{ left: `${leftPct}%` }}
                      className={`absolute top-0.5 bottom-0.5 w-3 -ml-1.5 rounded-sm cursor-pointer transition-transform ${
                        isSelected ? "scale-125 ring-2 ring-[#163324] z-20" : "hover:scale-110"
                      } ${isGood ? "bg-emerald-600" : "bg-amber-500"}`}
                      title={`${isGood ? "GOOD" : "IMPROVE"} at ${formatTime(ev.start)}: ${ev.message}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deterministic Metrics Table */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#2e7354]" />
              <span>{t("metrics_title")}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("metric_duration")}</span>
                <span className="text-[#141f19] font-bold">
                  {data.metrics.duration.toFixed(1)}{language === "th" ? " วินาที" : "s"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("metric_shots")}</span>
                <span className="text-[#141f19] font-bold">
                  {data.metrics.shot_count} {language === "th" ? "ช็อต" : "shots"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("metric_asl")}</span>
                <span className="text-[#1b5e3a] font-bold">
                  {data.metrics.average_shot_length.toFixed(2)}{language === "th" ? " วินาที" : "s"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("metric_cpm")}</span>
                <span className="text-[#141f19] font-bold">{data.metrics.cuts_per_minute}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("metric_longest")}</span>
                <span className="text-[#141f19] font-bold">
                  {data.metrics.longest_shot.toFixed(1)}{language === "th" ? " วินาที" : "s"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("metric_shortest")}</span>
                <span className="text-[#141f19] font-bold">
                  {data.metrics.shortest_shot.toFixed(1)}{language === "th" ? " วินาที" : "s"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("metric_silence")}</span>
                <span className="text-rose-600 font-bold">
                  {data.metrics.silence_seconds.toFixed(1)}{language === "th" ? " วินาที" : "s"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("metric_speech_ratio")}</span>
                <span className="text-[#15803d] font-bold">{(data.metrics.speech_ratio * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Clickable Feedback Cards + Skills */}
        <div className="lg:col-span-5 space-y-6">
          {/* Actionable Feedback Cards */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2e7354]" />
                <span>{t("actionable_feedback_title")}</span>
              </h3>
              <span className="text-[11px] font-mono text-[#718278]">
                {data.events.length} {t("observations_tag")}
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {data.events.map((ev, idx) => {
                const isGood = ev.severity === "good";
                const isSelected = activeEventIndex === idx;
                const translatedMessage = translateFeedbackMessage(ev.message);
                const translatedSuggestion = translateFeedbackSuggestion(ev.suggestion);

                return (
                  <div
                    key={idx}
                    onClick={() => seekTo(ev.start, idx)}
                    className={`p-4 rounded-xl border transition cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? "bg-[#eef6f1] border-[#2e7354] shadow-xs"
                        : isGood
                        ? "bg-[#f4faf6] border-[#cce8d7] hover:border-emerald-400"
                        : "bg-[#fef9f4] border-[#fed7aa] hover:border-amber-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] tracking-wider uppercase ${
                            isGood ? "bg-[#d8ece1] text-[#15803d]" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isGood ? t("tag_good") : t("tag_improve")}
                        </span>
                        <span className="font-mono text-[#141f19] font-bold">
                          {formatTime(ev.start)} – {formatTime(ev.end)}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#2e7354] font-semibold hover:underline flex items-center gap-0.5">
                        {t("jump_to_cut")}
                      </span>
                    </div>

                    <p className="text-[#374151] leading-relaxed">{translatedMessage}</p>

                    {translatedSuggestion && (
                      <div className="p-2.5 rounded-lg bg-white border border-[#e5ede7] text-[11px] text-[#854d0e] leading-normal">
                        <strong>{t("try_suggestion")}</strong> {translatedSuggestion}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill Scores Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider">{t("skills_for_edit")}</h3>
            <div className="space-y-3">
              {Object.entries(data.skills).map(([key, score]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#4b5563] uppercase tracking-wider font-mono text-[11px]">
                      {language === "th" ? skillTranslationsTh[key] || key : key}
                    </span>
                    <span className="font-mono text-[#141f19] font-bold">{score}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#edf2ee] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#163324] transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Recommended Challenge */}
          {data.next_practice && (
            <div className="p-6 rounded-2xl bg-[#163324] text-white space-y-3 shadow-sm">
              <div className="text-[10px] font-mono text-[#9fd6b5] uppercase tracking-wider font-bold">
                {t("coach_recommendation")}
              </div>
              <h4 className="text-sm font-bold text-white">
                {language === "th" && data.next_practice.skill === "timing"
                  ? "ฝึกคัตตามความคิดและตัดช่วงหยุดพูด #02"
                  : language === "th" && data.next_practice.skill === "pacing"
                  ? "ฝึกจังหวะเพลงและการเปลี่ยนความเร็ว #02"
                  : data.next_practice.title}
              </h4>
              <p className="text-xs text-[#c1d9cc] leading-relaxed">
                {language === "th" && data.next_practice.skill === "timing"
                  ? "จังหวะคัตของคุณสามารถทำให้กระชับขึ้นได้อีก โดยการตัดทอนช่วงหยุดคิดระหว่างประโยคสนทนา"
                  : data.next_practice.reason}
              </p>

              <div className="pt-2">
                <Link
                  href={`/practice/${data.next_practice.exercise_id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#d2ebd9] hover:bg-[#c3e4cc] text-[#133022] font-bold text-xs uppercase tracking-wider transition shadow-xs"
                >
                  <span>{t("btn_start_recommended")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
