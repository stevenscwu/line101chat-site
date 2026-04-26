import type { Metadata } from "next";
import { Manrope, Noto_Sans_TC } from "next/font/google";

import "@/app/globals.css";

const siteUrl = "https://line101chat.com";
const title = "LINE Indonesian Chinese Translator";
const description =
  "A LINE chatbot for quick Indonesian and Traditional Chinese daily conversation translation.";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoSansTc = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "LINE101 Chat",
    title,
    description,
    locale: "zh_TW",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${notoSansTc.variable}`}>
      <body className="min-h-screen bg-[var(--surface-light)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
