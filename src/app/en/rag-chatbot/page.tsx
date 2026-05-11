import { RagChatbotContent } from "@/app/rag-chatbot/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "rag");

export default function EnglishRagChatbotPage() {
  return <RagChatbotContent locale="en" />;
}
