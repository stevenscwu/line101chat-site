import Image from "next/image";
import { MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { presenterAlt, presenterImages } from "@/data/presenter";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

type PresenterKey = keyof typeof presenterImages;

type PresenterFrameProps = {
  imageKey: PresenterKey;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

function PresenterFrame({
  imageKey,
  className = "",
  imageClassName = "object-cover object-top",
  priority = false,
}: PresenterFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] ${className}`}
    >
      <Image
        src={presenterImages[imageKey]}
        alt={presenterAlt[imageKey]}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 420px, 88vw"
        className={imageClassName}
      />
    </div>
  );
}

type PresenterHeroProps = {
  speech: string;
  featureCards: string[];
};

export function PresenterHero({ speech, featureCards }: PresenterHeroProps) {
  return (
    <div className="relative mx-auto max-w-[520px] lg:max-w-none">
      <PresenterFrame
        imageKey="hero"
        priority
        className="aspect-[4/5] min-h-[420px]"
        imageClassName="object-cover object-top"
      />

      <div className="absolute left-3 top-4 max-w-[78%] rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-bold leading-6 text-slate-800 shadow-lg sm:left-5 sm:max-w-[70%]">
        {speech}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 grid gap-2 px-3 sm:grid-cols-2 sm:px-5">
        {featureCards.map((feature) => (
          <div
            key={feature}
            className="rounded-lg border border-white/70 bg-slate-950/85 px-3 py-2 text-sm font-bold text-white shadow-lg backdrop-blur"
          >
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
}

type PresenterCalloutProps = {
  imageKey: PresenterKey;
  title: string;
  body: string;
  label?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function PresenterCallout({
  imageKey,
  title,
  body,
  label,
  actionLabel,
  actionHref,
}: PresenterCalloutProps) {
  return (
    <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[180px_1fr] md:items-center">
      <PresenterFrame imageKey={imageKey} className="aspect-[4/5] min-h-[220px]" />
      <div>
        {label ? (
          <p className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            {label}
          </p>
        ) : null}
        <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">{title}</h2>
        <p className="mt-3 text-base leading-8 text-slate-600">{body}</p>
        {actionLabel && actionHref ? (
          <ButtonLink href={actionHref} className="mt-5">
            {actionLabel}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}

type PresenterSideCardProps = {
  imageKey?: PresenterKey;
  quote: string;
};

export function PresenterSideCard({ imageKey = "cta", quote }: PresenterSideCardProps) {
  return (
    <aside className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <PresenterFrame imageKey={imageKey} className="aspect-[5/4] min-h-[220px]" />
      <div className="mt-4 rounded-lg bg-white p-4 text-sm font-semibold leading-7 text-slate-700 shadow-sm">
        {quote}
      </div>
    </aside>
  );
}

type PresenterCTAProps = {
  title: string;
  body: string;
  buttonLabel?: string;
  buttonHref?: string;
  locale?: Locale;
};

export function PresenterCTA({
  title,
  body,
  buttonLabel,
  buttonHref,
  locale = "zh",
}: PresenterCTAProps) {
  const { labels, primaryCtas } = getSiteContent(locale);
  const resolvedButtonLabel = buttonLabel ?? primaryCtas.assessment.label;
  const resolvedButtonHref = localizePath(buttonHref ?? primaryCtas.assessment.href, locale);

  return (
    <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-300">
            {labels.nextStep}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[0] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{body}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={resolvedButtonHref}>
              {resolvedButtonLabel}
            </ButtonLink>
            <ButtonLink href={localizePath(primaryCtas.demo.href, locale)} variant="secondary">
              {primaryCtas.demo.label}
            </ButtonLink>
            <ButtonLink href={localizePath(primaryCtas.line.href, locale)} variant="line" icon={MessageCircle}>
              {primaryCtas.line.label}
            </ButtonLink>
          </div>
        </div>
        <div className="relative">
          <PresenterFrame imageKey="cta" className="aspect-[4/5] min-h-[360px]" />
          <div className="absolute -bottom-4 left-4 right-4 rounded-lg border border-emerald-200 bg-white p-3 text-sm font-bold leading-6 text-slate-800 shadow-lg">
            {labels.ctaBubble}
          </div>
        </div>
      </div>
    </section>
  );
}
