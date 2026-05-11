"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { getLocaleFromPathname, getSiteContent, localizePath } from "@/data/site";

export function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const { labels, navItems, site } = getSiteContent(locale);

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:px-10">
        <div>
          <Link href={localizePath("/", locale)} className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-lg font-black text-white">
              L
            </span>
            <span>
              <span className="block text-lg font-black">LINE101Chat</span>
              <span className="block text-sm text-slate-300">
                {labels.brandTagline}
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            {labels.footerDescription}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-400 hover:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {site.email}
            </a>
            <ButtonLink href={localizePath(site.linePageUrl, locale)} icon={MessageCircle} variant="line">
              {labels.addLine}
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-sm font-black text-white">{labels.websiteNav}</h2>
            <div className="mt-4 grid gap-2">
              {navItems.slice(0, 4).map((item) => (
                <Link key={item.href} href={localizePath(item.href, locale)} className="text-sm text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white">{labels.resources}</h2>
            <div className="mt-4 grid gap-2">
              {navItems.slice(4).map((item) => (
                <Link key={item.href} href={localizePath(item.href, locale)} className="text-sm text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link href={localizePath("/about", locale)} className="text-sm text-slate-300 hover:text-white">
                {locale === "en" ? "About" : "關於我們"}
              </Link>
              <Link href={localizePath("/privacy", locale)} className="text-sm text-slate-300 hover:text-white">
                {labels.privacyPolicy}
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white">{labels.contact}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {labels.contactPlan}
              <br />
              {site.email}
            </p>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              Copyright © {new Date().getFullYear()} LINE101Chat. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
