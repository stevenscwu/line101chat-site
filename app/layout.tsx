import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "AI-Augmented DevSecOps Thesis | AI 強化 DevSecOps 論文網站",
  description:
    "Master's research website for AI-Augmented DevSecOps with SonarQube and GPT-4.1 / 碩士論文網站：整合 SonarQube 與 GPT-4.1，實現智慧化弱點分級與處置排序。",
  keywords: [
    "DevSecOps",
    "SonarQube",
    "GPT-4.1",
    "SAST",
    "DAST",
    "AI security",
    "RAG",
    "Azure",
    "雲端運算",
    "弱點分流",
    "靜態應用程式安全測試",
    "動態應用程式安全測試"
  ],
  openGraph: {
    title: "AI-Augmented DevSecOps Thesis | AI 強化 DevSecOps 論文網站",
    description:
      "Explore architecture, experiments, and enterprise applications of AI-assisted vulnerability triage / 探索 AI 輔助弱點分流之架構、實驗與企業應用。",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
