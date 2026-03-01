import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "AI-Augmented DevSecOps Thesis",
  description:
    "Master's research website: AI-Augmented DevSecOps integrating SonarQube and GPT-4.1 for intelligent vulnerability triage.",
  keywords: [
    "DevSecOps",
    "SonarQube",
    "GPT-4.1",
    "SAST",
    "AI security",
    "RAG",
    "Azure"
  ],
  openGraph: {
    title: "AI-Augmented DevSecOps Thesis",
    description:
      "Explore architecture, experiments, and enterprise applications of AI-assisted vulnerability triage.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
