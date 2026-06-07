import type { Metadata } from "next";
import { AlertTriangle, Download, ExternalLink, FileText, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";
import { legalDocuments, legalReferenceLinks } from "@/data/legal-documents";

export const metadata: Metadata = {
  title: "LINE101Chat Legal Documents",
  description:
    "Taiwan-first LINE101Chat customer legal document templates, including NDA, MSA, Pilot SOW, DPA, AI output policy, support terms, data retention, privacy notice, and incident response.",
  alternates: { canonical: "/en/legal" },
};

export default function EnglishLegalDocumentsPage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-1 text-sm font-black text-amber-200">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Lawyer Review Required
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
            LINE101Chat Legal Document Templates
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-200">
            These Taiwan-first templates support customer discussions, pilots, and PoCs. They are not final legal advice
            and should be reviewed by a Taiwan lawyer before signing.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/legal/line101chat-legal-documents-index-zh-tw.md" variant="primary" icon={Download}>
              Download Chinese index
            </ButtonLink>
            <ButtonLink href="/en/pricing" variant="secondary">
              View pilot pricing
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-lg border border-amber-200 bg-white p-6">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-amber-700" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-black text-slate-950">Before Signing</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">
                If LINE101Chat has not completed company registration, do not sign under a nonexistent company name.
                Use the actual legal contracting party and review the terms for Taiwan tax, privacy, consumer, and
                industry requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Document Set"
            title="Documents to use before customer pilots"
            description="The files are Traditional Chinese templates for Taiwan-market customer work."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {legalDocuments.map((document) => (
              <article key={document.href} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
                    Draft
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-black leading-tight text-slate-950">{document.shortTitle}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-emerald-700">
                  Use before: {document.mustUseBefore}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{document.purpose}</p>
                <a
                  href={document.href}
                  className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800"
                >
                  Download Markdown
                  <Download className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Official References"
            title="Taiwan legal sources checked"
            description="These sources informed the template structure; they do not replace legal review."
          />
          <div className="grid gap-3">
            {legalReferenceLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 text-sm font-black text-slate-800 hover:border-emerald-400 hover:text-emerald-700"
              >
                {link.label}
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
