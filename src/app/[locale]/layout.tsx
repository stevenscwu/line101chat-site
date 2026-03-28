import type { ReactNode } from "react";

import { Footer } from "@/components/navigation/Footer";
import { Header } from "@/components/navigation/Header";
import { locales } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return (
    <div className="min-h-screen bg-[var(--surface-light)] text-[var(--text-primary)]">
      <Header locale={locale} ui={dictionary.ui} />
      <main>{children}</main>
      <Footer locale={locale} ui={dictionary.ui} />
    </div>
  );
}
