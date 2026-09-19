"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Target,
  Clock,
  Lightbulb,
  ChevronRight,
  Film,
  Download,
  Brain,
  Layers,
  Keyboard,
  Check,
  Play,
  RotateCcw,
  Sliders,
  Laptop
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LESSON_TRANSLATIONS_TH } from "@/lib/curriculumTranslations";
import { LESSON_MASTERCLASS_DATA } from "@/lib/lessonMasterclassData";
import TimelineBlueprint from "@/components/TimelineBlueprint";
import SafeZoneOverlay, { SafeZoneMode, SafeZoneToolbar } from "@/components/SafeZoneOverlay";

interface LessonContent {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  skill: string;
  concept: string;
  why: string;
  bad_example: string;
  good_example: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  practice_id?: string;
}

interface LessonDetail {
  id: string;
  module_id: string;
  module_title: string;
  module_number: number;
  title: string;
  duration: string;
  difficulty: string;
  skill: string;
  completed: boolean;
  content: LessonContent;
}

const ALL_LESSON_IDS = [
  "timing-01",
  "pacing-01",
  "pacing-02",
  "story-01",
  "broll-01",
  "audio-01",
  "text-01",
  "motion-01",
  "hook-01",
  "color-01",
  "complete-01",
];

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [videoMode, setVideoMode] = useState<"bad" | "good">("bad");
  const [safeZoneMode, setSafeZoneMode] = useState<SafeZoneMode>("none");
  const [selectedSoftware, setSelectedSoftware] = useState<"davinci" | "capcut">("davinci");

  const { language, t } = useLanguage();

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data);
        setCompleted(Boolean(data.completed));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load lesson:", err);
        setLoading(false);
      });
  }, [lessonId]);

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setSubmittedQuiz(true);
    const correctIdx = lesson?.content?.quiz?.correct;
    if (selectedOption === correctIdx) {
      fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" });
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#2e7354] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-[#141f19]">Lesson Not Found</h2>
        <Link href="/learn" className="text-[#2e7354] text-sm mt-2 inline-block">
          {t("back_to_curriculum")}
        </Link>
      </div>
    );
  }

  const thData = LESSON_TRANSLATIONS_TH[lessonId];
  const modTitle = language === "th" && thData ? thData.module_title : lesson.module_title;
  const lesTitle = language === "th" && thData ? thData.title : lesson.title;
  const concept = language === "th" && thData ? thData.concept : lesson.content.concept;
  const why = language === "th" && thData ? thData.why : lesson.content.why;
  const badEx = language === "th" && thData ? thData.bad_example : lesson.content.bad_example;
  const goodEx = language === "th" && thData ? thData.good_example : lesson.content.good_example;
  const quiz = language === "th" && thData ? thData.quiz : lesson.content.quiz;

  const extraData = LESSON_MASTERCLASS_DATA[lessonId] || LESSON_MASTERCLASS_DATA["timing-01"];
  const practiceId = lesson.content.practice_id || `${lessonId}-practice`;

  const rawStreamUrl = `/api/media/stream?path=practice/${practiceId}/raw_footage.mp4`;
  const sampleStreamUrl = `/api/media/stream?path=practice/${practiceId}/sample_edited.mp4`;
  const currentStreamUrl = videoMode === "bad" ? rawStreamUrl : sampleStreamUrl;

  const currentIdx = ALL_LESSON_IDS.indexOf(lessonId);
  const prevLessonId = currentIdx > 0 ? ALL_LESSON_IDS[currentIdx - 1] : null;
  const nextLessonId = currentIdx < ALL_LESSON_IDS.length - 1 ? ALL_LESSON_IDS[currentIdx + 1] : null;

  const difficultyText =
    language === "th"
      ? lesson.difficulty === "Beginner"
        ? "ระดับเบื้องต้น"
        : lesson.difficulty === "Intermediate"
        ? "ระดับปานกลาง"
        : "ระดับขั้นสูง"
      : lesson.difficulty;

  const stepsConfig = [
    {
      id: 1,
      titleEn: "Psychology & Rules",
      titleTh: "1. จิตวิทยา & กฎทอง",
      icon: Brain,
    },
    {
      id: 2,
      titleEn: "Visual Comparison",
      titleTh: "2. วิดีโอเปรียบเทียบ",
      icon: Film,
    },
    {
      id: 3,
      titleEn: "Timeline Blueprint",
      titleTh: "3. ผ่าไทม์ไลน์ & คีย์ลัด",
      icon: Layers,
    },
    {
      id: 4,
      titleEn: "Quiz & Practice",
      titleTh: "4. ทดสอบ & ฝึกจริง",
      icon: Target,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5ede7] pb-4">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5e6d64] hover:text-[#163324] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("back_to_curriculum")}</span>
        </Link>

        <div className="flex items-center gap-3">
          {completed && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-[#eef6f1] text-[#1b5e3a] border border-[#dcebe1] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t("status_completed")}</span>
            </span>
          )}
          <span className="text-xs text-[#718278] font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#8a9990]" />
            <span>{lesson.duration}</span>
          </span>
        </div>
      </div>

      {/* Lesson Banner Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5ede7] shadow-xs space-y-2">
        <div className="text-[11px] font-mono font-bold tracking-widest text-[#2e7354] uppercase">
          MODULE 0{lesson.module_number} • {modTitle}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141f19]">{lesTitle}</h1>
        <div className="flex items-center gap-2 text-xs text-[#5e6d64] font-mono pt-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#f2f6f3] border border-[#e0eae3]">
            {difficultyText}
          </span>
          <span>•</span>
          <span className="text-[#2e7354] font-semibold">
            {language === "th" ? `ทักษะ: ${lesson.skill}` : `Skill Focus: ${lesson.skill.toUpperCase()}`}
          </span>
        </div>
      </div>

      {/* 4-STEP MASTERCLASS NAVIGATION BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f0f5f2] p-1.5 rounded-2xl border border-[#dcebe1]">
        {stepsConfig.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id as 1 | 2 | 3 | 4)}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-[#163324] text-white shadow-sm"
                  : "text-[#5e6d64] hover:text-[#163324] hover:bg-white/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#7dd3a6]" : "text-[#5e6d64]"}`} />
              <span className="truncate">{language === "th" ? s.titleTh : s.titleEn}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: PSYCHOLOGY & THE GOLDEN RULE */}
      {/* ========================================================================= */}
      {activeStep === 1 && (
        <div className="space-y-6">
          {/* Core Principle Card */}
          <div className="p-7 rounded-3xl bg-white border border-[#e5ede7] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#163324] uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-[#2e7354]" />
              <span>{t("core_principle")}</span>
            </div>
            <p className="text-base text-[#141f19] leading-relaxed font-medium">{concept}</p>
          </div>

          {/* Why It Works & Psychological Mechanism */}
          <div className="p-7 rounded-3xl bg-[#eef6f1] border border-[#dcebe1] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#163324] uppercase tracking-wider">
              <Brain className="w-4 h-4 text-[#2e7354]" />
              <span>{language === "th" ? "กลไกทางจิตวิทยา (Why the Brain Reacts)" : "The Psychological Mechanism"}</span>
            </div>
            <p className="text-sm text-[#274635] leading-relaxed">{why}</p>
            <div className="pt-2 border-t border-[#cce0d4]">
              <div className="text-xs text-[#1e4230] leading-relaxed italic bg-white/70 p-3.5 rounded-xl border border-[#cce0d4]">
                <strong>💡 {language === "th" ? "การรับรู้ของผู้ชม:" : "Cognitive Science Note:"}</strong>{" "}
                {language === "th" ? extraData.psychologyInsight.th : extraData.psychologyInsight.en}
              </div>
            </div>
          </div>

          {/* Editor's Golden Rule Callout */}
          <div className="p-7 rounded-3xl bg-radial from-[#1e4230] to-[#0e2117] text-white border border-[#2b5943] shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#7dd3a6] font-bold">
                <Sparkles className="w-4 h-4 text-[#7dd3a6]" />
                <span>{language === "th" ? "กฎทองของนักตัดต่อ (Rule of Thumb)" : "Editor's Golden Rule"}</span>
              </div>
              <span className="text-[10px] font-mono text-white/50 bg-black/40 px-2.5 py-1 rounded-md border border-white/10">
                PRO BENCHMARK
              </span>
            </div>

            <div className="text-lg sm:text-xl font-bold text-white leading-snug">
              &ldquo;{language === "th" ? extraData.goldenRule.th : extraData.goldenRule.en}&rdquo;
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-[#c1d9cc]">
              <span className="bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                🎯 {language === "th" ? extraData.metricsTarget.th : extraData.metricsTarget.en}
              </span>
            </div>
          </div>

          {/* Next Step Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#163324] hover:bg-[#1e4230] text-white font-bold text-xs uppercase tracking-wider transition shadow-xs cursor-pointer"
            >
              <span>{language === "th" ? "ไปต่อ: ดูวิดีโอเปรียบเทียบ →" : "Next: Visual Comparison →"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: INTERACTIVE VISUAL COMPARISON PLAYER */}
      {/* ========================================================================= */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5ede7] shadow-xs space-y-5">
            {/* Header with Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5ede7] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#141f19] flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#2e7354]" />
                  <span>{language === "th" ? "เครื่องเล่นวิดีโอเปรียบเทียบ (Visual Cut Simulator)" : "Visual Cut Simulator"}</span>
                </h2>
                <p className="text-xs text-[#5e6d64] mt-0.5">
                  {language === "th"
                    ? "สลับดูระหว่างฟุตเทจดิบ (Bad Example) กับงานที่ตัดเสร็จแล้ว (Good Example) เพื่อฟังและเห็นจังหวะจริง"
                    : "Switch between the unedited raw take and the finished master edit to see the real difference in pacing."}
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="inline-flex rounded-xl bg-[#f0f5f2] p-1 border border-[#dce5df] shrink-0">
                <button
                  type="button"
                  onClick={() => setVideoMode("bad")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    videoMode === "bad"
                      ? "bg-rose-600 text-white shadow-xs font-bold"
                      : "text-[#5e6d64] hover:text-rose-700"
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{language === "th" ? "ตัวอย่างที่ไม่ดี (Bad / Raw)" : "Bad / Uncut"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoMode("good")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    videoMode === "good"
                      ? "bg-[#163324] text-white shadow-xs font-bold"
                      : "text-[#5e6d64] hover:text-[#163324]"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7dd3a6]" />
                  <span>{language === "th" ? "ตัวอย่างที่ดี (Good / Pro Edit)" : "Good / Pro Edit"}</span>
                </button>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video rounded-2xl bg-[#0e1612] overflow-hidden border border-[#1b2b23] shadow-lg group">
              <video
                key={currentStreamUrl}
                src={currentStreamUrl}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              />

              {/* Safe Zone Overlay */}
              <SafeZoneOverlay mode={safeZoneMode} onModeChange={setSafeZoneMode} />

              {/* Badge */}
              <div className="absolute top-3 left-3 pointer-events-none z-30">
                <span
                  className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-wide uppercase text-white backdrop-blur-xs border ${
                    videoMode === "bad"
                      ? "bg-rose-950/80 border-rose-500/40 text-rose-200"
                      : "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
                  }`}
                >
                  {videoMode === "bad"
                    ? language === "th"
                      ? "❌ ตัวอย่างที่ไม่ดี: มี Dead Air & แช่ภาพนิ่ง"
                      : "❌ BAD EXAMPLE: Lingering pauses & static hold"
                    : language === "th"
                    ? "✅ ตัวอย่างที่ดี: คัตกระชับ & ปิดรอยต่อด้วย B-roll"
                    : "✅ PRO EDIT: Tightened pauses & seamless cuts"}
                </span>
              </div>

              {/* Top-Right Safe Zone Quick Switcher */}
              <div className="absolute top-3 right-3 z-30 opacity-90 hover:opacity-100 transition">
                <SafeZoneToolbar mode={safeZoneMode} onModeChange={setSafeZoneMode} />
              </div>
            </div>

            {/* Side-by-Side Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Bad Example Card */}
              <div
                className={`p-5 rounded-2xl border transition ${
                  videoMode === "bad" ? "bg-[#fef7f7] border-rose-300 ring-2 ring-rose-200" : "bg-[#fcfaf9] border-[#f0e6e6]"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{t("pitfall_bad")}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#7f1d1d] leading-relaxed">{badEx}</p>
                <div className="mt-3 text-[11px] text-rose-800 font-mono bg-rose-100/70 p-2.5 rounded-xl border border-rose-200">
                  ⚠️ {t("pitfall_result")}
                </div>
              </div>

              {/* Good Example Card */}
              <div
                className={`p-5 rounded-2xl border transition ${
                  videoMode === "good" ? "bg-[#f4faf6] border-emerald-300 ring-2 ring-emerald-200" : "bg-[#f9fcf9] border-[#e2ece5]"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t("intentional_good")}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#064e3b] leading-relaxed">{goodEx}</p>
                <div className="mt-3 text-[11px] text-emerald-800 font-mono bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200">
                  ✨ {t("intentional_result")}
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(1)}
              className="px-5 py-2.5 rounded-2xl bg-white border border-[#dce5df] hover:bg-[#f6faf7] text-[#141f19] font-semibold text-xs transition cursor-pointer"
            >
              ← {language === "th" ? "ย้อนกลับ" : "Back"}
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#163324] hover:bg-[#1e4230] text-white font-bold text-xs uppercase tracking-wider transition shadow-xs cursor-pointer"
            >
              <span>{language === "th" ? "ไปต่อ: ผ่าโครงสร้างไทม์ไลน์ →" : "Next: Timeline Blueprint →"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: TIMELINE BLUEPRINT & PRO SHORTCUTS */}
      {/* ========================================================================= */}
      {activeStep === 3 && (
        <div className="space-y-6">
          {/* Timeline Blueprint Component */}
          <TimelineBlueprint blueprintType={extraData.blueprintType} />

          {/* Software Shortcuts & Pro Cheatsheet */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5ede7] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5ede7] pb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#2e7354]" />
                <h3 className="text-base font-bold text-[#141f19]">
                  {language === "th" ? "สูตรคีย์ลัดสำหรับบทเรียนนี้" : "Pro NLE Keyboard Shortcuts"}
                </h3>
              </div>

              {/* Software Tab Switcher */}
              <div className="inline-flex rounded-xl bg-[#f0f5f2] p-1 border border-[#dce5df]">
                <button
                  type="button"
                  onClick={() => setSelectedSoftware("davinci")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSoftware === "davinci" ? "bg-[#163324] text-white font-bold" : "text-[#5e6d64]"
                  }`}
                >
                  DaVinci Resolve 19
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSoftware("capcut")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSoftware === "capcut" ? "bg-[#163324] text-white font-bold" : "text-[#5e6d64]"
                  }`}
                >
                  CapCut Desktop
                </button>
              </div>
            </div>

            {/* Shortcuts List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(selectedSoftware === "davinci" ? extraData.davinciShortcuts : extraData.capcutShortcuts).map(
                (item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#f8faf8] border border-[#e2ece5] flex flex-col justify-between space-y-2 hover:border-[#2e7354]/40 transition"
                  >
                    <div className="inline-block self-start px-2.5 py-1 rounded-lg bg-[#163324] text-[#7dd3a6] font-mono font-bold text-xs border border-[#234937] shadow-xs">
                      {item.key}
                    </div>
                    <p className="text-xs text-[#374151] leading-relaxed font-medium">
                      {language === "th" ? item.actionTh : item.actionEn}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Quick Tip Banner */}
            <div className="p-4 rounded-2xl bg-[#eef6f1] border border-[#cce0d4] text-xs text-[#163324] leading-relaxed flex items-start gap-2.5">
              <Laptop className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
              <span>
                {language === "th"
                  ? "ฝึกใช้มือซ้ายกดคีย์ลัดเหล่านี้บนคีย์บอร์ดโดยไม่ต้องละสายตาออกจากหน้าจอ จะช่วยลดเวลาตัดต่อลงได้มากกว่า 50%!"
                  : "Keep your left hand resting on these keys while scrubbing with your right hand on the mouse to double your cutting speed!"}
              </span>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 rounded-2xl bg-white border border-[#dce5df] hover:bg-[#f6faf7] text-[#141f19] font-semibold text-xs transition cursor-pointer"
            >
              ← {language === "th" ? "ย้อนกลับ" : "Back"}
            </button>

            <button
              onClick={() => setActiveStep(4)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#163324] hover:bg-[#1e4230] text-white font-bold text-xs uppercase tracking-wider transition shadow-xs cursor-pointer"
            >
              <span>{language === "th" ? "ไปต่อ: แบบทดสอบ & ฝึกจริง →" : "Next: Quiz & Challenge →"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: KNOWLEDGE QUIZ & CHALLENGE LAUNCH */}
      {/* ========================================================================= */}
      {activeStep === 4 && (
        <div className="space-y-6">
          {/* Mini Quiz */}
          {quiz && (
            <div className="p-7 rounded-3xl bg-white border border-[#e5ede7] space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#163324] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#2e7354]" />
                  <span>{t("quiz_title")}</span>
                </div>
                <span className="text-[11px] text-[#718278] font-mono">{t("quiz_sub")}</span>
              </div>

              <p className="text-sm font-semibold text-[#141f19]">{quiz.question}</p>

              <div className="space-y-2.5">
                {quiz.options.map((opt: string, idx: number) => {
                  const isSelected = selectedOption === idx;
                  let style = "bg-white border-[#e5ede7] text-[#374151] hover:border-[#cbdad0] hover:bg-[#f8faf8]";

                  if (submittedQuiz) {
                    if (idx === quiz.correct) {
                      style = "bg-[#f4faf6] border-emerald-400 text-emerald-900 font-semibold";
                    } else if (isSelected) {
                      style = "bg-[#fef7f7] border-rose-400 text-rose-900";
                    }
                  } else if (isSelected) {
                    style = "bg-[#eef6f1] border-[#2e7354] text-[#163324] font-semibold";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !submittedQuiz && setSelectedOption(idx)}
                      disabled={submittedQuiz}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition flex items-start gap-3 cursor-pointer ${style}`}
                    >
                      <span className="font-mono text-xs text-[#718278] mt-0.5">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!submittedQuiz ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedOption === null}
                  className="w-full py-3 px-4 rounded-xl bg-[#163324] hover:bg-[#1e4230] text-white text-xs font-bold transition disabled:opacity-40 shadow-xs cursor-pointer"
                >
                  {t("btn_submit_answer")}
                </button>
              ) : (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    selectedOption === quiz.correct
                      ? "bg-[#f4faf6] border-emerald-200 text-emerald-800"
                      : "bg-[#fef7f7] border-rose-200 text-rose-800"
                  }`}
                >
                  <strong>{selectedOption === quiz.correct ? t("quiz_correct") : t("quiz_incorrect")}</strong>{" "}
                  {quiz.explanation}
                </div>
              )}
            </div>
          )}

          {/* Action CTA: Launch Practice Challenge in DaVinci / CapCut */}
          <div className="p-8 rounded-3xl bg-[#163324] text-white space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-[#7dd3a6] uppercase tracking-widest font-bold">
                  {t("lesson_cta_title")}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {language === "th"
                    ? "นำความรู้ไปตัดจริงใน DaVinci Resolve / CapCut"
                    : "Put This Technique to Work in DaVinci Resolve / CapCut"}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#c1d9cc] self-start sm:self-auto">
                CHALLENGE READY
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#c1d9cc] leading-relaxed">{t("lesson_cta_sub")}</p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href={`/practice/${practiceId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#d2ebd9] hover:bg-[#c3e4cc] text-[#133022] font-extrabold text-xs uppercase tracking-wider transition shadow-sm"
              >
                <span>{t("btn_launch_challenge")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/guides"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition"
              >
                <span>{language === "th" ? "ดูคู่มือ DaVinci & CapCut" : "View NLE Setup Guides"}</span>
              </Link>
            </div>
          </div>

          {/* Previous / Next Lesson Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e5ede7]">
            {prevLessonId ? (
              <Link
                href={`/learn/${prevLessonId}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#5e6d64] hover:text-[#163324] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === "th" ? "← บทเรียนก่อนหน้า" : "← Previous Lesson"}</span>
              </Link>
            ) : (
              <div></div>
            )}

            {nextLessonId ? (
              <Link
                href={`/learn/${nextLessonId}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#163324] hover:text-[#2e7354] transition"
              >
                <span>{language === "th" ? "บทเรียนถัดไป →" : "Next Lesson →"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
