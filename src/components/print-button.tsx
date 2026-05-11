"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
      onClick={() => window.print()}
    >
      {label}
      <Printer className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
