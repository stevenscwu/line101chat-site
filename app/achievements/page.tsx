import type { Metadata } from "next";
import { BadgeShelf } from "@/components/achievements/BadgeShelf";
import { badgeItems, progressData } from "@/data/site-data";

export const metadata: Metadata = {
  title: "成就牆 | Japanese After 50",
  description:
    "可視化學習成就：連續天數、章節完成、口說里程碑與公開紀錄進度。"
};

export default function AchievementsPage() {
  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">成就牆</p>
        <h1 className="mt-2 text-3xl font-black text-white">成就牆</h1>
        <p className="mt-2 text-sm text-slate-300">
          不是為了炫耀，而是提醒自己：每一天的持續都有被看見。
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="surface-card">
          <p className="text-sm text-slate-300">連續天數里程碑</p>
          <p className="mt-2 text-3xl font-black text-white">{progressData.streakDays} / 21</p>
        </article>
        <article className="surface-card">
          <p className="text-sm text-slate-300">目前等級</p>
          <p className="mt-2 text-3xl font-black text-white">Lv.{progressData.level}</p>
        </article>
        <article className="surface-card">
          <p className="text-sm text-slate-300">累積任務數</p>
          <p className="mt-2 text-3xl font-black text-white">{progressData.totalStudySessions}</p>
        </article>
      </section>

      <BadgeShelf badges={badgeItems} />
    </main>
  );
}
