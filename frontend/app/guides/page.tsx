"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Laptop,
  Sparkles,
  Command,
  Scissors,
  Layers,
  Volume2,
  ZoomIn,
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Target,
  FileVideo,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function SoftwareGuidesPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"davinci" | "capcut">("davinci");

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#2e7354] uppercase mb-1">
            <Laptop className="w-3.5 h-3.5" />
            <span>
              {language === "th"
                ? "คู่มือการใช้งานและคีย์ลัดโปรแกรมตัดต่อ"
                : "SOFTWARE TUTORIALS & CHEATSHEETS"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141f19] mb-1">
            {language === "th"
              ? "คู่มือพื้นฐาน: DaVinci Resolve 19 & CapCut Desktop"
              : "Master Your Software: DaVinci Resolve 19 & CapCut Desktop"}
          </h1>
          <p className="text-xs sm:text-sm text-[#5e6d64] max-w-2xl leading-relaxed">
            {language === "th"
              ? "ขั้นตอนการตัดต่อจริง คีย์ลัดเร่งสปีด และเทคนิคการตั้งค่าโปรเจกต์สำหรับนำฟุตเทจดิบของ EditLab ไปฝึกตัดต่อแล้วส่งกลับมาตรวจ"
              : "Practical editing workflows, speed shortcuts, and project setup guides to practice with EditLab footage and submit for AI coaching."}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="inline-flex rounded-xl bg-[#f0f5f2] p-1.5 border border-[#dce5df] shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("davinci")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "davinci"
                ? "bg-[#163324] text-white shadow-xs"
                : "text-[#5e6d64] hover:text-[#141f19]"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
            <span>DaVinci Resolve 19</span>
          </button>
          <button
            onClick={() => setActiveTab("capcut")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "capcut"
                ? "bg-[#163324] text-white shadow-xs"
                : "text-[#5e6d64] hover:text-[#141f19]"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]"></span>
            <span>CapCut Desktop</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DAVINCI RESOLVE 19 GUIDE                                                  */}
      {/* ========================================================================= */}
      {activeTab === "davinci" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Version Info & Spec */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center font-bold text-base shrink-0 border border-[#fed7aa]">
                DVR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#141f19]">DaVinci Resolve 19.x</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#eef6f1] text-[#144d2d] uppercase">
                    {language === "th" ? "เวอร์ชันฟรี & Studio" : "Free & Studio"}
                  </span>
                </div>
                <p className="text-xs text-[#5e6d64] mt-1">
                  {language === "th"
                    ? "โปรแกรมตัดต่อมาตรฐานฮอลลีวูด โดดเด่นด้านระบบ Edit Page, การเกลี่ยสี Color Grading, และ Fairlight Audio"
                    : "Hollywood-standard NLE known for high-precision Edit Page, industry-leading Color grading, and Fairlight sound."}
                </p>
              </div>
            </div>

            <a
              href="https://www.blackmagicdesign.com/products/davinciresolve"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fafbfa] hover:bg-[#f3f7f4] text-[#141f19] text-xs font-semibold border border-[#dce5df] transition shrink-0 cursor-pointer"
            >
              <span>{language === "th" ? "เว็บไซต์ Blackmagic" : "Official Website"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#2e7354]" />
            </a>
          </div>

          {/* Section 1: Keyboard Shortcuts Cheatsheet */}
          <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Command className="w-4 h-4 text-[#2e7354]" />
              <h2 className="text-sm font-bold text-[#141f19] uppercase tracking-wider">
                {language === "th" ? "คีย์ลัดสำคัญที่ต้องรู้ (Essential Shortcuts)" : "Essential Shortcuts Cheatsheet"}
              </h2>
            </div>
            <p className="text-xs text-[#5e6d64]">
              {language === "th"
                ? "คีย์ลัดเหล่านี้จะช่วยให้คุณตัดงานเสร็จเร็วกว่าการใช้เมาส์คลิกถึง 3 เท่า โดยเฉพาะการใช้ Q และ W ในการตัด Dead air"
                : "Mastering these shortcuts will speed up your editing by 3x, especially using Q and W to trim dead air."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Q
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">Ripple Cut Head</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ตัดส่วนหน้าทิ้งอัตโนมัติ" : "Ripple Start to Playhead"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ตัดคลิปจากจุดเริ่มช็อตจนถึงตำแหน่งหัวอ่าน พร้อมดูดคลิปเข้ามาต่อทันที"
                    : "Trims start of clip to playhead and closes the gap instantly."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    W
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">Ripple Cut Tail</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ตัดส่วนหลังทิ้งอัตโนมัติ" : "Ripple End to Playhead"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ตัดคลิปจากตำแหน่งหัวอ่านจนถึงท้ายช็อต แล้วดูดคลิปถัดไปเข้ามาชนทันที"
                    : "Trims from playhead to end of clip and snaps next clip forward."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Ctrl + B
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">Split Razor</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ตัดแบ่งช็อตตรงหัวอ่าน" : "Razor Blade at Playhead"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ฟันดาบแยกคลิป ณ จุดที่หัวอ่านตั้งอยู่ทันทีโดยไม่ต้องสลับเครื่องมือ"
                    : "Splits the clip at current playhead position without switching tools."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Shift + Backspace
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">Ripple Delete</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ลบคลิปพร้อมดูดช่องว่าง" : "Ripple Delete Clip"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ลบคลิปที่เลือกทิ้ง และดึงคลิปด้านหลังทั้งหมดมาปิดรอยต่อ ไม่ให้เกิดช่องว่างสีดำ"
                    : "Deletes selected clip and closes the resulting gap automatically."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Alt + Scroll / Ctrl + =
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">Timeline Zoom</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ซูมดูรูปคลื่นเสียง" : "Timeline Waveform Zoom"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ขยายไทม์ไลน์เพื่อเห็นจังหวะหยุดพูด (Dead air) และเสียงเอ่ออ่าได้อย่างแม่นยำ"
                    : "Zoom in to spot micro dead air silences and speech pauses clearly."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    B / A
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">Tool Switch</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "สลับเครื่องมือ Blade / Arrow" : "Blade / Selection Tool"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "กด B เพื่อเลือกใบมีดฟันคลิป และกด A เพื่อกลับสู่โหมดลูกศรเลือกปกติ"
                    : "Press B for Blade tool, press A to return to standard Selection mode."}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Step-by-Step Practical Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Project Setup */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef6f1] text-[#163324] font-bold text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <h3 className="text-sm font-bold text-[#141f19]">
                  {language === "th" ? "การตั้งค่าโปรเจกต์และสัดส่วนภาพ" : "Project Setup & Canvas Ratio"}
                </h3>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "เปิด DaVinci Resolve กดปุ่ม 'New Project' แล้วไปที่หน้า Edit Page (ไอคอนรูปฟิล์มด้านล่าง)"
                      : "Open DaVinci Resolve, click 'New Project', then navigate to the Edit Page tab at the bottom."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "คลิกฟันเฟืองมุมขวาล่าง (Project Settings) > Master Settings: ตั้งความละเอียดเป็น 1920x1080 (16:9) หรือติ๊ก 'Use vertical resolution' เพื่อทำ 1080x1920 (9:16 สำหรับ Shorts/Reels)"
                      : "Click the Settings Gear (bottom right) > Master Settings: set timeline resolution to 1920x1080 or check 'Use vertical resolution' for 9:16 Shorts."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Step 2: Trimming Dead Air */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef6f1] text-[#163324] font-bold text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <h3 className="text-sm font-bold text-[#141f19]">
                  {language === "th" ? "เทคนิคตัด Dead Air ใน 1 คลิกด้วย Q & W" : "Speed Trimming with Q & W"}
                </h3>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "ลากไฟล์ raw_footage.mp4 ลง Timeline กดซูมรูปคลื่นเสียง (Waveform)"
                      : "Drag raw_footage.mp4 into the timeline. Zoom in to clearly inspect dialogue waveforms."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "เมื่อผู้พูดหยุดพูดหรือเกิดช่วง Dead air: เลื่อนหัวอ่านไปที่จุดสิ้นสุดประโยคแล้วกด W หรือเลื่อนไปต้นประโยคถัดไปแล้วกด Q เพื่อดูดรอยต่อให้ชิดกันทันที"
                      : "When dead air occurs: move playhead to the end of speech and press W, or move to the next syllable and press Q to ripple trim."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Step 3: B-Roll & J-Cut */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef6f1] text-[#163324] font-bold text-xs flex items-center justify-center font-mono">
                  3
                </span>
                <h3 className="text-sm font-bold text-[#141f19]">
                  {language === "th" ? "การใส่ภาพ B-Roll และทำเสียง J-Cut" : "Layering B-Roll & Audio J-Cuts"}
                </h3>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "วางคลิปคนพูดไว้ที่ Track V1/A1 แล้วลากคลิปภาพประกอบ B-roll วางบน Track V2 ทับช่วงที่มีรอยต่อ Jump cut"
                      : "Keep dialogue on V1/A1. Drag B-roll cutaway footage onto Track V2 to seamlessly cover Jump cuts."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "ทำ J-Cut: กดปุ่ม Alt ค้างไว้แล้วลากขอบเสียงของช็อตถัดไปให้เริ่มก่อนภาพประมาณ 0.3–0.5 วินาที ทำให้เสียงนำภาพอย่างลื่นไหล"
                      : "Create J-Cuts: Hold Alt and drag the incoming audio clip edge 0.3–0.5s ahead of the video cut."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Step 4: Punch Zoom */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef6f1] text-[#163324] font-bold text-xs flex items-center justify-center font-mono">
                  4
                </span>
                <h3 className="text-sm font-bold text-[#141f19]">
                  {language === "th" ? "การทำ Punch Zoom (เน้นคำสำคัญ)" : "Punch Zoom in Inspector"}
                </h3>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "ตัดแยกคลิป (Ctrl+B) ตรงคำสำคัญหรือประโยคที่ต้องการเน้น จากนั้นคลิกเลือกคลิปนั้น"
                      : "Split clip (Ctrl+B) on the high-impact sentence or punchline, then select it."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "เปิดหน้าต่าง Inspector (มุมขวาบน) > Video > Transform: ปรับค่า Zoom X และ Y เป็น 1.15 ถึง 1.20 โดยปรับ Position Y ให้อยู่ระดับสายตา"
                      : "Open Inspector (top right) > Video > Transform: set Zoom X/Y to 1.15–1.20 and adjust Position Y so eyes stay centered."}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 5: Export Settings for EditLab */}
          <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#2e7354]" />
              <h2 className="text-sm font-bold text-[#141f19] uppercase tracking-wider">
                {language === "th" ? "การตั้งค่า Export ส่งตรวจใน EditLab" : "Deliver / Export Settings for EditLab"}
              </h2>
            </div>
            <p className="text-xs text-[#5e6d64]">
              {language === "th"
                ? "ไปที่หน้า Deliver (ไอคอนรูปจรวดด้านล่างสุด) และตั้งค่าตามนี้เพื่อให้ระบบ FFmpeg ของ EditLab วิเคราะห์ได้อย่างรวดเร็วและแม่นยำ:"
                : "Navigate to the Deliver Page (rocket icon at the bottom) and use these settings for optimal EditLab analysis:"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px] uppercase">Format</span>
                <span className="text-[#141f19] font-bold">MP4</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px] uppercase">Video Codec</span>
                <span className="text-[#141f19] font-bold">H.264</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px] uppercase">Resolution</span>
                <span className="text-[#141f19] font-bold">1920x1080 (HD)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px] uppercase">Audio</span>
                <span className="text-[#141f19] font-bold">AAC • 48 kHz</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CAPCUT DESKTOP GUIDE                                                      */}
      {/* ========================================================================= */}
      {activeTab === "capcut" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Version Info & Spec */}
          <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#ecfeff] text-[#0891b2] flex items-center justify-center font-bold text-base shrink-0 border border-[#a5f3fc]">
                CAP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#141f19]">CapCut Desktop (PC / Mac)</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#eef6f1] text-[#144d2d] uppercase">
                    {language === "th" ? "เวอร์ชันปัจจุบัน" : "Latest Version"}
                  </span>
                </div>
                <p className="text-xs text-[#5e6d64] mt-1">
                  {language === "th"
                    ? "โปรแกรมตัดต่อยอดนิยมสำหรับ Short-form วิดีโอ ตัดต่อไว มีระบบ Auto Captions, Overlay แทร็กแยก, และเอฟเฟกต์สำเร็จรูป"
                    : "Fastest-growing NLE for short-form creators with auto captions, overlay tracks, and instant speed trimming."}
                </p>
              </div>
            </div>

            <a
              href="https://www.capcut.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fafbfa] hover:bg-[#f3f7f4] text-[#141f19] text-xs font-semibold border border-[#dce5df] transition shrink-0 cursor-pointer"
            >
              <span>{language === "th" ? "เว็บไซต์ CapCut" : "Official Website"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#2e7354]" />
            </a>
          </div>

          {/* Section 1: Keyboard Shortcuts Cheatsheet */}
          <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Command className="w-4 h-4 text-[#2e7354]" />
              <h2 className="text-sm font-bold text-[#141f19] uppercase tracking-wider">
                {language === "th" ? "คีย์ลัดสำคัญใน CapCut Desktop" : "CapCut Desktop Essential Shortcuts"}
              </h2>
            </div>
            <p className="text-xs text-[#5e6d64]">
              {language === "th"
                ? "ใช้คีย์ลัดเหล่านี้เพื่อตัดต่อวิดีโอสั้น TikTok, Reels และ Shorts ได้อย่างรวดเร็วเป็นพิเศษ"
                : "Speed shortcuts to edit TikTok, Reels, and Shorts at high velocity on PC and Mac."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Ctrl + B
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#0891b2] uppercase">Split Clip</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ตัดแยกคลิป (Split)" : "Split Clip at Playhead"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ตัดแบ่งวิดีโอตรงตำแหน่งหัวอ่านทันที (Mac ใช้ Cmd + B)"
                    : "Instantly split video clip at the playhead cursor (Cmd+B on Mac)."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Delete / Backspace
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#0891b2] uppercase">Ripple Delete</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ลบและดูดช่องว่างอัตโนมัติ" : "Delete & Close Gap"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ลบคลิปที่เลือกทิ้ง โดยแม่เหล็ก (Magnet) จะดูดคลิปถัดไปมาชิดให้อัตโนมัติ"
                    : "Deletes selected segment and auto-snaps adjacent clips together."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Q / W
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#0891b2] uppercase">Trim Head / Tail</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ตัดหัวช็อต (Q) / ตัดท้ายช็อต (W)" : "Trim Left (Q) / Right (W)"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ตัดทอนส่วนเกินทางซ้ายหรือขวาของคลิปถึงหัวอ่านในคลิกเดียว"
                    : "Trims the left or right side of clip up to playhead."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Ctrl + Scroll
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#0891b2] uppercase">Timeline Zoom</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "ซูมดูรูปคลื่นเสียงใน CapCut" : "Waveform Zoom In/Out"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "หมุนลูกกลิ้งเมาส์พร้อมกด Ctrl เพื่อขยายดูจังหวะหยุดพูด (Dead air)"
                    : "Quickly zoom in and out of the timeline to see speech pauses."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    P / V
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#0891b2] uppercase">Magnet & Snap</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "เปิด/ปิด แม่เหล็กและ Snapping" : "Toggle Magnet & Snapping"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "ควบคุมให้คลิปเกาะติดกันอัตโนมัติ ไม่ให้เกิดช่องว่างสีดำระหว่างคัต"
                    : "Ensures clips snap together cleanly without leaving 1-frame gaps."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#cbdad0] text-[#163324] shadow-2xs">
                    Space
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#0891b2] uppercase">Play / Pause</span>
                </div>
                <div className="text-xs font-bold text-[#141f19]">
                  {language === "th" ? "เล่นและหยุดวิดีโอ" : "Play and Pause Preview"}
                </div>
                <div className="text-[11px] text-[#5e6d64] leading-relaxed">
                  {language === "th"
                    ? "เคาะ Spacebar เพื่อฟังจังหวะคำพูดและประเมินเพซซิ่งแบบเรียลไทม์"
                    : "Tap spacebar to preview rhythm and pacing."}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Step-by-Step Practical Workflow in CapCut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Canvas Ratio */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef6f1] text-[#163324] font-bold text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <h3 className="text-sm font-bold text-[#141f19]">
                  {language === "th" ? "การตั้งสัดส่วนวิดีโอ (Ratio 9:16 หรือ 16:9)" : "Set Canvas Ratio (9:16 or 16:9)"}
                </h3>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "เปิด CapCut Desktop กด 'New Project' จากนั้นกดเมนู 'Ratio' ใต้จอพรีวิว เลือก 9:16 (แนวตั้งสำหรับ TikTok/Reels) หรือ 16:9 (แนวนอนมาตรฐาน)"
                      : "Click 'New Project', then click the 'Ratio' dropdown directly below the preview player. Choose 9:16 (Vertical) or 16:9 (Horizontal)."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "ลากไฟล์ raw_footage.mp4 จากโฟลเดอร์หรือหน้าต่าง Media ลงมาบนไทม์ไลน์หลัก"
                      : "Drag raw_footage.mp4 into the main timeline track."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Step 2: Cutting Dead Air */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef6f1] text-[#163324] font-bold text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <h3 className="text-sm font-bold text-[#141f19]">
                  {language === "th" ? "การตัด Dead Air และช่วงหยุดพูด" : "Trimming Dead Air Pauses"}
                </h3>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "กด Ctrl+Mouse Scroll เพื่อขยายดูภูเขารูปคลื่นเสียง สังเกตช่วงที่เป็นเส้นตรงแบน (ไม่มีเสียงพูดเกิน 0.6 วินาที)"
                      : "Zoom timeline with Ctrl+Scroll to inspect speech waveforms. Look for flat silence gaps longer than 0.6 seconds."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "กด Ctrl+B ตรงจุดเริ่มเงียบ และกด Ctrl+B อีกครั้งตรงจุดเริ่มประโยคถัดไป จากนั้นกด Delete เพื่อลบช่วงเงียบทิ้งทันที"
                      : "Press Ctrl+B at the start of pause and Ctrl+B at next word, then press Delete to snap dialogue together."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Step 3: Overlay B-Roll */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef6f1] text-[#163324] font-bold text-xs flex items-center justify-center font-mono">
                  3
                </span>
                <h3 className="text-sm font-bold text-[#141f19]">
                  {language === "th" ? "การวางภาพ B-Roll ซ้อนแทร็ก Overlay" : "Overlaying B-Roll on Track 2"}
                </h3>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "ลากคลิป B-roll วางบนแทร็กด้านบนของคลิปคนพูด (Track Overlay) ตรงจุดที่มีรอยต่อ Jump cut เพื่อปิดบังรอยตัด"
                      : "Drag B-roll clips onto the upper track above dialogue to cover jump cuts and illustrate speech."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "ปรับความยาวช็อต B-roll ให้อยู่ระหว่าง 1.5 ถึง 3.0 วินาที เพื่อให้ผู้ชมเข้าใจภาพและไม่บดบังผู้พูดนานเกินไป"
                      : "Hold B-roll duration for 1.5–3.0 seconds so viewers grasp visual context without losing dialogue focus."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Step 4: Punch Zoom */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef6f1] text-[#163324] font-bold text-xs flex items-center justify-center font-mono">
                  4
                </span>
                <h3 className="text-sm font-bold text-[#141f19]">
                  {language === "th" ? "การทำ Punch Zoom ด้วย Scale ใน CapCut" : "Punch Zoom via Video Scale"}
                </h3>
              </div>
              <ul className="text-xs text-[#4b5563] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "กด Ctrl+B ตัดแยกช่วงคำพูดสำคัญ จากนั้นคลิกที่ช็อตนั้น"
                      : "Split (Ctrl+B) around the keyword, punchline, or emotional pivot, then click that clip."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2e7354] shrink-0 mt-0.5" />
                  <span>
                    {language === "th"
                      ? "ไปที่แผงควบคุมด้านขวาบน > แถบ Video > Basic: ปรับ Scale จาก 100% เป็น 115%–120% เพื่อซูมเจาะใบหน้าผู้พูด"
                      : "On the top-right inspector > Video > Basic: increase Scale from 100% to 115%–120% to punch in on speaker."}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 5: Export Settings in CapCut */}
          <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#2e7354]" />
              <h2 className="text-sm font-bold text-[#141f19] uppercase tracking-wider">
                {language === "th" ? "การตั้งค่า Export ใน CapCut Desktop" : "CapCut Desktop Export Settings"}
              </h2>
            </div>
            <p className="text-xs text-[#5e6d64]">
              {language === "th"
                ? "กดปุ่ม 'Export' สีฟ้ามุมขวาบน แล้วตั้งค่าตามคำแนะนำนี้ก่อนนำไฟล์มาส่งใน EditLab:"
                : "Click the blue 'Export' button in the top right corner and verify these settings:"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px] uppercase">Format</span>
                <span className="text-[#141f19] font-bold">MP4</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px] uppercase">Resolution</span>
                <span className="text-[#141f19] font-bold">1080P</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px] uppercase">Bitrate</span>
                <span className="text-[#141f19] font-bold">Higher / Standard</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e5ede7]">
                <span className="text-[#718278] block text-[10px] uppercase">Codec</span>
                <span className="text-[#141f19] font-bold">H.264</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Free Assets & SFX Libraries */}
      <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5ede7] pb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#2e7354]" />
            <h3 className="text-sm font-bold text-[#141f19]">
              {language === "th"
                ? "คลังซาวด์เอฟเฟกต์ & ฟุตเทจฟรีแนะนำสำหรับฝึกตัดต่อ"
                : "Curated Free Sound Effects & Stock Resources"}
            </h3>
          </div>
          <span className="text-[11px] text-[#718278] font-mono">
            {language === "th" ? "คลังเสียงและฟุตเทจปลอดลิขสิทธิ์" : "Royalty-free & Creative Commons"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* MyInstants Thailand */}
          <a
            href="https://www.myinstants.com/en/index/th/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#fafbfa] hover:bg-[#f3f7f4] border border-[#e5ede7] hover:border-[#cbdad0] transition flex flex-col justify-between space-y-2 group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">
                  Meme SFX & Soundboard
                </span>
                <ExternalLink className="w-3 h-3 text-[#718278] group-hover:text-[#2e7354] transition" />
              </div>
              <h4 className="text-xs font-bold text-[#141f19] group-hover:text-[#2e7354] transition mt-1 line-clamp-1">
                {language === "th" ? "MyInstants: ซาวด์มีมไทย & ตบมุก" : "MyInstants: Thai SFX Soundboard"}
              </h4>
              <p className="text-[11px] text-[#5e6d64] line-clamp-2 mt-1 leading-relaxed">
                {language === "th"
                  ? "คลังเสียงตบมุก แป่ว เป๊ง ตึ่งโป๊ะ เสียงช็อตฟีล และมีมสุดฮิตสำหรับงานตัดต่อสไตล์สนุกสนาน"
                  : "Trending comedy sound effects, punchline stingers, meme sounds, and alert SFX."}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#2e7354] flex items-center gap-1 font-semibold">
              myinstants.com/en/index/th/ ↗
            </span>
          </a>

          {/* Pixabay SFX */}
          <a
            href="https://pixabay.com/sound-effects/search/whoosh/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#fafbfa] hover:bg-[#f3f7f4] border border-[#e5ede7] hover:border-[#cbdad0] transition flex flex-col justify-between space-y-2 group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">
                  Transitions & Cuts
                </span>
                <ExternalLink className="w-3 h-3 text-[#718278] group-hover:text-[#2e7354] transition" />
              </div>
              <h4 className="text-xs font-bold text-[#141f19] group-hover:text-[#2e7354] transition mt-1 line-clamp-1">
                {language === "th" ? "Pixabay: เสียง Whoosh & Pop" : "Pixabay: Whoosh & Pop SFX"}
              </h4>
              <p className="text-[11px] text-[#5e6d64] line-clamp-2 mt-1 leading-relaxed">
                {language === "th"
                  ? "เสียง Whoosh, Swoosh, Pop เสริมจังหวะคัตและ Punch Zoom ให้น่าติดตาม"
                  : "Essential swoosh, riser, and pop sound effects to emphasize cuts and punch zooms."}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#2e7354] flex items-center gap-1 font-semibold">
              pixabay.com ↗
            </span>
          </a>

          {/* Mixkit B-Roll */}
          <a
            href="https://mixkit.co/free-stock-video/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#fafbfa] hover:bg-[#f3f7f4] border border-[#e5ede7] hover:border-[#cbdad0] transition flex flex-col justify-between space-y-2 group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">
                  B-Roll Cutaways
                </span>
                <ExternalLink className="w-3 h-3 text-[#718278] group-hover:text-[#2e7354] transition" />
              </div>
              <h4 className="text-xs font-bold text-[#141f19] group-hover:text-[#2e7354] transition mt-1 line-clamp-1">
                {language === "th" ? "Mixkit: ภาพตัดแทรก B-Roll" : "Mixkit: Free B-Roll Videos"}
              </h4>
              <p className="text-[11px] text-[#5e6d64] line-clamp-2 mt-1 leading-relaxed">
                {language === "th"
                  ? "คลิปภาพคั่นฉากสวยๆ คมชัด ใช้แทรกคั่นคำพูดและซ่อนรอยต่อช็อต Jump Cut"
                  : "Cinematic cutaways to insert over dialogue cuts and cover jump cuts seamlessly."}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#2e7354] flex items-center gap-1 font-semibold">
              mixkit.co ↗
            </span>
          </a>

          {/* Pexels Video */}
          <a
            href="https://www.pexels.com/search/videos/talking%20head/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-[#fafbfa] hover:bg-[#f3f7f4] border border-[#e5ede7] hover:border-[#cbdad0] transition flex flex-col justify-between space-y-2 group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#2e7354] uppercase">
                  A-Roll Dialogue
                </span>
                <ExternalLink className="w-3 h-3 text-[#718278] group-hover:text-[#2e7354] transition" />
              </div>
              <h4 className="text-xs font-bold text-[#141f19] group-hover:text-[#2e7354] transition mt-1 line-clamp-1">
                {language === "th" ? "Pexels: ฟุตเทจคนพูด 4K" : "Pexels: Talking Head 4K"}
              </h4>
              <p className="text-[11px] text-[#5e6d64] line-clamp-2 mt-1 leading-relaxed">
                {language === "th"
                  ? "คลิปคนพูดหน้ากล้องและบทสัมภาษณ์ความละเอียดสูง เหมาะสำหรับฝึกตัดบทสนทนา"
                  : "High-resolution talking head video clips ideal for dialogue and pacing practice."}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#2e7354] flex items-center gap-1 font-semibold">
              pexels.com ↗
            </span>
          </a>
        </div>
      </div>

      {/* Common Pro Tips & Warnings */}
      <div className="p-6 rounded-2xl bg-[#fefce8] border border-[#fef08a] flex items-start gap-3.5 shadow-xs">
        <AlertCircle className="w-5 h-5 text-[#ca8a04] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#854d0e] leading-relaxed">
          <span className="font-bold block text-sm">
            {language === "th" ? "เคล็ดลับของมืออาชีพ (Pro Tip สำหรับส่งตรวจ EditLab):" : "Pro Tip for EditLab Submissions:"}
          </span>
          <p>
            {language === "th"
              ? "อย่าปล่อยให้มีช่วงเงียบสีดำ (Black frame) ท้ายคลิป และอย่าตัดหางเสียงจนคำพูดฟังดูห้วนกุด คุมความยาววิดีโอรวมให้ตรงตามเกณฑ์ที่โจทย์กำหนด (เช่น 20–30 วินาที) เพื่อให้ได้รับคะแนน ASL และ Pacing สูงสุด"
              : "Avoid trailing black frames at the end, and never clip speech syllables mid-word. Keep total duration within the benchmark window (e.g. 20–30s) to score highest on pacing and ASL."}
          </p>
        </div>
      </div>

      {/* CTA: Go to Practice Challenge */}
      <div className="p-8 rounded-2xl bg-[#163324] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            {language === "th" ? "พร้อมนำเทคนิคไปตัดต่อจริงหรือยัง?" : "Ready to Apply These Techniques?"}
          </h3>
          <p className="text-xs text-[#c1d9cc]">
            {language === "th"
              ? "ดาวน์โหลดฟุตเทจดิบในห้องฝึกซ้อม นำไปตัดใน DaVinci Resolve หรือ CapCut แล้วส่งผลงานกลับมาให้อัลกอริทึมตรวจ"
              : "Download raw footage from the practice challenge, edit in DaVinci or CapCut, and submit for instant AI analysis."}
          </p>
        </div>

        <Link
          href="/practice/timing-01-practice"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#d2ebd9] hover:bg-[#c3e4cc] text-[#133022] font-bold text-xs uppercase tracking-wider transition shadow-xs shrink-0 cursor-pointer"
        >
          <Target className="w-4 h-4" />
          <span>{language === "th" ? "เริ่มฝึกตัดต่อทันที" : "Start Practice Now"}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
