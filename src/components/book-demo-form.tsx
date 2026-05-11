"use client";

import { Clipboard, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

import { ButtonLink } from "@/components/button-link";
import { bookingMailto, getGrowthContent } from "@/data/growth";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

type BookingState = Record<string, string>;

const fieldClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export function BookDemoForm({ locale = "zh" }: { locale?: Locale }) {
  const content = getGrowthContent(locale).bookDemo;
  const siteContent = getSiteContent(locale);
  const [form, setForm] = useState<BookingState>({});
  const [copyStatus, setCopyStatus] = useState(content.form.copyIdle);

  const emailBody = [
    content.form.emailHeader,
    "",
    ...content.form.fields.map((field) => `${field.label}: ${form[field.key] ?? ""}`),
  ].join("\n");

  function updateField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`${siteContent.site.email}\n\n${emailBody}`);
      setCopyStatus(content.form.copySuccess);
    } catch {
      setCopyStatus(content.form.copyError);
    }

    window.setTimeout(() => setCopyStatus(content.form.copyIdle), 1800);
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        window.location.href = bookingMailto(locale, emailBody);
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {content.form.fields.map((field) => (
          <label
            key={field.key}
            className={`text-sm font-bold text-slate-800 ${
              field.key === "problem" || field.key === "time" ? "sm:col-span-2" : ""
            }`}
          >
            {field.label}
            {field.key === "problem" ? (
              <textarea
                className={`${fieldClass} min-h-28 resize-y`}
                name={field.key}
                placeholder={field.placeholder}
                value={form[field.key] ?? ""}
                onChange={(event) => updateField(field.key, event.target.value)}
              />
            ) : (
              <input
                className={fieldClass}
                name={field.key}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                value={form[field.key] ?? ""}
                onChange={(event) => updateField(field.key, event.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-600">
        {content.form.recipientLabel}
        <a className="font-black text-emerald-700" href={`mailto:${siteContent.site.email}`}>
          {siteContent.site.email}
        </a>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {content.form.submitLabel}
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
          onClick={copyMessage}
        >
          <Clipboard className="h-4 w-4" aria-hidden="true" />
          {copyStatus}
        </button>
        <ButtonLink href={localizePath(siteContent.primaryCtas.line.href, locale)} icon={MessageCircle} variant="line">
          {content.form.lineLabel}
        </ButtonLink>
      </div>
    </form>
  );
}
