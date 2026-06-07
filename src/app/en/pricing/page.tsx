import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "LINE101Chat Pricing | LINE Enrollment FAQ Pilot",
  description:
    "LINE101Chat pilot pricing for Taiwan education teams that want to turn enrollment FAQs, course pages, and SOPs into a source-grounded LINE AI knowledge assistant.",
  alternates: { canonical: "/en/pricing" },
};

const packages = [
  {
    name: "LINE Enrollment FAQ Pilot",
    price: "NT$38,000",
    timeline: "7-10 business days",
    bestFor: "Cram schools, course operators, and education service teams already using LINE for inquiries.",
    highlighted: true,
    items: ["One use case", "20-30 pages", "30 approved questions", "Human handoff flow"],
  },
  {
    name: "Pilot Maintenance",
    price: "NT$8,000-12,000 / month",
    timeline: "After pilot",
    bestFor: "Teams that need small monthly updates and answer-quality review.",
    highlighted: false,
    items: ["Minor FAQ updates", "Monthly question review", "Basic quality checks", "Handoff copy refinement"],
  },
  {
    name: "Production Rollout",
    price: "Quoted after pilot",
    timeline: "Usually 4-6+ weeks",
    bestFor: "Teams expanding to more courses, departments, branches, or private data requirements.",
    highlighted: false,
    items: ["More documents", "More scenarios", "Admin update workflow", "Hosting and data-handling review"],
  },
];

const pilotIncludes = [
  "One enrollment, course, or front-desk FAQ use case",
  "20-30 pages of FAQ, course pages, PDFs, or SOPs",
  "30 real test questions approved by the customer",
  "LINE or web demo entry point",
  "Traditional Chinese answers with source clues",
  "Human handoff copy for uncertain or high-risk questions",
  "One test report with production recommendation",
];

const exclusions = [
  "No regulated legal, medical, immigration, financial, or official school decision advice",
  "No sensitive personal records, payment data, passwords, or student private documents",
  "No full CRM integration, multi-branch rollout, or 24/7 production SLA in the pilot",
  "No guarantee of perfect AI accuracy; the pilot measures process quality and answer boundaries",
];

export default function EnglishPricingPage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex rounded-lg bg-[#06c755]/15 px-3 py-1 text-sm font-black text-[#8df5ad]">
            Pricing
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
            Start with one LINE enrollment FAQ pilot, not a full AI transformation project.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-200">
            The first offer is deliberately small: one education or course inquiry use case, one document set, 30 real
            questions, and a clear go/no-go report before larger deployment.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/en/free-assessment" variant="primary">
              Apply for pilot assessment
            </ButtonLink>
            <ButtonLink href="/en/line" variant="line" icon={MessageCircle}>
              Ask through LINE
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Packages"
            title="A simple first package for real sales conversations"
            description="The pilot price is public so customers can quickly decide whether the project is worth discussing."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {packages.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-lg border p-6 shadow-sm ${
                  plan.highlighted ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"
                }`}
              >
                <h2 className="text-2xl font-black leading-tight text-slate-950">{plan.name}</h2>
                <p className="mt-4 text-3xl font-black text-emerald-700">{plan.price}</p>
                <p className="mt-2 text-sm font-bold text-slate-500">{plan.timeline}</p>
                <p className="mt-4 text-sm leading-7 text-slate-700">{plan.bestFor}</p>
                <ul className="mt-5 grid gap-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Pilot includes</h2>
            <ul className="mt-5 grid gap-3">
              {pilotIncludes.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-700" aria-hidden="true" />
              <h2 className="text-2xl font-black text-slate-950">Pilot excludes</h2>
            </div>
            <ul className="mt-5 grid gap-3">
              {exclusions.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
