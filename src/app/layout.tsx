import type { Metadata } from "next";

import "@/app/globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s｜LINE101Chat",
  },
  description: site.description,
  keywords: site.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: "LINE101Chat",
    title: site.title,
    description: site.description,
    locale: "zh_TW",
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body className="min-h-screen bg-[var(--surface-light)] text-[var(--text-primary)] antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
