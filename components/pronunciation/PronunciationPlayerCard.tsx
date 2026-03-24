"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mic, PauseCircle, PlayCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { PhraseItem } from "@/lib/learning/types";

interface PronunciationPlayerCardProps {
  phrase: PhraseItem;
  showKana?: boolean;
  showZh?: boolean;
}

export function PronunciationPlayerCard({
  phrase,
  showKana = true,
  showZh = true
}: PronunciationPlayerCardProps) {
  const reduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);

  function speak(text: string, rate: number) {
    if (!("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = rate;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    if (!("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -2 }}
      className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-slate-900 to-slate-800 p-5"
    >
      <p className="text-xs tracking-wide text-cyan-200">{phrase.context}</p>
      <p className="mt-2 text-2xl font-bold text-white">{phrase.ja}</p>
      {showKana ? <p className="mt-2 text-sm text-cyan-100">{phrase.kana}</p> : null}
      {showZh ? <p className="mt-3 text-sm text-slate-300">{phrase.zhTW}</p> : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => speak(phrase.ja, 1)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 hover:bg-slate-700"
        >
          <PlayCircle className="h-4 w-4" />
          播放
        </button>
        <button
          type="button"
          onClick={() => speak(phrase.ja, 0.84)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          慢速重播
        </button>
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 hover:bg-slate-700"
        >
          <Mic className="h-4 w-4" />
          錄音練習
        </button>
        <button
          type="button"
          onClick={stop}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 hover:bg-slate-700"
        >
          <PauseCircle className="h-4 w-4" />
          停止
        </button>
      </div>
      {isPlaying ? <p className="mt-3 text-xs text-cyan-100">播放中...</p> : null}
    </motion.article>
  );
}
