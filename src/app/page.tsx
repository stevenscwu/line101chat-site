import { CheckCircle2 } from "lucide-react";

import { BenefitCard, ServiceCard } from "@/components/cards";
import { HeroSection } from "@/components/hero-section";
import { PresenterCTA } from "@/components/presenter";
import { ProcessSteps } from "@/components/process-steps";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

export function HomeContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const home = content.pages.home;

  return (
    <main>
      <HeroSection locale={locale} />

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.problems.eyebrow}
            title={home.sections.problems.title}
            description={home.sections.problems.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.problemCards.map((item) => (
              <BenefitCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.core.eyebrow}
            title={home.sections.core.title}
            description={home.sections.core.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {content.coreServices.map((service) => (
              <ServiceCard
                key={service.title}
                {...service}
                href={localizePath(service.href, locale)}
                readMoreLabel={content.labels.readMore}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.security.eyebrow}
            title={home.sections.security.title}
            description={home.sections.security.description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {content.securityPrinciples.map((item) => (
              <BenefitCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.trust.eyebrow}
            title={home.sections.trust.title}
            description={home.sections.trust.description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.teamHighlights.map((item) => (
              <BenefitCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow={home.sections.audiences.eyebrow}
              title={home.sections.audiences.title}
              description={home.sections.audiences.description}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {content.audienceSegments.map((segment) => (
                <div key={segment.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <segment.icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                  <p className="text-sm font-black text-slate-800">{segment.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff7ed] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.process.eyebrow}
            title={home.sections.process.title}
            description={home.sections.process.description}
          />
          <div className="mt-8">
            <ProcessSteps steps={content.processSteps} />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.benefits.eyebrow}
            title={home.sections.benefits.title}
            description={home.sections.benefits.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.benefits.map((benefit) => (
              <div key={benefit} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.maintenance.eyebrow}
            title={home.sections.maintenance.title}
            description={home.sections.maintenance.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {content.trustPoints.map((item) => (
              <BenefitCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <PresenterCTA
        title={home.cta.title}
        body={home.cta.body}
        buttonLabel={home.cta.buttonLabel}
        locale={locale}
      />
    </main>
  );
}

export default function Home() {
  return <HomeContent locale="zh" />;
}
