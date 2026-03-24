"use client";

import { useState } from "react";

interface CopyableCardProps {
  title: string;
  body: string;
  sourceRefs: string[];
}

export function CopyableCard({ title, body, sourceRefs }: CopyableCardProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="panel">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{body}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">Sources: {sourceRefs.join(", ")}</p>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </article>
  );
}
