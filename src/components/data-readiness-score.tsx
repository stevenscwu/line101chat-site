import { CheckCircle2 } from "lucide-react";

import { readinessScores } from "@/data/site";

export function DataReadinessScore() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {readinessScores.map((item, index) => (
        <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black text-slate-400">0{index + 1}</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-black leading-6 text-slate-950">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}
