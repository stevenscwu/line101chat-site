import type { ReactNode } from "react";

import { BakeryShell } from "@/components/bakery/BakeryShell";
import { resolveLocale } from "@/lib/i18n/server";

type BakeryLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function BakeryLayout({ children, params }: BakeryLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return <BakeryShell locale={locale}>{children}</BakeryShell>;
}
