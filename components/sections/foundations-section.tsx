import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const foundationCards = [
  {
    title: "Cloud Computing Basics",
    points: [
      "Cloud computing delivers infrastructure, platforms, and software over the internet.",
      "IaaS provides virtual machines and networks, PaaS provides managed runtimes, SaaS provides finished applications.",
      "Azure ecosystem: compute (VM/App Service), storage (Blob), identity (Entra ID), and monitoring (Azure Monitor).",
      "Cloud CI/CD automates build, scan, test, and deployment at scale."
    ]
  },
  {
    title: "DevOps to DevSecOps",
    points: [
      "DevOps integrates development and operations for faster releases.",
      "Security bottlenecks emerge when checks happen only near production.",
      "Shift-left security inserts controls in coding and CI phases.",
      "DevSecOps improves release confidence, compliance, and incident reduction."
    ]
  },
  {
    title: "Static Analysis (SAST)",
    points: [
      "SAST inspects source code without executing the program.",
      "Rules identify patterns linked to vulnerabilities such as injection and insecure cryptography.",
      "Limitations include false positives and missing runtime context.",
      "Teams struggle to triage large alert volumes quickly."
    ]
  },
  {
    title: "AI in Software Security",
    points: [
      "LLMs summarize technical findings in plain language.",
      "AI can classify severity using code context and business impact signals.",
      "Context-aware triage reduces alert fatigue and analyst burnout.",
      "Human-in-the-loop validation ensures trust and governance."
    ]
  }
];

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      eyebrow="Educational Foundations"
      title="Build Shared Context Before Deep Research"
      description="This section introduces cloud, DevSecOps, static analysis, and AI-driven triage in clear terms for researchers and engineers new to security operations."
      className="bg-slate-50 dark:bg-slate-950"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {foundationCards.map((card) => (
          <Reveal key={card.title}>
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
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">Cloud Security Flow Illustration</h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
            {[
              "Developer Commit",
              "Cloud CI/CD Pipeline",
              "SAST + Policy Gates",
              "Secure Deployment"
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
