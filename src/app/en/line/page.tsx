import { LineContent } from "@/app/line/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "line");

export default function EnglishLinePage() {
  return <LineContent locale="en" />;
}
