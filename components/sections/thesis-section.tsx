"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const pipelineSteps = [
  "Code push",
  "Pipeline triggered",
  "SonarQube scan",
  "Report stored",
  "AI analysis",
  "Prioritized summary",
  "Human approval",
  "Deployment"
];

const severityData = {
  labels: ["Critical", "High", "Medium", "Low"],
  datasets: [
    {
      label: "Before AI Triage",
      data: [42, 80, 145, 188],
      backgroundColor: "rgba(56, 93, 245, 0.6)"
    },
    {
      label: "After AI Triage",
      data: [39, 52, 71, 61],
      backgroundColor: "rgba(6, 182, 212, 0.65)"
    }
  ]
};

const productivityData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
  datasets: [
    {
      label: "Manual Triage",
      data: [18, 19, 17, 20, 19, 18],
      borderColor: "rgba(100, 116, 139, 0.95)",
      backgroundColor: "rgba(100, 116, 139, 0.18)",
      tension: 0.35
    },
    {
      label: "AI-Augmented Triage",
      data: [20, 24, 26, 29, 30, 31],
      borderColor: "rgba(14, 165, 233, 1)",
      backgroundColor: "rgba(14, 165, 233, 0.15)",
      tension: 0.35
    }
  ]
};

export function ThesisSection() {
  return (
    <Section
      id="thesis"
      eyebrow="Core Thesis"
      title="Research Architecture, Experiments, and Contributions"
      description="The thesis addresses SAST information overload by combining SonarQube outputs with GPT-4.1 contextual reasoning in a cloud-based, privacy-aware DevSecOps pipeline."
      className="bg-white dark:bg-slate-900"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Problem and Motivation</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>SAST tools generate high volumes of alerts, many lacking actionable context.</li>
              <li>Teams need prioritization that reflects exploitability, business impact, and deployment criticality.</li>
              <li>Cloud-native systems increase architectural complexity and attack surface.</li>
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Proposed Architecture</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Code - CI/CD - SonarQube - Azure Blob - Azure Function - GPT analysis - Human review - Deployment.
              This design enables explainable risk prioritization while preserving human oversight.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 p-4 text-xs dark:border-slate-700">
              <p className="font-semibold text-brand-700 dark:text-brand-300">Privacy-Preserving Workflow</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Sensitive artifacts can stay in enterprise-controlled cloud boundaries with selective prompt abstraction.
              </p>
            </div>
          </article>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Interactive Pipeline Walkthrough</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineSteps.map((step, idx) => (
              <div key={step} className="group rounded-xl border border-brand-100 bg-brand-50/60 p-4 transition hover:-translate-y-1 hover:border-brand-300 dark:border-brand-500/25 dark:bg-brand-500/10 dark:hover:border-brand-400/60">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700 dark:text-brand-200">Stage {idx + 1}</p>
                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">Severity Filtering Results</h3>
            <div className="mt-4 h-72">
              <Bar
                data={severityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } }
                }}
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">Productivity Improvement Over Time</h3>
            <div className="mt-4 h-72">
              <Line
                data={productivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } }
                }}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <article className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">Research Contributions</h3>
          <ul className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
            <li>AI-enhanced DevSecOps triage architecture with human-in-the-loop validation.</li>
            <li>Measured reduction in triage time and improved severity prioritization quality.</li>
            <li>Reproducible pipeline blueprint suitable for research and enterprise adaptation.</li>
            <li>Privacy-aware cloud workflow for sensitive vulnerability processing.</li>
          </ul>
        </article>
      </Reveal>
    </Section>
  );
}
