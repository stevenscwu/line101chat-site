import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { PricingCard } from "@/components/cards";
import { PresenterSideCard } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { packages, primaryCtas, site } from "@/data/site";

export const metadata: Metadata = {
  title: "服務項目｜RAG 知識助理與 LINE 翻譯助理",
  description:
    "了解 LINE101Chat 的 RAG 知識助理、LINE 翻譯助理、Starter PoC、Business Plan 與私有化部署服務。",
  alternates: { canonical: "/services" },
};

const comparisonRows = [
  ["適合對象", "學校、系所、SME、客服、HR、IT、製造業", "雇主、移工、看護、工廠、仲介、家庭"],
  ["主要解決問題", "正式文件查找、重複問答、來源追溯、內部知識保存", "印尼文與繁體中文日常溝通、現場指示、照護與工作對話"],
  ["使用資料", "FAQ、SOP、規章、產品手冊、招生資訊、內部文件", "LINE 文字訊息、翻譯紀錄、額度與使用量設定"],
  ["部署方式", "LINE chatbot、網站 chatbot、雲端、本地端或私有雲", "LINE chatbot、本地端或私有化 LLM backend"],
  ["收費模式", "PoC、建置費、維護費、客製整合", "建置費、月費、使用量或額度制"],
  ["最適合的第一步", "準備 20-30 頁正式文件與真實問題做 Starter PoC", "確認語言方向、使用者族群與 LINE 操作流程"],
];

export default function ServicesPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <SectionHeading
              eyebrow="服務項目"
              title="服務項目"
              description="LINE101Chat 專注在兩種能快速落地的 AI chatbot：根據正式文件回答問題的 RAG 知識助理，以及直接在 LINE 裡使用的印尼文繁體中文翻譯助理。"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                "從需求評估開始，先確認是否真的適合導入。",
                "PoC 範圍明確，避免一開始投入過大。",
                "重視文件品質、來源引用與資料安全。",
                "可依場景選擇 LINE、網站、雲端或本地端部署。",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <p className="text-sm font-bold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <PresenterSideCard quote="不確定從哪一種服務開始？可以先從需求評估開始，我們會協助你判斷最適合的導入路徑。" />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="服務比較"
            title="兩種服務怎麼選？"
            description="如果問題主要來自文件查找與重複問答，先看 RAG；如果問題主要是跨語言日常溝通，先看 LINE 翻譯助理。"
          />
          <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="p-4 font-black">項目</th>
                  <th className="p-4 font-black">RAG 知識助理</th>
                  <th className="p-4 font-black">LINE 翻譯助理</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([item, rag, translation]) => (
                  <tr key={item} className="border-t border-slate-200">
                    <th className="w-44 bg-slate-50 p-4 font-black text-slate-900">{item}</th>
                    <td className="p-4 leading-7 text-slate-700">{rag}</td>
                    <td className="p-4 leading-7 text-slate-700">{translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="導入方案"
            title="服務套裝"
            description="每個組織的文件量、使用人數與安全需求不同，因此建議先從可驗證的小範圍開始。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {packages.map((item) => (
              <PricingCard
                key={item.title}
                name={item.title}
                price={item.title === "Starter PoC" ? "PoC 起點" : "專案規劃"}
                summary={item.description}
                includes={item.items}
                highlighted={item.title === "Starter PoC"}
              />
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            詳細價格請參考{" "}
            <a className="font-black text-emerald-700" href="/pricing">
              價格方案
            </a>
            ，或寄信至 {site.email} 預約 {primaryCtas.demo.label}。
          </p>
        </div>
      </section>
    </main>
  );
}
