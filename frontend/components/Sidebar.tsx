"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scissors,
  Home,
  BookOpen,
  Target,
  BarChart2,
  Sliders,
  ArrowUpRight,
  HelpCircle,
  AudioLines,
  Languages,
  Laptop,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { label: t("nav_overview"), href: "/", icon: Home },
    { label: t("nav_learn"), href: "/learn", icon: BookOpen },
    { label: t("nav_practice"), href: "/practice/pacing-01-practice", icon: Target },
    { label: t("nav_guides"), href: "/guides", icon: Laptop },
    { label: t("nav_skills"), href: "/skills", icon: BarChart2 },
    { label: t("nav_settings"), href: "/settings", icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e8eee9] min-h-screen flex flex-col justify-between p-5 shrink-0 select-none">
      <div className="space-y-6">
        {/* Brand Logo & Language Switcher */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#d8ece1] flex items-center justify-center text-[#163324] transition group-hover:bg-[#cae5d5] shadow-xs">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#163324] leading-tight font-sans">
                EditLab<span className="text-[#2e7354]">.</span>
              </span>
              <span className="text-[9px] font-bold text-[#718278] tracking-widest uppercase">
                {t("brand_slogan")}
              </span>
            </div>
          </Link>
        </div>

        {/* Language Selector Pill */}
        <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#f4f7f5] border border-[#e2ece5]">
          <div className="flex items-center gap-1.5 px-2 text-[11px] font-medium text-[#5e6d64]">
            <Languages className="w-3.5 h-3.5 text-[#2e7354]" />
            <span className="font-mono text-[10px] uppercase">{language === "en" ? "EN" : "TH"}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                language === "en"
                  ? "bg-[#163324] text-white shadow-xs"
                  : "text-[#5e6d64] hover:text-[#163324]"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("th")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                language === "th"
                  ? "bg-[#163324] text-white shadow-xs"
                  : "text-[#5e6d64] hover:text-[#163324]"
              }`}
            >
              ไทย
            </button>
          </div>
        </div>

        {/* Section: YOUR WORKSPACE */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold tracking-widest text-[#8a9990] uppercase px-3 py-1">
            {t("your_workspace")}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#d8ece1] text-[#163324] font-semibold shadow-xs"
                      : "text-[#5e6d64] hover:text-[#163324] hover:bg-[#f1f6f2]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#163324]" : "text-[#718278]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#1b5e3a]" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="space-y-3 pt-6">
        {/* Practice encouragement card */}
        <div className="bg-[#eef6f1] border border-[#dcebe1] rounded-2xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#2e7354]">
            <AudioLines className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#163324] leading-snug">
              {t("sidebar_quote_title")}
            </div>
            <p className="text-[11px] text-[#5e6d64] leading-relaxed mt-1">
              {t("sidebar_quote_sub")}
            </p>
          </div>
          <div className="pt-1">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1f4a34] hover:text-[#163324] transition group"
            >
              <span>{t("sidebar_find_lesson")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>
          </div>
        </div>

        {/* Help / How it works */}
        <div className="px-2 pt-1 flex items-center justify-between text-xs text-[#718278] hover:text-[#163324] transition cursor-pointer">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t("sidebar_how_it_works")}</span>
          </div>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </aside>
  );
}
