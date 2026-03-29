import type { BakeryNewsItem } from "@/lib/bakery/content";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

type BakeryNewsCardProps = {
  item: BakeryNewsItem;
};

export function BakeryNewsCard({ item }: BakeryNewsCardProps) {
  return (
    <article className="rounded-3xl border border-amber-200/90 bg-white p-5 shadow-[0_8px_22px_rgba(120,79,32,0.08)]">
      <p className="text-xs uppercase tracking-[0.13em] text-amber-900/60">{item.category}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-amber-950">{item.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-stone-700">{item.excerpt}</p>
      <p className="mt-4 text-xs text-amber-900/65">{formatDate(item.date)}</p>
    </article>
  );
}
