import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const foundationCards = [
  {
    id: "truth",
    title: "True-Core Identity",
    points: [
      "I am not pretending to be a language teacher. I am a 50+ IT professional learning Japanese in public.",
      "The story is authentic: beginner-to-intermediate progress, real mistakes, and practical routines after work.",
      "The mission is explicit: create stable income streams to support family responsibilities."
    ]
  },
  {
    id: "positioning",
    title: "Channel Positioning",
    points: [
      "Primary theme: senior man learning Japanese with discipline and humility.",
      "Differentiator: IT mindset applied to language learning (systems, tooling, automation, consistency).",
      "Audience fit: busy adults, late-start learners, and people rebuilding confidence after 40."
    ]
  },
  {
    id: "platforms",
    title: "Platform Identity System",
    points: [
      "YouTube: weekly long-form journey logs (wins, mistakes, and lessons learned).",
      "Instagram/Reels/Shorts: daily 30-60 second clips with one clear takeaway.",
      "X/Threads: concise daily reflections and IT x Japanese analogies.",
      "LINE/community channel: close-circle engagement and conversion path."
    ]
  },
  {
    id: "pillars",
    title: "Content Pillars",
    points: [
      "Daily Japanese learning logs: vocabulary, pronunciation, listening drills, and practice reflections.",
      "IT x Japanese crossover: tech terms in Japanese, bilingual debugging stories, and workflow hacks.",
      "Family-income transparency: what content worked, what did not, and what generated revenue."
    ]
  },
  {
    id: "voice",
    title: "Voice and Trust Rules",
    points: [
      "Never fake fluency. Show corrections, not perfection.",
      "Use clear and warm language so other late-start learners feel welcome.",
      "Always include one practical next step per post to help people take action."
    ]
  }
];

export function FoundationsSection() {
  return (
    <Section
      id="identity"
      eyebrow="Identity Blueprint"
      title="Brand-New Social Presence, Same True You"
      description="This section defines the public identity system for a 50+ IT man learning Japanese while building trust, audience fit, and long-term monetization potential."
      className="bg-slate-50 dark:bg-slate-950"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {foundationCards.map((card) => (
          <Reveal key={card.id}>
            <article className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">{card.title}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {card.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
            Identity-to-Content Flow
          </h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
            {[
              "Truth: 50+ IT man learning Japanese",
              "Theme: senior journey with daily progress",
              "Format: short + long + community loop",
              "Outcome: trust, leads, and family-support income"
            ].map((item, idx) => (
              <div key={item} className="rounded-lg border border-brand-100 bg-brand-50/50 p-3 text-center dark:border-brand-500/30 dark:bg-brand-500/10">
                <p className="font-semibold text-brand-700 dark:text-brand-200">Step {idx + 1}</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
