import { detectLeadIntent, getLeadCapturePrompt } from "@/lib/avatar/lead";
import { generateLlmReply, getLlmProvider } from "@/lib/avatar/llm";
import { getAvatarPersona, getSafeFallbackReply } from "@/lib/avatar/persona";
import { retrieveKnowledge } from "@/lib/avatar/rag";
import type {
  AvatarReply,
  GenerateAvatarReplyInput,
} from "@/lib/avatar/types";

function shouldAppendLeadPrompt(reply: string, prompt: string) {
  const promptMarker = prompt.split("\n")[0];
  return !reply.includes(promptMarker);
}

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
    const leadPrompt = getLeadCapturePrompt(userMessage);
    const reply =
      leadIntent && shouldAppendLeadPrompt(result.text, leadPrompt)
        ? `${result.text}\n\n${leadPrompt}`
        : result.text;

    return {
      reply,
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
      reply: getSafeFallbackReply(persona),
      provider: "mock",
      leadIntent,
      shouldHandoff: true,
      sources,
    };
  }
}
