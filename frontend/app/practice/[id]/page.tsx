"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Target,
  FolderOpen,
  UploadCloud,
  FileVideo,
  CheckSquare,
  Square,
  Sparkles,
  AlertTriangle,
  Download,
  ExternalLink,
  Film,
  PlayCircle,
  Eye,
  Info,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface TargetMetrics {
  target_duration_min?: number;
  target_duration_max?: number;
  max_shot_duration?: number;
  target_asl_min?: number;
  target_asl_max?: number;
  min_cuts?: number;
  max_silence_gap?: number;
}

interface ExternalSource {
  name: string;
  name_th: string;
  url: string;
  category: string;
  description: string;
  description_th: string;
}

interface ExerciseData {
  id: string;
  lesson_id: string;
  title: string;
  type: string;
  instructions: string;
  folder_path: string;
  raw_footage_path: string;
  sample_solution_path: string;
  raw_footage_filename?: string;
  raw_footage_exists: boolean;
  sample_solution_exists: boolean;
  download_raw_url?: string;
  download_sample_url?: string;
  stream_raw_url?: string;
  external_sources?: ExternalSource[];
  target_metrics: TargetMetrics;
  checklist: string[];
}

export default function PracticeChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const exerciseId = resolvedParams.id;
  const router = useRouter();
  const { language, t } = useLanguage();

  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useSampleFile, setUseSampleFile] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [folderNotice, setFolderNotice] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"raw" | "sample">("raw");

  useEffect(() => {
    fetch(`/api/practice/${exerciseId}`)
      .then((res) => res.json())
      .then((data) => {
        setExercise(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch exercise:", err);
        setLoading(false);
      });
  }, [exerciseId]);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOpenFolder = async () => {
    try {
      const res = await fetch(`/api/practice/${exerciseId}/open-folder`, { method: "POST" });
      const data = await res.json();
      if (data.status === "opened") {
        setFolderNotice(language === "th" ? "เปิดโฟลเดอร์ใน Windows Explorer แล้ว" : "Opened practice folder in Windows Explorer.");
      } else {
        setFolderNotice(`Folder: ${data.path}`);
      }
      setTimeout(() => setFolderNotice(null), 4000);
    } catch {
      setFolderNotice(language === "th" ? "ไม่สามารถเปิดโฟลเดอร์อัตโนมัติได้" : "Could not trigger folder open automatically.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUseSampleFile(false);
      setErrorMsg(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !useSampleFile) {
      setErrorMsg(language === "th" ? "โปรดเลือกไฟล์วิดีโอที่ Export มา หรือกดใช้วิดีโอตัวอย่าง" : "Please select an exported video file or use the demo solution.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("exercise_id", exerciseId);

    if (useSampleFile && exercise?.sample_solution_path) {
      formData.append("local_path", exercise.sample_solution_path);
    } else if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Analysis failed");
      }

      const result = await res.json();
      router.push(`/feedback/${result.analysis_id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error analyzing video";
      setErrorMsg(msg);
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#2e7354] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-[#141f19]">Exercise Not Found</h2>
        <Link href="/" className="text-[#2e7354] text-sm mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const checklistItems = language === "th" ? [
    "ฮุก (Hook): มีภาพหรือเสียงที่ดึงดูดภายใน 3 วินาทีแรก",
    "ตัดช่วงหยุดพูดและ Dead air ที่นานเกิน 0.8 วินาทีออกทั้งหมด",
    "คุมช็อตคนพูดไม่ให้แช่นานเกิน 3.5 วินาทีโดยไม่มีการคัตหรือซูม",
    "ความยาววิดีโอที่ตัดเสร็จแล้วต้องอยู่ระหว่าง 20 ถึง 30 วินาที",
    "รักษาความชัดเจนและความต่อเนื่องของบทสนทนาอย่างเป็นธรรมชาติ"
  ] : exercise.checklist;

  const streamRawUrl = `/api/media/stream?path=practice/${exerciseId}/raw_footage.mp4`;
  const streamSampleUrl = `/api/media/stream?path=practice/${exerciseId}/sample_edited.mp4`;
  const activeStreamUrl = previewMode === "raw" ? streamRawUrl : streamSampleUrl;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Title Header Card */}
      <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#2e7354] uppercase mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>{t("practice_challenge_badge")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141f19] mb-1">
            {language === "th" ? "โจทย์ตัดต่อ: เพซซิ่ง #01 — Fast Talking Head" : exercise.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6d64] max-w-2xl">
            {language === "th"
              ? "ตัดทอนวิดีโอฟุตเทจดิบคนพูดที่มีให้ เหลือความยาว 20–30 วินาทีที่กระชับและน่าติดตาม ตัด Dead air ออก และคุมจังหวะให้ลื่นไหล"
              : exercise.instructions}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <a
            href={`/api/practice/${exerciseId}/download-raw`}
            download
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#163324] hover:bg-[#1e4230] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#7dd3a6]" />
            <span>{t("btn_download_raw")}</span>
          </a>

          <button
            onClick={handleOpenFolder}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f6faf7] text-[#141f19] text-xs font-semibold border border-[#dce5df] transition shadow-xs cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-[#2e7354]" />
            <span>{t("btn_open_folder")}</span>
          </button>
        </div>
      </div>

      {folderNotice && (
        <div className="p-3 rounded-xl bg-[#eef6f1] border border-[#cce8d7] text-[#163324] text-xs font-medium flex items-center justify-between">
          <span>{folderNotice}</span>
          <span className="text-[10px] font-mono text-[#2e7354]">{exercise.folder_path}</span>
        </div>
      )}

      {/* SECTION 1: Practice Assets & Source Footage Preview (HIGHLIGHTED) */}
      <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5ede7] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#2e7354]" />
              <h2 className="text-base font-bold text-[#141f19]">{t("practice_assets_title")}</h2>
            </div>
            <p className="text-xs text-[#5e6d64] mt-0.5">{t("practice_assets_sub")}</p>
          </div>

          {/* Toggle Raw vs Sample */}
          <div className="inline-flex rounded-xl bg-[#f0f5f2] p-1 border border-[#dce5df]">
            <button
              onClick={() => setPreviewMode("raw")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                previewMode === "raw"
                  ? "bg-white text-[#163324] shadow-xs font-bold"
                  : "text-[#5e6d64] hover:text-[#141f19]"
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{language === "th" ? "วิดีโอดิบ (Raw 40s)" : "Raw Footage (40s)"}</span>
            </button>
            <button
              onClick={() => setPreviewMode("sample")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                previewMode === "sample"
                  ? "bg-white text-[#163324] shadow-xs font-bold"
                  : "text-[#5e6d64] hover:text-[#141f19]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === "th" ? "วิดีโอตัวอย่างตัดเสร็จ (24s)" : "Sample Edit (24s)"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Video Player */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-video rounded-xl bg-[#0e1612] overflow-hidden border border-[#1b2b23] shadow-md group">
              <video
                key={activeStreamUrl}
                src={activeStreamUrl}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2.5 left-2.5 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wide uppercase bg-black/70 text-white backdrop-blur-xs border border-white/10">
                  {previewMode === "raw" ? t("raw_preview_badge") : "BENCHMARK SAMPLE SOLUTION (24s)"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#718278] font-mono px-1">
              <span>{previewMode === "raw" ? "raw_footage.mp4 (1080p • 25fps • AAC)" : "sample_edited.mp4 (1080p • 7 cuts)"}</span>
              <span>{previewMode === "raw" ? "~40 seconds" : "~24 seconds"}</span>
            </div>
          </div>

          {/* Quick Actions & Specs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-3">
              <div className="text-xs font-bold text-[#141f19] uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#2e7354]" />
                <span>{language === "th" ? "ข้อมูลไฟล์ Source" : "File Specifications"}</span>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 font-mono">
                <li className="flex justify-between">
                  <span className="text-[#718278]">{language === "th" ? "ชื่อไฟล์:" : "Filename:"}</span>
                  <span className="font-semibold text-[#141f19]">raw_footage.mp4</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#718278]">{language === "th" ? "ความยาวต้นฉบับ:" : "Original Length:"}</span>
                  <span className="font-semibold text-[#141f19]">40.0 วินาที</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#718278]">{language === "th" ? "โจทย์ความยาว:" : "Target Length:"}</span>
                  <span className="font-semibold text-[#2e7354]">20.0 – 30.0 วินาที</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#718278]">{language === "th" ? "รูปแบบ:" : "Format:"}</span>
                  <span className="font-semibold text-[#141f19]">MP4 (H.264 / AAC)</span>
                </li>
              </ul>
            </div>

            {/* Direct Downloads */}
            <div className="space-y-2">
              <a
                href={`/api/practice/${exerciseId}/download-raw`}
                download
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#eef6f1] hover:bg-[#e1f0e6] border border-[#cce8d7] text-[#163324] transition text-xs font-bold cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-[#2e7354]" />
                  <span>{t("btn_download_raw")}</span>
                </div>
                <span className="text-[10px] font-mono text-[#2e7354] uppercase bg-white px-2 py-0.5 rounded-md border border-[#cce8d7]">
                  ~375 KB
                </span>
              </a>

              <a
                href={`/api/practice/${exerciseId}/download-sample`}
                download
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-[#f6faf7] border border-[#dce5df] text-[#374151] transition text-xs font-medium cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-[#718278]" />
                  <span>{t("btn_download_sample")}</span>
                </div>
                <span className="text-[10px] font-mono text-[#718278] uppercase bg-[#f0f5f2] px-2 py-0.5 rounded-md">
                  ~250 KB
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Curated External Sources Section */}
        {exercise.external_sources && exercise.external_sources.length > 0 && (
          <div className="pt-4 border-t border-[#e5ede7] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider">
                  {t("external_sources_title")}
                </h3>
                <p className="text-[11px] text-[#718278]">{t("external_sources_sub")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {exercise.external_sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#fafbfa] hover:bg-[#f3f7f4] border border-[#e5ede7] hover:border-[#cbdad0] transition flex flex-col justify-between space-y-2 group cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase block">
                      {src.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#141f19] group-hover:text-[#2e7354] transition mt-0.5 line-clamp-1">
                      {language === "th" ? src.name_th : src.name}
                    </h4>
                    <p className="text-[11px] text-[#5e6d64] line-clamp-2 mt-1 leading-relaxed">
                      {language === "th" ? src.description_th : src.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#2e7354] font-semibold pt-1">
                    <span>{t("open_external")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Workflow & Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: DaVinci Guide + Target Metrics */}
        <div className="lg:col-span-6 space-y-6">
          {/* DaVinci Workflow */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2e7354]" />
              <span>{t("davinci_workflow_title")}</span>
            </h3>

            <ol className="space-y-3 text-xs text-[#4b5563]">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#eef6f1] text-[#163324] flex items-center justify-center font-mono font-bold shrink-0">
                  1
                </span>
                <span>{t("step_1")}</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#eef6f1] text-[#163324] flex items-center justify-center font-mono font-bold shrink-0">
                  2
                </span>
                <span>{t("step_2")}</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#eef6f1] text-[#163324] flex items-center justify-center font-mono font-bold shrink-0">
                  3
                </span>
                <span>{t("step_3")}</span>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#eef6f1] text-[#163324] flex items-center justify-center font-mono font-bold shrink-0">
                  4
                </span>
                <span>{t("step_4")}</span>
              </li>
            </ol>
          </div>

          {/* Checklist */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider">{t("checklist_title")}</h3>
            <div className="space-y-2.5">
              {checklistItems.map((item: string, idx: number) => {
                const isChecked = Boolean(checkedItems[idx]);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className="w-full text-left flex items-start gap-3 text-xs text-[#374151] hover:text-[#141f19] transition group cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-[#9ca3af] group-hover:text-[#6b7280] shrink-0 mt-0.5" />
                    )}
                    <span className={isChecked ? "line-through text-[#9ca3af]" : ""}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Metrics */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider">{t("benchmarks_title")}</h3>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("benchmark_duration")}</span>
                <span className="text-[#141f19] font-bold">
                  {exercise.target_metrics.target_duration_min}–{exercise.target_metrics.target_duration_max}
                  {language === "th" ? " วินาที" : "s"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("benchmark_hold")}</span>
                <span className="text-[#141f19] font-bold">
                  &le; {exercise.target_metrics.max_shot_duration}
                  {language === "th" ? " วินาที" : "s"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("benchmark_asl")}</span>
                <span className="text-[#141f19] font-bold">
                  {exercise.target_metrics.target_asl_min}–{exercise.target_metrics.target_asl_max}
                  {language === "th" ? " วินาที" : "s"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px]">{t("benchmark_silence")}</span>
                <span className="text-[#141f19] font-bold">
                  &le; {exercise.target_metrics.max_silence_gap}
                  {language === "th" ? " วินาที" : "s"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Dropzone */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] space-y-5 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-[#141f19]">{t("submit_video_title")}</h3>
              <p className="text-xs text-[#5e6d64] mt-1">{t("submit_video_sub")}</p>
            </div>

            {/* Quick Demo Pre-load Option */}
            {exercise.sample_solution_exists && (
              <div
                onClick={() => {
                  setUseSampleFile(true);
                  setSelectedFile(null);
                  setErrorMsg(null);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  useSampleFile
                    ? "bg-[#eef6f1] border-[#2e7354] text-[#163324]"
                    : "bg-[#fbfdfb] border-[#e2ebe4] text-[#4b5563] hover:border-[#cbdad0]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d8ece1] text-[#163324] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#141f19]">{t("use_demo_title")}</div>
                    <div className="text-[11px] text-[#718278]">{t("use_demo_sub")}</div>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-full ${
                    useSampleFile ? "bg-[#163324] text-white font-bold" : "bg-[#edf2ee] text-[#5e6d64]"
                  }`}
                >
                  {useSampleFile ? t("btn_selected") : t("btn_select")}
                </span>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
              className={`p-8 rounded-2xl border-2 border-dashed text-center transition ${
                selectedFile
                  ? "bg-[#f4faf6] border-[#2e7354]"
                  : "bg-[#fbfdfb] border-[#d8e3dc] hover:border-[#a8c2b1]"
              }`}
            >
              <input
                type="file"
                id="video-upload"
                accept=".mp4,.mov,.m4v"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <FileVideo className="w-10 h-10 text-[#2e7354] mx-auto" />
                  <div className="text-sm font-bold text-[#141f19]">{selectedFile.name}</div>
                  <div className="text-xs text-[#718278] font-mono">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  <label
                    htmlFor="video-upload"
                    className="inline-block mt-2 text-xs font-semibold text-[#2e7354] hover:underline cursor-pointer"
                  >
                    {t("btn_change_file")}
                  </label>
                </div>
              ) : (
                <label htmlFor="video-upload" className="cursor-pointer block space-y-2">
                  <UploadCloud className="w-10 h-10 text-[#8a9990] mx-auto" />
                  <div className="text-sm font-semibold text-[#141f19]">
                    {t("upload_drag_title")}
                  </div>
                  <div className="text-xs text-[#718278]">{t("upload_drag_sub")}</div>
                </label>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={analyzing || (!selectedFile && !useSampleFile)}
              className={`w-full py-3.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-xs ${
                analyzing
                  ? "bg-[#2e7354]/60 text-white cursor-wait"
                  : selectedFile || useSampleFile
                  ? "bg-[#163324] hover:bg-[#1e4230] text-white cursor-pointer"
                  : "bg-[#e5ede7] text-[#8a9990] cursor-not-allowed"
              }`}
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("analyzing_pipeline")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t("btn_analyze_my_edit")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
