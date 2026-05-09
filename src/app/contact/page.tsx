import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "聯絡我們｜預約 Demo 與 PoC 評估",
  description:
    "聯絡 LINE101Chat，預約 30 分鐘 RAG 需求評估、RAG 知識助理 Demo、翻譯加值服務或本地端私有化部署討論。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <SectionHeading
              eyebrow="聯絡我們"
              title="聯絡我們"
              description="如果你正在評估 RAG 知識助理、雲端代管、本地端部署或翻譯加值服務，歡迎先用一封信描述目前的文件、使用場景與資料敏感度。"
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
          <div className="space-y-5">
            <PresenterCallout
              imageKey="contact"
              label="30 分鐘需求評估"
              title="先聊清楚，再決定是否做 RAG PoC"
              body="我們會協助確認文件狀況、使用者場景、LINE 或網站入口、雲端或本地端部署方向，以及 PoC 需要準備的資料。"
            />
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">直接聯絡</h2>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-700">
                <a className="flex items-center gap-2 hover:text-emerald-700" href={`mailto:${site.email}`}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {site.email}
                </a>
                <a className="flex items-center gap-2 hover:text-emerald-700" href={site.lineAddFriendUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  加入 LINE 詢問
                </a>
              </div>
              <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <Image
                  src="/line-qr.png"
                  alt="加入 LINE101Chat LINE 官方帳號 QR Code"
                  width={294}
                  height={296}
                  className="mx-auto h-auto w-full max-w-[220px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
