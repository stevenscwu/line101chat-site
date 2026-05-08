import { faqItems } from "@/data/site";

export function FAQSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-10" id="faq">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">FAQ</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] text-slate-950 sm:text-4xl">
            常見問題
          </h2>
        </div>
        <div className="mt-8 grid gap-3">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-sm"
            >
              <summary className="cursor-pointer list-none text-base font-black text-slate-950 [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
