// frontend/lib/lessonMasterclassData.ts

export interface LessonExtraData {
  blueprintType:
    | "jump_cut"
    | "shot_duration"
    | "rhythm"
    | "story_arc"
    | "broll_overlay"
    | "j_cut"
    | "caption_chunks"
    | "punch_zoom"
    | "retention_hook"
    | "color_match"
    | "master_edit";
  goldenRule: {
    en: string;
    th: string;
  };
  metricsTarget: {
    en: string;
    th: string;
  };
  psychologyInsight: {
    en: string;
    th: string;
  };
  davinciShortcuts: Array<{ key: string; actionEn: string; actionTh: string }>;
  capcutShortcuts: Array<{ key: string; actionEn: string; actionTh: string }>;
}

export const LESSON_MASTERCLASS_DATA: Record<string, LessonExtraData> = {
  "timing-01": {
    blueprintType: "jump_cut",
    goldenRule: {
      en: "Cut exactly as the thought ends. Leave no more than 0.15s–0.2s of dead air after the final consonant.",
      th: "ตัดทันทีเมื่อความคิดสิ้นสุด เว้นช่วงเงียบหลังพยางค์สุดท้ายไม่เกิน 0.15–0.2 วินาที",
    },
    metricsTarget: {
      en: "Dead air gap < 0.25s • Cuts per minute > 14",
      th: "ช่วงเงียบ Dead Air < 0.25 วินาที • คัตต่อนาที > 14 คัต",
    },
    psychologyInsight: {
      en: "The human brain processes spoken language in cognitive units. When a unit completes, any silence longer than 250ms triggers an involuntary loss of momentum.",
      th: "สมองมนุษย์ประมวลผลภาษาเป็นก้อนความคิด เมื่อประเด็นจบลง ช่วงเงียบที่ยาวเกิน 250 มิลลิวินาทีจะทำให้สมองคนดูเริ่มหลุดโฟกัสทันที",
    },
    davinciShortcuts: [
      { key: "W", actionEn: "Ripple Cut Head (trim left to playhead)", actionTh: "Ripple Cut ตัดทิ้งช่วงเงียบด้านซ้ายถึงหัวอ่าน" },
      { key: "Q", actionEn: "Ripple Cut Tail (trim right to playhead)", actionTh: "Ripple Cut ตัดทิ้งช่วงเงียบด้านขวาถึงหัวอ่าน" },
      { key: "Ctrl + \\", actionEn: "Split clip at playhead", actionTh: "ตัดแยกคลิปตรงตำแหน่งหัวอ่าน" },
    ],
    capcutShortcuts: [
      { key: "Ctrl + B", actionEn: "Split clip at playhead", actionTh: "ตัดแยกคลิปทันทีตรงหัวอ่าน" },
      { key: "Q / W", actionEn: "Delete clip left / right", actionTh: "ลบคลิปส่วนเกินซ้าย / ขวาทันที" },
      { key: "Del", actionEn: "Ripple delete selected segment", actionTh: "ลบและร่นคลิปเข้ามาชนทันที (Ripple Delete)" },
    ],
  },

  "pacing-01": {
    blueprintType: "shot_duration",
    goldenRule: {
      en: "Never let a static talking head hold longer than 3.5 seconds without a cut, punch-zoom, or B-roll.",
      th: "ห้ามแช่ภาพคนพูดนิ่งสนิทเกิน 3.5 วินาที โดยไม่มีการคัต ซูม หรือภาพ B-roll เสริม",
    },
    metricsTarget: {
      en: "Average Shot Length (ASL): 1.8s – 2.8s • Max hold < 4.0s",
      th: "ความยาวช็อตเฉลี่ย (ASL): 1.8 – 2.8 วินาที • แช่ภาพสูงสุด < 4.0 วินาที",
    },
    psychologyInsight: {
      en: "Visual habituation kicks in after 3 seconds of a static shot. Changing the shot angle or scale triggers the orienting reflex, resetting viewer vigilance.",
      th: "สายตามนุษย์จะเริ่มชาชินเมื่อมองภาพนิ่งเดิมเกิน 3 วินาที การเปลี่ยนมุมกล้องหรือขนาดภาพจะกระตุ้นสมองให้ตื่นตัวและตั้งใจดูต่อ",
    },
    davinciShortcuts: [
      { key: "Ctrl + Shift + [", actionEn: "Trim In point to playhead", actionTh: "ตัดจุดเริ่มต้นช็อตเข้ามาหาหัวอ่าน" },
      { key: "Ctrl + Shift + ]", actionEn: "Trim Out point to playhead", actionTh: "ตัดจุดสิ้นสุดช็อตเข้ามาหาหัวอ่าน" },
      { key: "B", actionEn: "Activate Blade edit tool", actionTh: "เปิดใช้เครื่องมือมีดตัด (Blade Tool)" },
    ],
    capcutShortcuts: [
      { key: "Ctrl + B", actionEn: "Quick split on pauses", actionTh: "กดตัดแยกคลิปตรงช่วงหยุดพูด" },
      { key: "Alt + [", actionEn: "Trim clip start to playhead", actionTh: "ตัดช่วงต้นของคลิปมาหาหัวอ่าน" },
      { key: "Alt + ]", actionEn: "Trim clip end to playhead", actionTh: "ตัดช่วงท้ายของคลิปมาหาหัวอ่าน" },
    ],
  },

  "pacing-02": {
    blueprintType: "rhythm",
    goldenRule: {
      en: "Contrast is king: pair high-tempo cut bursts (0.8s–1.2s) with deliberate breathing pauses (2.5s–3.0s).",
      th: "คอนทราสต์คือหัวใจ: สลับจังหวะคัตเร็ว (0.8–1.2s) กับจังหวะหยุดหายใจ (2.5–3.0s) ให้มีมิติ",
    },
    metricsTarget: {
      en: "Varied cadence • Dynamic tempo modulation across the edit",
      th: "ความยาวช็อตหลากหลาย • มีทั้งช่วงเร่งและช่วงพักอารมณ์",
    },
    psychologyInsight: {
      en: "Monotonous speed creates fatigue whether fast or slow. Rhythmic variation mimics musical phrasing, creating tension and emotional release.",
      th: "ความเร็วที่เท่ากันเป๊ะตลอดเรื่องจะทำให้คนดูไร้อารมณ์ การสลับจังหวะเหมือนโน้ตดนตรีช่วยสร้างความตื่นเต้นและการปลดปล่อยทางอารมณ์",
    },
    davinciShortcuts: [
      { key: "M", actionEn: "Add beat marker on timeline", actionTh: "ปักหมุดจังหวะบีทเพลงบนไทม์ไลน์ (Marker)" },
      { key: "Shift + Down", actionEn: "Snap directly to next marker", actionTh: "กระโดดไปยังมาร์กเกอร์จังหวะถัดไป" },
      { key: "R", actionEn: "Change clip speed / duration", actionTh: "ปรับความเร็วคลิป (Change Speed)" },
    ],
    capcutShortcuts: [
      { key: "Auto Beat", actionEn: "Auto beat detection on audio track", actionTh: "เปิดระบบจับจังหวะเพลงอัตโนมัติ (Beat Detection)" },
      { key: "Ctrl + R", actionEn: "Speed curve ramp adjustment", actionTh: "ปรับสปีดเคิร์ฟ (Speed Curve) เร็ว-ช้าตามอารมณ์" },
    ],
  },

  "story-01": {
    blueprintType: "story_arc",
    goldenRule: {
      en: "Hook in 0–3s, raise the conflict in 4–15s, reveal the breakthrough, and deliver the payoff at the finish.",
      th: "ฮุกคนดูใน 0–3s, เปิดปมปัญหาใน 4–15s, แสดงวิธีแก้ และสรุปบทเรียนท้ายคลิป",
    },
    metricsTarget: {
      en: "Clear 3-act progression • High early second retention",
      th: "โครงสร้าง 3 องค์ชัดเจน • ยอดคนดูผ่าน 5 วินาทีแรกสูง",
    },
    psychologyInsight: {
      en: "Humans are wired for narrative causality. Without understanding the stakes, great visual effects have zero emotional resonance.",
      th: "มนุษย์ผูกพันกับเรื่องเล่าที่มีเหตุและผล หากคนดูไม่รู้ว่า 'ทำไมเรื่องนี้ถึงสำคัญ' เทคนิคสวยงามแค่ไหนก็ตรึงใจไม่ได้",
    },
    davinciShortcuts: [
      { key: "Ctrl + Y", actionEn: "Add new video track for storyline B-roll", actionTh: "เพิ่มแทร็กวิดีโอใหม่สำหรับฟุตเทจเล่าเรื่อง" },
      { key: "Alt + Up / Down", actionEn: "Move clips between tracks cleanly", actionTh: "สลับย้ายคลิปขึ้นลงระหว่างแทร็กอย่างแม่นยำ" },
    ],
    capcutShortcuts: [
      { key: "Drag Track", actionEn: "Stack secondary storyline clip above", actionTh: "ลากคลิปเสริมขึ้นแทร็กด้านบนเพื่อเล่าเรื่องคู่ขนาน" },
      { key: "Freeze Frame", actionEn: "Freeze key frame for dramatic explanation", actionTh: "หยุดภาพนิ่ง (Freeze) เพื่อเน้นจุดสำคัญของเรื่อง" },
    ],
  },

  "broll-01": {
    blueprintType: "broll_overlay",
    goldenRule: {
      en: "Show, don't just tell. Drop B-roll on Track V2 directly over the cut points on Track V1 to mask jump cuts.",
      th: "แสดงให้เห็นดีกว่าแค่เล่า วาง B-roll บน Track V2 คลุมรอยตัดบน Track V1 เพื่อซ่อนรอยต่อคำพูด",
    },
    metricsTarget: {
      en: "B-roll coverage: 25%–45% of total edit runtime",
      th: "มีภาพ B-roll ครอบคลุมประมาณ 25%–45% ของความยาวคลิป",
    },
    psychologyInsight: {
      en: "Dual coding theory proves that receiving synchronized audio and visual data multiplies information retention and reduces cognitive strain.",
      th: "ทฤษฎี Dual Coding ระบุว่าการรับข้อมูลทั้งภาพและเสียงที่สอดคล้องกันพร้อมกัน ช่วยเพิ่มการจดจำและลดความเหนื่อยล้าของสมอง",
    },
    davinciShortcuts: [
      { key: "F10", actionEn: "Overwrite clip to Track V2", actionTh: "วางทับคลิป B-roll ลงแทร็ก V2 (Overwrite)" },
      { key: "D", actionEn: "Enable / disable selected B-roll clip", actionTh: "เปิด/ปิด การแสดงผลของคลิป B-roll (Toggle Mute)" },
    ],
    capcutShortcuts: [
      { key: "Overlay Track", actionEn: "Add overlay video track above main", actionTh: "เพิ่มคลิปแบบ Overlay ซ้อนทับแทร็กหลัก" },
      { key: "Picture-in-Picture", actionEn: "Transform B-roll position & scale", actionTh: "ย่อขนาดหรือปรับตำแหน่งภาพแทรก (PIP)" },
    ],
  },

  "audio-01": {
    blueprintType: "j_cut",
    goldenRule: {
      en: "Let audio lead the transition. Pull incoming audio 8–15 frames (0.3s–0.5s) ahead of the incoming video cut.",
      th: "ให้เสียงนำทางสายตา ดึงเสียงฉากถัดไปให้เริ่มก่อนภาพประมาณ 8–15 เฟรม (0.3–0.5 วินาที)",
    },
    metricsTarget: {
      en: "J-cut / L-cut overlap: 0.3s – 0.6s • Seamless dialogue flow",
      th: "เสียงข้ามฉาก J-cut: 0.3 – 0.6 วินาที • เสียงสนทนาไร้รอยต่อ",
    },
    psychologyInsight: {
      en: "In the real world, sound travels in omnidirectional waves and reaches our ears before we turn our heads to look. J-Cuts mimic human biological perception.",
      th: "ในโลกความจริง เสียงเดินทางรอบทิศทางและมาถึงหูก่อนที่เราจะหันสายตาไปมอง J-Cut จึงให้ความรู้สึกสมจริงและเป็นธรรมชาติที่สุดสำหรับคนดู",
    },
    davinciShortcuts: [
      { key: "Alt + Drag Audio Edge", actionEn: "Slip audio edge independently of video link", actionTh: "กด Alt ค้างแล้วลากขอบเสียงแยกอิสระจากภาพ" },
      { key: "Ctrl + Shift + K", actionEn: "Razor cut audio without affecting video", actionTh: "ตัดแยกเฉพาะแทร็กเสียงโดยไม่ตัดภาพ" },
    ],
    capcutShortcuts: [
      { key: "Separate Audio", actionEn: "Right click -> Separate audio from video clip", actionTh: "คลิกขวา -> แยกเสียงออกจากวิดีโอ (Separate Audio)" },
      { key: "Audio Fade In", actionEn: "Add 0.2s crossfade on dialogue seam", actionTh: "ใส่ Fade In / Fade Out 0.2s เพื่อลบรอยคลิกเสียง" },
    ],
  },

  "text-01": {
    blueprintType: "caption_chunks",
    goldenRule: {
      en: "Chunk captions into 1–3 words and highlight only the single high-impact keyword per sentence in vibrant color.",
      th: "ซอยซับไตเติลเป็นก้อน 1–3 คำ และไฮไลต์สีเด่นเฉพาะคำสำคัญ 1 คำต่อประโยค",
    },
    metricsTarget: {
      en: "1–3 words per caption block • Word-level voice synchronization",
      th: "1–3 คำต่อช่วงซับ • ซิงก์ตรงเป๊ะกับพยางค์เสียงพูด",
    },
    psychologyInsight: {
      en: "Reading long text forces viewers to stop watching facial expressions. Kinetic single-word highlights allow peripheral reading without breaking eye contact.",
      th: "การอ่านตัวหนังสือยาวๆ บังคับให้คนดูต้องละสายตาจากใบหน้าคนพูด ซับแบบทีละคำช่วยให้คนดูอ่านได้ทางหางตาโดยไม่หลุดโฟกัสจากผู้พูด",
    },
    davinciShortcuts: [
      { key: "Subtitles Track", actionEn: "Create Dedicated Subtitle Track in Edit Page", actionTh: "สร้างแทร็ก Subtitles แยกต่างหากในหน้า Edit" },
      { key: "Text+ Fusion", actionEn: "Use Text+ for dynamic keyword style highlights", actionTh: "ใช้ Text+ เพื่อเน้นสีตัวอักษรเฉพาะคำสำคัญ" },
    ],
    capcutShortcuts: [
      { key: "Auto Captions", actionEn: "Text -> Auto captions with word-by-word sync", actionTh: "กดเมนู Text -> คำบรรยายอัตโนมัติ (Auto Captions)" },
      { key: "Preset Style", actionEn: "Apply high-contrast yellow/green glow preset", actionTh: "เลือกพรีเซ็ตสีเหลือง/เขียวสะดุดตา อ่านง่ายบนมือถือ" },
    ],
  },

  "motion-01": {
    blueprintType: "punch_zoom",
    goldenRule: {
      en: "Punch zoom from 100% to 115%–120% exactly on the climax syllable or punchline. Don't smooth it with slow ease.",
      th: "Punch Zoom จาก 100% เป็น 115%–120% ทันทีที่พยางค์เน้นหรือจุดหักมุม อย่าใช้สโลว์ซูมให้ตัดฉับพลัน",
    },
    metricsTarget: {
      en: "Instant scale shift: 100% -> 115% • Re-centers subject eye-line",
      th: "ตัดซูมฉับพลัน: 100% -> 115% • ล็อคระดับสายตาคนพูดให้อยู่กึ่งกลาง",
    },
    psychologyInsight: {
      en: "A sudden focal shift mimics physical proximity—as if the speaker leaned in closer to share a secret. It snaps wandering attention back immediately.",
      th: "การตัดซูมฉับพลันจำลองความรู้สึกเหมือนผู้พูดโน้มตัวเข้ามาใกล้เพื่อบอกความลับ ช่วยดึงสติคนดูให้หันกลับมาตั้งใจฟังทันที",
    },
    davinciShortcuts: [
      { key: "Inspector -> Zoom", actionEn: "Set Zoom X/Y to 1.15 on the second clip slice", actionTh: "ใน Inspector ปรับ Zoom X/Y เป็น 1.15 ในคลิปท่อนที่ตัดแยก" },
      { key: "Ctrl + B", actionEn: "Split slice right on the punchline keyword", actionTh: "ตัดแยกท่อนคลิปตรงคำสำคัญพอดี" },
    ],
    capcutShortcuts: [
      { key: "Scale 115%", actionEn: "Select split clip and change Scale slider to 115%", actionTh: "เลือกคลิปที่ตัดแล้วเลื่อน Scale เป็น 115%" },
      { key: "Camera Shake", actionEn: "Add subtle impact flash or shake effect", actionTh: "ใส่เอฟเฟกต์กระแทกเบาๆ เพื่อเพิ่มน้ำหนักให้มุก" },
    ],
  },

  "hook-01": {
    blueprintType: "retention_hook",
    goldenRule: {
      en: "Eliminate greetings, channel logos, and throat-clearing. Open with immediate curiosity or proof in 0–1.5 seconds.",
      th: "ตัดคำทักทาย โลโก้ และการเกริ่นทิ้งทั้งหมด เปิดด้วยประเด็นชวนสงสัยหรือผลลัพธ์ทันทีใน 0–1.5 วินาที",
    },
    metricsTarget: {
      en: "Speech begins in < 0.2s • Strong visual pattern interrupt in frame 1",
      th: "เสียงพูดเริ่มภายใน < 0.2 วินาที • มีภาพหรือคำกระแทกสายตาตั้งแต่เฟรมแรก",
    },
    psychologyInsight: {
      en: "TikTok and Instagram users swipe with subconscious thumb reflexes. You have approximately 800 milliseconds to convince the brain that this clip is unique.",
      th: "ผู้ใช้โซเชียลปัดหน้าจอด้วยสัญชาตญาณ คุณมีเวลาเพียง 800 มิลลิวินาทีแรกในการโน้มน้าวสมองคนดูว่าคลิปนี้คุ้มค่าที่จะหยุดดู",
    },
    davinciShortcuts: [
      { key: "Ripple Start", actionEn: "Press Shift+[ to prune any silence before first word", actionTh: "ตัดทิ้งช่วงเงียบและอึกอักก่อนเริ่มพูดคำแรกออกหมด" },
      { key: "Large Title", actionEn: "Place bold hook title on first 1.5 seconds", actionTh: "วางไตเติลฮุกตัวโตใน 1.5 วินาทีแรกของคลิป" },
    ],
    capcutShortcuts: [
      { key: "Trim Beginning", actionEn: "Drag left handle so wave starts on frame 0", actionTh: "ลากตัดขอบซ้ายให้คลื่นเสียงพูดเริ่มตรงเฟรมที่ 0 พอดี" },
      { key: "Sound Effect", actionEn: "Add Whoosh / Pop SFX on the opening frame", actionTh: "ใส่เสียงซาวด์ Whoosh หรือ Pop ในวินาทีแรกเพื่อเปิดโสตประสาท" },
    ],
  },

  "color-01": {
    blueprintType: "color_match",
    goldenRule: {
      en: "Match exposure and skin tone vectors across cuts before applying any creative look or aesthetic LUT.",
      th: "ปรับ Exposure และโทนสีผิวให้เท่ากันระหว่างช็อต A-roll และ B-roll ก่อนใส่ LUT สีใดๆ",
    },
    metricsTarget: {
      en: "Consistent luminance across cuts • Skin tones locked on skin line",
      th: "ความสว่างไม่โดดข้ามช็อต • โทนสีผิวอยู่ในเกณฑ์ธรรมชาติ",
    },
    psychologyInsight: {
      en: "Subconscious brightness jumps between cuts trigger micro-disorientation, breaking the viewer's immersion without them knowing why.",
      th: "ความสว่างที่กระโดดไปมาระหว่างคัตจะสร้างความรำคาญใจให้สายตาโดยไม่รู้ตัว และทำลายความเพลิดเพลินในการรับชม",
    },
    davinciShortcuts: [
      { key: "Color Page (Shift+6)", actionEn: "Open DaVinci Color wheels & Scopes", actionTh: "กด Shift+6 เข้าหน้าต่าง Color ปรับ Lift/Gamma/Gain" },
      { key: "Shot Match to This Clip", actionEn: "Right click reference clip -> Shot Match", actionTh: "คลิกขวาที่คลิปอ้างอิง -> เลือก Shot Match to This Clip" },
    ],
    capcutShortcuts: [
      { key: "Adjust Tab", actionEn: "Adjust brightness, contrast, and temp to balance", actionTh: "เปิดแถบ Adjust ปรับความสว่างและอุณหภูมิสีให้ใกล้เคียงกัน" },
      { key: "Apply to All", actionEn: "Apply consistent base correction across all clips", actionTh: "กดปุ่ม Apply to all เพื่อคุมโทนสีให้เป็นหนึ่งเดียวทั้งโปรเจกต์" },
    ],
  },

  "complete-01": {
    blueprintType: "master_edit",
    goldenRule: {
      en: "Layer all elements like an orchestra: A-roll sets meaning, B-roll guides eyes, SFX accentuates cuts, and Music drives emotion.",
      th: "จัดวางทุกองค์ประกอบเหมือนวงออเคสตรา: A-roll นำทางความคิด, B-roll นำสายตา, SFX เน้นจุดตัด, และ BGM ขับเคลื่อนอารมณ์",
    },
    metricsTarget: {
      en: "Complete 5-track synergy • Final retention score > 85",
      th: "สอดประสานครบ 5 แทร็ก • คะแนนประเมินภาพรวม > 85 คะแนน",
    },
    psychologyInsight: {
      en: "A master edit feels effortless. The viewer shouldn't notice the cuts—they should only feel the momentum of the story pulling them forward.",
      th: "งานตัดต่อระดับมาสเตอร์จะให้ความรู้สึกลื่นไหลอย่างเป็นธรรมชาติ คนดูจะไม่ทันสังเกตเห็นรอยตัด แต่จะรู้สึกได้ถึงพลังของเรื่องราวที่ดึงดูดไปจนจบ",
    },
    davinciShortcuts: [
      { key: "Fairlight Page (Shift+7)", actionEn: "Master sound levels: Dialogue -12dB, Music -22dB", actionTh: "เข้าหน้า Fairlight คุมเสียงพูดที่ -12dB และเพลงที่ -22dB" },
      { key: "Deliver Page (Shift+8)", actionEn: "Export clean 1080x1920 MP4 H.264 render", actionTh: "เข้าหน้า Deliver ตั้งค่า Render 1080x1920 MP4 คุณภาพสูง" },
    ],
    capcutShortcuts: [
      { key: "Loudness Normalization", actionEn: "Turn on Loudness Normalization on speech", actionTh: "เปิดระบบ Loudness Normalization เพื่อให้เสียงดังสม่ำเสมอ" },
      { key: "Export 1080p", actionEn: "Export 1080p, 60fps, Higher Bitrate MP4", actionTh: "กด Export เลือก 1080p บิตเรตสูงเพื่อความคมชัดสูงสุด" },
    ],
  },
};
