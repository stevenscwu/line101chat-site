import type { Metadata } from "next";
import { SocialClipIdeasCard } from "@/components/social/SocialClipIdeasCard";
import { socialIdeas } from "@/data/site-data";

export const metadata: Metadata = {
  title: "社群靈感 | Japanese After 50",
  description:
    "用真實學習資料生成低成本貼文靈感：今日一句、卡關筆記、一週回顧、短片提詞。"
};

export default function SocialIdeasPage() {
  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">社群靈感</p>
        <h1 className="mt-2 text-3xl font-black text-white">社群靈感</h1>
        <p className="mt-2 text-sm text-slate-300">
          內容不用硬想，從今天真實學習紀錄直接轉成可發佈素材。
        </p>
      </header>

      <SocialClipIdeasCard ideas={socialIdeas} />

      <section className="surface-card">
        <h2 className="text-lg font-semibold text-white">今日發佈建議流程</h2>
        <ol className="mt-3 space-y-2 text-sm text-slate-300">
          <li className="rounded-xl bg-slate-800/70 px-3 py-2">1. 從「今日一句」挑一段 20 秒短句錄音。</li>
          <li className="rounded-xl bg-slate-800/70 px-3 py-2">2. 補一行今天最卡的點，保持真實。</li>
          <li className="rounded-xl bg-slate-800/70 px-3 py-2">3. 附上 #50後學日語 #日本語修行中。</li>
        </ol>
      </section>
    </main>
  );
}
