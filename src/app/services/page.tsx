import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { PricingCard } from "@/components/cards";
import { PresenterSideCard } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { packages, primaryCtas, site } from "@/data/site";

export const metadata: Metadata = {
  title: "服務項目｜RAG 知識助理與翻譯加值服務",
  description:
    "了解 LINE101Chat 的 RAG 知識助理、台灣 SME Cloud RAG、Local / Private RAG 與 LINE 翻譯加值服務。",
  alternates: { canonical: "/services" },
};

const comparisonRows = [
  ["定位", "核心導入服務", "RAG 或 LINE chatbot 上線後的加值服務"],
  ["適合對象", "學校、系所、SME、客服、HR、IT、製造業", "雇主、移工、看護、工廠、仲介、家庭"],
  ["主要解決問題", "正式文件查找、重複問答、來源追溯、內部知識保存", "印尼文與繁體中文日常溝通、現場指示、照護與工作對話"],
  ["使用資料", "FAQ、SOP、規章、產品手冊、招生資訊、內部文件", "LINE 文字訊息、翻譯紀錄、額度與使用量設定"],
  ["部署方式", "LINE chatbot、網站 chatbot、雲端、本地端或私有雲", "LINE chatbot、本地端或私有化 LLM backend"],
  ["收費模式", "RAG PoC、建置費、維護費、客製整合", "加購建置費、月費、使用量或額度制"],
  ["最適合的第一步", "準備 20-40 頁正式文件與真實問題做 RAG Starter PoC", "先確認是否已有 LINE 使用流程與實際翻譯量"],
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
              description="LINE101Chat 的主軸是 RAG 知識助理：讓 AI 根據正式文件回答問題、附上來源並能長期維護。翻譯 chatbot 則定位為 LINE 場景的加值服務。"
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                "從需求評估開始，先確認是否真的適合導入。",
                "RAG PoC 範圍明確，避免一開始投入過大。",
                "重視文件品質、來源引用與資料安全。",
                "可依場景選擇 LINE、網站、雲端、本地端或私有雲部署。",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <p className="text-sm font-bold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <PresenterSideCard quote="不確定該做雲端還是本地端？可以先從 RAG 需求評估開始，我們會協助你用文件敏感度、預算與維運能力判斷導入路徑。" />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="服務比較"
            title="先做 RAG，再看是否需要翻譯加值"
            description="如果問題主要來自文件查找與重複問答，RAG 是第一優先；如果上線後還有跨語言日常溝通，再加上 LINE 翻譯服務。"
          />
          <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="p-4 font-black">項目</th>
                  <th className="p-4 font-black">RAG 知識助理</th>
                  <th className="p-4 font-black">LINE 翻譯加值服務</th>
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
            title="台灣 SME 導入方案"
            description="以中小企業可承擔的節奏安排：先用 RAG Starter PoC 驗證，再依資料敏感度選擇 SME Cloud RAG 或 Local / Private RAG。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {packages.map((item) => (
              <PricingCard
                key={item.title}
                name={item.title}
                price={item.price}
                summary={item.description}
                includes={item.items}
                highlighted={item.highlighted}
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
