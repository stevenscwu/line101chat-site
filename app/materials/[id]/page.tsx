import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaterialById } from "@/lib/content";

interface MaterialDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const { id } = await params;
  const material = getMaterialById(id);

  if (!material) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm text-slate-500">{material.type.toUpperCase()}</p>
        <h1 className="font-display text-3xl font-bold">{material.title}</h1>
        <p className="text-slate-600 dark:text-slate-300">{material.topic}</p>
      </section>

      <section className="panel space-y-5">
        <div className="flex flex-wrap gap-2">
          {material.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <article>
          <h2 className="font-semibold">Japanese Text</h2>
          <p className="mt-2 whitespace-pre-line rounded-xl bg-slate-100 p-4 text-lg leading-relaxed dark:bg-slate-800">
            {material.japaneseText}
          </p>
        </article>

        {material.translation ? (
          <article>
            <h2 className="font-semibold">Translation</h2>
            <p className="mt-2 rounded-xl bg-slate-100 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {material.translation}
            </p>
          </article>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={{ pathname: "/pronunciation-lab", query: { materialId: material.id } }}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Practice In Pronunciation Lab
          </Link>
          <Link
            href="/materials"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Back To Materials
          </Link>
        </div>
      </section>

      <section className="text-xs text-slate-500">
        Created: {material.createdAt} | Updated: {material.updatedAt}
      </section>
    </main>
  );
}
