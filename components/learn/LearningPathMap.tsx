import { LearningPathNode } from "@/data/site-data";
import { LessonNode } from "@/components/learn/LessonNode";

interface LearningPathMapProps {
  nodes: LearningPathNode[];
  compact?: boolean;
}

export function LearningPathMap({ nodes, compact = false }: LearningPathMapProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">學習路徑地圖</h3>
        <p className="text-xs text-slate-400">Lesson / Review / Milestone / Challenge</p>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 lg:grid-cols-5"}`}>
        {nodes.map((node, index) => (
          <LessonNode key={node.id} node={node} index={index} />
        ))}
      </div>
    </section>
  );
}
