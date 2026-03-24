import { StudyLogBoard } from "@/components/study-log/study-log-board";
import { getAllMaterials, getStudyLogs } from "@/lib/content";

export default function StudyLogPage() {
  const logs = getStudyLogs();
  const materials = getAllMaterials();

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <h1 className="font-display text-3xl font-bold">Study Log</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Record each session quickly so consistency and progress stay visible.
        </p>
      </section>

      <StudyLogBoard initialLogs={logs} materials={materials} />
    </main>
  );
}
