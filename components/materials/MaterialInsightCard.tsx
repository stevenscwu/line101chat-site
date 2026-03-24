interface MaterialInsightCardProps {
  extractedVocabulary: number;
  extractedPhrases: number;
  generatedDrills: number;
}

export function MaterialInsightCard({
  extractedVocabulary,
  extractedPhrases,
  generatedDrills
}: MaterialInsightCardProps) {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">素材洞察</h3>
      <p className="mt-1 text-sm text-slate-400">系統自動抽取可以直接練習的內容。</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-700 bg-slate-800/70 p-3">
          <p className="text-xs text-slate-400">抽取單字</p>
          <p className="mt-1 text-2xl font-black text-white">{extractedVocabulary}</p>
        </article>
        <article className="rounded-2xl border border-slate-700 bg-slate-800/70 p-3">
          <p className="text-xs text-slate-400">抽取句子</p>
          <p className="mt-1 text-2xl font-black text-white">{extractedPhrases}</p>
        </article>
        <article className="rounded-2xl border border-slate-700 bg-slate-800/70 p-3">
          <p className="text-xs text-slate-400">生成練習卡</p>
          <p className="mt-1 text-2xl font-black text-white">{generatedDrills}</p>
        </article>
      </div>
    </section>
  );
}
