"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  BookOpen,
  Target,
  Clock,
  Play,
  ArrowRight,
  ArrowUpRight,
  Film,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface DashboardData {
  level: string;
  completed_lessons_count: number;
  streak_days: number;
  continue_learning: {
    id: string;
    module_id: string;
    module_title: string;
    module_number: number;
    title: string;
    duration: string;
  };
  skills: Array<{
    id: string;
    name: string;
    score: number;
    confidence: number;
  }>;
  recent_practice: Array<{
    id: string;
    exercise_id: string;
    created_at: string;
    score: number;
    exercise_title: string;
  }>;
  recommended_practice: {
    skill: string;
    exercise_id: string;
    title: string;
    description: string;
  };
}

export default function OverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#2e7354] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-[#5e6d64] font-mono">
            {language === "th" ? "กำลังเปิดพื้นที่ทำงาน..." : "Opening your creative workspace..."}
          </span>
        </div>
      </div>
    );
  }

  const skills = data?.skills || [];
  const continueLesson = data?.continue_learning;
  const recommended = data?.recommended_practice;
  const avgScore = skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length) : 66;

  // Thai labels for skill names
  const skillTranslationsTh: Record<string, string> = {
    "Cut Timing": "จังหวะคัต (Cut Timing)",
    "Pacing & Rhythm": "เพซซิ่ง & จังหวะ (Pacing)",
    "Story & Sequence": "การเล่าเรื่อง (Story)",
    "Audio Transitions": "การตัดต่อเสียง (Audio)",
    "B-roll Usage": "การใช้ B-roll",
    "Motion & Zoom": "โมชันและซูม (Motion)",
    "Hook & Retention": "การฮุกและดึงดูด (Hook)",
    "Text & Captions": "ข้อความและแคปชัน (Text)",
    "Color Consistency": "ความสม่ำเสมอของสี (Color)",
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#2e7354] uppercase mb-1">
            {t("eyebrow_workspace")}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#141f19]">{t("header_title")}</h1>
          <p className="text-sm text-[#5e6d64] mt-1">{t("header_sub")}</p>
        </div>

        <div>
          <Link
            href="/practice/pacing-01-practice"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#f1f6f2] text-[#141f19] text-xs sm:text-sm font-semibold border border-[#dce5df] transition shadow-xs"
          >
            <Scissors className="w-3.5 h-3.5 -rotate-45 text-[#2e7354]" />
            <span>{t("btn_new_practice")}</span>
          </Link>
        </div>
      </div>

      {/* Hero Banner Card (Deep Forest Green) */}
      <div className="rounded-3xl bg-[#163324] border border-[#234937] p-8 sm:p-10 text-white relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-4 z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-[#9fd6b5] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9fd6b5]" />
              <span>{t("hero_badge")}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {t("hero_title")}
            </h2>

            <p className="text-sm text-[#c1d9cc] max-w-md leading-relaxed">
              {t("hero_sub")}
            </p>

            <div className="pt-2">
              <Link
                href={`/learn/${continueLesson?.id || "pacing-01"}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d2ebd9] hover:bg-[#c3e4cc] text-[#133022] font-bold text-xs sm:text-sm transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t("btn_continue_learning")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="text-[11px] text-[#9fd6b5] font-mono flex items-center gap-2 pt-1">
              <Clock className="w-3 h-3" />
              <span>{t("hero_meta")}</span>
            </div>
          </div>

          {/* Right Column: Stylized NLE Window Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl bg-[#1c3c2b] border border-[#2c533e] p-4 shadow-lg space-y-3">
              {/* Window Title Bar */}
              <div className="flex items-center justify-between text-[10px] text-[#8cbda3] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8cbda3]/40" />
                  <span className="w-2 h-2 rounded-full bg-[#8cbda3]/40" />
                  <span className="w-2 h-2 rounded-full bg-[#8cbda3]/40" />
                </div>
                <span className="tracking-widest uppercase font-semibold text-[9px]">{t("hero_nle_tag")}</span>
              </div>

              {/* Canvas Preview */}
              <div className="rounded-xl bg-[#162f22] aspect-video relative overflow-hidden border border-[#254936] flex items-center justify-center">
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/40 text-[9px] font-mono text-[#a8d4be]">
                  FRAME 024
                </div>

                {/* Stylized mountain art layers */}
                <svg
                  className="w-full h-full absolute inset-0 text-[#284f39]"
                  viewBox="0 0 200 120"
                  fill="currentColor"
                >
                  <polygon points="10,120 70,50 130,120" fill="#2d5840" />
                  <polygon points="70,120 130,30 190,120" fill="#396c4f" opacity="0.9" />
                  <polygon points="120,120 165,65 200,120" fill="#4d8262" opacity="0.8" />
                  <circle cx="160" cy="35" r="10" fill="#e9f3eb" />
                </svg>

                <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white z-10">
                  <Film className="w-4 h-4" />
                </div>
              </div>

              {/* Timeline Strip */}
              <div className="rounded-lg bg-[#14281d] p-2 border border-[#224432] space-y-1.5 text-[9px] font-mono">
                <div className="flex gap-1">
                  <div className="flex-1 py-1 rounded bg-[#2a543d] text-center text-[#d1ebd9] font-semibold">
                    {language === "th" ? "ฮุก (Hook)" : "Hook"}
                  </div>
                  <div className="flex-[2] py-1 rounded bg-[#35664b] text-center text-[#d1ebd9] font-semibold">
                    {language === "th" ? "การเล่าเรื่อง (Story)" : "The story"}
                  </div>
                  <div className="flex-1 py-1 rounded bg-[#2a543d] text-center text-[#d1ebd9] font-semibold">
                    {language === "th" ? "จุดคลี่คลาย (Payoff)" : "Payoff"}
                  </div>
                </div>

                <div className="h-4 flex items-center justify-between px-1 relative text-[#5c8b71]">
                  <span>||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||</span>
                  <div className="absolute top-0 bottom-0 left-[38%] w-0.5 bg-amber-400 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1: Lessons */}
        <div className="p-5 rounded-2xl bg-white border border-[#e5ede7] flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-[#eef6f1] flex items-center justify-center text-[#2e7354] shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#141f19] flex items-baseline gap-1.5 font-sans">
              <span>{data?.completed_lessons_count || 1}</span>
              <span className="text-xs text-[#5e6d64] font-normal">{t("stat_lessons")}</span>
            </div>
            <div className="text-xs text-[#718278]">{t("stat_completed_so_far")}</div>
          </div>
        </div>

        {/* Stat 2: Skill Average */}
        <div className="p-5 rounded-2xl bg-white border border-[#e5ede7] flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-[#eef6f1] flex items-center justify-center text-[#2e7354] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#141f19] flex items-baseline gap-1.5 font-sans">
              <span>{avgScore}</span>
              <span className="text-xs text-[#5e6d64] font-normal">/ 100</span>
            </div>
            <div className="text-xs text-[#718278]">{t("stat_skill_average")}</div>
          </div>
        </div>

        {/* Stat 3: Level */}
        <div className="p-5 rounded-2xl bg-white border border-[#e5ede7] flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-[#eef6f1] flex items-center justify-center text-[#2e7354] shrink-0">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#141f19] font-sans">
              {language === "th" ? "ระดับ 4 (Level 4)" : "Level 4"}
            </div>
            <div className="text-xs text-[#718278]">{t("stat_journey")}</div>
          </div>
        </div>
      </div>

      {/* Section: Pick up where you left off */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#141f19]">{t("section_pick_up")}</h3>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2e7354] hover:text-[#163324] transition"
          >
            <span>{t("link_explore_curriculum")}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Active Lesson Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#eef6f1] text-[#1b5e3a] border border-[#dcebe1]">
                {t("badge_module")} 0{continueLesson?.module_number || 2}
              </div>

              <div>
                <h4 className="text-base font-bold text-[#141f19]">
                  {language === "th" && continueLesson?.module_number === 2
                    ? "เพซซิ่งและจังหวะ (Pacing & Rhythm)"
                    : continueLesson?.module_title || "Pacing & Rhythm"}
                </h4>
                <p className="text-xs text-[#5e6d64] mt-0.5">
                  {language === "th"
                    ? "ความยาวช็อตและการตัดช่วงเงียบ Dead Air (Pacing 01)"
                    : continueLesson?.title}
                </p>
              </div>

              <p className="text-xs text-[#4b5563] leading-relaxed bg-[#f8faf8] p-3 rounded-xl border border-[#e8eee9]">
                {language === "th"
                  ? "เรียนรู้ว่าทำไมการแช่ภาพคนพูดนานเกิน 5 วินาทีถึงทำให้งานตัดดูอืด และการตัดทันทีที่จบประโยคช่วยรักษาความต่อเนื่องของอารมณ์ได้อย่างไร"
                  : "Learn why holding a static talking head for 5+ seconds makes an edit feel sluggish, and how cutting on thought preserves narrative momentum."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/learn/${continueLesson?.id || "pacing-01"}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#163324] hover:bg-[#1e4230] text-white text-xs font-semibold transition"
              >
                <span>{t("btn_continue_lesson")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Practice Challenge Card */}
          <div className="p-6 rounded-2xl bg-[#eef6f1] border border-[#dcebe1] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-[#2e7354] uppercase flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  {t("badge_put_practice")}
                </span>
                <span className="text-[10px] font-mono text-[#5e6d64]">{t("badge_davinci_challenge")}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#163324]">
                  {language === "th" ? "ตัดวิดีโอคนพูดสไตล์กระชับ #01" : recommended?.title || "Fast Talking Head #01"}
                </h4>
                <p className="text-xs text-[#5e6d64] mt-0.5">
                  {language === "th"
                    ? "ตัดช่วงหยุดพูด เอา Dead air ออก และคุมความยาวให้อยู่ในช่วง 20-30 วินาที"
                    : recommended?.description || "Trim pauses, remove dead air, and cut down to 20-30 seconds."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#163324]">
                <div className="p-2 rounded-lg bg-white border border-[#dcebe1]">
                  <span className="text-[#718278] block text-[10px]">{t("target_duration_label")}</span>
                  <span className="font-semibold">{language === "th" ? "20–30 วินาที" : "20–30 sec"}</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#dcebe1]">
                  <span className="text-[#718278] block text-[10px]">{t("target_max_pause_label")}</span>
                  <span className="font-semibold">&le; {language === "th" ? "0.8 วินาที" : "0.8 sec"}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/practice/${recommended?.exercise_id || "pacing-01-practice"}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#163324] hover:bg-[#1e4230] text-white text-xs font-semibold transition"
              >
                <span>{t("btn_open_challenge")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix Preview */}
      <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#141f19]">{t("skills_progress_title")}</h3>
            <p className="text-xs text-[#718278]">{t("skills_progress_sub")}</p>
          </div>
          <Link
            href="/skills"
            className="text-xs font-semibold text-[#2e7354] hover:text-[#163324] flex items-center gap-1"
          >
            <span>{t("link_full_profile")}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.slice(0, 6).map((skill) => (
            <div key={skill.id} className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e8eee9] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#141f19]">
                  {language === "th" ? skillTranslationsTh[skill.name] || skill.name : skill.name}
                </span>
                <span className="font-mono font-bold text-[#163324]">{Math.round(skill.score)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#e3eae5] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#163324] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, skill.score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
