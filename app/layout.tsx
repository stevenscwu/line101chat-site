import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "50+ IT Man Learning Japanese | New Social Identity Build",
  description:
    "A practical creator system for a 50+ IT man learning Japanese, building a new social media identity, and creating stable family-support income.",
  keywords: [
    "50+ Japanese learner",
    "senior man learning Japanese",
    "IT background creator",
    "social media identity",
    "creator monetization",
    "family support income",
    "content strategy",
    "Japanese study workflow",
    "RAG assistant",
    "personal brand"
  ],
  openGraph: {
    title: "50+ IT Man Learning Japanese | Build, Share, Monetize",
    description:
      "Documenting the real journey of a 50+ IT man learning Japanese and building social channels that support his family.",
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
