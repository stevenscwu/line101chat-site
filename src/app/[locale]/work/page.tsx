import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/shared/CTASection";
import { PageHero } from "@/components/shared/PageHero";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type WorkPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/work",
    title: dictionary.pages.work.metadata.title,
    description: dictionary.pages.work.metadata.description,
  });
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.pages.work;

  return (
    <div className="animate-fade-scale">
      <PageHero
        kicker={content.hero.kicker}
        title={content.hero.title}
        description={content.hero.description}
      />

      <Section tone="light">
        <div className="grid gap-4 md:grid-cols-3">
          {content.collections.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.summary}</p>

              <details className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-700">
                  {dictionary.ui.buttons.viewDetails}
                </summary>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="rounded-lg bg-white px-3 py-2">
                      {highlight}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs uppercase tracking-[0.1em] text-slate-500">{item.stack}</p>
              </details>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-7">
          <h3 className="text-2xl font-semibold text-slate-900">{content.future.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{content.future.description}</p>
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
