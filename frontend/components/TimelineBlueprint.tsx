"use client";

import React, { useState } from "react";
import { Scissors, Volume2, Eye, Sparkles, Layers, Music, Film, CheckCircle2, Info } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface TimelineBlueprintProps {
  blueprintType: string;
}

export default function TimelineBlueprint({ blueprintType }: TimelineBlueprintProps) {
  const { language } = useLanguage();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="rounded-2xl bg-[#0e1a14] border border-[#234937] p-5 text-white space-y-4 shadow-md font-sans">
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#7dd3a6] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>{language === "th" ? "ผ่าโครงสร้างไทม์ไลน์ (NLE Track Blueprint)" : "NLE Timeline Blueprint Architecture"}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-white/60">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Video (V)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Audio (A)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Cut Point (✂️)
          </span>
        </div>
      </div>

      {/* Blueprint Content by Type */}
      <div className="space-y-3 pt-1">
        {/* TYPE 1: JUMP CUT / SHOT DURATION */}
        {(blueprintType === "jump_cut" || blueprintType === "shot_duration") && (
          <div className="space-y-2">
            {/* Track V1 */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">V1</span>
              <div className="flex-1 h-9 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1 relative overflow-hidden">
                <div className="w-[45%] h-full bg-blue-600/80 rounded flex items-center justify-center text-[10px] font-mono text-white font-medium border border-blue-400/40">
                  Speaker Sentence 1
                </div>
                {/* Ripple Trim Cut Zone */}
                <div className="w-[10%] h-full bg-rose-500/20 border border-dashed border-rose-400 rounded flex items-center justify-center text-[9px] font-mono text-rose-300">
                  ✂️ 0.2s Trim
                </div>
                <div className="w-[45%] h-full bg-blue-500/80 rounded flex items-center justify-center text-[10px] font-mono text-white font-medium border border-blue-400/40">
                  Speaker Sentence 2
                </div>
              </div>
            </div>

            {/* Track A1 */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">A1</span>
              <div className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1 relative overflow-hidden">
                <div className="w-[45%] h-full bg-emerald-700/80 rounded flex items-center justify-center text-[9px] font-mono text-emerald-200 border border-emerald-500/40">
                  ♫ Voice Waveform (Clean)
                </div>
                <div className="w-[10%] h-full bg-rose-950/80 rounded flex items-center justify-center text-[8px] font-mono text-rose-400">
                  Silence
                </div>
                <div className="w-[45%] h-full bg-emerald-700/80 rounded flex items-center justify-center text-[9px] font-mono text-emerald-200 border border-emerald-500/40">
                  ♫ Voice Waveform (Next Thought)
                </div>
              </div>
            </div>

            {/* Explanation Banner */}
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {language === "th"
                  ? "การตัดช่วงเงียบ (Dead Air) 0.2s ออก จะทำให้ประโยคสนทนาเชื่อมติดกันอย่างเป็นธรรมชาติ ไม่มีจังหวะอึกอัก คนดูไม่กดเลื่อนผ่าน"
                  : "Ripple trimming the 0.2s dead air pulls the next sentence forward seamlessly, eliminating hesitations and sustaining viewer attention."}
              </span>
            </div>
          </div>
        )}

        {/* TYPE 2: J-CUT */}
        {blueprintType === "j_cut" && (
          <div className="space-y-2">
            {/* Track V1 */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">V1</span>
              <div className="flex-1 h-9 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1 relative">
                <div className="w-[55%] h-full bg-blue-600/80 rounded flex items-center justify-center text-[10px] font-mono text-white font-medium">
                  Scene 1 (Talking Head)
                </div>
                <div className="w-[45%] h-full bg-purple-600/80 rounded flex items-center justify-center text-[10px] font-mono text-white font-medium">
                  Scene 2 (B-Roll Video)
                </div>
                {/* Cut Line */}
                <div className="absolute top-0 bottom-0 left-[55%] w-0.5 bg-amber-400 z-10"></div>
              </div>
            </div>

            {/* Track A1 & A2 (J-Cut Audio Lead) */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">A1</span>
              <div className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex relative">
                <div className="w-[55%] h-full bg-emerald-700/80 rounded flex items-center justify-center text-[9px] font-mono text-emerald-200">
                  Scene 1 Audio
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">A2</span>
              <div className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex relative">
                {/* Empty left padding, audio starts 12 frames ahead */}
                <div className="w-[43%] h-full"></div>
                <div className="w-[57%] h-full bg-teal-600/90 rounded border border-teal-400 flex items-center justify-center text-[9px] font-mono text-white font-bold shadow-xs">
                  ◀ Scene 2 Audio Starts 0.4s EARLY (J-Shape)
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/40 text-[11px] text-teal-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                {language === "th"
                  ? "รูปตัว J เกิดจากเสียงในแทร็ก A2 เริ่มดังขึ้นก่อนที่ภาพ V1 จะเปลี่ยน ทำให้หูของคนดูรับรู้ล่วงหน้า รอยตัดจึงดูสมูทและไม่กระตุกอารมณ์"
                  : "The J-Cut shape occurs because Track A2 audio starts 0.4s before the video on V1 transitions. Ears hear the new environment before eyes see it!"}
              </span>
            </div>
          </div>
        )}

        {/* TYPE 3: B-ROLL OVERLAY */}
        {blueprintType === "broll_overlay" && (
          <div className="space-y-2">
            {/* Track V2: B-Roll Clip */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">V2</span>
              <div className="flex-1 h-9 rounded-lg bg-black/40 border border-white/10 p-0.5 flex relative">
                <div className="w-[30%] h-full"></div>
                <div className="w-[45%] h-full bg-amber-500/90 rounded border border-amber-300 flex items-center justify-center text-[10px] font-mono text-black font-bold shadow-sm">
                  ★ B-Roll (Product / Screen Demo)
                </div>
              </div>
            </div>

            {/* Track V1: Jump Cut Underneath */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">V1</span>
              <div className="flex-1 h-9 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1 relative">
                <div className="w-[50%] h-full bg-blue-600/80 rounded flex items-center justify-center text-[10px] font-mono text-white font-medium">
                  Talking Head Take 1
                </div>
                <div className="w-[50%] h-full bg-blue-600/80 rounded flex items-center justify-center text-[10px] font-mono text-white font-medium">
                  Talking Head Take 2
                </div>
                {/* Jump Cut Seam */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-rose-500 z-10" title="Hidden Jump Cut"></div>
              </div>
            </div>

            {/* Track A1 */}
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">A1</span>
              <div className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex">
                <div className="w-full h-full bg-emerald-700/80 rounded flex items-center justify-center text-[9px] font-mono text-emerald-200">
                  Continuous Spoken Dialogue
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
              <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {language === "th"
                  ? "วาง B-roll บน Track V2 คลุมรอยต่อระหว่าง Take 1 กับ Take 2 บน Track V1 คนดูจะไม่เห็นรอย Jump Cut ที่กระตุก แต่จะเห็นภาพประกอบสวยงามแทน"
                  : "B-roll on Track V2 completely masks the jump cut seam on Track V1. The audio flows seamlessly while the visual stays dynamic!"}
              </span>
            </div>
          </div>
        )}

        {/* TYPE 4: PUNCH ZOOM */}
        {blueprintType === "punch_zoom" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">V1</span>
              <div className="flex-1 h-9 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1 relative">
                <div className="w-[60%] h-full bg-blue-600/80 rounded flex items-center justify-center text-[10px] font-mono text-white font-medium">
                  Normal Framing (Scale: 100%)
                </div>
                <div className="w-[40%] h-full bg-purple-600/90 rounded border border-purple-400 flex items-center justify-center text-[10px] font-mono text-white font-bold">
                  ⚡ PUNCH ZOOM (Scale: 115%)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">A1</span>
              <div className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1">
                <div className="w-[60%] h-full bg-emerald-700/80 rounded flex items-center justify-center text-[9px] font-mono text-emerald-200">
                  Regular sentence flow...
                </div>
                <div className="w-[40%] h-full bg-emerald-600 rounded border border-emerald-400 flex items-center justify-center text-[9px] font-mono text-white font-bold">
                  PUNCHLINE / KEYWORD!
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                {language === "th"
                  ? "ตัดช็อตฉับพลันแล้วขยายเป็น 115% ตรงคำพูดสำคัญ เปรียบเสมือนหมัดฮุกทางสายตา ช่วยเปลี่ยนมิติภาพโดยไม่ต้องใช้กล้องตัวที่ 2"
                  : "An instant 115% punch cut directly on the climax keyword underlines the takeaway and breaks visual stagnation without requiring a B-camera."}
              </span>
            </div>
          </div>
        )}

        {/* TYPE 5: CAPTION CHUNKS */}
        {blueprintType === "caption_chunks" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">TXT</span>
              <div className="flex-1 h-9 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1.5">
                <div className="flex-1 h-full bg-neutral-800 rounded flex items-center justify-center text-[10px] font-bold text-white border border-white/20">
                  &quot;THIS SINGLE&quot;
                </div>
                <div className="flex-1 h-full bg-yellow-400 rounded flex items-center justify-center text-[10px] font-extrabold text-black border border-yellow-200 shadow-sm">
                  ★ &quot;EDIT TRICK&quot;
                </div>
                <div className="flex-1 h-full bg-neutral-800 rounded flex items-center justify-center text-[10px] font-bold text-white border border-white/20">
                  &quot;SAVES TIME&quot;
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">V1</span>
              <div className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex">
                <div className="w-full h-full bg-blue-600/80 rounded flex items-center justify-center text-[10px] font-mono text-white">
                  Talking Head (Subject centered in Safe Zone)
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-yellow-950/40 border border-yellow-800/40 text-[11px] text-yellow-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span>
                {language === "th"
                  ? "แสดงแคปชันก้อนละ 1–3 คำ และไฮไลต์คำสำคัญสีทองตรงพยางค์ที่ผู้พูดออกเสียง ช่วยนำสายตาคนดูได้อย่างแม่นยำ"
                  : "Syncing 1–3 word chunks with vibrant keyword highlights directs eye gaze without obscuring the speaker's facial expressions."}
              </span>
            </div>
          </div>
        )}

        {/* TYPE 6: RETENTION HOOK */}
        {blueprintType === "retention_hook" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">TIME</span>
              <div className="flex-1 h-5 flex text-[9px] font-mono text-white/60">
                <div className="w-[30%] border-r border-amber-400/60 pl-1 text-amber-300 font-bold">0.0s - 1.5s (Hook Window)</div>
                <div className="w-[30%] border-r border-white/20 pl-1">1.5s - 3.0s (Stakes / Curiosity)</div>
                <div className="w-[40%] pl-1">3.0s+ (Core Story Arc)</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-mono text-white/50 text-right">V1</span>
              <div className="flex-1 h-9 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1">
                <div className="w-[30%] h-full bg-amber-500 rounded text-black font-extrabold flex items-center justify-center text-[10px] border border-amber-300">
                  ⚡ INSTANT RESULT / HOOK
                </div>
                <div className="w-[30%] h-full bg-blue-600/80 rounded text-white flex items-center justify-center text-[10px] font-mono">
                  Why this matters
                </div>
                <div className="w-[40%] h-full bg-blue-700/80 rounded text-white flex items-center justify-center text-[10px] font-mono">
                  Full Demonstration
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2">
              <Scissors className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {language === "th"
                  ? "ตัดคำทักทาย 'สวัสดีครับ' และโลโก้ทิ้งทั้งหมด เริ่มต้นด้วยประเด็นหรือผลลัพธ์ที่น่าทึ่งในเฟรมแรก เพื่อตรึงคนดูให้ไม่ปัดหนีใน 2 วินาทีแรก"
                  : "Remove all greetings and channel logos. Start with the payoff or shocking realization in frame 1 to capture subconscious swiping reflexes."}
              </span>
            </div>
          </div>
        )}

        {/* DEFAULT / MASTER EDIT / RHYTHM / OTHER */}
        {blueprintType !== "jump_cut" &&
          blueprintType !== "shot_duration" &&
          blueprintType !== "j_cut" &&
          blueprintType !== "broll_overlay" &&
          blueprintType !== "punch_zoom" &&
          blueprintType !== "caption_chunks" &&
          blueprintType !== "retention_hook" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 text-[10px] font-mono text-white/50 text-right">V2</span>
                <div className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-2">
                  <div className="w-1/4 h-full bg-amber-500/80 rounded flex items-center justify-center text-[9px] font-mono text-black font-bold">
                    Hook Graphic
                  </div>
                  <div className="w-1/2 h-full bg-purple-600/80 rounded flex items-center justify-center text-[9px] font-mono text-white">
                    B-Roll Context
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-8 text-[10px] font-mono text-white/50 text-right">V1</span>
                <div className="flex-1 h-8 rounded-lg bg-black/40 border border-white/10 p-0.5 flex gap-1">
                  <div className="flex-1 h-full bg-blue-600/80 rounded flex items-center justify-center text-[9px] font-mono text-white">
                    Main Narrative (Short & Punchy Cuts)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-8 text-[10px] font-mono text-white/50 text-right">A1</span>
                <div className="flex-1 h-7 rounded-lg bg-black/40 border border-white/10 p-0.5 flex">
                  <div className="w-full h-full bg-emerald-700/80 rounded flex items-center justify-center text-[9px] font-mono text-emerald-200">
                    Dialogue Track (-12dB Clean Level)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-8 text-[10px] font-mono text-white/50 text-right">A2</span>
                <div className="flex-1 h-7 rounded-lg bg-black/40 border border-white/10 p-0.5 flex">
                  <div className="w-full h-full bg-sky-900/80 rounded flex items-center justify-center text-[9px] font-mono text-sky-200">
                    Background Music (-22dB Ducked) + SFX Pops
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  {language === "th"
                    ? "การจัดเลเยอร์แบบมือโปร: รวมเสียงพูด ดนตรี ซาวด์เอฟเฟกต์ และภาพคัตสลับให้ทำงานสอดประสานเป็นหนึ่งเดียว"
                    : "Pro Multi-Track Harmony: Synchronizes voice, ducked music, punchy sound design, and B-roll visuals into an effortless viewer flow."}
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
