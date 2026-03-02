import type { RetrievedChunk } from "@/lib/retrieval";

type GenerateAnswerInput = {
  query: string;
  context: RetrievedChunk[];
};

export async function generateAnswer({ query, context }: GenerateAnswerInput): Promise<string> {
  const provider = process.env.LLM_PROVIDER ?? "placeholder";

  if (provider === "openai" || provider === "azure-openai") {
    return `Provider '${provider}' configured. Integrate API call in lib/llm.ts using your deployment and model settings. / 已偵測到提供者 '${provider}'，請於 lib/llm.ts 完成實際模型呼叫整合。`;
  }

  if (context.length === 0) {
    return `No direct indexed context was found for "${query}". In a full RAG stack, this step calls embeddings + vector search + LLM synthesis. / 目前未找到與「${query}」直接對應的索引內容；完整 RAG 會執行向量化、檢索與回應合成。`;
  }

  const summarizedContext = context.map((chunk) => `- (${chunk.source}) ${chunk.content}`).join("\n");
  return [
    "RAG demo response (placeholder) / RAG 示範回應（佔位版）：",
    `Question / 問題: ${query}`,
    "Relevant context / 相關內容：",
    summarizedContext,
    "Suggested interpretation / 建議解讀：AI 強化分流可透過規則式檢測與語意脈絡推論整合，提升弱點優先排序品質。"
  ].join("\n");
}
