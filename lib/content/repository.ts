import { materials } from "@/data/materials";
import { studyLogs } from "@/data/study-logs";
import { todayFocus } from "@/data/today-focus";
import { weeklyReviews } from "@/data/weekly-reviews";
import {
  ContentCard,
  DashboardMetrics,
  MaterialType,
  StudyLogEntry,
  StudyMaterial,
  WeeklyReview
} from "@/lib/content/types";

function sortByDateDesc<T extends { date?: string; updatedAt?: string; endDate?: string }>(
  items: T[],
  key: "date" | "updatedAt" | "endDate"
): T[] {
  return [...items].sort((a, b) => {
    const left = new Date(a[key] ?? "").getTime();
    const right = new Date(b[key] ?? "").getTime();
    return right - left;
  });
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getAllMaterials(): StudyMaterial[] {
  return sortByDateDesc(materials, "updatedAt");
}

export function getMaterialTypes(): MaterialType[] {
  return ["vocab", "grammar", "dialogue", "listening", "reading", "other"];
}

export function getMaterialsByType(type: MaterialType | "all"): StudyMaterial[] {
  const all = getAllMaterials();
  return type === "all" ? all : all.filter((material) => material.type === type);
}

export function getMaterialById(id: string): StudyMaterial | undefined {
  return materials.find((material) => material.id === id);
}

export function getStudyLogs(): StudyLogEntry[] {
  return sortByDateDesc(studyLogs, "date");
}

export function getWeeklyReviews(): WeeklyReview[] {
  return sortByDateDesc(weeklyReviews, "endDate");
}

export function getTodayFocus() {
  return todayFocus;
}

export function splitMaterialIntoSentences(material: StudyMaterial): string[] {
  return material.japaneseText
    .split(/(?<=[。！？\n])/u)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getCurrentStreakDays(referenceDate = new Date()): number {
  const logDates = new Set(studyLogs.map((entry) => entry.date));
  const cursor = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  let streak = 0;
  while (logDates.has(formatLocalDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getDashboardMetrics(referenceDate = new Date()): DashboardMetrics {
  const logs = getStudyLogs();
  const reviews = getWeeklyReviews();
  const orderedMaterials = getAllMaterials();
  const today = formatLocalDate(referenceDate);

  return {
    currentStreakDays: getCurrentStreakDays(referenceDate),
    totalSessions: logs.length,
    totalMinutes: logs.reduce((sum, entry) => sum + entry.minutesStudied, 0),
    minutesToday: logs
      .filter((entry) => entry.date === today)
      .reduce((sum, entry) => sum + entry.minutesStudied, 0),
    latestMaterial: orderedMaterials[0],
    latestStudyLog: logs[0],
    latestWeeklyReview: reviews[0]
  };
}

export function getContentStudioCards(): ContentCard[] {
  const latestLog = getStudyLogs()[0];
  const latestMaterial = getAllMaterials()[0];
  const latestReview = getWeeklyReviews()[0];

  if (!latestLog || !latestMaterial || !latestReview) {
    return [];
  }

  const firstSentence =
    splitMaterialIntoSentences(latestMaterial)[0] ?? latestMaterial.japaneseText;

  return [
    {
      id: "card-sentence",
      type: "sentence-of-the-day",
      title: "Sentence of the Day",
      text: `${firstSentence} / ${latestMaterial.translation ?? "No translation yet."}`,
      sourceRefs: [latestMaterial.id]
    },
    {
      id: "card-mistake",
      type: "mistake-of-the-day",
      title: "Mistake of the Day",
      text: `Today I noticed this challenge: ${latestLog.reflection}`,
      sourceRefs: [latestLog.id]
    },
    {
      id: "card-speaking",
      type: "speaking-prompt",
      title: "Speaking Prompt",
      text: `Speak for 45 seconds using this theme: ${latestLog.focusArea}. End with one plan for tomorrow.`,
      sourceRefs: [latestLog.id, latestMaterial.id]
    },
    {
      id: "card-weekly",
      type: "weekly-recap",
      title: "Weekly Recap Snippet",
      text: latestReview.publicSummary ?? latestReview.nextWeekFocus,
      sourceRefs: [latestReview.id]
    },
    {
      id: "card-reflection",
      type: "reflection-prompt",
      title: "Honest 50+ Reflection Prompt",
      text: `As a 50+ learner, what improved this week and what still feels difficult? Mention one concrete sentence you practiced.`,
      sourceRefs: [latestReview.id, latestLog.id]
    }
  ];
}
