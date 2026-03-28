import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/shared/PageHero";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type PrivacyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/privacy",
    title: dictionary.ui.footer.links.privacy,
    description:
      locale === "zh-TW"
        ? "隱私政策頁面建置中。"
        : "Privacy policy page placeholder.",
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <>
      <PageHero
        kicker={locale === "zh-TW" ? "法務" : "Legal"}
        title={locale === "zh-TW" ? "隱私政策" : "Privacy Policy"}
        description={
          locale === "zh-TW"
            ? "此頁面為法務內容預留位置，可於未來補充完整條款。"
            : "This is a placeholder for full privacy terms that can be added later."
        }
      />
      <Section tone="light">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          {locale === "zh-TW"
            ? "目前站點尚在建置階段，正式上線前將補齊完整隱私政策內容。"
            : "The site is currently in setup mode. Complete privacy terms will be published before launch."}
        </p>
      </Section>
    </>
  );
}
