import type { Metadata } from "next";
import Link from "next/link";
import { Award, Compass, Mic2, Upload } from "lucide-react";
import { BadgeShelf } from "@/components/achievements/BadgeShelf";
import { EncouragementBanner } from "@/components/dashboard/EncouragementBanner";
import { MissionHeroCard } from "@/components/dashboard/MissionHeroCard";
import { LearningPathMap } from "@/components/learn/LearningPathMap";
import { MaterialInsightCard } from "@/components/materials/MaterialInsightCard";
import { UploadStudyMaterialCard } from "@/components/materials/UploadStudyMaterialCard";
import { PronunciationPlayerCard } from "@/components/pronunciation/PronunciationPlayerCard";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";
import { SocialClipIdeasCard } from "@/components/social/SocialClipIdeasCard";
import { StatChip } from "@/components/shared/StatChip";
import {
  badgeItems,
  encouragementBanners,
  learningPathNodes,
  missionData,
  phraseOfTheDay,
  progressData,
  socialIdeas
} from "@/data/site-data";
import { getDefaultDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "首頁 | Japanese After 50",
  description:
    "50後學日語的官方首頁：今日任務、進度概況、發音練習、學習素材與公開成長旅程。"
};

export default function HomePage() {
  const dict = getDefaultDictionary();

  return (
    <main className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <article className="rounded-[2rem] border border-slate-700 bg-hero-glow p-7 shadow-soft">
            <p className="chip-label text-cyan-200">{dict.ui.siteTagline}</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
              {dict.brand.hero?.headline}
            </h1>
            <p className="mt-3 text-base text-cyan-100">{dict.brand.hero?.supportJa}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">{dict.brand.hero?.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <PrimaryActionButton>{dict.ui.actions.startToday}</PrimaryActionButton>
              </Link>
              <Link href="/learn">
                <PrimaryActionButton variant="secondary">{dict.ui.actions.viewPath}</PrimaryActionButton>
              </Link>
            </div>
          </article>

          <MissionHeroCard mission={missionData} />
        </div>

        <section className="surface-card">
          <h2 className="text-xl font-bold text-white">進度總覽</h2>
          <p className="mt-1 text-sm text-slate-400">看得見的進度，最能支撐長期學習。</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatChip label="連續天數" value={`${progressData.streakDays} 天`} tone="amber" />
            <StatChip label="學習 XP" value={`${progressData.xp}`} tone="violet" />
            <StatChip
              label="本週目標"
              value={`${progressData.weeklyStudiedMinutes}/${progressData.weeklyTargetMinutes} 分`}
              tone="emerald"
            />
            <StatChip label="累積學習次數" value={`${progressData.totalStudySessions} 次`} tone="cyan" />
          </div>

          <div className="mt-5 space-y-3">
            {dict.brand.microCopy?.map((line) => (
              <p key={line} className="rounded-2xl bg-slate-800/70 px-3 py-2 text-sm text-slate-200">
                {line}
              </p>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="surface-card">
          <div className="flex items-center gap-2 text-cyan-200">
            <Compass className="h-4 w-4" />
            <h2 className="text-lg font-semibold">學習旅程預覽</h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">關卡化路徑，清楚知道下一步。</p>
          <div className="mt-4">
            <LearningPathMap nodes={learningPathNodes.slice(0, 3)} compact />
          </div>
        </article>

        <article className="space-y-5">
          <div className="surface-card">
            <div className="flex items-center gap-2 text-cyan-200">
              <Mic2 className="h-4 w-4" />
              <h2 className="text-lg font-semibold">發音練習預覽</h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">日文優先，搭配繁中理解，今天就開口。</p>
            <div className="mt-4">
              <PronunciationPlayerCard phrase={phraseOfTheDay} />
            </div>
          </div>

          <div className="surface-card">
            <div className="flex items-center gap-2 text-cyan-200">
              <Upload className="h-4 w-4" />
              <h2 className="text-lg font-semibold">素材處理預覽</h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">上傳今天學到的內容，快速轉成可練習資源。</p>
            <div className="mt-4 space-y-4">
              <UploadStudyMaterialCard />
              <MaterialInsightCard extractedVocabulary={42} extractedPhrases={16} generatedDrills={9} />
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <SocialClipIdeasCard ideas={socialIdeas.slice(0, 2)} />
        <article className="surface-card space-y-4">
          <h2 className="text-xl font-bold text-white">鼓勵與哲學</h2>
          <p className="text-sm leading-relaxed text-slate-300">{dict.brand.philosophy?.body}</p>
          <EncouragementBanner message={encouragementBanners[0]} />
          <Link href="/about">
            <PrimaryActionButton variant="secondary">了解計畫初衷</PrimaryActionButton>
          </Link>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <article className="surface-card space-y-3">
          <div className="flex items-center gap-2 text-cyan-200">
            <Award className="h-4 w-4" />
            <h2 className="text-lg font-semibold">成就展示</h2>
          </div>
          <BadgeShelf badges={badgeItems.slice(0, 3)} />
        </article>

        <article className="surface-card">
          <h2 className="text-xl font-bold text-white">關於這個專案</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{dict.brand.about?.motivation}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{dict.brand.about?.mission}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <PrimaryActionButton>進入學習系統</PrimaryActionButton>
            </Link>
            <Link href="/social-ideas">
              <PrimaryActionButton variant="ghost">看今天可以發什麼</PrimaryActionButton>
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
