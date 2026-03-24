import type { Metadata } from "next";
import { getDefaultDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "關於計畫 | Japanese After 50",
  description:
    "關於 Japanese After 50：50+ 台灣學習者的日語長期學習系統、公開記錄與鼓勵型社群計畫。"
};

export default function AboutPage() {
  const dict = getDefaultDictionary();

  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">關於計畫</p>
        <h1 className="mt-2 text-3xl font-black text-white">關於這個計畫</h1>
        <p className="mt-2 text-sm text-slate-300">{dict.brand.about?.motivation}</p>
      </header>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="surface-card">
          <h2 className="text-xl font-bold text-white">為什麼做這個網站？</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            這個網站不是商業型聊天機器人展示頁，而是一個真實可用的日語修行系統。它把每天該做的事情拆成清楚節點，
            讓 50+ 學習者也能穩定、長期地把日語練成生活能力。
          </p>
        </article>

        <article className="surface-card">
          <h2 className="text-xl font-bold text-white">計畫核心</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li className="rounded-xl bg-slate-800/70 px-3 py-2">每日任務可視化，降低開始門檻</li>
            <li className="rounded-xl bg-slate-800/70 px-3 py-2">日文學習內容優先，繁中輔助理解</li>
            <li className="rounded-xl bg-slate-800/70 px-3 py-2">發音練習與素材抽取一體化</li>
            <li className="rounded-xl bg-slate-800/70 px-3 py-2">把學習紀錄轉成低成本社群內容</li>
          </ul>
        </article>
      </section>

      <section className="surface-card">
        <h2 className="text-xl font-bold text-white">給未來使用者</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          現在先服務一位台灣 50+ 學習者。未來會把這套方法整理成可重用模板，幫更多人建立自己的日語學習儀表板。
        </p>
      </section>
    </main>
  );
}
