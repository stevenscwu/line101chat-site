import { Mail, MessageCircle, Send } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { site } from "@/data/site";

const fieldClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export function ContactForm() {
  return (
    <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Later: connect this form to an email service, CRM, LINE official account, or booking system. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-800">
          Name
          <input className={fieldClass} name="name" placeholder="王小明" />
        </label>
        <label className="text-sm font-bold text-slate-800">
          Company / Organization
          <input className={fieldClass} name="organization" placeholder="公司、學校或單位名稱" />
        </label>
        <label className="text-sm font-bold text-slate-800">
          Email
          <input className={fieldClass} name="email" type="email" placeholder="name@example.com" />
        </label>
        <label className="text-sm font-bold text-slate-800">
          Phone / LINE ID
          <input className={fieldClass} name="phone" placeholder="手機或 LINE ID" />
        </label>
        <label className="text-sm font-bold text-slate-800 sm:col-span-2">
          Service interest
          <select className={fieldClass} name="service" defaultValue="">
            <option value="" disabled>
              請選擇感興趣的服務
            </option>
            <option>企業 AI 助理 Starter PoC</option>
            <option>SME Cloud RAG</option>
            <option>Local / Private RAG</option>
            <option>翻譯選配模組</option>
            <option>還不確定，需要先評估</option>
          </select>
        </label>
        <label className="text-sm font-bold text-slate-800 sm:col-span-2">
          Message
          <textarea
            className={`${fieldClass} min-h-36 resize-y`}
            name="message"
            placeholder="請簡單描述你的文件類型、使用對象、希望接 LINE 或網站、資料是否敏感，以及目前遇到的問題。"
          />
        </label>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-600">
        v1 表單尚未送出資料。請寄信至{" "}
        <a className="font-black text-emerald-700" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        ，或加入 LINE 官方帳號洽詢。
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={`mailto:${site.email}?subject=LINE101Chat%20需求評估`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          寄信洽詢
        </a>
        <ButtonLink href={site.lineAddFriendUrl} icon={MessageCircle} variant="line" external>
          加入 LINE 詢問
        </ButtonLink>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-black text-slate-700"
          disabled
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          送出表單
        </button>
      </div>
    </form>
  );
}
