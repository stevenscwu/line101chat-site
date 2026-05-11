import type { Metadata } from "next";

import { CTASection } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { getGrowthContent } from "@/data/growth";
import { localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

const zh = getGrowthContent("zh").article;

export const metadata: Metadata = {
  title: zh.metadata.title,
  description: zh.metadata.description,
  alternates: { canonical: "/blog/rag-chatbot-document-preparation" },
};

export function RagDocumentPreparationArticleContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const article = getGrowthContent(locale).article;

  return (
    <main>
      <article className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <SectionHeading eyebrow={article.eyebrow} title={article.title} description={article.description} />
          <div className="mt-10 grid gap-8">
            {article.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-black leading-tight text-slate-950">{section.title}</h2>
                <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </article>
      <CTASection
        title={locale === "en" ? "Want to test your documents with a small PoC?" : "想用小 PoC 測試你的文件嗎？"}
        body={
          locale === "en"
            ? "Use the checklist first, then book a 30-minute document readiness review."
            : "先用文件準備檢查表整理資料，再預約 30 分鐘文件健檢。"
        }
        href={localizePath("/document-readiness-checklist", locale)}
        label={locale === "en" ? "Open Checklist" : "查看檢查表"}
      />
    </main>
  );
}

export default function RagDocumentPreparationArticlePage() {
  return <RagDocumentPreparationArticleContent locale="zh" />;
}
