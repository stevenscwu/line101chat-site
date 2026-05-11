import { BlogContent } from "@/app/blog/page";
import { getGrowthContent } from "@/data/growth";

const en = getGrowthContent("en").blog;

export const metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
  alternates: { canonical: "/en/blog" },
};

export default function EnglishBlogPage() {
  return <BlogContent locale="en" />;
}
