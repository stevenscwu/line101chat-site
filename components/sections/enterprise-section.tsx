import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function EnterpriseSection() {
  return (
    <Section
      id="enterprise"
      eyebrow="Enterprise RAG Solutions"
      title="Commercialization Path: Private AI for Security and Knowledge"
      description="Beyond thesis validation, the same architecture can power secure enterprise assistants for engineering, compliance, and operations teams."
      className="bg-white dark:bg-slate-900"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Why Enterprises Need Private AI</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>Knowledge overload across tickets, runbooks, and audit artifacts slows decision-making.</li>
              <li>Regulated industries require strict data governance and traceable AI outputs.</li>
              <li>Private AI keeps sensitive code and documents inside controlled boundaries.</li>
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Use Cases</h3>
            <ul className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
              <li>DevSecOps assistant</li>
              <li>Enterprise knowledge assistant</li>
              <li>Compliance and audit support</li>
              <li>Code review assistant</li>
              <li>Technical support chatbot</li>
            </ul>
          </article>
        </Reveal>
      </div>

      <Reveal>
        <article className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">RAG Architecture Explanation</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Document ingestion",
              "Vector database indexing",
              "Context retrieval",
              "LLM synthesis with citation"
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
            Deployment options include secure enterprise chatbot services, on-prem AI assistants, Azure-native AI stacks,
            and dedicated DevSecOps copilots.
          </p>
        </article>
      </Reveal>
    </Section>
  );
}
