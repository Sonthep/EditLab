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
  ChevronDown,
  ListFilter,
  Check,
  ChevronRight,
  Laptop,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { EXERCISE_TRANSLATIONS_TH } from "@/lib/curriculumTranslations";
import SafeZoneOverlay, { SafeZoneMode, SafeZoneToolbar } from "@/components/SafeZoneOverlay";

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
  module_id?: string;
  module_title?: string;
  module_number?: number;
}

interface ChallengeListItem {
  id: string;
  lesson_id: string;
  title: string;
  module_id?: string;
  module_title?: string;
  module_number?: number;
  skill?: string;
  difficulty?: string;
}

export default function PracticeChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const exerciseId = resolvedParams.id;
  const router = useRouter();
  const { language, t } = useLanguage();

  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [allExercises, setAllExercises] = useState<ChallengeListItem[]>([]);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useSampleFile, setUseSampleFile] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [folderNotice, setFolderNotice] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"raw" | "sample">("raw");
  const [selectedSoftware, setSelectedSoftware] = useState<"davinci" | "capcut">("davinci");
  const [safeZoneMode, setSafeZoneMode] = useState<SafeZoneMode>("none");

  useEffect(() => {
    // Fetch exercise detail
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

    // Fetch list of all exercises for challenge switcher
    fetch("/api/practice")
      .then((res) => res.json())
      .then((data) => {
        if (data.exercises) {
          setAllExercises(data.exercises);
        }
      })
      .catch((err) => console.error("Failed to fetch exercises list:", err));
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

  const thData = EXERCISE_TRANSLATIONS_TH[exerciseId];
  const displayTitle = language === "th" && thData ? thData.title : exercise.title;
  const displayInstructions = language === "th" && thData ? thData.instructions : exercise.instructions;
  const checklistItems = language === "th" && thData ? thData.checklist : exercise.checklist;

  const streamRawUrl = `/api/media/stream?path=practice/${exerciseId}/raw_footage.mp4`;
  const streamSampleUrl = `/api/media/stream?path=practice/${exerciseId}/sample_edited.mp4`;
  const activeStreamUrl = previewMode === "raw" ? streamRawUrl : streamSampleUrl;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Title Header Card */}
      <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#2e7354] uppercase">
              <Target className="w-3.5 h-3.5" />
              <span>{t("practice_challenge_badge")}</span>
            </div>

            {/* Challenge Switcher Dropdown */}
            {allExercises.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowSwitcher(!showSwitcher)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eef6f1] hover:bg-[#e1f0e6] text-[#163324] text-[11px] font-bold border border-[#cce8d7] transition cursor-pointer"
                >
                  <ListFilter className="w-3 h-3 text-[#2e7354]" />
                  <span>
                    {language === "th"
                      ? `สลับโจทย์ฝึก (${allExercises.length})`
                      : `Switch Challenge (${allExercises.length})`}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#2e7354]" />
                </button>

                {showSwitcher && (
                  <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#dce5df] shadow-xl p-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[#718278] border-b border-[#eef2ef] mb-1">
                      {language === "th" ? "เลือกโจทย์ฝึกซ้อมตัดต่อ (10 หมวด)" : "Select Practice Challenge (10 Modules)"}
                    </div>
                    {allExercises.map((item, idx) => {
                      const isCurrent = item.id === exerciseId;
                      const itemTh = EXERCISE_TRANSLATIONS_TH[item.id];
                      const itemTitle = language === "th" && itemTh ? itemTh.title : item.title;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setShowSwitcher(false);
                            if (!isCurrent) {
                              router.push(`/practice/${item.id}`);
                            }
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start gap-2.5 cursor-pointer ${
                            isCurrent
                              ? "bg-[#eef6f1] text-[#163324] font-bold"
                              : "hover:bg-[#f6faf7] text-[#374151]"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white border border-[#dce5df] text-[10px] flex items-center justify-center font-mono shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs truncate">{itemTitle}</div>
                            <div className="text-[10px] text-[#718278] font-mono">
                              {item.skill?.toUpperCase()} • {item.difficulty}
                            </div>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-[#2e7354] shrink-0 mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141f19] mb-1">
            {displayTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6d64] max-w-2xl leading-relaxed">
            {displayInstructions}
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
              <span>{language === "th" ? "วิดีโอดิบ (Raw)" : "Raw Footage"}</span>
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
              <span>{language === "th" ? "วิดีโอตัวอย่างตัดเสร็จ" : "Sample Solution"}</span>
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

              {/* Safe Zone Overlay */}
              <SafeZoneOverlay mode={safeZoneMode} onModeChange={setSafeZoneMode} />

              <div className="absolute top-2.5 left-2.5 pointer-events-none z-30">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wide uppercase bg-black/70 text-white backdrop-blur-xs border border-white/10">
                  {previewMode === "raw" ? t("raw_preview_badge") : "BENCHMARK SAMPLE SOLUTION"}
                </span>
              </div>

              {/* Top-right Safe Zone Toolbar */}
              <div className="absolute top-2.5 right-2.5 z-30 opacity-90 hover:opacity-100 transition">
                <SafeZoneToolbar mode={safeZoneMode} onModeChange={setSafeZoneMode} />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#718278] font-mono px-1">
              <span>{previewMode === "raw" ? "raw_footage.mp4 (1080p • 25fps • AAC)" : "sample_edited.mp4 (1080p edit)"}</span>
              <span>
                {previewMode === "raw"
                  ? `${exercise.target_metrics.target_duration_max ? exercise.target_metrics.target_duration_max + 10 : 40}s raw`
                  : `${exercise.target_metrics.target_duration_min || 20}s edit`}
              </span>
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
                  <span className="text-[#718278]">{language === "th" ? "โจทย์ความยาว:" : "Target Length:"}</span>
                  <span className="font-semibold text-[#2e7354]">
                    {exercise.target_metrics.target_duration_min}–{exercise.target_metrics.target_duration_max}
                    {language === "th" ? " วินาที" : "s"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#718278]">{language === "th" ? "เกณฑ์คัตขั้นต่ำ:" : "Min Cuts:"}</span>
                  <span className="font-semibold text-[#141f19]">{exercise.target_metrics.min_cuts || 5} cuts</span>
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
                  MP4
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
                  SAMPLE
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
          {/* Software Workflow Guide (DaVinci 19 & CapCut Desktop) */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f0f4f1]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2e7354]" />
                <span className="text-xs font-bold text-[#141f19] uppercase tracking-wider">
                  {selectedSoftware === "davinci" ? t("davinci_workflow_title") : t("capcut_workflow_title")}
                </span>
              </div>
              <div className="inline-flex rounded-lg bg-[#f0f5f2] p-0.5 border border-[#e0eae3]">
                <button
                  type="button"
                  onClick={() => setSelectedSoftware("davinci")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    selectedSoftware === "davinci"
                      ? "bg-white text-[#163324] shadow-xs"
                      : "text-[#5e6d64] hover:text-[#141f19]"
                  }`}
                >
                  DaVinci 19
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSoftware("capcut")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    selectedSoftware === "capcut"
                      ? "bg-white text-[#163324] shadow-xs"
                      : "text-[#5e6d64] hover:text-[#141f19]"
                  }`}
                >
                  CapCut Desktop
                </button>
              </div>
            </div>

            {selectedSoftware === "davinci" ? (
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
            ) : (
              <ol className="space-y-3 text-xs text-[#4b5563]">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#eef6f1] text-[#163324] flex items-center justify-center font-mono font-bold shrink-0">
                    1
                  </span>
                  <span>{t("capcut_step_1")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#eef6f1] text-[#163324] flex items-center justify-center font-mono font-bold shrink-0">
                    2
                  </span>
                  <span>{t("capcut_step_2")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#eef6f1] text-[#163324] flex items-center justify-center font-mono font-bold shrink-0">
                    3
                  </span>
                  <span>{t("capcut_step_3")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#eef6f1] text-[#163324] flex items-center justify-center font-mono font-bold shrink-0">
                    4
                  </span>
                  <span>{t("capcut_step_4")}</span>
                </li>
              </ol>
            )}

            <div className="pt-2 border-t border-[#f0f4f1] flex items-center justify-between">
              <span className="text-[11px] text-[#718278]">
                {selectedSoftware === "davinci" ? "DaVinci Resolve 19 (Free/Studio)" : "CapCut Desktop v4+"}
              </span>
              <Link
                href={`/guides?software=${selectedSoftware}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#2e7354] hover:text-[#163324] font-semibold transition"
              >
                <span>{t("btn_view_full_guide")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
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
