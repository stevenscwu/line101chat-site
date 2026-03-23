import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function EnterpriseSection() {
  return (
    <Section
      id="monetize"
      eyebrow="Monetization Path"
      title="Income Streams That Match Your Real Identity"
      description="Monetization should feel aligned, practical, and trustworthy: helping people while building stable family-support income."
      className="bg-white dark:bg-slate-900"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Offer Ladder
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>
                Free: daily learning clips, mistakes, and practical study notes.
              </li>
              <li>
                Low-ticket: study templates, phrase packs, and IT-friendly Japanese cheat sheets.
              </li>
              <li>
                Mid-ticket: cohort-based accountability group for late-start learners.
              </li>
              <li>
                High-ticket: 1:1 coaching focused on systems, discipline, and execution planning.
              </li>
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Revenue Channels</h3>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
              <li>Affiliate tools you genuinely use</li>
              <li>YouTube ad revenue and sponsorships</li>
              <li>Downloadable learning products</li>
              <li>Private community subscriptions</li>
              <li>Workshops for mature learners</li>
              <li>Corporate talks: learning systems + reinvention</li>
            </ul>
          </article>
        </Reveal>
      </div>

      <Reveal>
        <article className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
            Conversion Framework
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Attention: honest daily progress",
              "Trust: show process and corrections",
              "Value: useful templates and examples",
              "Offer: clear next paid step"
            ].map((item, idx) => (
              <div key={item} className="rounded-xl border border-accent-100 bg-accent-50/50 p-4 dark:border-accent-500/30 dark:bg-accent-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-700 dark:text-accent-200">
                  Module {idx + 1}
                </p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Keep the story simple: a 50+ IT man learning Japanese with discipline. Consistency and sincerity are the
            core business advantages.
          </p>
        </article>
      </Reveal>
    </Section>
  );
}
