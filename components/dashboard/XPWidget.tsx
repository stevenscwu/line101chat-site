import { Sparkles } from "lucide-react";
import { ProgressRing } from "@/components/shared/ProgressRing";

interface XPWidgetProps {
  xp: number;
  level: number;
}

export function XPWidget({ xp, level }: XPWidgetProps) {
  const levelMax = 600;
  const levelCurrent = xp % levelMax;

  return (
    <article className="rounded-3xl border border-violet-400/30 bg-violet-500/10 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-violet-100">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm font-semibold">學習 XP</p>
          </div>
          <p className="mt-2 text-3xl font-black text-white">{xp}</p>
          <p className="text-sm text-violet-100">Lv.{level} 修行中</p>
        </div>
        <ProgressRing value={levelCurrent} max={levelMax} label="升級進度" size={96} strokeWidth={8} />
      </div>
    </article>
  );
}
