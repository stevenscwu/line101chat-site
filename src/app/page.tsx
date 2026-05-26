import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  FileSearch,
  GraduationCap,
  Headphones,
  MapPin,
  MessageCircle,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { BenefitCard, ServiceCard } from "@/components/cards";
import { HeroSection } from "@/components/hero-section";
import { PresenterCTA } from "@/components/presenter";
import { ProcessSteps } from "@/components/process-steps";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

type DemoChatbot = {
  title: string;
  badge: string;
  description: string;
  qrImage?: string;
  qrAlt: string;
  href: string;
  actionLabel: string;
  note: string;
  localized?: boolean;
};

type UseCaseCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function HomeContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const home = content.pages.home;
  const isEnglish = locale === "en";
  const demoChatbots: DemoChatbot[] = isEnglish
    ? [
        {
          title: "iFIRST Document Q&A Demo",
          badge: "Live demo",
          description:
            "A public-document demo showing how admissions, rules, and service files can become a LINE-searchable knowledge assistant.",
          qrImage: content.site.ntutDemoQrImage,
          qrAlt: "NTUT iFIRST LINE chatbot demo QR Code",
          href: "/demo/ifirst-rag",
          actionLabel: "Try demo",
          note: "Demo account for capability proof; official rules still require official confirmation.",
        },
        {
          title: "LINE101Chat Business Bot",
          badge: "Business inquiry",
          description:
            "Ask about service scope, document readiness, LINE integration, PoC planning, and cloud or local deployment assessment.",
          qrImage: content.site.lineQrImage,
          qrAlt: "LINE101Chat business inquiry QR Code",
          href: content.site.linePageUrl,
          actionLabel: "Ask on LINE",
          note: "Use this account for LINE101Chat service inquiries.",
        },
        {
          title: "101recipe Chatbot",
          badge: "Recipe demo",
          description:
            "A passcode-gated LINE and web demo for retrieving authorized recipe PDFs from a local recipe index.",
          qrImage: "/101recipe-chatbot-qr.png",
          qrAlt: "101recipe Chatbot QR Code",
          href: "/case-studies/101recipe",
          actionLabel: "View case",
          note: "Demo account for authorized recipe retrieval; file access still depends on passcode scope.",
          localized: false,
        },
      ]
    : [
        {
          title: "iFIRST 文件問答 Demo",
          badge: "可試用 Demo",
          description:
            "以北科大 iFIRST 公開文件展示招生、規章與表單資訊如何變成可在 LINE 查詢、能附來源的 AI 知識助理。",
          qrImage: content.site.ntutDemoQrImage,
          qrAlt: "北科大 iFIRST 文件問答 Demo LINE QR Code",
          href: "/demo/ifirst-rag",
          actionLabel: "線上試用 Demo",
          note: "此帳號用於能力展示；正式學校規定仍以官方公告與辦公室回覆為準。",
        },
        {
          title: "LINE101Chat 商務詢問 Bot",
          badge: "商務帳號",
          description:
            "用來詢問 LINE 自動客服、企業知識庫問答、文件盤點、PoC 規劃，以及雲端或本地端部署評估。",
          qrImage: content.site.lineQrImage,
          qrAlt: "LINE101Chat 商務詢問 LINE QR Code",
          href: content.site.linePageUrl,
          actionLabel: "加入 LINE 詢問",
          note: "服務詢問請使用此商務帳號，避免與案例 Demo 帳號混用。",
        },
        {
          title: "101recipe Chatbot",
          badge: "食譜案例",
          description:
            "以食譜課程與 PDF 資料庫為情境，展示通行碼授權、本機索引與 LINE / Web 雙入口如何做成查找助理。",
          qrImage: "/101recipe-chatbot-qr.png",
          qrAlt: "101recipe Chatbot LINE QR Code",
          href: "/case-studies/101recipe",
          actionLabel: "查看食譜案例",
          note: "授權查找 Demo；可下載檔案仍依通行碼範圍與服務約定為準。",
          localized: false,
        },
      ];
  const useCaseCards: UseCaseCard[] = isEnglish
    ? [
        {
          title: "School Admissions",
          description: "Admissions FAQs, program rules, forms, deadlines, and international student support.",
          icon: GraduationCap,
        },
        {
          title: "Business Support",
          description: "Customer service scripts, product FAQs, service flows, and LINE auto-reply triage.",
          icon: Headphones,
        },
        {
          title: "Internal SOP",
          description: "SOP lookup, forms, operating notes, and internal knowledge for daily work.",
          icon: FileSearch,
        },
        {
          title: "Tourism Services",
          description: "Travel, arrival, transportation, local service, and visitor FAQ scenarios.",
          icon: MapPin,
        },
        {
          title: "HR / Onboarding",
          description: "New-hire training, benefits, leave rules, IT FAQs, and admin support.",
          icon: UsersRound,
        },
      ]
    : [
        {
          title: "學校招生",
          description: "招生 FAQ、系所規章、表單、截止日與國際學生常見問題。",
          icon: GraduationCap,
        },
        {
          title: "企業客服",
          description: "LINE 自動客服、產品 FAQ、服務流程、價格與交付說明。",
          icon: Headphones,
        },
        {
          title: "內部 SOP",
          description: "SOP 查詢、表單位置、操作注意事項與部門內部知識。",
          icon: FileSearch,
        },
        {
          title: "觀光旅遊",
          description: "交通、票券、報到、在地服務與旅客常見問題。",
          icon: MapPin,
        },
        {
          title: "HR / 新人訓練",
          description: "新人報到、請假福利、IT 常見問題與行政制度查詢。",
          icon: UsersRound,
        },
      ];

  return (
    <main>
      <HeroSection locale={locale} />

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={isEnglish ? "LINE Chatbot Demos" : "LINE Chatbot Demo"}
            title={isEnglish ? "See how LINE knowledge assistants can look in real use" : "先看三種 LINE AI 助理情境"}
            description={
              isEnglish
                ? "Use existing demos and business inquiry flows to evaluate whether a small PoC makes sense for your organization."
                : "從 iFIRST 文件問答、LINE101Chat 商務詢問到 101recipe 食譜案例，先用具體情境理解文件如何變成 LINE 裡的即時回答。"
            }
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {demoChatbots.map((demo) => {
              const href = demo.localized === false ? demo.href : localizePath(demo.href, locale);

              return (
                <article key={demo.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#06c755]/10 text-[#06c755]">
                      <MessageCircle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {demo.badge}
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-black leading-tight text-slate-950">{demo.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{demo.description}</p>
                  <div className="mt-5 rounded-lg border border-emerald-100 bg-white p-4">
                    {demo.qrImage ? (
                      <Image
                        src={demo.qrImage}
                        alt={demo.qrAlt}
                        width={250}
                        height={250}
                        className="mx-auto h-auto w-full max-w-[168px]"
                      />
                    ) : (
                      <div className="mx-auto flex aspect-square w-full max-w-[168px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center text-sm font-black leading-6 text-slate-500">
                        QR Code
                        <br />
                        {isEnglish ? "Coming soon" : "準備中"}
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-xs font-bold leading-6 text-slate-500">{demo.note}</p>
                  <Link
                    href={href}
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-emerald-700"
                  >
                    {demo.actionLabel}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.audiences.eyebrow}
            title={home.sections.audiences.title}
            description={home.sections.audiences.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {useCaseCards.map((card) => (
              <article key={card.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <card.icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-black leading-tight text-slate-950">{card.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.problems.eyebrow}
            title={home.sections.problems.title}
            description={home.sections.problems.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.problemCards.map((item) => (
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
            eyebrow={home.sections.core.eyebrow}
            title={home.sections.core.title}
            description={home.sections.core.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {content.coreServices.map((service) => (
              <ServiceCard
                key={service.title}
                {...service}
                href={localizePath(service.href, locale)}
                readMoreLabel={content.labels.readMore}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.security.eyebrow}
            title={home.sections.security.title}
            description={home.sections.security.description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {content.securityPrinciples.map((item) => (
              <BenefitCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.trust.eyebrow}
            title={home.sections.trust.title}
            description={home.sections.trust.description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.teamHighlights.map((item) => (
              <BenefitCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff7ed] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.process.eyebrow}
            title={home.sections.process.title}
            description={home.sections.process.description}
          />
          <div className="mt-8">
            <ProcessSteps steps={content.processSteps} />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={home.sections.benefits.eyebrow}
            title={home.sections.benefits.title}
            description={home.sections.benefits.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.benefits.map((benefit) => (
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
            eyebrow={home.sections.maintenance.eyebrow}
            title={home.sections.maintenance.title}
            description={home.sections.maintenance.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {content.trustPoints.map((item) => (
              <BenefitCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <PresenterCTA
        title={home.cta.title}
        body={home.cta.body}
        buttonLabel={home.cta.buttonLabel}
        buttonHref={"buttonHref" in home.cta ? home.cta.buttonHref : undefined}
        locale={locale}
      />
    </main>
  );
}

export default function Home() {
  return <HomeContent locale="zh" />;
}
