import { NtutIfirstRagCaseStudyContent } from "@/app/case-studies/ntut-ifirst-rag/page";
import { getGrowthContent } from "@/data/growth";

const en = getGrowthContent("en").ntutCaseStudy;

export const metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
  alternates: { canonical: "/en/case-studies/ntut-ifirst-rag" },
};

export default function EnglishNtutIfirstRagCaseStudyPage() {
  return <NtutIfirstRagCaseStudyContent locale="en" />;
}
