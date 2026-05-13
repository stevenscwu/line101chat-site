import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "聯絡我們｜免費 AI 知識助理文件評估",
  description:
    "聯絡 LINE101Chat，免費評估 FAQ、SOP、規章與內部文件是否適合做 AI 知識助理、LINE 文件問答、雲端或本地端部署。",
  alternates: { canonical: "/contact" },
};

export function ContactContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const contact = content.pages.contact;
  const { labels, primaryCtas, site } = content;

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <SectionHeading
              eyebrow={contact.heading.eyebrow}
              title={contact.heading.title}
              description={contact.heading.description}
            />
            <div className="mt-8">
              <ContactForm locale={locale} />
            </div>
          </div>
          <div className="space-y-5">
            <PresenterCallout
              imageKey="contact"
              label={contact.callout.label}
              title={contact.callout.title}
              body={contact.callout.body}
            />
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">{labels.directContact}</h2>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-700">
                <a className="flex items-center gap-2 hover:text-emerald-700" href={`mailto:${site.email}`}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {site.email}
                </a>
                <a className="flex items-center gap-2 hover:text-emerald-700" href={localizePath(site.linePageUrl, locale)}>
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {primaryCtas.line.label}
                </a>
              </div>
              <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <Image
                  src={site.lineQrImage}
                  alt={contact.qrAlt}
                  width={612}
                  height={612}
                  className="mx-auto h-auto w-full max-w-[220px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return <ContactContent locale="zh" />;
}
