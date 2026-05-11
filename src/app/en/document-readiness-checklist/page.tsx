import { DocumentReadinessChecklistContent } from "@/app/document-readiness-checklist/page";
import { getGrowthContent } from "@/data/growth";

const en = getGrowthContent("en").checklist;

export const metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
  alternates: { canonical: "/en/document-readiness-checklist" },
};

export default function EnglishDocumentReadinessChecklistPage() {
  return <DocumentReadinessChecklistContent locale="en" />;
}
