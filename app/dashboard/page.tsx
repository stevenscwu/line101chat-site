import type { Metadata } from "next";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { EncouragementBanner } from "@/components/dashboard/EncouragementBanner";
import { DailyQuestList } from "@/components/dashboard/DailyQuestList";
import { MissionHeroCard } from "@/components/dashboard/MissionHeroCard";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { WeeklyGoalCard } from "@/components/dashboard/WeeklyGoalCard";
import { XPWidget } from "@/components/dashboard/XPWidget";
import { BadgeShelf } from "@/components/achievements/BadgeShelf";
import { DailyJournalCard } from "@/components/journal/DailyJournalCard";
import { LearningPathMap } from "@/components/learn/LearningPathMap";
import { VocabularyReviewCard } from "@/components/learn/VocabularyReviewCard";
import { MaterialInsightCard } from "@/components/materials/MaterialInsightCard";
import { UploadStudyMaterialCard } from "@/components/materials/UploadStudyMaterialCard";
import { PronunciationPlayerCard } from "@/components/pronunciation/PronunciationPlayerCard";
import { SocialClipIdeasCard } from "@/components/social/SocialClipIdeasCard";
import {
  activityFeed,
  badgeItems,
  dailyQuests,
  encouragementBanners,
  journalPrompts,
  learningPathNodes,
  missionData,
  phraseOfTheDay,
  progressData,
  socialIdeas,
  vocabularyOfTheDay
} from "@/data/site-data";

export const metadata: Metadata = {
  title: "儀表板 | Japanese After 50",
  description:
    "核心學習儀表板：今日任務、連續天數、XP、每日任務、發音練習、素材上傳、日誌與社群靈感。"
};

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-white">學習儀表板</h1>
        <p className="mt-2 text-sm text-slate-300">今天要做什麼，一眼就知道。現在就開始。</p>
      </header>

      <MissionHeroCard mission={missionData} />

      <section className="grid gap-4 md:grid-cols-3">
        <StreakWidget days={progressData.streakDays} />
        <XPWidget xp={progressData.xp} level={progressData.level} />
        <WeeklyGoalCard
          studiedMinutes={progressData.weeklyStudiedMinutes}
          targetMinutes={progressData.weeklyTargetMinutes}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DailyQuestList quests={dailyQuests} />
        <LearningPathMap nodes={learningPathNodes} compact />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <PronunciationPlayerCard phrase={phraseOfTheDay} />
        <VocabularyReviewCard item={vocabularyOfTheDay} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <UploadStudyMaterialCard />
        <MaterialInsightCard extractedVocabulary={42} extractedPhrases={16} generatedDrills={9} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DailyJournalCard prompts={journalPrompts} />
        <SocialClipIdeasCard ideas={socialIdeas} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <BadgeShelf badges={badgeItems} />
        <ActivityFeed items={activityFeed} />
      </section>

      <EncouragementBanner message={encouragementBanners[1]} />
    </main>
  );
}
