import { ArrowDown, ArrowRight, CheckCircle2, FileSearch, MessageCircle, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

type HowItWorksContent = ReturnType<typeof getSiteContent>["pages"]["home"]["howItWorks"];

function FlowDiagram({ heading, labels }: { heading: string; labels: string[] }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <FileSearch className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-black leading-tight text-slate-950">{heading}</h3>
      </div>
      <ol className="mt-6 grid gap-3 lg:grid-cols-6 lg:items-stretch">
        {labels.map((label, index) => {
          const isLast = index === labels.length - 1;

          return (
            <li key={label} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="flex min-h-20 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-black leading-6 text-slate-800">{label}</p>
              </div>
              {!isLast ? (
                <>
                  <ArrowDown className="mx-auto h-5 w-5 text-emerald-600 lg:hidden" aria-hidden="true" />
                  <ArrowRight className="hidden h-5 w-5 text-emerald-600 lg:block" aria-hidden="true" />
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepCards({ steps }: { steps: HowItWorksContent["steps"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {steps.map((step, index) => (
        <article key={step.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-black text-emerald-700">
              {index + 1}
            </span>
            {"tag" in step && step.tag ? (
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{step.tag}</span>
            ) : null}
          </div>
          <h3 className="mt-4 text-lg font-black leading-tight text-slate-950">{step.title}</h3>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{step.description}</p>
        </article>
      ))}
    </div>
  );
}

export function HowItWorksSection({ locale = "zh" }: { locale?: Locale }) {
  const content = getSiteContent(locale);
  const section = content.pages.home.howItWorks;

  return (
    <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
              <p className="text-sm font-bold leading-7 text-emerald-950">{section.trustNote}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <FlowDiagram heading={section.diagramHeading} labels={section.diagramLabels} />
        </div>

        <div className="mt-8">
          <StepCards steps={section.steps} />
        </div>

        <div className="mt-8 grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <h3 className="text-xl font-black leading-tight text-slate-950">{section.ctaTitle}</h3>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">{section.ctaDescription}</p>
            </div>
          </div>
          <ButtonLink href={localizePath(section.ctaHref, locale)} icon={MessageCircle}>
            {section.ctaButton}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
