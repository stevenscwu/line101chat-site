import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/shared/PageHero";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type TermsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/terms",
    title: dictionary.ui.footer.links.terms,
    description:
      locale === "zh-TW"
        ? "服務條款頁面建置中。"
        : "Terms of service page placeholder.",
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <>
      <PageHero
        kicker={locale === "zh-TW" ? "法務" : "Legal"}
        title={locale === "zh-TW" ? "服務條款" : "Terms of Service"}
        description={
          locale === "zh-TW"
            ? "此頁面為法務內容預留位置，可於未來補充正式條款。"
            : "This is a placeholder for complete legal terms to be added later."
        }
      />
      <Section tone="light">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          {locale === "zh-TW"
            ? "正式營運前，將在此公布完整服務條款與責任說明。"
            : "Before launch, complete terms and responsibilities will be published here."}
        </p>
      </Section>
    </>
  );
}
