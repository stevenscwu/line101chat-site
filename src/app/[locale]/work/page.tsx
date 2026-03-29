import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { FeaturedProjectCard } from "@/components/work/FeaturedProjectCard";
import { PortfolioCTASection } from "@/components/work/PortfolioCTASection";
import { ProjectArchiveCard } from "@/components/work/ProjectArchiveCard";
import type { WorkArchiveProject, WorkFeaturedProject } from "@/components/work/types";
import { WorksPageHero } from "@/components/work/WorksPageHero";
import { type Locale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type WorkPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

type WorkPortfolioCopy = {
  hero: {
    kicker: string;
    title: string;
    description: string;
    filters: string[];
  };
  featuredTitle: string;
  featuredHeading: string;
  featuredDescription: string;
  featuredProjects: WorkFeaturedProject[];
  archiveTitle: string;
  archiveHeading: string;
  archiveDescription: string;
  archiveProjects: WorkArchiveProject[];
  closing: {
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};

function getWorkPortfolioCopy(locale: Locale): WorkPortfolioCopy {
  if (locale === "zh-TW") {
    return {
      hero: {
        kicker: "作品",
        title: "精選案例與體驗原型",
        description:
          "這裡展示 LINE101 Studio 的網站、品牌體驗、RAG 助理與產品化介面示範。每個案例皆以視覺敘事、使用體驗與可擴充技術基礎為核心。",
        filters: ["品牌網站", "企業官網", "知識助理", "Dashboard", "互動式展示"],
      },
      featuredTitle: "Featured Works",
      featuredHeading: "以案例視角展示設計與工程整合能力",
      featuredDescription: "以較完整的案例預覽呈現設計方向、系統思維與交付品質。",
      featuredProjects: [
        {
          id: "simple-pure-bakery",
          category: "品牌網站 / 烘焙品牌體驗",
          title: "簡單純麵包 / Simple Pure Bakery",
          summary:
            "暖色編輯感品牌網站示範，結合商品敘事、團購流程與配送資訊，呈現生活風格品牌從視覺到內容架構的完整體驗。",
          highlights: [
            "建立品牌首頁、產品列表與產品明細頁的敘事節奏",
            "整合團購、配送、FAQ 與聯絡頁，形成可落地的商業流程",
            "以可延展的模組化元件支撐後續電商與內容擴充",
          ],
          stack: "Next.js App Router、TypeScript、Tailwind CSS",
          href: "/work/simple-bakery",
          cta: "查看案例",
          secondaryHref: "/work/simple-bakery/products",
          secondaryCta: "瀏覽產品頁",
          coverLabel: "Brand Experience Demo",
          coverTitle: "Bakery Brand Story",
          coverTone: "amber",
        },
        {
          id: "premium-business-site",
          category: "企業官網 / 品牌網站",
          title: "雙語品牌企業網站概念",
          summary:
            "面向 B2B 與國際客戶的企業官網概念，以內容分層、視覺系統與 CTA 路徑強化品牌信任與商務轉換效率。",
          highlights: [
            "雙語資訊架構，兼顧在地敘事與國際閱讀情境",
            "首屏與段落節奏聚焦品牌定位與關鍵服務價值",
            "支援後續案例頁、洞察內容與行銷著陸頁擴充",
          ],
          stack: "Next.js、TypeScript、Tailwind CSS、SEO Metadata",
          href: "/services/websites",
          cta: "查看網站能力",
          secondaryHref: "/contact",
          secondaryCta: "討論類似專案",
          coverLabel: "Corporate Website Concept",
          coverTitle: "Bilingual Brand System",
          coverTone: "indigo",
        },
        {
          id: "rag-knowledge-assistant",
          category: "知識助理 / AI 系統",
          title: "RAG 企業知識助理原型",
          summary:
            "針對政策文件與 FAQ 場景設計的知識助理原型，強調回答可追溯、維護流程清晰與企業導入可行性。",
          highlights: [
            "規劃知識匯入與版本更新流程，降低後續維運門檻",
            "設計檢索與回答協調邏輯，提升回答品質與可信度",
            "以對話介面串接既有客服與內部知識查詢情境",
          ],
          stack: "RAG Pipeline、Vector Retrieval、Web Chat UX",
          href: "/services/rag-chatbots",
          cta: "查看 AI 助理能力",
          secondaryHref: "/process",
          secondaryCta: "了解交付流程",
          coverLabel: "Knowledge Assistant Prototype",
          coverTitle: "Grounded RAG Experience",
          coverTone: "emerald",
        },
      ],
      archiveTitle: "Project Archive",
      archiveHeading: "更多探索中的作品方向",
      archiveDescription: "更多工作室探索與可擴充的案例方向，作為未來正式案例研究的基礎。",
      archiveProjects: [
        {
          id: "workflow-dashboard",
          category: "Dashboard / 產品介面",
          title: "流程管理 Dashboard",
          summary:
            "整合審核、任務與營運報表的模組化管理介面，示範角色導向操作與 KPI 可視化。",
          href: "/services/apps",
          cta: "查看應用能力",
          coverTone: "slate",
        },
        {
          id: "interactive-showcase",
          category: "互動式展示 / 體驗原型",
          title: "互動式品牌展示頁原型",
          summary:
            "以敘事滾動與分段視覺轉場呈現品牌故事，適合新品發表與活動主題頁。",
          cta: "案例製作中",
          coverTone: "indigo",
        },
        {
          id: "service-microsite",
          category: "服務型網站 / 轉換頁",
          title: "服務方案 Microsite 概念",
          summary:
            "聚焦單一服務方案的高轉換頁型，結合案例片段、流程說明與商務 CTA 結構。",
          href: "/pricing",
          cta: "查看方案架構",
          coverTone: "emerald",
        },
      ],
      closing: {
        title: "想把你的下一個專案做成可展示的作品嗎？",
        description:
          "如果你希望網站、AI 助理或產品系統同時具備品牌質感與工程穩定性，我們可以一起定義下一個案例。",
        primaryLabel: "預約專案討論",
        secondaryLabel: "查看服務內容",
      },
    };
  }

  return {
    hero: {
      kicker: "Work",
      title: "Curated projects and experience prototypes",
      description:
        "A portfolio-style showcase of website, brand experience, RAG assistant, and product UX demos from LINE101 Studio, focused on visual quality and execution depth.",
      filters: ["Brand Websites", "Corporate Sites", "Knowledge Assistant", "Dashboard", "Interactive Showcase"],
    },
    featuredTitle: "Featured Works",
    featuredHeading: "Showcasing integrated design and engineering through case previews",
    featuredDescription: "Larger case previews that emphasize narrative direction, UX quality, and delivery maturity.",
    featuredProjects: [
      {
        id: "simple-pure-bakery",
        category: "Brand Website / Bakery Experience",
        title: "Simple Pure Bakery",
        summary:
          "A warm editorial brand demo that combines product storytelling, group-order flow, and delivery information into a polished lifestyle-oriented web experience.",
        highlights: [
          "Built a cohesive flow across landing, products, and product-detail pages",
          "Connected group order, delivery, FAQ, and contact into practical business journeys",
          "Structured reusable modules to support future e-commerce and content expansion",
        ],
        stack: "Next.js App Router, TypeScript, Tailwind CSS",
        href: "/work/simple-bakery",
        cta: "View Case",
        secondaryHref: "/work/simple-bakery/products",
        secondaryCta: "Browse Product Pages",
        coverLabel: "Brand Experience Demo",
        coverTitle: "Bakery Brand Story",
        coverTone: "amber",
      },
      {
        id: "premium-business-site",
        category: "Corporate / Brand Website",
        title: "Premium Bilingual Business Site Concept",
        summary:
          "A bilingual business website concept designed for trust-building and conversion flow through structured content hierarchy and premium visual rhythm.",
        highlights: [
          "Designed bilingual architecture for local and international audiences",
          "Refined first-screen and section pacing around positioning clarity",
          "Prepared an extensible base for case studies and campaign landing pages",
        ],
        stack: "Next.js, TypeScript, Tailwind CSS, SEO Metadata",
        href: "/services/websites",
        cta: "Explore Website Capability",
        secondaryHref: "/contact",
        secondaryCta: "Discuss Similar Project",
        coverLabel: "Corporate Website Concept",
        coverTitle: "Bilingual Brand System",
        coverTone: "indigo",
      },
      {
        id: "rag-knowledge-assistant",
        category: "Knowledge Assistant / AI System",
        title: "RAG Knowledge Assistant Prototype",
        summary:
          "A grounded assistant prototype for policy and FAQ scenarios, focused on traceable answers and maintainable knowledge operations.",
        highlights: [
          "Designed ingestion and version-update flow for long-term maintainability",
          "Defined retrieval-and-answer orchestration to improve response reliability",
          "Mapped UX patterns for customer support and internal knowledge lookup",
        ],
        stack: "RAG Pipeline, Vector Retrieval, Web Chat UX",
        href: "/services/rag-chatbots",
        cta: "Explore AI Capability",
        secondaryHref: "/process",
        secondaryCta: "See Delivery Process",
        coverLabel: "Knowledge Assistant Prototype",
        coverTitle: "Grounded RAG Experience",
        coverTone: "emerald",
      },
    ],
    archiveTitle: "Project Archive",
    archiveHeading: "Additional project directions in active exploration",
    archiveDescription: "Additional studio explorations that can evolve into full case-study releases.",
    archiveProjects: [
      {
        id: "workflow-dashboard",
        category: "Dashboard / Product UX",
        title: "Workflow Management Dashboard",
        summary:
          "A modular interface unifying approvals, tasks, and operational reporting with role-oriented views.",
        href: "/services/apps",
        cta: "Explore App Capability",
        coverTone: "slate",
      },
      {
        id: "interactive-showcase",
        category: "Interactive Showcase / Experience",
        title: "Interactive Brand Showcase Prototype",
        summary:
          "A scroll narrative concept with staged visual transitions for launch campaigns and themed brand storytelling.",
        cta: "In Development",
        coverTone: "indigo",
      },
      {
        id: "service-microsite",
        category: "Service Microsite / Conversion",
        title: "Service Microsite Concept",
        summary:
          "A high-conversion page pattern that combines service framing, process visibility, and clear action paths.",
        href: "/pricing",
        cta: "View Pricing Structure",
        coverTone: "emerald",
      },
    ],
    closing: {
      title: "Ready to turn your next project into a portfolio-grade outcome?",
      description:
        "If you need your website, AI assistant, or app system to deliver both visual quality and engineering reliability, we can define it together.",
      primaryLabel: "Book a Project Conversation",
      secondaryLabel: "Explore Services",
    },
  };
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/work",
    title: dictionary.pages.work.metadata.title,
    description: dictionary.pages.work.metadata.description,
  });
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getWorkPortfolioCopy(locale);

  return (
    <div className="animate-fade-scale">
      <WorksPageHero
        kicker={copy.hero.kicker}
        title={copy.hero.title}
        description={copy.hero.description}
        filters={copy.hero.filters}
      />

      <Section tone="light" className="py-14 md:py-18">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{copy.featuredTitle}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {copy.featuredHeading}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
            {copy.featuredDescription}
          </p>
        </div>

        <div className="mt-8 space-y-7 md:mt-10 md:space-y-8">
          {copy.featuredProjects.map((project, index) => (
            <FeaturedProjectCard
              key={project.id}
              locale={locale}
              project={project}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </Section>

      <Section tone="neutral" className="py-14 md:py-18">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{copy.archiveTitle}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {copy.archiveHeading}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
            {copy.archiveDescription}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
          {copy.archiveProjects.map((project) => (
            <ProjectArchiveCard key={project.id} locale={locale} project={project} />
          ))}
        </div>
      </Section>

      <PortfolioCTASection
        locale={locale}
        title={copy.closing.title}
        description={copy.closing.description}
        primaryLabel={copy.closing.primaryLabel}
        secondaryLabel={copy.closing.secondaryLabel}
      />
    </div>
  );
}
