"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Target,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface SkillItem {
  id: string;
  name: string;
  score: number;
  confidence: number;
  updated_at: string;
}

interface SkillsProfileData {
  editor_level: string;
  average_score: number;
  skills: SkillItem[];
  strongest: SkillItem;
  needs_practice: SkillItem;
  recommended: {
    title: string;
    exercise_id: string;
  };
}

export default function SkillsProfilePage() {
  const [profile, setProfile] = useState<SkillsProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load skills:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#2e7354] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

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

  const getTranslatedSkillName = (name: string): string => {
    return language === "th" ? skillTranslationsTh[name] || name : name;
  };

  const editorLevelText = language === "th"
    ? profile.editor_level.replace("Editor Level", "ระดับนักตัดต่อ")
    : profile.editor_level;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Profile Card */}
      <div className="p-8 rounded-3xl bg-[#163324] text-white border border-[#234937] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#234734] border border-[#2d5840] flex items-center justify-center text-[#d2ebd9]">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#9fd6b5] font-bold mb-1">
              {t("dna_badge")}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{editorLevelText}</h1>
            <p className="text-xs text-[#c1d9cc] mt-1">
              {t("avg_mastery")} <strong className="text-white font-bold">{profile.average_score} / 100</strong>
            </p>
          </div>
        </div>

        <Link
          href={`/practice/${profile.recommended.exercise_id}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d2ebd9] hover:bg-[#c3e4cc] text-[#133022] font-bold text-xs uppercase tracking-wider transition shadow-xs shrink-0"
        >
          <Target className="w-4 h-4" />
          <span>{t("btn_practice_now")}</span>
        </Link>
      </div>

      {/* Strongest & Needs Practice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-[#f4faf6] border border-[#cce8d7] space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#15803d] uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t("strongest_skill_badge")}</span>
          </div>
          <div className="text-xl font-bold text-[#141f19]">{getTranslatedSkillName(profile.strongest.name)}</div>
          <div className="text-xs text-[#15803d] font-mono font-semibold">
            {language === "th" ? "คะแนน:" : "Score:"} {Math.round(profile.strongest.score)}/100 (
            {t("confidence_label")} {(profile.strongest.confidence * 100).toFixed(0)}%)
          </div>
          <p className="text-xs text-[#5e6d64] leading-relaxed">
            {t("strongest_skill_desc")}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#fef9f4] border border-[#fed7aa] space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>{t("needs_practice_badge")}</span>
          </div>
          <div className="text-xl font-bold text-[#141f19]">{getTranslatedSkillName(profile.needs_practice.name)}</div>
          <div className="text-xs text-[#b45309] font-mono font-semibold">
            {language === "th" ? "คะแนน:" : "Score:"} {Math.round(profile.needs_practice.score)}/100
          </div>
          <p className="text-xs text-[#5e6d64] leading-relaxed">
            {t("needs_practice_desc")}
          </p>
        </div>
      </div>

      {/* Comprehensive Skill Assessment */}
      <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] space-y-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#141f19] uppercase tracking-wider">{t("comprehensive_skills_title")}</h3>

        <div className="space-y-4">
          {profile.skills.map((s) => {
            const score = Math.round(s.score);
            return (
              <div key={s.id} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#141f19] font-semibold">{getTranslatedSkillName(s.name)}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[11px] text-[#718278]">
                      {t("confidence_label")} {(s.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-[#163324] font-bold">{score} / 100</span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-[#edf2ee] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#163324] transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
