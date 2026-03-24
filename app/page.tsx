import Link from "next/link";
import { getDashboardMetrics, getTodayFocus } from "@/lib/content";

export default function HomePage() {
  const metrics = getDashboardMetrics();
  const focus = getTodayFocus();

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-hero-grid p-8 shadow-soft dark:border-slate-800 dark:bg-hero-grid-dark">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-accent-300">
          Japanese After 50
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-4xl">
          A personal Japanese study dashboard for daily consistency, speaking practice, and public progress.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          This system is built for one serious learner first. It turns daily study into a clear workflow: materials,
          pronunciation, logging, weekly review, and lightweight content ideas.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Open Dashboard
          </Link>
          <Link
            href="/weekly-review"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Weekly Review
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Current Streak</p>
          <p className="mt-2 text-3xl font-bold">{metrics.currentStreakDays} days</p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Sessions</p>
          <p className="mt-2 text-3xl font-bold">{metrics.totalSessions}</p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Minutes</p>
          <p className="mt-2 text-3xl font-bold">{metrics.totalMinutes}</p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Today Minutes</p>
          <p className="mt-2 text-3xl font-bold">{metrics.minutesToday}</p>
        </article>
      </section>

      <section className="panel">
        <h2 className="font-display text-xl font-semibold">Today&apos;s Focus</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{focus.primaryGoal}</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {focus.tasks.map((task) => (
            <li key={task} className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">
              {task}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
