import { BadgeItem } from "@/data/site-data";

interface BadgeShelfProps {
  badges: BadgeItem[];
}

export function BadgeShelf({ badges }: BadgeShelfProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">成就徽章牆</h3>
      <p className="mt-1 text-sm text-slate-400">每個徽章都代表一段真實累積。</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {badges.map((badge) => (
          <article
            key={badge.id}
            className={`rounded-2xl border p-4 ${
              badge.unlocked
                ? "border-amber-400/50 bg-amber-500/10"
                : "border-slate-700 bg-slate-800/70"
            }`}
          >
            <p className="text-2xl">{badge.icon}</p>
            <p className="mt-2 text-sm font-semibold text-white">{badge.name}</p>
            <p className="mt-1 text-xs text-slate-300">{badge.description}</p>
            <div className="mt-3 h-2 rounded-full bg-slate-800">
              <div
                className={`h-2 rounded-full ${badge.unlocked ? "bg-amber-300" : "bg-cyan-400"}`}
                style={{ width: `${badge.progress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">{badge.progress}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
