import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/shared/PageHero";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type ContactPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/contact",
    title: dictionary.pages.contact.metadata.title,
    description: dictionary.pages.contact.metadata.description,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.pages.contact;

  return (
    <div className="animate-fade-scale">
      <PageHero
        kicker={content.hero.kicker}
        title={content.hero.title}
        description={content.hero.description}
      />

      <Section tone="light">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ContactForm
            form={dictionary.ui.contactForm}
            serviceOptions={dictionary.services.overview.cards.map((card) => card.title)}
          />

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">{content.aside.title}</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
              {content.aside.items.map((item) => (
                <li key={item} className="rounded-xl bg-white px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{content.aside.emailLabel}</p>
              <a href={`mailto:${content.aside.email}`} className="mt-2 inline-flex text-sm font-medium text-slate-800">
                {content.aside.email}
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
