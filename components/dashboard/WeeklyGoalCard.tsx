interface WeeklyGoalCardProps {
  studiedMinutes: number;
  targetMinutes: number;
}

export function WeeklyGoalCard({ studiedMinutes, targetMinutes }: WeeklyGoalCardProps) {
  const progress = Math.min(100, Math.round((studiedMinutes / targetMinutes) * 100));

  return (
    <article className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5">
      <p className="text-sm font-semibold text-emerald-100">本週目標</p>
      <p className="mt-2 text-2xl font-black text-white">
        {studiedMinutes} / {targetMinutes} 分鐘
      </p>
      <div className="mt-3 h-3 rounded-full bg-slate-800">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all"
          style={{ width: `${progress}%` }}
          aria-label={`本週進度 ${progress}%`}
        />
      </div>
      <p className="mt-2 text-sm text-emerald-100">{progress}% 已達成，繼續穩定往前。</p>
    </article>
  );
}
