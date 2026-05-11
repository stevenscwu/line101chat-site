import { PrivacyContent } from "@/app/privacy/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "privacy");

export default function EnglishPrivacyPage() {
  return <PrivacyContent locale="en" />;
}
