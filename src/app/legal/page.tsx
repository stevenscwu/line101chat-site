import type { Metadata } from "next";
import { AlertTriangle, Download, ExternalLink, FileText, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";
import { legalDocuments, legalReferenceLinks } from "@/data/legal-documents";

export const metadata: Metadata = {
  title: "LINE101Chat 客戶法律文件",
  description:
    "LINE101Chat 台灣市場客戶法律文件範本，包含 NDA、MSA、Pilot SOW、DPA、AI 使用政策、SLA、資料保存刪除、使用者告知與事件應變。",
  alternates: { canonical: "/legal" },
};

export default function LegalDocumentsPage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-1 text-sm font-black text-amber-200">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Lawyer Review Required
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
            LINE101Chat 客戶法律文件範本
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-200">
            這些文件用於台灣第一階段 Pilot、PoC 與客戶洽談：先把保密、資料處理、AI 回答限制、支援範圍與報價條件說清楚。文件目前是草案範本，簽署前需由台灣律師依實際簽約主體與客戶情境審閱。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/legal/line101chat-legal-documents-index-zh-tw.md" variant="primary" icon={Download}>
              下載文件索引
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">
              查看 Pilot 費用
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-lg border border-amber-200 bg-white p-6">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-amber-700" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-black text-slate-950">簽署前請先確認</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">
                若 LINE101Chat 尚未完成公司設立，不得以尚未成立之公司名義簽約。任何對外簽約文件都必須填入實際合法簽約主體，並由台灣律師、會計師或合格顧問依交易模式、個資、消保、稅務與產業法規審閱。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Document Set"
            title="客戶洽談與 Pilot 前需要的文件"
            description="文件以 Traditional Chinese 為主，設計給台灣教育、服務型中小企業與 LINE AI 知識助理 Pilot 使用。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {legalDocuments.map((document) => (
              <article key={document.href} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
                    草案
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-black leading-tight text-slate-950">{document.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-emerald-700">
                  使用時機：{document.mustUseBefore}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{document.purpose}</p>
                <a
                  href={document.href}
                  className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800"
                >
                  下載 Markdown
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
            eyebrow="Legal Basis Checked"
            title="本次產出參考的官方法規來源"
            description="這些來源用來建立文件結構與風險提醒；實際條款仍需依專案、客戶身分、資料流與簽約主體進行法律審查。"
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
