"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
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
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LESSON_TRANSLATIONS_TH } from "@/lib/curriculumTranslations";

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

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [completed, setCompleted] = useState(false);
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

  const isCorrect = selectedOption === quiz?.correct;
  const practiceId = lesson.content.practice_id || "pacing-01-practice";

  const difficultyText = language === "th"
    ? lesson.difficulty === "Beginner"
      ? "ระดับเบื้องต้น"
      : lesson.difficulty === "Intermediate"
      ? "ระดับปานกลาง"
      : "ระดับขั้นสูง"
    : lesson.difficulty;

  const skillText = language === "th"
    ? lesson.skill === "timing"
      ? "จังหวะคัต (Timing)"
      : lesson.skill === "pacing"
      ? "เพซซิ่ง (Pacing)"
      : lesson.skill === "story"
      ? "การเล่าเรื่อง (Story)"
      : lesson.skill === "broll"
      ? "การใช้ B-roll"
      : lesson.skill === "audio"
      ? "ระบบเสียง (Audio)"
      : lesson.skill === "text"
      ? "ข้อความ & แคปชัน"
      : lesson.skill === "motion"
      ? "โมชัน & ซูม"
      : lesson.skill === "hook"
      ? "การฮุก (Hook)"
      : lesson.skill === "color"
      ? "สี & คอนทราสต์"
      : "ทักษะองค์รวม"
    : lesson.skill;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5e6d64] hover:text-[#163324] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("back_to_curriculum")}</span>
        </Link>

        <div className="flex items-center gap-2">
          {completed && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-[#eef6f1] text-[#1b5e3a] border border-[#dcebe1] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("status_completed")}
            </span>
          )}
          <span className="text-xs text-[#718278] font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#8a9990]" />
            {lesson.duration}
          </span>
        </div>
      </div>

      {/* Lesson Header Card */}
      <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
        <div className="text-[11px] font-bold tracking-widest text-[#2e7354] uppercase">
          {t("badge_module")} 0{lesson.module_number}: {modTitle}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141f19]">{lesTitle}</h1>
        <div className="flex items-center gap-2 text-xs text-[#5e6d64] font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-[#f2f6f3] border border-[#e0eae3]">
            {difficultyText}
          </span>
          <span>•</span>
          <span className="uppercase text-[#2e7354] font-semibold">
            {language === "th" ? `ทักษะ: ${skillText}` : `Skill: ${skillText}`}
          </span>
        </div>
      </div>

      {/* Core Concept */}
      <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#163324] uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-[#2e7354]" />
          <span>{t("core_principle")}</span>
        </div>
        <p className="text-sm sm:text-base text-[#141f19] leading-relaxed">{concept}</p>
      </div>

      {/* Why it Matters */}
      <div className="p-7 rounded-2xl bg-[#eef6f1] border border-[#dcebe1] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#163324] uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-[#2e7354]" />
          <span>{t("why_it_works")}</span>
        </div>
        <p className="text-sm text-[#274635] leading-relaxed">{why}</p>
      </div>

      {/* Bad vs Good Example Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bad Example */}
        <div className="p-6 rounded-2xl bg-[#fef7f7] border border-[#fbd5d5] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>{t("pitfall_bad")}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#7f1d1d] leading-relaxed">{badEx}</p>
          </div>
          <div className="text-[11px] text-rose-800 font-mono bg-rose-100/60 p-2.5 rounded-xl border border-rose-200">
            {t("pitfall_result")}
          </div>
        </div>

        {/* Good Example */}
        <div className="p-6 rounded-2xl bg-[#f4faf6] border border-[#cce8d7] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t("intentional_good")}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#064e3b] leading-relaxed">{goodEx}</p>
          </div>
          <div className="text-[11px] text-emerald-800 font-mono bg-emerald-100/60 p-2.5 rounded-xl border border-emerald-200">
            {t("intentional_result")}
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      {quiz && (
        <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] space-y-5 shadow-xs">
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
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition flex items-start gap-3 ${style}`}
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
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                selectedOption !== null
                  ? "bg-[#163324] hover:bg-[#1e4230] text-white cursor-pointer shadow-xs"
                  : "bg-[#e5ede7] text-[#8a9990] cursor-not-allowed"
              }`}
            >
              {t("btn_submit_answer")}
            </button>
          ) : (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                isCorrect
                  ? "bg-[#f4faf6] border-emerald-300 text-emerald-900"
                  : "bg-[#fef7f7] border-rose-300 text-rose-900"
              }`}
            >
              <div className="font-bold mb-1">{isCorrect ? t("quiz_correct") : t("quiz_incorrect")}</div>
              <p>{quiz.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Attached Practice Source & Footage Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#cce8d7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#eef6f1] text-[#163324] flex items-center justify-center shrink-0 mt-0.5">
            <Film className="w-5 h-5 text-[#2e7354]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#dcf2e3] text-[#144d2d]">
                {language === "th" ? "ไฟล์ Source แนบพร้อม" : "SOURCE ATTACHED"}
              </span>
              <span className="text-xs text-[#718278] font-mono">raw_footage.mp4 (40s)</span>
            </div>
            <h4 className="text-sm font-bold text-[#141f19]">
              {language === "th" ? "วิดีโอดิบสำหรับฝึกตัดต่อใน DaVinci / Premiere" : "Raw Practice Footage for DaVinci / Premiere"}
            </h4>
            <p className="text-xs text-[#5e6d64] mt-0.5 max-w-xl">
              {language === "th"
                ? "ฟุตเทจดิบคนพูดที่มี dead air และจังหวะหยุดพูดให้คุณนำไปฝึกตัดแต่งและคุมเพซซิ่งได้ทันที"
                : "Unedited talking head clip with dead air gaps ready for you to cut and tighten."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`/api/practice/${practiceId}/download-raw`}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f0f5f2] hover:bg-[#e2ebe4] text-[#163324] text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#2e7354]" />
            <span>{language === "th" ? "ดาวน์โหลด Source" : "Download MP4"}</span>
          </a>
        </div>
      </div>

      {/* CTA: Next Action */}
      <div className="p-8 rounded-2xl bg-[#163324] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">{t("lesson_cta_title")}</h3>
          <p className="text-xs text-[#c1d9cc]">{t("lesson_cta_sub")}</p>
        </div>

        <Link
          href={`/practice/${practiceId}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#d2ebd9] hover:bg-[#c3e4cc] text-[#133022] font-bold text-xs uppercase tracking-wider transition shadow-xs shrink-0"
        >
          <Target className="w-4 h-4" />
          <span>{t("btn_launch_challenge")}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
