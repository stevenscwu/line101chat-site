import { CalendarDays } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { PresenterHero } from "@/components/presenter";
import { primaryCtas } from "@/data/site";

const heroFeatures = [
  "企業 AI 助理",
  "LINE 快速查詢",
  "來源引用",
  "資料保密邊界",
];

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-emerald-50 px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:self-end">
          <p className="inline-flex rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
            台灣中小企業 AI 助理 / 北科大工程團隊
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl lg:text-6xl">
            LINE101Chat 企業 AI 助理，讓公司知識保密又好查
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600 sm:text-xl">
            把 SOP、合約摘要、產品手冊、FAQ 與內部制度整理成可透過 LINE 搜尋的 AI 助理。依資料敏感度規劃雲端、本地端或私有雲部署，讓答案好找，也讓公司資訊留在可控範圍。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primaryCtas.demo.href} icon={CalendarDays}>
              {primaryCtas.demo.label}
            </ButtonLink>
            <ButtonLink href={primaryCtas.services.href} variant="secondary">
              {primaryCtas.services.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:row-span-2">
          <PresenterHero
            featureCards={heroFeatures}
            speech="我是 LINE101Chat 的 AI 解決方案顧問，會先協助你盤點文件敏感度與查詢場景，再規劃 LINE 入口、來源引用與部署方式。"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:self-start">
          {[
            ["30 分鐘", "先做需求評估"],
            ["2-3 週", "AI 助理 Starter PoC"],
            ["雲端 / 本地端", "依資料敏感度部署"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-black text-slate-950">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
