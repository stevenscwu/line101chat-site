"use client";

import { useEffect, useMemo, useState } from "react";

interface PronunciationLabClientProps {
  materialId: string;
  materialTitle: string;
  translation?: string;
  sentences: string[];
}

type Difficulty = "difficult" | "okay" | "mastered";
type DifficultyMap = Record<string, Difficulty>;

function getStorageKey(materialId: string): string {
  return `line101chat:difficulty:${materialId}`;
}

function sentenceKey(index: number): string {
  return `s-${index}`;
}

export function PronunciationLabClient({
  materialId,
  materialTitle,
  translation,
  sentences
}: PronunciationLabClientProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyMap>({});
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(getStorageKey(materialId));
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as DifficultyMap;
      setDifficulty(parsed);
    } catch {
      localStorage.removeItem(getStorageKey(materialId));
    }
  }, [materialId]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(materialId), JSON.stringify(difficulty));
  }, [difficulty, materialId]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const difficultyCount = useMemo(() => {
    return Object.values(difficulty).reduce(
      (acc, value) => {
        acc[value] += 1;
        return acc;
      },
      { difficult: 0, okay: 0, mastered: 0 }
    );
  }, [difficulty]);

  function setSentenceDifficulty(index: number, value: Difficulty) {
    const key = sentenceKey(index);
    setDifficulty((prev) => ({ ...prev, [key]: value }));
  }

  function playSentence(index: number) {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const text = sentences[index];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = slowMode ? 0.85 : 1;
    utterance.pitch = 1;
    utterance.onstart = () => setPlayingIndex(index);
    utterance.onend = () => setPlayingIndex((current) => (current === index ? null : current));
    utterance.onerror = () => setPlayingIndex(null);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function stopPlayback() {
    if (!("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    setPlayingIndex(null);
  }

  return (
    <div className="space-y-6">
      <section className="panel space-y-3">
        <h1 className="font-display text-3xl font-bold">Pronunciation Lab</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Material: <span className="font-semibold">{materialTitle}</span>
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowTranslation((prev) => !prev)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {showTranslation ? "Hide Translation" : "Show Translation"}
          </button>
          <button
            type="button"
            onClick={() => setSlowMode((prev) => !prev)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              slowMode
                ? "bg-brand-600 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {slowMode ? "Slow Mode: On (0.85x)" : "Slow Mode: Off (1.0x)"}
          </button>
          <button
            type="button"
            onClick={stopPlayback}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Stop Playback
          </button>
        </div>

        {showTranslation && translation ? (
          <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {translation}
          </p>
        ) : null}

        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
            Difficult: {difficultyCount.difficult}
          </div>
          <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">Okay: {difficultyCount.okay}</div>
          <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
            Mastered: {difficultyCount.mastered}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {sentences.map((sentence, index) => {
          const selected = difficulty[sentenceKey(index)];
          return (
            <article key={`${sentence}-${index}`} className="panel">
              <p className="text-xs uppercase tracking-wide text-slate-500">Sentence {index + 1}</p>
              <p className="mt-2 text-xl leading-relaxed">{sentence}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => playSentence(index)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    playingIndex === index
                      ? "bg-brand-600 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {playingIndex === index ? "Playing..." : "Play"}
                </button>
                <button
                  type="button"
                  onClick={() => playSentence(index)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Replay
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setSentenceDifficulty(index, "difficult")}
                  className={`rounded-full px-3 py-1 ${
                    selected === "difficult"
                      ? "bg-rose-600 text-white"
                      : "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  }`}
                >
                  Difficult
                </button>
                <button
                  type="button"
                  onClick={() => setSentenceDifficulty(index, "okay")}
                  className={`rounded-full px-3 py-1 ${
                    selected === "okay"
                      ? "bg-amber-600 text-white"
                      : "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  }`}
                >
                  Okay
                </button>
                <button
                  type="button"
                  onClick={() => setSentenceDifficulty(index, "mastered")}
                  className={`rounded-full px-3 py-1 ${
                    selected === "mastered"
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  }`}
                >
                  Mastered
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
