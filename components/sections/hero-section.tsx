import { Reveal } from "@/components/ui/reveal";

const stats = [
  { label: "Daily Japanese Study", value: "45 min" },
  { label: "Content Output Target", value: "5 posts/week" },
  { label: "Positioning", value: "50+ IT learner" }
];

export function HeroSection() {
  return (
    <section id="top" className="bg-hero-grid pt-28 dark:bg-hero-grid-dark" aria-label="Landing section">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200">
            Channel Theme: Senior Man Learning Japanese
          </p>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Build a Brand-New Social Identity
            <span className="mt-3 block text-3xl sm:text-4xl">
              As a 50+ IT Man Learning Japanese
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300">
            This site is the action plan for a real-life mission: keep my true identity as an IT professional, share
            my Japanese learning journey in public, and build steady income streams to support my family.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#identity" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Identity Blueprint
            </a>
            <a href="#system" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
              Weekly System
            </a>
            <a href="#chatbot" className="rounded-lg border border-accent-500 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-500/10">
              Ask AI Coach
            </a>
            <a href="#monetize" className="rounded-lg border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:border-brand-500/60 dark:text-brand-300 dark:hover:bg-brand-500/10">
              Monetization Path
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Execution Snapshot
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Study in public, turn each learning session into content, and connect every post to a simple offer or
              lead magnet.
            </p>
            <div className="mt-5 rounded-xl border border-brand-100 bg-white p-4 dark:border-brand-500/30 dark:bg-slate-900">
              <ol className="grid gap-2 text-sm">
                {[
                  "Practice Japanese and capture one honest learning moment.",
                  "Turn that moment into one short video and one text post.",
                  "Add one IT x Japanese insight to stay true to your background.",
                  "Publish with one clear call-to-action (follow, DM, or email).",
                  "Review audience signals and earnings every week."
                ].map((step, idx) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/70">
              <p className="font-semibold text-slate-900 dark:text-slate-100">North Star</p>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                New social identity, same true self: IT background, 50+ learner, and family-first income mission.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-xl font-bold text-brand-700 dark:text-brand-300">{stat.value}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
