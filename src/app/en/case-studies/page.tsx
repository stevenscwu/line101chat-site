import { CaseStudiesContent } from "@/app/case-studies/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "caseStudies");

export default function EnglishCaseStudiesPage() {
  return <CaseStudiesContent locale="en" />;
}
