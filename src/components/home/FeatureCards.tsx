import { Section } from "@/components/layout/Section";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type FeatureCardsProps = {
  content: Dictionary["home"]["whyUs"];
};

export function FeatureCards({ content }: FeatureCardsProps) {
  return (
    <Section tone="light">
      <div className="space-y-8">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {content.title}
          </h2>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">{content.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {content.cards.map((card, index) => (
            <article
              key={card.title}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-500">
                {`0${index + 1}`}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
