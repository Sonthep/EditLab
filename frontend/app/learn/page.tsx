"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Scissors,
  Activity,
  Layers,
  Volume2,
  Type,
  Move,
  Anchor,
  Sun,
  Award,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface Lesson {
  id: string;
  module_id: string;
  module_title: string;
  module_number: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  skill: string;
  completed: boolean;
}

interface ModuleData {
  module_id: string;
  title: string;
  number: number;
  lessons: Lesson[];
}

const MODULE_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Scissors,
  2: Activity,
  3: BookOpen,
  4: Layers,
  5: Volume2,
  6: Type,
  7: Move,
  8: Anchor,
  9: Sun,
  10: Award,
};

const MODULE_TITLES_TH: Record<number, string> = {
  1: "การตัดและจังหวะคัต (Cut & Timing)",
  2: "เพซซิ่งและจังหวะ (Pacing & Rhythm)",
  3: "โครงสร้างเรื่องและลำดับภาพ (Story & Sequence)",
  4: "การใช้ภาพเสริม (B-roll)",
  5: "การตัดต่อเสียงและการเชื่อมต่อ (Audio)",
  6: "ข้อความและแคปชัน (Text & Caption)",
  7: "การเคลื่อนไหวและซูม (Motion)",
  8: "การฮุกและตรึงคนดู (Hook & Retention)",
  9: "สีและความสม่ำเสมอของภาพ (Color)",
  10: "การตัดต่อแบบองค์รวม (Complete Master Edit)",
};

const LESSON_TITLES_TH: Record<string, { title: string; desc: string }> = {
  "timing-01": {
    title: "ทำไมต้องคัต & การคัตตามความคิด (Why Cut)",
    desc: "เรียนรู้จังหวะการตัดต่อเมื่อความคิดสิ้นสุด เพื่อไม่ให้จังหวะการพูดสะดุดและไม่มี Dead air",
  },
  "pacing-01": {
    title: "ความยาวช็อต & การตัดช่วงเงียบ (Pacing 01)",
    desc: "เข้าใจจังหวะการแช่ภาพ ไม่ปล่อยให้คนพูดแช่นานเกิน 3-4 วินาที และการตัดช่วงอึกอักออก",
  },
  "pacing-02": {
    title: "จังหวะเพลงและการเปลี่ยนความเร็ว (Rhythm & Changing Pace)",
    desc: "การสร้างความแตกต่างระหว่างช่วงเร็วและช่วงผ่อนคลายเพื่อดึงดูดอารมณ์คนดู",
  },
  "story-01": {
    title: "ลำดับข้อมูลและการเปิดเรื่อง (Information Hierarchy)",
    desc: "เปิดเรื่องให้น่าสนใจและจัดลำดับช็อตให้คนดูเข้าใจสถานการณ์ทันที",
  },
  "broll-01": {
    title: "แสดงให้เห็น ดีกว่าแค่เล่าให้ฟัง (Show Instead of Tell)",
    desc: "ใส่ภาพ B-roll เสริมคำพูดทันทีที่เริ่มอธิบายสิ่งใหม่ เพื่อรีเซ็ตความสนใจของสายตา",
  },
  "audio-01": {
    title: "พลังของ J-Cut และการตัดเสียงล่วงหน้า",
    desc: "ให้เสียงของฉากถัดไปเริ่มก่อนภาพ เพื่อให้รอยต่อของคัตดูลื่นไหลไร้รอยต่อ",
  },
  "text-01": {
    title: "การเน้นคำสำคัญและความเร็วในการอ่าน (Keyword Emphasis)",
    desc: "ไฮไลต์เฉพาะคำหลักในแคปชันเพื่อนำสายตาคนดู ไม่ปล่อยให้ตัวหนังสือรกหน้าจอ",
  },
  "motion-01": {
    title: "Punch Zoom เพื่อเน้นจุดสำคัญ",
    desc: "ซูมตัดเข้า 115-120% ในคำสำคัญเพื่อเน้นย้ำและเปลี่ยนมุมกล้องแบบประหยัดเวลา",
  },
  "hook-01": {
    title: "3 วินาทีแรกชี้ชะตา (The First 3 Seconds)",
    desc: "ตัดคำเกริ่นนำ โลโก้ และช่วงเงียบออก เข้าสู่ประเด็นน่าสนใจทันที",
  },
  "color-01": {
    title: "การเกลี่ยแสงและบาลานซ์สีให้ตรงกัน (Shot Matching)",
    desc: "ปรับสีผิวและโทนแสงระหว่าง A-roll กับ B-roll ให้กลมกลืนเป็นเนื้อเดียวกัน",
  },
  "complete-01": {
    title: "การตัดต่อมาสเตอร์ 60 วินาที (The 60-Second Master Edit)",
    desc: "รวมทุกทักษะ: ฮุก เสียง B-roll แคปชัน และเพซซิ่ง เข้าเป็นผลงานสั้นที่สมบูรณ์แบบ",
  },
};

