import { FreeAssessmentContent } from "@/app/free-assessment/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "pricing");

export default function EnglishFreeAssessmentPage() {
  return <FreeAssessmentContent locale="en" />;
}
