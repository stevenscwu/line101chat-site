import Link from "next/link";
import { getDashboardMetrics, getTodayFocus } from "@/lib/content";

export default function DashboardPage() {
  const metrics = getDashboardMetrics();
  const focus = getTodayFocus();

  return (
    <main className="space-y-6">
      <section>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Your daily study cockpit: focus, momentum, and shortcuts.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Streak</p>
          <p className="mt-2 text-3xl font-bold">{metrics.currentStreakDays} days</p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Minutes Today</p>
          <p className="mt-2 text-3xl font-bold">{metrics.minutesToday}</p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Sessions</p>
          <p className="mt-2 text-3xl font-bold">{metrics.totalSessions}</p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Minutes</p>
          <p className="mt-2 text-3xl font-bold">{metrics.totalMinutes}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="panel">
          <h2 className="font-display text-xl font-semibold">Today&apos;s Study Focus</h2>
          <p className="mt-3 text-slate-700 dark:text-slate-200">{focus.primaryGoal}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{focus.pronunciationTarget}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {focus.tasks.map((task) => (
              <li key={task} className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">
                {task}
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2 className="font-display text-xl font-semibold">Quick Shortcuts</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link
              href="/materials"
              className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Open Materials
            </Link>
            <Link
              href="/pronunciation-lab"
              className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Start Pronunciation Lab
            </Link>
            <Link
              href="/study-log"
              className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Write Study Log
            </Link>
            <Link
              href="/content-studio"
              className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Generate Content Ideas
            </Link>
          </div>
          <div className="mt-5 rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <p className="font-semibold">Today&apos;s Social Prompt</p>
            <p className="mt-1">{focus.socialPrompt}</p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Latest Material</p>
          <p className="mt-2 font-semibold">{metrics.latestMaterial?.title}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{metrics.latestMaterial?.topic}</p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Latest Study Log</p>
          <p className="mt-2 font-semibold">{metrics.latestStudyLog?.focusArea}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{metrics.latestStudyLog?.reflection}</p>
        </article>
        <article className="panel">
          <p className="text-xs uppercase tracking-wide text-slate-500">Latest Weekly Review</p>
          <p className="mt-2 font-semibold">{metrics.latestWeeklyReview?.weekLabel}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{metrics.latestWeeklyReview?.nextWeekFocus}</p>
        </article>
      </section>
    </main>
  );
}
