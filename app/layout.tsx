import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Japanese After 50 | Personal Study Dashboard",
  description:
    "A personal Japanese study dashboard for daily practice, pronunciation drills, progress tracking, and lightweight content creation.",
  keywords: [
    "Japanese after 50",
    "Japanese study dashboard",
    "pronunciation practice",
    "study log",
    "weekly review",
    "materials system"
  ],
  openGraph: {
    title: "Japanese After 50 | Daily Study System",
    description:
      "A calm, practical dashboard for daily Japanese study, speaking practice, and visible progress.",
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
      <body className="min-h-screen">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
