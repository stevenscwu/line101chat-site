import type { RetrievedChunk } from "@/lib/retrieval";

type GenerateAnswerInput = {
  query: string;
  context: RetrievedChunk[];
};

export async function generateAnswer({ query, context }: GenerateAnswerInput): Promise<string> {
  const provider = process.env.LLM_PROVIDER ?? "placeholder";

  if (provider === "openai" || provider === "azure-openai") {
    return `Provider '${provider}' configured. Integrate API call in lib/llm.ts using your deployment and model settings.`;
  }

  if (context.length === 0) {
    return `No direct indexed context was found for \"${query}\". In a full RAG stack, this step calls embeddings + vector search + LLM synthesis.`;
  }

  const summarizedContext = context.map((chunk) => `- (${chunk.source}) ${chunk.content}`).join("\n");
  return [
    "RAG demo response (placeholder):",
    `Question: ${query}`,
    "Relevant context:",
    summarizedContext,
    "Suggested interpretation: AI-augmented triage improves prioritization quality by combining rule-based findings with contextual language reasoning."
  ].join("\n");
}
