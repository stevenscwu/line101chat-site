import type { Metadata } from "next";
import { Manrope, Noto_Sans_TC } from "next/font/google";

import "@/app/globals.css";

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
  title: "LINE101 Studio",
  description: "Premium digital studio in Taiwan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW" className={`${manrope.variable} ${notoSansTc.variable}`}>
      <body className="min-h-screen bg-[var(--surface-light)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
