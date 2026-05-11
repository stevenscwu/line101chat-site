import { RagDocumentPreparationArticleContent } from "@/app/blog/rag-chatbot-document-preparation/page";
import { getGrowthContent } from "@/data/growth";

const en = getGrowthContent("en").article;

export const metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
  alternates: { canonical: "/en/blog/rag-chatbot-document-preparation" },
};

export default function EnglishRagDocumentPreparationArticlePage() {
  return <RagDocumentPreparationArticleContent locale="en" />;
}
