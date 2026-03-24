import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/shared/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://line101chat.com"),
  title: "Japanese After 50 | 50後學日語",
  description:
    "台灣 50+ 學習者的日語修行平台：每日任務、發音練習、單字複習、學習素材與公開成長紀錄。",
  keywords: [
    "50後學日語",
    "台灣人學日文",
    "日語學習記錄",
    "Japanese after 50",
    "日本語修行中",
    "日文發音練習"
  ],
  openGraph: {
    title: "Japanese After 50 | 50後學日語",
    description:
      "以繁中介面 + 日文學習內容打造的 50+ 長期日語修行計畫。每天一點，穩定前進。",
    siteName: "Japanese After 50",
    locale: "zh_TW",
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
      <body className="min-h-screen">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
