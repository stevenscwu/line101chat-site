"use client";

import { LearningDisplayMode } from "@/lib/learning";

interface LearningDisplayModeSwitchProps {
  value: LearningDisplayMode;
  onChange: (mode: LearningDisplayMode) => void;
}

const modeOptions: { id: LearningDisplayMode; label: string; hint: string }[] = [
  { id: "beginner", label: "初學模式", hint: "日文 + 假名 + 繁中" },
  { id: "study", label: "學習模式", hint: "日文 + 繁中，假名可展開" },
  { id: "immersion", label: "沉浸模式", hint: "日文優先，繁中預設隱藏" }
];

export function LearningDisplayModeSwitch({ value, onChange }: LearningDisplayModeSwitchProps) {
  return (
    <section className="surface-card">
      <p className="chip-label">Learning Display Mode</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {modeOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-full px-3 py-2 text-sm ${
              option.id === value
                ? "bg-cyan-400 text-slate-950"
                : "border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">{modeOptions.find((option) => option.id === value)?.hint}</p>
    </section>
  );
}
