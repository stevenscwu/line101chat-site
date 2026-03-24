import { VocabItem } from "@/lib/learning/types";

interface VocabularyReviewCardProps {
  item: VocabItem;
  showKana?: boolean;
  showZh?: boolean;
}

export function VocabularyReviewCard({
  item,
  showKana = true,
  showZh = true
}: VocabularyReviewCardProps) {
  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-bold text-white">{item.word}</p>
          {showKana ? <p className="mt-1 text-sm text-cyan-100">{item.kana}</p> : null}
        </div>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
          弱項 {item.weaknessScore}
        </span>
      </div>

      {showZh ? <p className="mt-2 text-sm text-slate-300">{item.zhTW}</p> : null}
      <p className="mt-3 text-xs text-slate-500">{item.partOfSpeech}</p>

      <div className="mt-4 rounded-2xl bg-slate-800/80 p-3">
        <p className="text-sm text-white">{item.exampleJa}</p>
        {showKana ? <p className="mt-1 text-xs text-cyan-100">{item.exampleKana}</p> : null}
        {showZh ? <p className="mt-2 text-xs text-slate-300">{item.exampleZhTW}</p> : null}
      </div>
    </article>
  );
}
