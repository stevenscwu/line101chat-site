import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale, withLocale } from "@/lib/i18n/config";

type FooterProps = {
  locale: Locale;
  ui: Dictionary["ui"];
};

export function Footer({ locale, ui }: FooterProps) {
  const navLinks = ui.navigation.filter((item) => item.href !== "/" && !item.href.startsWith("/services/"));
  const serviceLinks = [
    ...ui.navigation.filter((item) => item.href === "/services"),
    {
      label: locale === "zh-TW" ? "網站建置" : "Website Building",
      href: "/services/websites",
    },
    {
      label: locale === "zh-TW" ? "RAG 智能助理" : "RAG Chatbots",
      href: "/services/rag-chatbots",
    },
    {
      label: locale === "zh-TW" ? "應用系統開發" : "App Development",
      href: "/services/apps",
    },
    ...ui.navigation.filter((item) => item.href === "/pricing"),
  ];

  return (
    <footer className="border-t border-white/10 bg-[var(--surface-dark)] py-16 text-white/82 md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.9fr_0.8fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.12em] text-white">{ui.brand.name}</p>
            <p className="max-w-md text-sm leading-relaxed text-white/66">{ui.footer.description}</p>

            <div className="space-y-2 rounded-2xl border border-white/12 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/48">{ui.footer.contactLabel}</p>
              <a href={`mailto:${ui.footer.email}`} className="text-sm font-medium text-white">
                {ui.footer.email}
              </a>
              <p className="text-xs text-white/62">{ui.footer.consultationNote}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <LanguageSwitcher locale={locale} label={ui.language.switch} />
              <Link
                href={withLocale(locale, "/contact")}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                {ui.header.bookConsultation}
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-white/45">{ui.footer.sections.company}</p>
            <ul className="mt-4 space-y-3 text-sm">
              {navLinks
                .filter((item) => item.href !== "/pricing" && item.href !== "/services")
                .map((item) => (
                  <li key={`footer-company-${item.href}`}>
                    <Link href={withLocale(locale, item.href)} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-white/45">{ui.footer.sections.services}</p>
            <ul className="mt-4 space-y-3 text-sm">
              {serviceLinks.map((item) => (
                <li key={`footer-services-${item.href}`}>
                  <Link href={withLocale(locale, item.href)} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-white/45">{ui.footer.sections.legal}</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href={withLocale(locale, "/privacy")} className="transition hover:text-white">
                  {ui.footer.links.privacy}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, "/terms")} className="transition hover:text-white">
                  {ui.footer.links.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-5 text-xs text-white/50">
          {ui.footer.copyright}
        </div>
      </Container>
    </footer>
  );
}
