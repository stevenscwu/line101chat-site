import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://line101chat.com"),
  title: { default: "說日語 · 每天一句", template: "%s | 說日語" },
  description: "將日語教材整理成小課程。在網頁準備教材，聆聽與跟讀，並在 Android 繼續學習。",
  openGraph: { type: "website", siteName: "說日語", title: "每天一句，慢慢練習。", description: "你的私人日語學習夥伴。從自己的教材開始，一句一句練習。" },
  twitter: { card: "summary", title: "說日語 · 每天一句" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>
    <a className="skip-link" href="#main">跳到主要內容</a>
    <header className="site-header"><Link href="/" className="brand"><span className="brand-icon"><BookOpen size={22} /></span><span>說日語<small>每天一句，慢慢練習</small></span></Link>
      <nav aria-label="主要導覽"><Link href="/">教材工作台</Link><Link href="/guide">使用說明</Link><Link href="/account" lang="zh-Hant">個人教材庫</Link><Link className="header-app" href="/guide#android">Android 應用程式 <ArrowUpRight size={15} /></Link></nav>
    </header>
    {children}
    <footer className="site-footer"><span>一句一句，養成每天練習的習慣。</span><div><Link href="/privacy">隱私權說明</Link><Link href="/guide">匯入說明</Link><span>日本語</span></div></footer>
  </body></html>;
}
