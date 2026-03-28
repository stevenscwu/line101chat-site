import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/shared/CTASection";
import { PageHero } from "@/components/shared/PageHero";
import { type Locale } from "@/lib/i18n/config";

type ServiceDetailContentProps = {
  locale: Locale;
  backToServicesLabel: string;
  content: {
    hero: {
      kicker: string;
      title: string;
      description: string;
    };
    whoFor: {
      title: string;
      items: string[];
    };
    problems: {
      title: string;
      items: string[];
    };
    included: {
      title: string;
      items: string[];
    };
    timeline: {
      title: string;
      items: string[];
    };
    engagement: {
      title: string;
      description: string;
    };
    cta: {
      title: string;
      description: string;
      primaryLabel: string;
      secondaryLabel: string;
    };
  };
};

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-slate-100/80 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ServiceDetailContent({
  locale,
  content,
  backToServicesLabel,
}: ServiceDetailContentProps) {
  return (
    <>
      <PageHero
        kicker={content.hero.kicker}
        title={content.hero.title}
        description={content.hero.description}
      />

      <Section tone="light">
        <div className="grid gap-4 md:grid-cols-2">
          <DetailList title={content.whoFor.title} items={content.whoFor.items} />
          <DetailList title={content.problems.title} items={content.problems.items} />
          <DetailList title={content.included.title} items={content.included.items} />
          <DetailList title={content.timeline.title} items={content.timeline.items} />
        </div>

        <article className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-7">
          <h2 className="text-xl font-semibold text-slate-900">{content.engagement.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{content.engagement.description}</p>
          <div className="mt-6">
            <Link
              href={`/${locale}/services`}
              className="text-sm font-medium text-slate-700 underline underline-offset-4"
            >
              {backToServicesLabel}
            </Link>
          </div>
        </article>
      </Section>

      <CTASection
        locale={locale}
        title={content.cta.title}
        description={content.cta.description}
        primary={{ label: content.cta.primaryLabel, href: "/contact" }}
        secondary={{ label: content.cta.secondaryLabel, href: "/contact" }}
      />
    </>
  );
}
