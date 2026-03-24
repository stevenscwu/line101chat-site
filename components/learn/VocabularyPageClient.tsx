"use client";

import { useMemo, useState } from "react";
import { vocabUnit001 } from "@/src/content/vocab/unit-001";
import { resolveDisplayMode } from "@/lib/learning";
import { LearningDisplayModeSwitch } from "@/components/shared/LearningDisplayModeSwitch";
import { VocabularyReviewCard } from "@/components/learn/VocabularyReviewCard";

export function VocabularyPageClient() {
  const [mode, setMode] = useState<"beginner" | "study" | "immersion">("study");
  const [showKanaOverride, setShowKanaOverride] = useState(false);
  const [showZhOverride, setShowZhOverride] = useState(false);

  const display = useMemo(() => resolveDisplayMode(mode), [mode]);
  const showKana = mode === "study" ? showKanaOverride : display.showKanaByDefault;
  const showZh = mode === "immersion" ? showZhOverride : display.showZhByDefault;

  const dueCount = vocabUnit001.filter((item) => item.dueInDays === 0).length;
  const weakCount = vocabUnit001.filter((item) => item.weaknessScore >= 70).length;

  return (
    <div className="space-y-6">
      <section className="surface-card grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4">
          <p className="text-xs text-cyan-100">今日到期</p>
          <p className="mt-1 text-2xl font-black text-white">{dueCount}</p>
        </article>
        <article className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4">
          <p className="text-xs text-amber-100">弱項單字</p>
          <p className="mt-1 text-2xl font-black text-white">{weakCount}</p>
        </article>
        <article className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
          <p className="text-xs text-emerald-100">本單元總數</p>
          <p className="mt-1 text-2xl font-black text-white">{vocabUnit001.length}</p>
        </article>
      </section>

      <LearningDisplayModeSwitch value={mode} onChange={setMode} />

      {mode === "study" ? (
        <button type="button" onClick={() => setShowKanaOverride((prev) => !prev)} className="pill">
          {showKana ? "隱藏假名" : "顯示假名"}
        </button>
      ) : null}

      {mode === "immersion" ? (
        <button type="button" onClick={() => setShowZhOverride((prev) => !prev)} className="pill">
          {showZh ? "隱藏繁中提示" : "顯示繁中提示"}
        </button>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {vocabUnit001.map((item) => (
          <VocabularyReviewCard key={item.id} item={item} showKana={showKana} showZh={showZh} />
        ))}
      </section>
    </div>
  );
}
