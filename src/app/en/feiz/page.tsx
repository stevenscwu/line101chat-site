import { FeizMailContent } from "@/app/feiz/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = {
  ...localizedMetadata("en", "feiz"),
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnglishFeizMailPage() {
  return <FeizMailContent locale="en" />;
}
