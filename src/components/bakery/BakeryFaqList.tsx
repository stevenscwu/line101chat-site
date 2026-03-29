type BakeryFaqItem = {
  question: string;
  answer: string;
};

type BakeryFaqListProps = {
  items: readonly BakeryFaqItem[];
};

export function BakeryFaqList({ items }: BakeryFaqListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-2xl border border-amber-200 bg-amber-50/50 p-4 open:bg-white"
        >
          <summary className="cursor-pointer list-none text-base font-medium text-amber-950">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-amber-300 text-xs text-amber-800">
                Q
              </span>
              {item.question}
            </span>
          </summary>
          <p className="mt-3 pl-8 text-sm leading-relaxed text-stone-700">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
