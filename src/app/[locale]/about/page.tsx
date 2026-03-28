import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/shared/CTASection";
import { PageHero } from "@/components/shared/PageHero";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type AboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-slate-100 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/about",
    title: dictionary.pages.about.metadata.title,
    description: dictionary.pages.about.metadata.description,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.pages.about;

  return (
    <div className="animate-fade-scale">
      <PageHero
        kicker={content.hero.kicker}
        title={content.hero.title}
        description={content.hero.description}
      />

      <Section tone="light">
        <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <h2 className="text-2xl font-semibold text-slate-900">{content.mission.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{content.mission.content}</p>
        </article>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <InfoBlock title={content.whatWeBuild.title} items={content.whatWeBuild.items} />
          <InfoBlock title={content.howWeWork.title} items={content.howWeWork.items} />
          <InfoBlock title={content.whyChoose.title} items={content.whyChoose.items} />
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
