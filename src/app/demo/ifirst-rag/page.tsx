import type { Metadata } from "next";
import Image from "next/image";
import { FileSearch, MessageCircle, ShieldCheck } from "lucide-react";

import { CTASection } from "@/components/cards";
import { RagDemoChat } from "@/components/rag-demo/RagDemoChat";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "北科大 iFIRST RAG 問答 Demo",
  description:
    "使用北科大創新前瞻科技學院公開文件建立的 AI 知識助理 Demo，可查詢人工智慧、資訊安全與半導體三個學程的部分規章、表單與修業資訊。",
  alternates: { canonical: "/demo/ifirst-rag" },
};

const disclaimer =
  `本 Demo 使用北科大創新前瞻科技學院公開資料建立，回答僅供展示與參考，正式規定仍以學校官方公告與辦公室回覆為準。網頁版目前只展示預先準備的示意回答；若要測試真實自由提問，請使用北科大創新學院 Demo chatbot（Channel ${site.ntutDemoLineChannelId}）。`;

export default function IfirstRagDemoPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                <FileSearch className="h-4 w-4" aria-hidden="true" />
                Public RAG Demo
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl">
                北科大創新前瞻科技學院 iFIRST RAG 問答 Demo
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
                這是一個使用公開文件建立的 AI 知識助理 Demo，可查詢人工智慧、資訊安全與半導體三個學程的部分規章、表單與修業資訊。
              </p>
            </div>

            <aside className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-amber-700" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black text-slate-950">Demo 使用提醒</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">{disclaimer}</p>
              <div className="mt-5 grid gap-4 rounded-lg border border-amber-200 bg-white/80 p-4 sm:grid-cols-[132px_1fr] sm:items-center lg:grid-cols-1 xl:grid-cols-[132px_1fr]">
                <div className="w-32 rounded-lg border border-slate-200 bg-white p-2">
                  <Image
                    src={site.ntutDemoQrImage}
                    alt="北科大創新學院文件問答 Demo chatbot QR Code"
                    width={250}
                    height={250}
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-black leading-6 text-slate-950">試用北科大創新學院文件問答 Demo</p>
                  <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
                    此 QR Code 僅供北科大創新學院 RAG Demo 使用；LINE101Chat 服務詢問請使用另一個商務帳號。
                  </p>
                  <div
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-800"
                    aria-label={`北科大創新學院 Demo chatbot channel ${site.ntutDemoLineChannelId}`}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Demo Channel {site.ntutDemoLineChannelId}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-10">
            <RagDemoChat />
          </div>
        </div>
      </section>

      <CTASection
        title="想為你的學校、系所或公司建立類似的 AI 知識助理？"
        body="LINE101Chat 可以協助你把 FAQ、SOP、招生資訊、規章與內部文件，轉換成可在 LINE 或網站使用的 AI 問答助理。"
        label="免費評估"
        href="/free-assessment"
      />
    </main>
  );
}
