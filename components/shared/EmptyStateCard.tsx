interface EmptyStateCardProps {
  title: string;
  description: string;
}

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <article className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </article>
  );
}
