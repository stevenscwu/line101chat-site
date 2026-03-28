import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/shared/CTASection";
import { PageHero } from "@/components/shared/PageHero";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type ProcessPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: ProcessPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/process",
    title: dictionary.pages.process.metadata.title,
    description: dictionary.pages.process.metadata.description,
  });
}

export default async function ProcessPage({ params }: ProcessPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.pages.process;

  return (
    <div className="animate-fade-scale">
      <PageHero
        kicker={content.hero.kicker}
        title={content.hero.title}
        description={content.hero.description}
      />

      <Section tone="neutral">
        <ol className="grid gap-4 md:grid-cols-2">
          {content.steps.map((step, index) => (
            <li
              key={step.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{`0${index + 1}`}</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{step.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.objective}</p>
              <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{step.deliverables}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="dark">
        <div className="rounded-3xl border border-white/12 bg-white/6 p-8">
          <h3 className="text-2xl font-semibold text-white">{content.principles.title}</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {content.principles.items.map((item) => (
              <li key={item} className="rounded-xl bg-white/7 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CTASection
        locale={locale}
        title={dictionary.home.finalCta.title}
        description={dictionary.home.finalCta.description}
        primary={dictionary.home.finalCta.primary}
        secondary={dictionary.home.finalCta.secondary}
      />
    </div>
  );
}
