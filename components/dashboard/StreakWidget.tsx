import { Flame } from "lucide-react";

interface StreakWidgetProps {
  days: number;
}

export function StreakWidget({ days }: StreakWidgetProps) {
  return (
    <article className="rounded-3xl border border-orange-400/30 bg-orange-500/10 p-5">
      <div className="flex items-center gap-2 text-orange-200">
        <Flame className="h-5 w-5" />
        <p className="text-sm font-semibold">連續天數</p>
      </div>
      <p className="mt-3 text-4xl font-black text-white">{days}</p>
      <p className="mt-1 text-sm text-orange-100">每天都有打卡，語感會自己長出來。</p>
    </article>
  );
}
