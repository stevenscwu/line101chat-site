import { detectLeadIntent } from "@/lib/avatar/lead";
import { generateLlmReply, getLlmProvider } from "@/lib/avatar/llm";
import { getAvatarPersona, getSafeFallbackReply } from "@/lib/avatar/persona";
import { retrieveKnowledge } from "@/lib/avatar/rag";
import type {
  AvatarReply,
  GenerateAvatarReplyInput,
} from "@/lib/avatar/types";

export async function generateAvatarReply(
  input: GenerateAvatarReplyInput,
): Promise<AvatarReply> {
  const userMessage = input.userMessage.trim();
  const persona = getAvatarPersona();
  const leadIntent = detectLeadIntent(userMessage);
  const snippets = await retrieveKnowledge(userMessage);
  const sources = [...new Set(snippets.map((snippet) => snippet.source))];

  try {
    const result = await generateLlmReply({
      ...input,
      userMessage,
      persona,
      snippets,
      leadIntent,
    });
    return {
      reply: result.text,
      provider: result.provider,
      leadIntent,
      shouldHandoff: leadIntent,
      sources,
    };
  } catch (error) {
    console.error("[avatar-engine] reply generation failed", {
      provider: (() => {
        try {
          return getLlmProvider();
        } catch {
          return "invalid";
        }
      })(),
      channel: input.channel,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });

    return {
      reply: getSafeFallbackReply(),
      provider: "mock",
      leadIntent,
      shouldHandoff: leadIntent,
      sources,
    };
  }
}
