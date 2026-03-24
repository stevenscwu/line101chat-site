interface StatChipProps {
  label: string;
  value: string;
  tone?: "cyan" | "violet" | "amber" | "emerald";
}

const toneClass: Record<NonNullable<StatChipProps["tone"]>, string> = {
  cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
  violet: "border-violet-400/30 bg-violet-400/10 text-violet-100",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
};

export function StatChip({ label, value, tone = "cyan" }: StatChipProps) {
  return (
    <article className={`rounded-2xl border px-4 py-3 ${toneClass[tone]}`}>
      <p className="text-xs tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </article>
  );
}
