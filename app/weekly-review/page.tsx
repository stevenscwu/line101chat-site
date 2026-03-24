import { getWeeklyReviews } from "@/lib/content";

export default function WeeklyReviewPage() {
  const reviews = getWeeklyReviews();

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <h1 className="font-display text-3xl font-bold">Weekly Review</h1>
        <p className="text-slate-600 dark:text-slate-300">
          A timeline of what improved, what remained difficult, and what to focus on next.
        </p>
      </section>

      <section className="space-y-4">
        {reviews.map((review) => (
          <article key={review.id} className="panel space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{review.weekLabel}</h2>
                <p className="text-sm text-slate-500">
                  {review.startDate} to {review.endDate}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Phrase: {review.phraseOfWeek}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Highlights</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {review.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-500">Biggest Challenge</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{review.biggestChallenge}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-500">Next Week Focus</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{review.nextWeekFocus}</p>
              </div>
            </div>

            {review.publicSummary ? (
              <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {review.publicSummary}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
