import { PricingContent } from "@/app/pricing/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "pricing");

export default function EnglishPricingPage() {
  return <PricingContent locale="en" />;
}
