import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { QuestItem } from "@/data/site-data";

interface DailyQuestListProps {
  quests: QuestItem[];
}

const statusStyle: Record<QuestItem["status"], string> = {
  todo: "text-slate-300",
  doing: "text-cyan-200",
  done: "text-emerald-200"
};

const statusIcon = {
  todo: Circle,
  doing: PlayCircle,
  done: CheckCircle2
};

export function DailyQuestList({ quests }: DailyQuestListProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">每日任務清單</h3>
      <p className="mt-1 text-sm text-slate-400">把今日任務拆小，完成率自然會高。</p>
      <ul className="mt-4 space-y-3">
        {quests.map((quest) => {
          const Icon = statusIcon[quest.status];
          return (
            <li
              key={quest.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-5 w-5 ${statusStyle[quest.status]}`} />
                <div>
                  <p className="text-sm font-medium text-slate-100">{quest.title}</p>
                  <p className="text-xs text-slate-400">+{quest.rewardXp} XP</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  quest.status === "done"
                    ? "bg-emerald-500/20 text-emerald-100"
                    : quest.status === "doing"
                      ? "bg-cyan-500/20 text-cyan-100"
                      : "bg-slate-700 text-slate-300"
                }`}
              >
                {quest.status === "done" ? "已完成" : quest.status === "doing" ? "進行中" : "待完成"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
