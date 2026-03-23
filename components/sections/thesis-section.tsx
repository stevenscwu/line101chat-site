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
  "Daily study capture",
  "One short script",
  "Record and post clip",
  "Repurpose into text carousel",
  "Engage comments and DMs",
  "Track what converts",
  "Package useful resources",
  "Ship one paid offer"
];

const contentOutputData = {
  labels: ["Short videos", "Long videos", "Text posts", "Newsletter"],
  datasets: [
    {
      label: "Current monthly output",
      data: [10, 2, 8, 1],
      backgroundColor: "rgba(56, 93, 245, 0.6)"
    },
    {
      label: "90-day target output",
      data: [20, 4, 16, 4],
      backgroundColor: "rgba(6, 182, 212, 0.65)"
    }
  ]
};

const revenueTrendData = {
  labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
  datasets: [
    {
      label: "Baseline (no system)",
      data: [0, 30, 40, 50, 60, 70],
      borderColor: "rgba(100, 116, 139, 0.95)",
      backgroundColor: "rgba(100, 116, 139, 0.18)",
      tension: 0.35
    },
    {
      label: "With weekly creator system",
      data: [0, 80, 180, 320, 500, 750],
      borderColor: "rgba(14, 165, 233, 1)",
      backgroundColor: "rgba(14, 165, 233, 0.15)",
      tension: 0.35
    }
  ]
};

export function ThesisSection() {
  return (
    <Section
      id="system"
      eyebrow="Weekly System"
      title="Study -> Publish -> Improve -> Monetize"
      description="A repeatable operating system that turns daily Japanese learning into consistent content and practical income opportunities."
      className="bg-white dark:bg-slate-900"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              90-Day Execution Sprint
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>
                Phase 1 (Weeks 1-4): build publishing consistency and identify your best-performing content format.
              </li>
              <li>
                Phase 2 (Weeks 5-8): launch one lead magnet and test one low-ticket offer.
              </li>
              <li>
                Phase 3 (Weeks 9-12): refine offer messaging and build recurring content funnels.
              </li>
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
              Weekly Operating Rhythm
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Monday to Friday: learn Japanese, capture one moment, and publish one short-form artifact. Saturday:
              long-form recap. Sunday: analytics, planning, and offer optimization.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 p-4 text-xs dark:border-slate-700">
              <p className="font-semibold text-brand-700 dark:text-brand-300">Non-Negotiable Rule</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Progress over perfection. Honest documentation is the brand asset that creates trust and conversions.
              </p>
            </div>
          </article>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
            Weekly Creator Pipeline
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pipelineSteps.map((step, idx) => (
              <div key={step} className="group rounded-xl border border-brand-100 bg-brand-50/60 p-4 transition hover:-translate-y-1 hover:border-brand-300 dark:border-brand-500/25 dark:bg-brand-500/10 dark:hover:border-brand-400/60">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700 dark:text-brand-200">
                  Stage {idx + 1}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              Content Output Growth
            </h3>
            <div className="mt-4 h-72">
              <Bar
                data={contentOutputData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  scales: {
                    y: { title: { display: true, text: "Pieces per month" } }
                  }
                }}
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              Revenue Trend Projection
            </h3>
            <div className="mt-4 h-72">
              <Line
                data={revenueTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  scales: {
                    y: { title: { display: true, text: "USD per month" } }
                  }
                }}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <article className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
            Post Templates That Build Trust
          </h3>
          <ul className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
            <li>
              Today I struggled with __ in Japanese. Here is what fixed it in 20 minutes.
            </li>
            <li>
              One IT analogy that made this Japanese grammar point easier to remember.
            </li>
            <li>
              What I said wrong today and the corrected sentence I will practice tomorrow.
            </li>
            <li>
              This week in numbers: study hours, posts shipped, and lessons for next week.
            </li>
          </ul>
        </article>
      </Reveal>

      <Reveal>
        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50">
            Weekly KPI Dashboard
          </h3>
          <ul className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
            <li>Study consistency: days studied / 7 days</li>
            <li>Publishing consistency: posts shipped / planned posts</li>
            <li>Audience trust: saves, comments, and DM quality</li>
            <li>Monetization: leads, calls booked, and paid conversions</li>
          </ul>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Keep the dashboard simple. If one metric drops for two weeks, tighten the system before adding new
            platforms or offers.
          </p>
        </article>
      </Reveal>
    </Section>
  );
}
