import type { Metadata } from "next";
import { PronunciationPageClient } from "@/components/pronunciation/PronunciationPageClient";

export const metadata: Metadata = {
  title: "發音練習 | Japanese After 50",
  description:
    "日文句型發音練習頁：日文優先顯示，支援假名/繁中切換與播放重播練習。"
};

export default function PronunciationPage() {
  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">發音練習</p>
        <h1 className="mt-2 text-3xl font-black text-white">發音練習</h1>
        <p className="mt-2 text-sm text-slate-300">
          先聽、再跟讀、再重播。慢速練習不是退步，是讓發音更穩的捷徑。
        </p>
      </header>

      <PronunciationPageClient />
    </main>
  );
}
