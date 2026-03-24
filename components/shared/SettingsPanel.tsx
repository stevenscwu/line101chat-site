"use client";

import { useState } from "react";
import { LearningDisplayModeSwitch } from "@/components/shared/LearningDisplayModeSwitch";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";

export function SettingsPanel() {
  const [mode, setMode] = useState<"beginner" | "study" | "immersion">("study");
  const [dailyReminder, setDailyReminder] = useState(true);

  return (
    <div className="space-y-6">
      <LearningDisplayModeSwitch value={mode} onChange={setMode} />

      <section className="surface-card">
        <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">每日學習提醒</p>
            <p className="text-xs text-slate-400">每天固定時間提醒今天任務</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dailyReminder}
            onClick={() => setDailyReminder((prev) => !prev)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition ${
              dailyReminder ? "bg-cyan-400" : "bg-slate-600"
            }`}
          >
            <span
              className={`h-6 w-6 rounded-full bg-white transition ${dailyReminder ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </label>
        <PrimaryActionButton className="mt-4">儲存設定</PrimaryActionButton>
      </section>
    </div>
  );
}
