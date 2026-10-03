import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://line101chat.com"),
  title: { default: "Daily Practice — Japanese & English", template: "%s | Daily Practice" },
  description: "Turn your Japanese and English materials into small, organized lessons. Prepare on the web, listen and practise, and take your lessons to Android.",
  openGraph: { type: "website", siteName: "Daily Practice", title: "A little language, every day.", description: "Your Japanese & English study companion. Bring your material. Make it a lesson." },
  twitter: { card: "summary", title: "Daily Practice — Japanese & English" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><Link href="/" className="brand"><span className="brand-icon"><BookOpen size={22} /></span><span>daily<span className="brand-light">practice</span><small>JAPANESE & ENGLISH</small></span></Link>
      <nav aria-label="Main navigation"><Link href="/">Study desk</Link><Link href="/guide">How it works</Link><Link href="/account" lang="zh-Hant">個人教材庫</Link><Link className="header-app" href="/guide#android">Android companion <ArrowUpRight size={15} /></Link></nav>
    </header>
    {children}
    <footer className="site-footer"><span>Small lessons. A daily habit.</span><div><Link href="/privacy">Your privacy</Link><Link href="/guide">Import guide</Link><span>日本語 · English</span></div></footer>
  </body></html>;
}
