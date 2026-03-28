import { Section } from "@/components/layout/Section";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type ProcessTimelineProps = {
  content: Dictionary["home"]["process"];
};

export function ProcessTimeline({ content }: ProcessTimelineProps) {
  return (
    <Section tone="dark">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {content.title}
          </h2>
          <p className="text-base leading-relaxed text-white/75 md:text-lg">{content.description}</p>
        </div>

        <ol className="grid gap-4 md:grid-cols-4">
          {content.steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-3xl border border-white/12 bg-white/6 p-6 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-white/45">{`0${index + 1}`}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/72">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
