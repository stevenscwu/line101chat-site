import type { PropsWithChildren } from "react";

export function ProjectTag({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-300/80 bg-white/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-700">
      {children}
    </span>
  );
}
