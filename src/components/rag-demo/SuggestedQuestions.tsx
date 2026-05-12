"use client";

import { MessageCircleQuestion } from "lucide-react";

type SuggestedQuestionsProps = {
  questions: string[];
  disabled?: boolean;
  onSelect: (question: string) => void;
};

export function SuggestedQuestions({ questions, disabled = false, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          className="flex min-h-12 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold leading-6 text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={() => onSelect(question)}
        >
          <MessageCircleQuestion className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <span>{question}</span>
        </button>
      ))}
    </div>
  );
}
