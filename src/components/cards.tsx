import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export function BenefitCard({ title, description, icon: Icon = CheckCircle2 }: CardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p> : null}
    </article>
  );
}

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  readMoreLabel?: string;
};

export function ServiceCard({ title, description, href, icon: Icon, readMoreLabel = "了解更多" }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-base leading-8 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex text-sm font-black text-emerald-700 group-hover:text-emerald-800">
        {readMoreLabel}
      </span>
    </Link>
  );
}

type PricingCardProps = {
  name: string;
  price: string;
  summary: string;
  includes: string[];
  highlighted?: boolean;
  timeline?: string;
  bestFor?: string;
  recommendedLabel?: string;
  timelineLabel?: string;
  bestForLabel?: string;
};

export function PricingCard({
  name,
  price,
  summary,
  includes,
  highlighted = false,
  timeline,
  bestFor,
  recommendedLabel = "建議 PoC 起點",
  timelineLabel = "時程：",
  bestForLabel = "適合：",
}: PricingCardProps) {
  return (
    <article
      className={`rounded-lg border p-6 shadow-sm ${
        highlighted
          ? "border-emerald-500 bg-emerald-50 shadow-[0_20px_60px_rgba(5,150,105,0.16)]"
          : "border-slate-200 bg-white"
      }`}
    >
      {highlighted ? (
        <p className="mb-3 inline-flex rounded-lg bg-emerald-600 px-3 py-1 text-xs font-black text-white">
          {recommendedLabel}
        </p>
      ) : null}
      <h3 className="text-xl font-black text-slate-950">{name}</h3>
      <p className="mt-3 text-3xl font-black text-slate-950">{price}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{summary}</p>
      {timeline || bestFor ? (
        <div className="mt-4 grid gap-2 rounded-lg border border-slate-200 bg-white/70 p-3 text-xs leading-5 text-slate-700">
          {timeline ? (
            <p>
              <span className="font-black text-slate-950">{timelineLabel}</span>
              {timeline}
            </p>
          ) : null}
          {bestFor ? (
            <p>
              <span className="font-black text-slate-950">{bestForLabel}</span>
              {bestFor}
            </p>
          ) : null}
        </div>
      ) : null}
      <ul className="mt-6 grid gap-3">
        {includes.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

type DemoCardProps = {
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
};

export function DemoCard({ title, description, features, icon: Icon }: DemoCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-black leading-tight text-slate-950">{title}</h2>
      <p className="mt-3 text-base leading-8 text-slate-600">{description}</p>
      <ul className="mt-5 grid gap-2">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm font-semibold text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

type CTASectionProps = {
  title: string;
  body: string;
  href?: string;
  label?: string;
};

export function CTASection({ title, body, href = "/contact", label = "預約 Demo" }: CTASectionProps) {
  return (
    <section className="bg-emerald-700 px-5 py-12 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black leading-tight tracking-[0]">{title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-emerald-50">{body}</p>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-emerald-800 shadow-sm hover:bg-emerald-50"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
