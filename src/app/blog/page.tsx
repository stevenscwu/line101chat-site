import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getGrowthContent } from "@/data/growth";
import { localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

const zh = getGrowthContent("zh").blog;

export const metadata: Metadata = {
  title: zh.metadata.title,
  description: zh.metadata.description,
  alternates: { canonical: "/blog" },
};

export function BlogContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const blog = getGrowthContent(locale).blog;

  return (
    <main className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow={blog.eyebrow} title={blog.title} description={blog.description} />
        <div className="mt-8 grid gap-4">
          {blog.posts.map((post) => (
            <Link
              key={post.href}
              href={localizePath(post.href, locale)}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-[0.08em] text-emerald-700">{post.date}</p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">{post.title}</h2>
              <p className="mt-3 text-base leading-8 text-slate-600">{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function BlogPage() {
  return <BlogContent locale="zh" />;
}
