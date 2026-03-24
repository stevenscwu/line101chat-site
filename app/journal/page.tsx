import type { Metadata } from "next";
import { DailyJournalCard } from "@/components/journal/DailyJournalCard";
import { journalEntries, journalPrompts } from "@/data/site-data";

export const metadata: Metadata = {
  title: "學習日誌 | Japanese After 50",
  description:
    "低摩擦日誌頁：快速紀錄今日心情、信心、反思，建立可持續的日語學習紀錄。"
};

export default function JournalPage() {
  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">學習日誌</p>
        <h1 className="mt-2 text-3xl font-black text-white">學習日誌</h1>
        <p className="mt-2 text-sm text-slate-300">
          每天 1 分鐘紀錄，就能看見自己如何慢慢變強。誠實記錄比完美記錄更有價值。
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DailyJournalCard prompts={journalPrompts} />

        <article className="surface-card">
          <h2 className="text-lg font-semibold text-white">近期日誌</h2>
          <div className="mt-4 space-y-3">
            {journalEntries.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{entry.date}</p>
                  <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300">{entry.mood}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{entry.reflection}</p>
                <p className="mt-2 text-xs text-cyan-200">信心：{entry.confidence}/5</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
