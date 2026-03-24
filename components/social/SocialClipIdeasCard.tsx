"use client";

import { useState } from "react";
import { Camera, Copy } from "lucide-react";
import { SocialIdea } from "@/data/site-data";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";

interface SocialClipIdeasCardProps {
  ideas: SocialIdea[];
}

export function SocialClipIdeasCard({ ideas }: SocialClipIdeasCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyText(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">社群短內容靈感</h3>
          <p className="mt-1 text-sm text-slate-400">低成本輸出，保持公開學習節奏。</p>
        </div>
        <PrimaryActionButton variant="secondary">
          <Camera className="mr-2 h-4 w-4" />
          錄製今日短片
        </PrimaryActionButton>
      </div>

      <div className="mt-4 space-y-3">
        {ideas.map((idea) => (
          <article key={idea.id} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-white">{idea.title}</h4>
              <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300">{idea.format}</span>
            </div>
            <p className="mt-2 text-sm text-cyan-100">{idea.hook}</p>
            <p className="mt-2 text-sm text-slate-300">{idea.caption}</p>
            <button
              type="button"
              onClick={() => copyText(idea.caption, idea.id)}
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-600 px-3 text-sm text-slate-200 hover:bg-slate-700"
            >
              <Copy className="h-4 w-4" />
              {copiedId === idea.id ? "已複製" : "複製文案"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
