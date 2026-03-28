import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { type Locale, withLocale } from "@/lib/i18n/config";

type CTASectionProps = {
  locale: Locale;
  title: string;
  description: string;
  primary: {
    label: string;
    href: string;
  };
  secondary: {
    label: string;
    href: string;
  };
};

export function CTASection({
  locale,
  title,
  description,
  primary,
  secondary,
}: CTASectionProps) {
  return (
    <Section tone="dark" className="py-20 md:py-24">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/15 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),rgba(10,14,26,0.8))] px-8 py-12 md:px-12 md:py-16">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="relative max-w-3xl space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
          <p className="text-base leading-relaxed text-white/75 md:text-lg">{description}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={withLocale(locale, primary.href)}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {primary.label}
            </Link>
            <Link
              href={withLocale(locale, secondary.href)}
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
