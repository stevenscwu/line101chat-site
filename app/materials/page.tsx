import { MaterialsBrowser } from "@/components/materials/materials-browser";
import { getAllMaterials } from "@/lib/content";

export default function MaterialsPage() {
  const materials = getAllMaterials();

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <h1 className="font-display text-3xl font-bold">Materials</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Organize daily study content by type, topic, and review priority.
        </p>
      </section>

      <section className="panel">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Material Library</h2>
          <button
            type="button"
            className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            + Add Material (next step)
          </button>
        </div>
        <MaterialsBrowser materials={materials} />
      </section>
    </main>
  );
}
