"use client";

import { FormEvent, useState } from "react";
import { Clipboard, Mail, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

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

export function ContactForm({ locale = "zh" }: { locale?: Locale }) {
  const { contactForm: copy, primaryCtas, site } = getSiteContent(locale);
  const [form, setForm] = useState(initialForm);
  const [copyStatus, setCopyStatus] = useState(copy.copyIdle);

  const emailBody = [
    copy.emailHeader,
    "",
    `Name: ${form.name}`,
    `Company / Organization: ${form.organization}`,
    `Email: ${form.email}`,
    `Phone / LINE ID: ${form.phone}`,
    `Service interest: ${form.service}`,
    "",
    "Message:",
    form.message,
  ].join("\n");

  const subjectName = form.organization || form.name || copy.fallbackSubjectName;
  const subject = `${copy.subjectPrefix} - ${subjectName}`;
  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

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
      setCopyStatus(copy.copySuccess);
    } catch {
      setCopyStatus(copy.copyError);
    }
    window.setTimeout(() => setCopyStatus(copy.copyIdle), 1800);
  }

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-800">
          {copy.labels.name}
          <input
            className={fieldClass}
            name="name"
            placeholder={copy.placeholders.name}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
        <label className="text-sm font-bold text-slate-800">
          {copy.labels.organization}
          <input
            className={fieldClass}
            name="organization"
            placeholder={copy.placeholders.organization}
            value={form.organization}
            onChange={(event) => updateField("organization", event.target.value)}
          />
        </label>
        <label className="text-sm font-bold text-slate-800">
          {copy.labels.email}
          <input
            className={fieldClass}
            name="email"
            type="email"
            placeholder={copy.placeholders.email}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label className="text-sm font-bold text-slate-800">
          {copy.labels.phone}
          <input
            className={fieldClass}
            name="phone"
            placeholder={copy.placeholders.phone}
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>
        <label className="text-sm font-bold text-slate-800 sm:col-span-2">
          {copy.labels.service}
          <select
            className={fieldClass}
            name="service"
            value={form.service}
            onChange={(event) => updateField("service", event.target.value)}
          >
            <option value="" disabled>
              {copy.placeholders.service}
            </option>
            {copy.serviceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold text-slate-800 sm:col-span-2">
          {copy.labels.message}
          <textarea
            className={`${fieldClass} min-h-36 resize-y`}
            name="message"
            placeholder={copy.placeholders.message}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-600">
        {copy.recipientLabel}{" "}
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
          {copy.submitLabel}
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
          onClick={copyMessage}
        >
          <Clipboard className="h-4 w-4" aria-hidden="true" />
          {copyStatus}
        </button>
        <ButtonLink href={localizePath(primaryCtas.line.href, locale)} icon={MessageCircle} variant="line">
          {primaryCtas.line.label}
        </ButtonLink>
      </div>
    </form>
  );
}
