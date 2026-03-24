import { ActivityItem } from "@/data/site-data";

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">近期活動紀錄</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-3">
            <p className="text-xs text-cyan-100">{item.time}</p>
            <p className="mt-1 text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
