"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, HardDrive, Cpu, Key, Save } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface SettingsData {
  ffmpeg_installed: boolean;
  ffprobe_installed: boolean;
  data_directory: string;
  ai_provider: string;
  gemini_api_key_set: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [dataDir, setDataDir] = useState("");
  const [aiProvider, setAiProvider] = useState("local_rule");
  const [geminiKey, setGeminiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: SettingsData) => {
        setSettings(data);
        setDataDir(data.data_directory);
        setAiProvider(data.ai_provider);
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveNotice(null);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data_directory: dataDir,
          ai_provider: aiProvider,
          gemini_api_key: geminiKey,
        }),
      });
      setSaveNotice(language === "th" ? "บันทึกการตั้งค่าเรียบร้อยแล้ว" : "Settings saved successfully.");
      setTimeout(() => setSaveNotice(null), 3000);
    } catch {
      setSaveNotice(language === "th" ? "บันทึกการตั้งค่าไม่สำเร็จ" : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <div className="text-[11px] font-bold tracking-widest text-[#2e7354] uppercase mb-1">
          {language === "th" ? "การปรับแต่งระบบ" : "Configuration"}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#141f19]">{t("settings_title")}</h1>
        <p className="text-sm text-[#5e6d64] mt-1">{t("settings_sub")}</p>
      </div>

      <div className="space-y-6">
        {/* Processing Engine Diagnostics */}
        <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2e7354]" />
            <span>{t("engine_title")}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] flex items-center justify-between">
              <span className="text-[#141f19] font-mono font-medium">FFmpeg</span>
              {settings?.ffmpeg_installed ? (
                <span className="flex items-center gap-1.5 text-[#15803d] font-semibold bg-[#eef6f1] px-2.5 py-1 rounded-full border border-[#dcebe1]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t("installed")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" /> {t("missing")}
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] flex items-center justify-between">
              <span className="text-[#141f19] font-mono font-medium">FFprobe</span>
              {settings?.ffprobe_installed ? (
                <span className="flex items-center gap-1.5 text-[#15803d] font-semibold bg-[#eef6f1] px-2.5 py-1 rounded-full border border-[#dcebe1]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t("installed")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" /> {t("missing")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Directory Card */}
        <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#2e7354]" />
            <span>{t("workspace_dir_title")}</span>
          </h3>

          <div>
            <label className="text-xs text-[#5e6d64] block mb-1.5">{t("workspace_dir_sub")}</label>
            <input
              type="text"
              value={dataDir}
              onChange={(e) => setDataDir(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] text-xs font-mono text-[#141f19] focus:outline-none focus:border-[#2e7354]"
            />
          </div>
        </div>

        {/* AI Provider Card */}
        <div className="p-7 rounded-2xl bg-white border border-[#e5ede7] space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-[#141f19] uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-[#2e7354]" />
            <span>{t("ai_provider_title")}</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#5e6d64] block mb-1.5">{t("ai_provider_sub")}</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] text-xs text-[#141f19] focus:outline-none focus:border-[#2e7354]"
              >
                <option value="local_rule">{t("opt_local")}</option>
                <option value="gemini">{t("opt_gemini")}</option>
              </select>
            </div>

            {aiProvider === "gemini" && (
              <div>
                <label className="text-xs text-[#5e6d64] block mb-1.5">Gemini API Key</label>
                <input
                  type="password"
                  placeholder={settings?.gemini_api_key_set ? "••••••••••••••••••••••••" : "Paste your GEMINI_API_KEY"}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8faf8] border border-[#e5ede7] text-xs font-mono text-[#141f19] focus:outline-none focus:border-[#2e7354]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-between pt-2">
          {saveNotice ? (
            <span className="text-xs text-[#15803d] font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {saveNotice}
            </span>
          ) : (
            <span></span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#163324] hover:bg-[#1e4230] text-white font-bold text-xs uppercase tracking-wider transition shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? t("btn_saving") : t("btn_save_settings")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
