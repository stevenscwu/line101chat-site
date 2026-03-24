import { CopyableCard } from "@/components/content-studio/copyable-card";
import { getContentStudioCards } from "@/lib/content";

export default function ContentStudioPage() {
  const cards = getContentStudioCards();

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <h1 className="font-display text-3xl font-bold">Content Studio</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Turn real study activity into lightweight social-ready snippets.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <CopyableCard key={card.id} title={card.title} body={card.text} sourceRefs={card.sourceRefs} />
        ))}
      </section>
    </main>
  );
}
