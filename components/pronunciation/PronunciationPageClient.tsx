"use client";

import { useMemo, useState } from "react";
import { restaurantPhrases } from "@/src/content/phrases/restaurant";
import { resolveDisplayMode } from "@/lib/learning";
import { LearningDisplayModeSwitch } from "@/components/shared/LearningDisplayModeSwitch";
import { PronunciationPlayerCard } from "@/components/pronunciation/PronunciationPlayerCard";

export function PronunciationPageClient() {
  const [mode, setMode] = useState<"beginner" | "study" | "immersion">("beginner");
  const [showKanaOverride, setShowKanaOverride] = useState(false);
  const [showZhOverride, setShowZhOverride] = useState(false);

  const display = useMemo(() => resolveDisplayMode(mode), [mode]);
  const showKana = mode === "study" ? showKanaOverride : display.showKanaByDefault;
  const showZh = mode === "immersion" ? showZhOverride : display.showZhByDefault;

  return (
    <div className="space-y-6">
      <LearningDisplayModeSwitch value={mode} onChange={setMode} />

      {mode === "study" ? (
        <button
          type="button"
          onClick={() => setShowKanaOverride((prev) => !prev)}
          className="pill"
        >
          {showKana ? "隱藏假名" : "顯示假名"}
        </button>
      ) : null}

      {mode === "immersion" ? (
        <button
          type="button"
          onClick={() => setShowZhOverride((prev) => !prev)}
          className="pill"
        >
          {showZh ? "隱藏繁中提示" : "顯示繁中提示"}
        </button>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {restaurantPhrases.map((phrase) => (
          <PronunciationPlayerCard
            key={phrase.id}
            phrase={phrase}
            showKana={showKana}
            showZh={showZh}
          />
        ))}
      </section>
    </div>
  );
}
