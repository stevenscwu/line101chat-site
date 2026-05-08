import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy｜LINE101Chat",
  description: "LINE101Chat 隱私權政策，說明聯絡資料、客戶文件、LINE 訊息紀錄與資料刪除請求的處理方式。",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "1. 我們收集的資料",
    body: "我們只收集客戶透過聯絡表單、Email、LINE 或諮詢過程主動提供的資訊，例如姓名、公司或組織、Email、電話 / LINE ID、服務需求與訊息內容。",
  },
  {
    title: "2. 客戶文件使用方式",
    body: "客戶提供的文件只會用於約定的 chatbot 開發、測試、調整與維護。文件可能包含 FAQ、SOP、規章、產品手冊、招生資訊或內部知識資料。",
  },
  {
    title: "3. 敏感文件",
    body: "若文件包含個資、營業秘密、法務資料、醫療照護內容或其他敏感資訊，應在專案開始前另行確認資料處理方式、保密約定與部署環境。",
  },
  {
    title: "4. 本地端與私有化部署",
    body: "若客戶有較高資料安全需求，LINE101Chat 可依專案需求評估本地端或私有雲部署，包含 Local LLM、Ollama 或其他私有化架構。",
  },
  {
    title: "5. LINE 訊息與使用紀錄",
    body: "當客戶啟用 chatbot 服務時，LINE 訊息可能會在客戶同意的範圍內被記錄，用於除錯、使用量分析、服務改善、額度管理或客戶支援。",
  },
  {
    title: "6. 資料刪除請求",
    body: "客戶可要求刪除聯絡資料、測試文件或專案資料。我們會依實際專案狀態、備份週期與法律或合約要求處理。",
  },
  {
    title: "7. 不販售客戶資料",
    body: "LINE101Chat 不會有意將客戶資料、文件內容或訊息紀錄出售給廣告商。",
  },
  {
    title: "8. 政策更新",
    body: "本政策可能依服務內容與法規需求更新。若更新涉及重大資料處理方式變更，會以適當方式通知客戶。",
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
      <article className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">隱私權</p>
        <h1 className="mt-3 text-4xl font-black leading-tight tracking-[0] text-slate-950">
          LINE101Chat 隱私權政策
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          本政策說明 LINE101Chat 在網站聯絡、需求評估、PoC 與 chatbot 服務過程中，如何處理客戶提供的資料與文件。
        </p>
        <div className="mt-8 grid gap-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
              <p className="mt-3 text-base leading-8 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
