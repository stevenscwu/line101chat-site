import { Section } from "@/components/layout/Section";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type ShowcaseGridProps = {
  content: Dictionary["home"]["showcase"];
};

export function ShowcaseGrid({ content }: ShowcaseGridProps) {
  return (
    <Section tone="neutral">
      <div className="space-y-9">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {content.title}
          </h2>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">{content.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {content.items.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-100/80 to-transparent" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.category}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
