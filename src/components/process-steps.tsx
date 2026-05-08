export function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {steps.map((step, index) => (
        <li key={step} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
            {index + 1}
          </span>
          <p className="mt-4 text-sm font-black leading-6 text-slate-900">{step}</p>
        </li>
      ))}
    </ol>
  );
}
