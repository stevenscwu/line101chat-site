import { CalendarDays } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { PresenterHero } from "@/components/presenter";
import { primaryCtas } from "@/data/site";

const heroFeatures = [
  "RAG 文件問答核心服務",
  "來源引用與知識庫更新",
  "LINE 聊天機器人",
  "雲端 / 本地端部署",
];

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-emerald-50 px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:self-end">
          <p className="inline-flex rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
            台灣中小企業 RAG 知識助理 / 北科大工程團隊
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl lg:text-6xl">
            先把公司文件變成可信任的 RAG AI 助理
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600 sm:text-xl">
            LINE101Chat 以 RAG 文件問答為核心，協助台灣中小企業、學校與組織建置能引用正式來源的 LINE / Web AI 知識助理。印尼文繁體中文翻譯則作為加值服務，依實際場景加購。
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
            speech="我是 LINE101Chat 的 AI 解決方案顧問，會先協助你判斷文件是否適合做 RAG，再規劃雲端或本地端部署。"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:self-start">
          {[
            ["30 分鐘", "先做需求評估"],
            ["2-3 週", "RAG Starter PoC"],
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
