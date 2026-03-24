import type { Metadata } from "next";
import { EncouragementBanner } from "@/components/dashboard/EncouragementBanner";
import { LearningPathMap } from "@/components/learn/LearningPathMap";
import { learningPathNodes } from "@/data/site-data";

export const metadata: Metadata = {
  title: "學習路徑 | Japanese After 50",
  description:
    "視覺化日語學習路徑：Lesson、Review、Milestone、Challenge，一步一步清楚前進。"
};

export default function LearnPage() {
  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">學習路徑</p>
        <h1 className="mt-2 text-3xl font-black text-white">學習路徑</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          這不是一次衝刺，而是可持續的關卡化學習。每完成一個節點，就把日語再收進一點點。
        </p>
      </header>

      <LearningPathMap nodes={learningPathNodes} />

      <section className="surface-card grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-100">已完成章節</p>
          <p className="mt-2 text-3xl font-black text-white">
            {learningPathNodes.filter((node) => node.status === "completed").length}
          </p>
        </article>
        <article className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4">
          <p className="text-sm text-cyan-100">目前進行中</p>
          <p className="mt-2 text-3xl font-black text-white">
            {learningPathNodes.filter((node) => node.status === "current").length}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
          <p className="text-sm text-slate-300">待解鎖章節</p>
          <p className="mt-2 text-3xl font-black text-white">
            {learningPathNodes.filter((node) => node.status === "locked").length}
          </p>
        </article>
      </section>

      <EncouragementBanner message="把關卡拆小，就能把長期目標變成每天看得見的前進。" />
    </main>
  );
}
