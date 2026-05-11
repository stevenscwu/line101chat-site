import { HomeContent } from "@/app/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "home");

export default function EnglishHomePage() {
  return <HomeContent locale="en" />;
}
