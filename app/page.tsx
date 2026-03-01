import { HeroSection } from "@/components/sections/hero-section";
import { FoundationsSection } from "@/components/sections/foundations-section";
import { ThesisSection } from "@/components/sections/thesis-section";
import { ChatbotSection } from "@/components/sections/chatbot-section";
import { EnterpriseSection } from "@/components/sections/enterprise-section";
import { AboutContactSection } from "@/components/sections/about-contact-section";

export default function HomePage() {
  return (
    <main className="overflow-x-clip">
      <HeroSection />
      <FoundationsSection />
      <ThesisSection />
      <ChatbotSection />
      <EnterpriseSection />
      <AboutContactSection />
    </main>
  );
}
