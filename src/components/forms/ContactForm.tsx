"use client";

import { FormEvent, useState } from "react";

import type { Dictionary } from "@/lib/i18n/dictionaries";

type ContactFormProps = {
  form: Dictionary["ui"]["contactForm"];
  serviceOptions: string[];
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm({ form, serviceOptions }: ContactFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorText, setErrorText] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = new FormData(event.currentTarget);

    if (selectedServices.length === 0) {
      setState("error");
      setErrorText(form.error);
      return;
    }

    setState("submitting");
    setErrorText("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      // Placeholder for future CRM or email API integration.
      console.info("Contact inquiry payload", {
        name: payload.get("name"),
        company: payload.get("company"),
        email: payload.get("email"),
        projectType: payload.get("projectType"),
        budget: payload.get("budget"),
        message: payload.get("message"),
        selectedServices,
      });

      event.currentTarget.reset();
      setSelectedServices([]);
      setState("success");
    } catch {
      setState("error");
      setErrorText(form.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:p-8">
      <p className="text-sm text-slate-600">{form.intro}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span>{form.fields.name}</span>
          <input
            required
            name="name"
            placeholder={form.placeholders.name}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>{form.fields.company}</span>
          <input
            required
            name="company"
            placeholder={form.placeholders.company}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span>{form.fields.email}</span>
          <input
            required
            type="email"
            name="email"
            placeholder={form.placeholders.email}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>{form.fields.projectType}</span>
          <select
            required
            name="projectType"
            defaultValue=""
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="" disabled>
              --
            </option>
            {form.projectTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm text-slate-700">{form.fields.serviceSelection}</legend>
        <div className="grid gap-2 md:grid-cols-3">
          {serviceOptions.map((service) => {
            const active = selectedServices.includes(service);

            return (
              <label
                key={service}
                className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition ${
                  active
                    ? "border-slate-700 bg-slate-100 text-slate-900"
                    : "border-slate-300 bg-white text-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedServices((prev) => [...prev, service]);
                    } else {
                      setSelectedServices((prev) => prev.filter((item) => item !== service));
                    }
                  }}
                />
                {service}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="space-y-2 text-sm text-slate-700">
        <span>{form.fields.budget}</span>
        <select
          required
          name="budget"
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
        >
          <option value="" disabled>
            --
          </option>
          {form.budgetRanges.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        <span>{form.fields.message}</span>
        <textarea
          required
          minLength={20}
          rows={6}
          name="message"
          placeholder={form.placeholders.message}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "submitting" ? form.submitting : form.submit}
        </button>

        {state === "success" ? (
          <p className="text-sm text-emerald-700">{form.success}</p>
        ) : null}
        {state === "error" ? (
          <p className="text-sm text-red-700">{errorText || form.error}</p>
        ) : null}
      </div>
    </form>
  );
}
