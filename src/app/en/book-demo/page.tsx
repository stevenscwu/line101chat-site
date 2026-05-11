import { BookDemoContent } from "@/app/book-demo/page";
import { getGrowthContent } from "@/data/growth";

const en = getGrowthContent("en").bookDemo;

export const metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
  alternates: { canonical: "/en/book-demo" },
};

export default function EnglishBookDemoPage() {
  return <BookDemoContent locale="en" />;
}