export default function CurriculumPage() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch("/api/lessons")
      .then((res) => res.json())
      .then((data) => {
        setModules(data.modules || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load curriculum:", err);
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

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="text-[11px] font-bold tracking-widest text-[#2e7354] uppercase mb-1">
          {t("curriculum_eyebrow")}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#141f19]">{t("curriculum_title")}</h1>
        <p className="text-sm text-[#5e6d64] max-w-2xl mt-1">{t("curriculum_sub")}</p>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {modules.map((mod) => {
          const Icon = MODULE_ICONS[mod.number] || BookOpen;
          const completedCount = mod.lessons.filter((l) => l.completed).length;
          const modTitle = language === "th" ? MODULE_TITLES_TH[mod.number] || mod.title : mod.title;

          return (
            <div
              key={mod.module_id}
              className="rounded-2xl bg-white border border-[#e5ede7] overflow-hidden shadow-xs hover:border-[#cbdad0] transition"
            >
              {/* Module Header */}
              <div className="p-5 bg-[#fbfdfb] border-b border-[#edf2ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#eef6f1] text-[#2e7354] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#718278] uppercase tracking-wider font-semibold">
                      {t("badge_module")} 0{mod.number}
                    </div>
                    <h2 className="text-base font-bold text-[#141f19]">{modTitle}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5e6d64] font-mono bg-[#f0f5f2] px-2.5 py-1 rounded-full border border-[#e2ece5]">
                    {completedCount} / {mod.lessons.length} {t("lessons_completed_tag")}
                  </span>
                </div>
              </div>

              {/* Lessons within Module */}
              <div className="divide-y divide-[#edf2ee]">
                {mod.lessons.map((lesson) => {
                  const thInfo = LESSON_TITLES_TH[lesson.id];
                  const lessonTitle = language === "th" && thInfo ? thInfo.title : lesson.title;
                  const lessonDesc = language === "th" && thInfo ? thInfo.desc : lesson.description;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${lesson.id}`}
                      className="p-4 flex items-center justify-between hover:bg-[#f6faf7] transition group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            lesson.completed
                              ? "bg-[#eef6f1] text-[#1b5e3a]"
                              : "bg-[#edf2ee] text-[#8a9990] group-hover:text-[#163324]"
                          }`}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#1b5e3a]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8a9990]"></span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#141f19] group-hover:text-[#1b5e3a] transition">
                              {lessonTitle}
                            </span>
                            <span className="hidden md:inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#2e7354] bg-[#eef6f1] px-2 py-0.5 rounded-md border border-[#cce8d7]">
                              🎬 4-Step Masterclass
                            </span>
                          </div>
                          <div className="text-xs text-[#5e6d64] line-clamp-1 mt-0.5">{lessonDesc}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#f2f6f3] text-[#5e6d64] border border-[#e0eae3] font-mono text-[11px]">
                          {language === "th" && lesson.difficulty === "Beginner"
                            ? "เบื้องต้น"
                            : language === "th" && lesson.difficulty === "Intermediate"
                            ? "ปานกลาง"
                            : language === "th" && lesson.difficulty === "Advanced"
                            ? "ขั้นสูง"
                            : lesson.difficulty}
                        </span>
                        <span className="text-[#718278] font-mono flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-[#8a9990]" />
                          {lesson.duration}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#8a9990] group-hover:text-[#163324] group-hover:translate-x-0.5 transition" />
                      </div>

                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
