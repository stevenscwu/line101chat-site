import type { Metadata } from "next";
import Image from "next/image";
import {
  Bot,
  CheckCircle2,
  FileSearch,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AvatarDemoChat } from "@/components/avatar/AvatarDemoChat";
import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: {
    absolute: "Celine｜LINE101Chat AI 分身 Demo",
  },
  description:
    "Phase 1 LINE101 Avatar MVP：一個網站 AI 分身 landing page、一段 Celine demo flow、LINE webhook 檢查與 Vercel 部署。",
  alternates: { canonical: "/ai-avatar" },
  openGraph: {
    title: "Celine｜LINE101Chat AI Avatar MVP",
    description:
      "先用 Celine 驗證網站對話、LINE webhook、可信知識與真人交接。",
    url: "/ai-avatar",
  },
};

const demoChecks = [
  "網站訪客可以直接和 Celine 對話",
  "回答使用同一套 persona 與本地知識",
  "報價、導入、合作意圖會引導到真人評估",
  "部署可先用 mock mode，不依賴外部模型",
];

const lineChecks = [
  "Dedicated LINE avatar channel only",
  "Raw-body x-line-signature verification",
  "Text message reply through Messaging API",
  "Unsupported messages get a text fallback",
];

export default function AiAvatarPage() {
  const qrUrl =
    process.env.NEXT_PUBLIC_LINE_AVATAR_QR_URL?.trim() ||
    "/celine-line-qr.png";
  const addFriendUrl =
    process.env.NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL?.trim() ||
    "https://line.me/R/ti/p/%40821jpehj";

  return (
    <main>
      <section className="overflow-hidden bg-slate-950 px-5 py-14 text-white sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#06c755]/30 bg-[#06c755]/10 px-4 py-2 text-sm font-black text-[#8df5ad]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Phase 1 MVP · Celine Demo
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              LINE101 Avatar starts with one working AI representative.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-300">
              Celine is the first LINE101Chat reference avatar: a clear persona,
              approved knowledge, a website chat flow, and a dedicated LINE
              webhook path ready for Vercel deployment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="#avatar-demo" variant="line" icon={Bot}>
                Try the website demo
              </ButtonLink>
              <ButtonLink
                href={addFriendUrl}
                external
                variant="secondary"
                icon={MessageCircle}
              >
                Add Celine on LINE
              </ButtonLink>
              <ButtonLink href="/free-assessment" variant="secondary">
                Book free assessment
              </ButtonLink>
            </div>
          </div>

          <aside className="overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-[0_32px_90px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-[4/5]">
              <Image
                src="/presenter/4.png"
                alt="Celine, LINE101Chat virtual representative"
                fill
                priority
                sizes="(min-width: 1024px) 420px, 92vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-5 pt-24">
                <p className="text-3xl font-black">Celine</p>
                <p className="mt-2 text-sm font-bold text-emerald-200">
                  LINE101Chat virtual representative
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#f5faf7] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="One Demo Flow"
            title="Website chat first, then LINE verification"
            description="Phase 1 keeps the product small: validate one avatar conversation, one handoff path, and one LINE webhook integration before adding more channels or avatar management."
          />
          <div className="mt-8">
            <AvatarDemoChat />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionHeading
            eyebrow="Phase 1 Proof"
            title="What this MVP proves"
            description="This release is not a full avatar platform. It is a deployable proof that one branded AI representative can answer, qualify, and hand off from the LINE101Chat website."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {demoChecks.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <p className="text-sm font-black leading-7 text-slate-800">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="LINE Integration Check"
              title="Verify the dedicated Celine LINE channel after Vercel deploy"
              description="The route is already scoped to /api/line/avatar-webhook and verifies LINE signatures before parsing JSON. Phase 1 only confirms the webhook path, text reply, fallback behavior, and public add-friend CTA."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {lineChecks.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-lg border border-emerald-200 bg-white p-4"
                >
                  <ShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-black leading-7 text-slate-800">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-emerald-700">
              Celine LINE Demo
            </p>
            <div className="mt-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-dashed border-emerald-300 bg-emerald-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="Celine LINE demo QR code"
                className="h-full w-full object-contain p-3"
              />
            </div>
            <ButtonLink
              href={addFriendUrl}
              external
              variant="line"
              icon={MessageCircle}
              className="mt-4 w-full"
            >
              Add Celine on LINE
            </ButtonLink>
          </aside>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-300">
              Vercel Deployment
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Deploy mock mode first, then connect LINE.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              Phase 1 should go live with <code>LLM_PROVIDER=mock</code> until
              the deployed page, website API, and LINE webhook are confirmed.
              External model and durable memory upgrades can follow after this
              first deployment is stable.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              ["Required", "LLM_PROVIDER, CELINE_MEMORY_SECRET"],
              ["LINE", "LINE_AVATAR_CHANNEL_SECRET, LINE_AVATAR_CHANNEL_ACCESS_TOKEN"],
              ["Public CTA", "NEXT_PUBLIC_LINE_AVATAR_QR_URL, NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL"],
              ["Optional", "UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN"],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-lg border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center gap-3">
                  <FileSearch
                    className="h-5 w-5 text-emerald-300"
                    aria-hidden="true"
                  />
                  <h3 className="font-black text-emerald-300">{title}</h3>
                </div>
                <p className="mt-2 break-words text-sm leading-7 text-slate-300">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
