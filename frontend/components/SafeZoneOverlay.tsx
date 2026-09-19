"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music2,
  Grid3X3,
  Shield,
  Eye,
  Sliders,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Repeat
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export type SafeZoneMode = "none" | "tiktok" | "reels" | "shorts" | "grid";

interface SafeZoneOverlayProps {
  mode: SafeZoneMode;
  onModeChange: (mode: SafeZoneMode) => void;
  className?: string;
}

export default function SafeZoneOverlay({
  mode,
  onModeChange,
  className = ""
}: SafeZoneOverlayProps) {
  const { language } = useLanguage();
  const [opacity, setOpacity] = useState<"subtle" | "normal" | "high">("normal");

  const opacityClass =
    opacity === "subtle"
      ? "opacity-50"
      : opacity === "high"
      ? "opacity-95"
      : "opacity-75";

  if (mode === "none") {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* 3x3 Rule of Thirds Grid */}
      {(mode === "grid" || mode === "tiktok" || mode === "reels" || mode === "shorts") && (
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${mode === "grid" ? "opacity-70" : "opacity-25"}`}>
          {/* Vertical Lines */}
          <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-white/60 shadow-xs" />
          <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-white/60 shadow-xs" />
          {/* Horizontal Lines */}
          <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-white/60 shadow-xs" />
          <div className="absolute left-0 right-0 top-2/3 h-[1px] bg-white/60 shadow-xs" />
          {/* Center Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-400/80" />
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-400/80" />
          </div>
        </div>
      )}

      {/* TIKTOK HUD SIMULATION */}
      {mode === "tiktok" && (
        <div className={`relative w-full h-full flex flex-col justify-between p-3 font-sans text-white pointer-events-none ${opacityClass}`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between pt-1 px-3 text-[11px] font-semibold text-white/90">
            <span className="text-white/60 text-[10px]">LIVE</span>
            <div className="flex items-center gap-3">
              <span className="text-white/60">Following</span>
              <span className="font-bold border-b-2 border-white pb-0.5">For You</span>
            </div>
            <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center text-[9px]">🔍</div>
          </div>

          {/* Safe Box Boundary Outline (Green dotted rectangle) */}
          <div className="absolute top-[14%] bottom-[20%] left-[8%] right-[20%] border border-emerald-400/70 border-dashed rounded-lg pointer-events-none flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
            <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded self-start">
              ✓ TikTok Safe Caption Zone
            </div>
          </div>

          {/* Right Action Rail Danger Zone */}
          <div className="absolute right-2.5 bottom-16 flex flex-col items-center gap-3.5 bg-rose-500/15 border border-rose-400/30 p-2 rounded-2xl backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white flex items-center justify-center text-[9px] font-bold">
              User
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-5 h-5 fill-white" />
              <span className="text-[9px] font-bold mt-0.5">84.2K</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-5 h-5 fill-white" />
              <span className="text-[9px] font-bold mt-0.5">1,240</span>
            </div>
            <div className="flex flex-col items-center">
              <Bookmark className="w-5 h-5 fill-white" />
              <span className="text-[9px] font-bold mt-0.5">9,812</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-5 h-5 fill-white" />
              <span className="text-[9px] font-bold mt-0.5">Share</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-neutral-900 border-2 border-white/60 animate-spin flex items-center justify-center">
              <Music2 className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Bottom Captions & Audio Bar Danger Zone */}
          <div className="absolute left-3 right-20 bottom-3 bg-rose-500/15 border border-rose-400/30 p-2.5 rounded-xl backdrop-blur-xs space-y-1">
            <div className="text-[11px] font-bold">@creator_account</div>
            <div className="text-[10px] text-white/90 leading-tight">
              Watch until the end! Best editing tips #videoediting #davinci 🎬✨
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-white/80 font-mono">
              <Music2 className="w-2.5 h-2.5" />
              <span>Original Audio - Trending Sound</span>
            </div>
          </div>
        </div>
      )}

      {/* INSTAGRAM REELS HUD SIMULATION */}
      {mode === "reels" && (
        <div className={`relative w-full h-full flex flex-col justify-between p-3 font-sans text-white pointer-events-none ${opacityClass}`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between pt-1 px-2 text-xs font-bold">
            <span className="text-white/90">Reels</span>
            <div className="w-5 h-5 rounded-md border border-white/40 flex items-center justify-center text-[10px]">📷</div>
          </div>

          {/* Safe Box Boundary Outline */}
          <div className="absolute top-[12%] bottom-[22%] left-[8%] right-[18%] border border-sky-400/70 border-dashed rounded-lg pointer-events-none flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-sky-300 bg-black/60 px-1.5 py-0.5 rounded self-start">
              ✓ Reels Safe Title & Subtitle Zone
            </div>
          </div>

          {/* Right Action Rail */}
          <div className="absolute right-2.5 bottom-14 flex flex-col items-center gap-3.5 bg-rose-500/15 border border-rose-400/30 p-2 rounded-2xl backdrop-blur-xs">
            <div className="flex flex-col items-center">
              <Heart className="w-5 h-5" />
              <span className="text-[9px] font-semibold mt-0.5">42.5K</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-5 h-5" />
              <span className="text-[9px] font-semibold mt-0.5">850</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-center">
              <MoreVertical className="w-4 h-4" />
            </div>
            <div className="w-6 h-6 rounded-md bg-white/20 border border-white/60 flex items-center justify-center">
              <Music2 className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Bottom Caption Bar */}
          <div className="absolute left-3 right-18 bottom-3 bg-rose-500/15 border border-rose-400/30 p-2.5 rounded-xl backdrop-blur-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/30 text-[9px] font-bold flex items-center justify-center">IG</div>
              <span className="text-[11px] font-bold">@creator_pro</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/40 font-semibold">Follow</span>
            </div>
            <div className="text-[10px] text-white/90 leading-tight">
              Master the pacing of jump cuts in DaVinci Resolve! #editor
            </div>
          </div>
        </div>
      )}

      {/* YOUTUBE SHORTS HUD SIMULATION */}
      {mode === "shorts" && (
        <div className={`relative w-full h-full flex flex-col justify-between p-3 font-sans text-white pointer-events-none ${opacityClass}`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between pt-1 px-2 text-xs font-semibold">
            <span className="text-white/80 text-[10px]">Shorts</span>
            <div className="flex items-center gap-3">
              <span className="text-xs">🔍</span>
              <span className="text-xs">⋮</span>
            </div>
          </div>

          {/* Safe Box Boundary Outline */}
          <div className="absolute top-[10%] bottom-[22%] left-[6%] right-[18%] border border-rose-400/70 border-dashed rounded-lg pointer-events-none flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(251,113,133,0.15)]">
            <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-rose-300 bg-black/60 px-1.5 py-0.5 rounded self-start">
              ✓ YT Shorts Safe Subtitle Zone
            </div>
          </div>

          {/* Right Action Rail */}
          <div className="absolute right-2 bottom-14 flex flex-col items-center gap-3 bg-rose-500/15 border border-rose-400/30 p-1.5 rounded-2xl backdrop-blur-xs">
            <div className="flex flex-col items-center">
              <ThumbsUp className="w-4 h-4 fill-white" />
              <span className="text-[9px] font-bold mt-0.5">12K</span>
            </div>
            <div className="flex flex-col items-center">
              <ThumbsDown className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-0.5">Dislike</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="text-[9px] font-bold mt-0.5">340</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-0.5">Share</span>
            </div>
            <div className="flex flex-col items-center">
              <Repeat className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-0.5">Remix</span>
            </div>
          </div>

          {/* Bottom Channel Bar */}
          <div className="absolute left-3 right-16 bottom-3 bg-rose-500/15 border border-rose-400/30 p-2 rounded-xl backdrop-blur-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-600 text-[8px] font-bold flex items-center justify-center">YT</div>
              <span className="text-[11px] font-bold">@EditLabCoach</span>
              <span className="bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded-full">Subscribe</span>
            </div>
            <div className="text-[10px] text-white/90 leading-tight">
              Don&apos;t let dead air ruin your retention rate! ⚡
            </div>
          </div>
        </div>
      )}

      {/* RULE OF THIRDS GRID ONLY */}
      {mode === "grid" && (
        <div className="relative w-full h-full flex items-center justify-center p-3 text-white pointer-events-none">
          <div className="bg-black/60 px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-emerald-300">
            Rule of Thirds (3x3 Composition Grid)
          </div>
        </div>
      )}
    </div>
  );
}

export function SafeZoneToolbar({
  mode,
  onModeChange
}: {
  mode: SafeZoneMode;
  onModeChange: (mode: SafeZoneMode) => void;
}) {
  const { language } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 bg-[#13281c] p-1 rounded-xl border border-[#234937] text-[11px]">
      <div className="flex items-center gap-1 px-2 text-[#7dd3a6] font-semibold font-mono text-[10px] border-r border-[#234937]">
        <Shield className="w-3 h-3" />
        <span className="hidden sm:inline">Safe Zone:</span>
      </div>

      <button
        type="button"
        onClick={() => onModeChange("none")}
        className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
          mode === "none"
            ? "bg-[#2e7354] text-white font-bold"
            : "text-[#9fd6b5] hover:text-white"
        }`}
      >
        Off
      </button>

      <button
        type="button"
        onClick={() => onModeChange("tiktok")}
        className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
          mode === "tiktok"
            ? "bg-[#2e7354] text-white font-bold"
            : "text-[#9fd6b5] hover:text-white"
        }`}
      >
        TikTok
      </button>

      <button
        type="button"
        onClick={() => onModeChange("reels")}
        className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
          mode === "reels"
            ? "bg-[#2e7354] text-white font-bold"
            : "text-[#9fd6b5] hover:text-white"
        }`}
      >
        Reels
      </button>

      <button
        type="button"
        onClick={() => onModeChange("shorts")}
        className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer ${
          mode === "shorts"
            ? "bg-[#2e7354] text-white font-bold"
            : "text-[#9fd6b5] hover:text-white"
        }`}
      >
        Shorts
      </button>

      <button
        type="button"
        onClick={() => onModeChange("grid")}
        className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
          mode === "grid"
            ? "bg-[#2e7354] text-white font-bold"
            : "text-[#9fd6b5] hover:text-white"
        }`}
        title="3x3 Grid (Rule of Thirds)"
      >
        <Grid3X3 className="w-3 h-3" />
        <span>3x3</span>
      </button>
    </div>
  );
}
