"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "th";

export const translations = {
  en: {
    // Sidebar
    brand_slogan: "MAKE EVERY CUT COUNT",
    your_workspace: "YOUR WORKSPACE",
    nav_overview: "Overview",
    nav_learn: "Learn",
    nav_practice: "Practice",
    nav_skills: "My skills",
    nav_settings: "Settings",
    sidebar_quote_title: "A little practice. A better editor.",
    sidebar_quote_sub: "Build your instincts, one thoughtful cut at a time.",
    sidebar_find_lesson: "Find your next lesson",
    sidebar_how_it_works: "How it works",

    // Dashboard Overview
    eyebrow_workspace: "YOUR CREATIVE WORKSPACE",
    header_title: "Small cuts. Big progress.",
    header_sub: "A little learning, a little practice. Make something better today.",
    btn_new_practice: "New practice",
    hero_badge: "YOUR NEXT CHAPTER",
    hero_title: "Good edits start with a better instinct.",
    hero_sub: "Learn the why behind every cut. Then bring it to life in DaVinci Resolve.",
    btn_continue_learning: "Continue learning",
    hero_meta: "6 min • One idea you can use today",
    hero_nle_tag: "YOUR NEXT GREAT CUT",

    // Stats
    stat_lessons: "lessons",
    stat_completed_so_far: "Completed so far",
    stat_skill_average: "Current skill average",
    stat_journey: "Your editing journey",

    // Dashboard sections
    section_pick_up: "Pick up where you left off",
    link_explore_curriculum: "Explore curriculum",
    badge_module: "MODULE",
    btn_continue_lesson: "Continue Lesson",
    badge_put_practice: "PUT IT INTO PRACTICE",
    badge_davinci_challenge: "DaVinci Challenge",
    btn_open_challenge: "Open Practice Challenge",
    target_duration_label: "Target:",
    target_max_pause_label: "Max Pause:",
    skills_progress_title: "Skill Progress Overview",
    skills_progress_sub: "Evolving analysis scores based on your DaVinci Resolve exports",
    link_full_profile: "Full Profile",

    // Curriculum
    curriculum_eyebrow: "FOUNDATION CURRICULUM",
    curriculum_title: "Editing Thinking & Craft",
    curriculum_sub: "Master the psychological and storytelling principles of when, why, and how to cut before practicing in DaVinci Resolve.",
    lessons_completed_tag: "Completed",

    // Lesson Detail
    back_to_curriculum: "Back to Curriculum",
    status_completed: "Completed",
    core_principle: "Core Principle",
    why_it_works: "Why Does This Cut Work?",
    pitfall_bad: "Common Pitfall (Bad Example)",
    pitfall_result: "Result: Momentum drains, viewer clicks away",
    intentional_good: "The Intentional Cut (Good Example)",
    intentional_result: "Result: Seamless rhythm, natural retention",
    quiz_title: "Mini Comprehension Quiz",
    quiz_sub: "Test your editing instinct",
    btn_submit_answer: "Submit Answer",
    quiz_correct: "Correct!",
    quiz_incorrect: "Not quite.",
    lesson_cta_title: "Ready to Put This into Practice?",
    lesson_cta_sub: "Open the raw footage folder in DaVinci Resolve, apply these principles, and submit your MP4.",
    btn_launch_challenge: "Launch Challenge",

    // Practice
    practice_challenge_badge: "PRACTICE CHALLENGE",
    btn_open_folder: "Open Practice Folder",
    practice_assets_title: "Practice Assets & Raw Footage",
    practice_assets_sub: "Preview raw footage, download to your editing software (DaVinci/Premiere), or find more free stock.",
    btn_download_raw: "Download Raw Footage (.MP4)",
    btn_download_sample: "Download Sample Solution (.MP4)",
    raw_preview_badge: "RAW SOURCE FOOTAGE (40s UNEDITED)",
    external_sources_title: "Curated Free Footage & Sound Sources",
    external_sources_sub: "Expand your edit with free 4K talking heads, cinematic B-roll, and sound effects.",
    open_external: "Browse Library →",
    davinci_workflow_title: "DaVinci Resolve Workflow",
    step_1: "Click Open Practice Folder to access raw_footage.mp4.",
    step_2: "Drag the clip into your timeline in DaVinci Resolve.",
    step_3: "Trim dead air, cut on finished thoughts, and keep shot lengths tight (under 3.5s).",
    step_4: "Export as MP4 or QuickTime MOV, then submit below.",
    checklist_title: "Editor's Checklist",
    benchmarks_title: "Target Benchmarks",
    benchmark_duration: "Target Duration",
    benchmark_hold: "Max Hold Time",
    benchmark_asl: "Target ASL",
    benchmark_silence: "Max Silence Gap",
    submit_video_title: "Submit Exported Video",
    submit_video_sub: "Select your exported MP4 or MOV. EditLab analyzes scene pacing, silence gaps, and returns timestamped coaching.",
    use_demo_title: "Use Pre-Rendered Demo Solution",
    use_demo_sub: "sample_edited.mp4 (24s with 7 scenes)",
    btn_select: "Select",
    btn_selected: "Selected",
    upload_drag_title: "Click to select exported MP4 or drag & drop here",
    upload_drag_sub: "Supports standard H.264 MP4 or QuickTime MOV",
    btn_change_file: "Change video file",
    btn_analyze_my_edit: "Analyze My Edit",
    analyzing_pipeline: "Running FFmpeg & Coaching Pipeline...",

    // Feedback
    coach_session_badge: "AI VIDEO COACH • SESSION",
    feedback_title: "Analysis & Actionable Feedback",
    overall_score_label: "Overall Score:",
    timeline_title: "Interactive Timeline",
    timeline_sub: "Click any track to jump",
    track_shots: "Shots & Cuts",
    track_silence: "Silence / Dead Air Track",
    track_markers: "Coaching Markers",
    metrics_title: "Video Metrics",
    metric_duration: "Total Duration",
    metric_shots: "Shot Count",
    metric_asl: "Average Shot (ASL)",
    metric_cpm: "Cuts / Minute",
    metric_longest: "Longest Shot",
    metric_shortest: "Shortest Shot",
    metric_silence: "Silence Gaps",
    metric_speech_ratio: "Speech Ratio",
    actionable_feedback_title: "Actionable Timestamp Feedback",
    observations_tag: "observations",
    jump_to_cut: "Jump to cut →",
    tag_good: "GOOD",
    tag_improve: "IMPROVE",
    try_suggestion: "Try:",
    skills_for_edit: "Skill Scores for This Edit",
    coach_recommendation: "Coach Recommendation",
    btn_start_recommended: "Start Recommended Practice",

    // Skills Profile
    dna_badge: "Personal Editing DNA",
    avg_mastery: "Average Mastery:",
    btn_practice_now: "Practice Now",
    strongest_skill_badge: "Strongest Skill",
    strongest_skill_desc: "Your cut cadence and precision in this area show strong natural instinct and high viewer engagement.",
    needs_practice_badge: "Needs Practice",
    needs_practice_desc: "Focus on this discipline during your next DaVinci Resolve challenge to tighten your overall edit flow.",
    comprehensive_skills_title: "Comprehensive Skill Assessment",
    confidence_label: "Conf:",

    // Settings
    settings_title: "System Settings",
    settings_sub: "Configure your local workspace, tools, and AI coaching providers.",
    engine_title: "Video Processing Engine",
    installed: "Installed",
    missing: "Missing",
    workspace_dir_title: "Local Workspace Directory",
    workspace_dir_sub: "Assets & Database Path",
    ai_provider_title: "AI Coaching Provider",
    ai_provider_sub: "Provider Mode",
    opt_local: "Local Rule-Based Engine (Default • 100% Offline • No API Key Needed)",
    opt_gemini: "Google Gemini API (Generative Video Coaching)",
    btn_save_settings: "Save Settings",
    btn_saving: "Saving...",
  },

  th: {
    // Sidebar
    brand_slogan: "ให้ทุกคัตมีความหมาย",
    your_workspace: "พื้นที่ทำงานของคุณ",
    nav_overview: "ภาพรวม",
    nav_learn: "บทเรียน",
    nav_practice: "ฝึกตัดต่อ",
    nav_skills: "ทักษะของฉัน",
    nav_settings: "ตั้งค่า",
    sidebar_quote_title: "ฝึกทีละนิด เป็นนักตัดต่อที่เก่งขึ้น",
    sidebar_quote_sub: "สร้างสัญชาตญาณ คัตอย่างเข้าใจและมีเป้าหมาย",
    sidebar_find_lesson: "ดูบทเรียนถัดไป",
    sidebar_how_it_works: "วิธีใช้งาน",

    // Dashboard Overview
    eyebrow_workspace: "พื้นที่สร้างสรรค์ของคุณ",
    header_title: "คัตเล็กๆ สู่พัฒนาการที่ยิ่งใหญ่",
    header_sub: "เรียนรู้ทีละนิด ลงมือทำทีละน้อย สร้างผลงานที่ดีขึ้นในวันนี้",
    btn_new_practice: "เริ่มฝึกใหม่",
    hero_badge: "บทเรียนถัดไปของคุณ",
    hero_title: "งานตัดที่ดี เริ่มต้นจากสัญชาตญาณที่เฉียบคม",
    hero_sub: "เรียนรู้เหตุผลเบื้องหลังทุกคัต แล้วนำไปลงมือตัดจริงใน DaVinci Resolve",
    btn_continue_learning: "เรียนต่อทันที",
    hero_meta: "6 นาที • 1 เทคนิคที่ใช้ได้จริงวันนี้",
    hero_nle_tag: "จุดเริ่มต้นผลงานชิ้นเอกของคุณ",

    // Stats
    stat_lessons: "บทเรียน",
    stat_completed_so_far: "เรียนจบแล้ว",
    stat_skill_average: "คะแนนทักษะเฉลี่ย",
    stat_journey: "เส้นทางการเติบโต",

    // Dashboard sections
    section_pick_up: "เรียนต่อจากที่ค้างไว้",
    link_explore_curriculum: "ดูหลักสูตรทั้งหมด",
    badge_module: "โมดูล",
    btn_continue_lesson: "เรียนต่อ",
    badge_put_practice: "ลงมือฝึกจริง",
    badge_davinci_challenge: "โจทย์ DaVinci",
    btn_open_challenge: "เปิดโจทย์ฝึกซ้อม",
    target_duration_label: "ความยาวเป้าหมาย:",
    target_max_pause_label: "หยุดพูดสูงสุด:",
    skills_progress_title: "ภาพรวมพัฒนาการทักษะ",
    skills_progress_sub: "คะแนนพัฒนาการอิงจากการวิเคราะห์งาน Export จริงของคุณ",
    link_full_profile: "ดูโปรไฟล์เต็ม",

    // Curriculum
    curriculum_eyebrow: "หลักสูตรพื้นฐาน",
    curriculum_title: "วิธีคิดและการคราฟต์งานตัดต่อ",
    curriculum_sub: "เข้าใจจิตวิทยาและหลักการเล่าเรื่องว่าเมื่อไหร่ ทำไม และตัดอย่างไร ก่อนลงมือใน DaVinci Resolve",
    lessons_completed_tag: "เสร็จสิ้น",

    // Lesson Detail
    back_to_curriculum: "กลับสู่หน้าหลักสูตร",
    status_completed: "เรียนจบแล้ว",
    core_principle: "หลักการสำคัญ",
    why_it_works: "ทำไมคัตแบบนี้ถึงได้ผล?",
    pitfall_bad: "ข้อผิดพลาดที่พบบ่อย (ตัวอย่างที่ไม่ดี)",
    pitfall_result: "ผลลัพธ์: จังหวะสะดุด ผู้ชมกดเลื่อนผ่าน",
    intentional_good: "คัตอย่างมีชั้นเชิง (ตัวอย่างที่ดี)",
    intentional_result: "ผลลัพธ์: ไหลลื่นน่าติดตาม รักษาความสนใจได้ดี",
    quiz_title: "แบบทดสอบวัดความเข้าใจ",
    quiz_sub: "ทดสอบสัญชาตญาณการตัดต่อของคุณ",
    btn_submit_answer: "ส่งคำตอบ",
    quiz_correct: "ถูกต้อง!",
    quiz_incorrect: "ยังไม่ถูกต้อง",
    lesson_cta_title: "พร้อมนำไปลงมือฝึกตัดจริงหรือยัง?",
    lesson_cta_sub: "เปิดโฟลเดอร์ไฟล์ Raw Footage ใน DaVinci Resolve นำหลักการไปใช้ แล้วส่งวิดีโอ MP4 กลับมาตรวจ",
    btn_launch_challenge: "เปิดโจทย์ฝึกซ้อม",

    // Practice
    practice_challenge_badge: "โจทย์ฝึกซ้อมตัดต่อ",
    btn_open_folder: "เปิดโฟลเดอร์ในเครื่อง",
    practice_assets_title: "ไฟล์ Source สำหรับฝึกตัดต่อ",
    practice_assets_sub: "ดูตัวอย่างคลิปดิบก่อนตัด ดาวน์โหลดไปใช้ในโปรแกรมตัดต่อ (DaVinci/Premiere) หรือโหลด Source ฟรีเพิ่มเติม",
    btn_download_raw: "ดาวน์โหลด Source Video (.MP4)",
    btn_download_sample: "ดาวน์โหลดวิดีโอตัวอย่างตัดเสร็จ (.MP4)",
    raw_preview_badge: "ฟุตเทจดิบต้นฉบับ (40 วินาที ยังไม่ได้ตัด)",
    external_sources_title: "คลัง Source ฟรีไม่มีลิขสิทธิ์สำหรับฝึกตัดต่อ",
    external_sources_sub: "ฟุตเทจคนพูดความคมชัดสูง, คลิป B-Roll คั่นฉาก และเสียง Sound Effects ยอดนิยม",
    open_external: "เปิดคลังดาวน์โหลด →",
    davinci_workflow_title: "ขั้นตอนการทำงานใน DaVinci Resolve",
    step_1: "คลิก 'เปิดโฟลเดอร์ฟุตเทจ' เพื่อเข้าถึงไฟล์ raw_footage.mp4",
    step_2: "ลากคลิปเข้าสู่ไทม์ไลน์ใน DaVinci Resolve",
    step_3: "ตัด Dead air, คัตทันทีที่จบประโยค และคุมความยาวช็อตให้กระชับ (ต่ำกว่า 3.5 วินาที)",
    step_4: "Export เป็น MP4 หรือ QuickTime MOV แล้วนำมาอัปโหลดด้านล่าง",
    checklist_title: "เช็กลิสต์ของนักตัดต่อ",
    benchmarks_title: "เกณฑ์เป้าหมายการประเมิน",
    benchmark_duration: "ความยาวเป้าหมาย",
    benchmark_hold: "ความยาวช็อตสูงสุด",
    benchmark_asl: "ความยาวช็อตเฉลี่ย (ASL)",
    benchmark_silence: "ช่วงเงียบสูงสุด",
    submit_video_title: "ส่งวิดีโอที่ตัดเสร็จแล้ว",
    submit_video_sub: "เลือกไฟล์ MP4 หรือ MOV ที่ Export มา EditLab จะวิเคราะห์จังหวะคัต ช่วงเงียบ และให้ข้อเสนอแนะพร้อม Timestamp",
    use_demo_title: "ใช้วิดีโอตัวอย่างที่ระบบเตรียมไว้",
    use_demo_sub: "sample_edited.mp4 (24 วินาที 7 ฉากคัต)",
    btn_select: "เลือก",
    btn_selected: "เลือกแล้ว",
    upload_drag_title: "คลิกเพื่อเลือกไฟล์ MP4 หรือลากไฟล์มาวางที่นี่",
    upload_drag_sub: "รองรับไฟล์มาตรฐาน H.264 MP4 หรือ QuickTime MOV",
    btn_change_file: "เปลี่ยนไฟล์วิดีโอ",
    btn_analyze_my_edit: "วิเคราะห์งานตัดของฉัน",
    analyzing_pipeline: "กำลังรันระบบวิเคราะห์ FFmpeg และประเมินผล...",

    // Feedback
    coach_session_badge: "AI โค้ชการตัดต่อ • เซสชัน",
    feedback_title: "ผลการวิเคราะห์และคำแนะนำที่นำไปใช้ได้จริง",
    overall_score_label: "คะแนนรวม:",
    timeline_title: "ไทม์ไลน์เชิงโต้ตอบ",
    timeline_sub: "คลิกที่แทร็กใดก็ได้เพื่อข้ามไปยังเวลานั้นทันที",
    track_shots: "แทร็กช็อตและจุดคัต",
    track_silence: "แทร็กช่วงเงียบ / Dead Air",
    track_markers: "แทร็กจุดแนะนำของโค้ช",
    metrics_title: "สถิติข้อมูลวิดีโอ",
    metric_duration: "ความยาวรวม",
    metric_shots: "จำนวนช็อต",
    metric_asl: "ความยาวเฉลี่ย (ASL)",
    metric_cpm: "จำนวนคัต / นาที",
    metric_longest: "ช็อตที่ยาวที่สุด",
    metric_shortest: "ช็อตที่สั้นที่สุด",
    metric_silence: "เวลารวมช่วงเงียบ",
    metric_speech_ratio: "สัดส่วนเสียงพูด",
    actionable_feedback_title: "คำแนะนำตามจุดตัด (Timestamp Feedback)",
    observations_tag: "จุดสังเกต",
    jump_to_cut: "ข้ามไปยังจุดคัต →",
    tag_good: "จุดที่ดี",
    tag_improve: "จุดที่ควรปรับ",
    try_suggestion: "ลอง:",
    skills_for_edit: "คะแนนทักษะสำหรับงานตัดนี้",
    coach_recommendation: "คำแนะนำจากโค้ช",
    btn_start_recommended: "เริ่มฝึกโจทย์แนะนำ",

    // Skills Profile
    dna_badge: "DNA การตัดต่อของคุณ",
    avg_mastery: "คะแนนความเชี่ยวชาญเฉลี่ย:",
    btn_practice_now: "ฝึกซ้อมทันที",
    strongest_skill_badge: "ทักษะที่โดดเด่นที่สุด",
    strongest_skill_desc: "จังหวะและความแม่นยำของคุณในด้านนี้แสดงถึงสัญชาตญาณที่เป็นธรรมชาติและตรึงใจผู้ชมได้ดี",
    needs_practice_badge: "ทักษะที่ควรฝึกเพิ่ม",
    needs_practice_desc: "เน้นทักษะนี้ในโจทย์ถัดไปของ DaVinci Resolve เพื่อให้งานตัดต่อของคุณกระชับและลื่นไหลยิ่งขึ้น",
    comprehensive_skills_title: "การประเมินทักษะอย่างละเอียด",
    confidence_label: "ความมั่นใจ:",

    // Settings
    settings_title: "การตั้งค่าระบบ",
    settings_sub: "กำหนดค่าโฟลเดอร์พื้นที่ทำงาน เครื่องมือ และเอนจิน AI โค้ชชิ่ง",
    engine_title: "เอนจินประมวลผลวิดีโอ",
    installed: "ติดตั้งแล้ว",
    missing: "ไม่พบ",
    workspace_dir_title: "โฟลเดอร์พื้นที่ทำงานในเครื่อง",
    workspace_dir_sub: "ตำแหน่งฐานข้อมูลและไฟล์ฟุตเทจ",
    ai_provider_title: "เอนจิน AI โค้ชชิ่ง",
    ai_provider_sub: "โหมดผู้ให้บริการ",
    opt_local: "Local Rule-Based Engine (ค่าเริ่มต้น • ใช้งานออฟไลน์ 100% • ไม่ต้องใช้ API Key)",
    opt_gemini: "Google Gemini API (Generative Video Coaching)",
    btn_save_settings: "บันทึกการตั้งค่า",
    btn_saving: "กำลังบันทึก...",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => translations.en[key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("editlab_lang") as Language;
    if (saved && (saved === "en" || saved === "th")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("editlab_lang", lang);
  };

  const t = (key: keyof typeof translations.en): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
