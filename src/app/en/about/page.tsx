import { AboutContent } from "@/app/about/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "about");

export default function EnglishAboutPage() {
  return <AboutContent locale="en" />;
}
