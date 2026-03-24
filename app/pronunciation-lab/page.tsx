import Link from "next/link";
import { PronunciationLabClient } from "@/components/pronunciation/pronunciation-lab-client";
import { getAllMaterials, getMaterialById, splitMaterialIntoSentences } from "@/lib/content";

interface PronunciationLabPageProps {
  searchParams: Promise<{ materialId?: string }>;
}

export default async function PronunciationLabPage({ searchParams }: PronunciationLabPageProps) {
  const { materialId } = await searchParams;
  const fallback = getAllMaterials()[0];
  const material = (materialId ? getMaterialById(materialId) : undefined) ?? fallback;

  if (!material) {
    return (
      <main className="panel">
        <h1 className="font-display text-2xl font-bold">Pronunciation Lab</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">No material found yet. Add material content first.</p>
      </main>
    );
  }

  const materials = getAllMaterials();
  const sentences = splitMaterialIntoSentences(material);

  return (
    <main className="space-y-6">
      <section className="panel">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Switch Material</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {materials.map((entry) => (
            <Link
              key={entry.id}
              href={{ pathname: "/pronunciation-lab", query: { materialId: entry.id } }}
              className={`rounded-full px-3 py-1.5 text-sm ${
                entry.id === material.id
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {entry.title}
            </Link>
          ))}
        </div>
      </section>

      <PronunciationLabClient
        materialId={material.id}
        materialTitle={material.title}
        translation={material.translation}
        sentences={sentences}
      />
    </main>
  );
}
