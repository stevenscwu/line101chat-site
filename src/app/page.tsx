import { CheckCircle2 } from "lucide-react";

import { BenefitCard, ServiceCard } from "@/components/cards";
import { HeroSection } from "@/components/hero-section";
import { PresenterCTA } from "@/components/presenter";
import { ProcessSteps } from "@/components/process-steps";
import { SectionHeading } from "@/components/section-heading";
import {
  audienceSegments,
  benefits,
  coreServices,
  problemCards,
  processSteps,
  teamHighlights,
  trustPoints,
} from "@/data/site";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="導入痛點"
            title="我們解決的問題"
            description="不是每個組織都需要大型 AI 平台。很多時候，先把文件整理好、讓 LINE 或網站能回答重複問題，就能立即減少團隊壓力。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problemCards.map((item) => (
              <BenefitCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="核心服務"
            title="RAG 是主服務，翻譯是加值服務"
            description="先把正式文件變成能追溯來源的 AI 知識助理，確認成效後，再依現場需求加上 LINE 翻譯、權限或私有化部署。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {coreServices.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="台灣市場信任"
            title="北科大工程背景，為台灣 SME 做務實導入"
            description="導入 AI 不只是 demo 漂亮，更要符合台灣公司對預算、維護、資料安全與可追溯答案的要求。"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {teamHighlights.map((item) => (
              <BenefitCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow="適用對象"
              title="適合誰使用？"
              description="LINE101Chat 特別適合已經累積大量文件、表單、FAQ 或日常 LINE 溝通量的台灣組織。"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {audienceSegments.map((segment) => (
                <div key={segment.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <segment.icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                  <p className="text-sm font-black text-slate-800">{segment.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff7ed] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="導入流程"
            title="導入流程"
            description="先用小範圍 RAG PoC 驗證文件品質與效益，再依資料敏感度決定雲端、本地端或私有化部署。"
          />
          <div className="mt-8">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="可衡量效益"
            title="可以帶來什麼效益？"
            description="成效會依文件品質與問題量而不同。我們會以實際問題測試，避免只看展示效果。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="信任與維護"
            title="把 AI 導入做得務實、可追溯、可維護"
            description="RAG 與 LINE chatbot 的價值不只在會聊天，而是在能否回答得準、能否追溯來源、能否被團隊長期維護。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {trustPoints.map((item) => (
              <BenefitCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <PresenterCTA
        title="想知道你的公司適不適合導入 AI 聊天助理？"
        body="先從 30 分鐘需求評估開始，我們會協助你確認文件狀況、適合的使用場景，以及 PoC 需要準備的資料。"
        buttonLabel="預約 30 分鐘需求評估"
      />
    </main>
  );
}
