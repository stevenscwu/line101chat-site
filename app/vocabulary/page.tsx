import type { Metadata } from "next";
import { VocabularyPageClient } from "@/components/learn/VocabularyPageClient";

export const metadata: Metadata = {
  title: "單字複習 | Japanese After 50",
  description:
    "日文單字複習頁：日文優先、支援假名與繁中，提供到期複習與弱項單字視覺提示。"
};

export default function VocabularyPage() {
  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">單字複習</p>
        <h1 className="mt-2 text-3xl font-black text-white">單字複習</h1>
        <p className="mt-2 text-sm text-slate-300">
          先看日文，再確認意思。讓認字、發音、例句一起連動，記得更久。
        </p>
      </header>

      <VocabularyPageClient />
    </main>
  );
}
