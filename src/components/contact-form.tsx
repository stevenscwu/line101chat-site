"use client";

import { FormEvent, useMemo, useState } from "react";
import { Clipboard, Mail, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { primaryCtas, site } from "@/data/site";

const fieldClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const initialForm = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [copyStatus, setCopyStatus] = useState("複製信件內容");

  const emailBody = useMemo(
    () =>
      [
        "LINE101Chat 需求評估",
        "",
        `Name: ${form.name}`,
        `Company / Organization: ${form.organization}`,
        `Email: ${form.email}`,
        `Phone / LINE ID: ${form.phone}`,
        `Service interest: ${form.service}`,
        "",
        "Message:",
        form.message,
      ].join("\n"),
    [form],
  );

  const mailtoHref = useMemo(() => {
    const subjectName = form.organization || form.name || "網站詢問";
    const subject = `LINE101Chat 需求評估 - ${subjectName}`;

    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
  }, [emailBody, form.name, form.organization]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = mailtoHref;
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`${site.email}\n\n${emailBody}`);
      setCopyStatus("已複製");
    } catch {
      setCopyStatus("複製失敗");
    }
    window.setTimeout(() => setCopyStatus("複製信件內容"), 1800);
  }

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-800">
          Name
          <input
            className={fieldClass}
            name="name"
            placeholder="王小明"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
        <label className="text-sm font-bold text-slate-800">
          Company / Organization
          <input
            className={fieldClass}
            name="organization"
            placeholder="公司、學校或單位名稱"
            value={form.organization}
            onChange={(event) => updateField("organization", event.target.value)}
          />
        </label>
        <label className="text-sm font-bold text-slate-800">
          Email
          <input
            className={fieldClass}
            name="email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label className="text-sm font-bold text-slate-800">
          Phone / LINE ID
          <input
            className={fieldClass}
            name="phone"
            placeholder="手機或 LINE ID"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>
        <label className="text-sm font-bold text-slate-800 sm:col-span-2">
          Service interest
          <select
            className={fieldClass}
            name="service"
            value={form.service}
            onChange={(event) => updateField("service", event.target.value)}
          >
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
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-600">
        收件信箱：{" "}
        <a className="font-black text-emerald-700" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          開啟 Email 送出
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
          onClick={copyMessage}
        >
          <Clipboard className="h-4 w-4" aria-hidden="true" />
          {copyStatus}
        </button>
        <ButtonLink href={primaryCtas.line.href} icon={MessageCircle} variant="line">
          加入 LINE 詢問
        </ButtonLink>
      </div>
    </form>
  );
}
