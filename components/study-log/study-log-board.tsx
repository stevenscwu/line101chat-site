"use client";

import { FormEvent, useMemo, useState } from "react";
import { StudyLogEntry, StudyMaterial } from "@/lib/content";

interface StudyLogBoardProps {
  initialLogs: StudyLogEntry[];
  materials: StudyMaterial[];
}

interface LogFormState {
  date: string;
  minutesStudied: string;
  focusArea: string;
  materialId: string;
  notes: string;
  reflection: string;
}

function todayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toSortedLogs(logs: StudyLogEntry[]): StudyLogEntry[] {
  return [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function StudyLogBoard({ initialLogs, materials }: StudyLogBoardProps) {
  const [logs, setLogs] = useState<StudyLogEntry[]>(initialLogs);
  const [form, setForm] = useState<LogFormState>({
    date: todayLocalDate(),
    minutesStudied: "30",
    focusArea: "",
    materialId: materials[0]?.id ?? "",
    notes: "",
    reflection: ""
  });

  const displayLogs = useMemo(() => toSortedLogs(logs), [logs]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const minutes = Number(form.minutesStudied);
    if (!form.focusArea.trim() || !form.reflection.trim() || Number.isNaN(minutes) || minutes <= 0) {
      return;
    }

    const entry: StudyLogEntry = {
      id: `log-${Date.now()}`,
      date: form.date,
      minutesStudied: minutes,
      focusArea: form.focusArea.trim(),
      materialIds: form.materialId ? [form.materialId] : [],
      notes: form.notes.trim(),
      reflection: form.reflection.trim(),
      confidenceScore: undefined,
      createdAt: new Date().toISOString()
    };

    setLogs((prev) => [entry, ...prev]);
    setForm((prev) => ({
      ...prev,
      focusArea: "",
      notes: "",
      reflection: ""
    }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
      <section className="panel">
        <h2 className="text-xl font-semibold">Add Study Log</h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-300">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-300">Minutes</span>
            <input
              type="number"
              min={5}
              step={5}
              value={form.minutesStudied}
              onChange={(event) => setForm((prev) => ({ ...prev, minutesStudied: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-300">Focus Area</span>
            <input
              type="text"
              placeholder="Pronunciation shadowing"
              value={form.focusArea}
              onChange={(event) => setForm((prev) => ({ ...prev, focusArea: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-300">Related Material</span>
            <select
              value={form.materialId}
              onChange={(event) => setForm((prev) => ({ ...prev, materialId: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            >
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-300">Notes</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-300">Reflection</span>
            <textarea
              rows={3}
              required
              value={form.reflection}
              onChange={(event) => setForm((prev) => ({ ...prev, reflection: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Save Log Entry
          </button>
        </form>
      </section>

      <section className="panel">
        <h2 className="text-xl font-semibold">Recent Sessions</h2>
        <div className="mt-4 space-y-3">
          {displayLogs.map((entry) => (
            <article key={entry.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{entry.focusArea}</p>
                <p className="text-xs text-slate-500">
                  {entry.date} | {entry.minutesStudied} min
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{entry.reflection}</p>
              {entry.notes ? (
                <p className="mt-1 text-xs text-slate-500">Notes: {entry.notes}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
