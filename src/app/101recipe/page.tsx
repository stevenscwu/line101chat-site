import type { Metadata } from "next";

import { RecipeChat } from "@/components/recipe-chat/RecipeChat";

export const metadata: Metadata = {
  title: "101recipe 食譜 PDF 查找助理",
  description: "使用本機 Ollama 與 RAG 索引，依照授權通行碼查找 101recipe 食譜 PDF。",
  alternates: { canonical: "/101recipe" },
};

export default function RecipePage() {
  return <RecipeChat />;
}
