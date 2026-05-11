import { TranslationChatbotContent } from "@/app/translation-chatbot/page";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata("en", "translation");

export default function EnglishTranslationChatbotPage() {
  return <TranslationChatbotContent locale="en" />;
}
