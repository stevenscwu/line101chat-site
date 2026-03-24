"use client";

import { FormEvent, useState } from "react";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";

interface DailyJournalCardProps {
  prompts: string[];
}

export function DailyJournalCard({ prompts }: DailyJournalCardProps) {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("穩定");
  const [confidence, setConfidence] = useState(3);
  const [saved, setSaved] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!entry.trim()) {
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
    setEntry("");
  }

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">今日學習日誌</h3>
      <p className="mt-1 text-sm text-slate-400">30 秒就能留下今天的學習痕跡。</p>

      <div className="mt-4 space-y-2">
        {prompts.map((prompt) => (
          <p key={prompt} className="rounded-xl bg-slate-800/70 px-3 py-2 text-sm text-slate-200">
            {prompt}
          </p>
        ))}
      </div>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-300">
            今日心情
            <select
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-slate-100"
            >
              <option>穩定</option>
              <option>有點卡</option>
              <option>有突破</option>
            </select>
          </label>
          <label className="text-sm text-slate-300">
            今日信心 {confidence}/5
            <input
              type="range"
              min={1}
              max={5}
              value={confidence}
              onChange={(event) => setConfidence(Number(event.target.value))}
              className="mt-3 w-full accent-cyan-400"
            />
          </label>
        </div>

        <textarea
          value={entry}
          onChange={(event) => setEntry(event.target.value)}
          placeholder="寫下今天一句最有感的日文或你的卡點..."
          rows={4}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
        />

        <div className="flex items-center gap-3">
          <PrimaryActionButton type="submit">儲存今日日誌</PrimaryActionButton>
          {saved ? <p className="text-sm text-emerald-300">已儲存，今天有前進。</p> : null}
        </div>
      </form>
    </section>
  );
}
