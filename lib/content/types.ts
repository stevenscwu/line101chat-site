export const MATERIAL_TYPES = [
  "vocab",
  "grammar",
  "dialogue",
  "listening",
  "reading",
  "other"
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];

export interface StudyMaterial {
  id: string;
  title: string;
  type: MaterialType;
  topic: string;
  japaneseText: string;
  translation?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyLogEntry {
  id: string;
  date: string;
  minutesStudied: number;
  focusArea: string;
  materialIds: string[];
  notes: string;
  reflection: string;
  confidenceScore?: number;
  createdAt: string;
}

export interface WeeklyReview {
  id: string;
  weekLabel: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  biggestChallenge: string;
  phraseOfWeek: string;
  nextWeekFocus: string;
  publicSummary?: string;
}

export interface TodayFocus {
  date: string;
  primaryGoal: string;
  pronunciationTarget: string;
  tasks: string[];
  socialPrompt: string;
}

export interface DashboardMetrics {
  currentStreakDays: number;
  totalSessions: number;
  totalMinutes: number;
  minutesToday: number;
  latestMaterial?: StudyMaterial;
  latestStudyLog?: StudyLogEntry;
  latestWeeklyReview?: WeeklyReview;
}

export type ContentCardType =
  | "sentence-of-the-day"
  | "mistake-of-the-day"
  | "speaking-prompt"
  | "weekly-recap"
  | "reflection-prompt";

export interface ContentCard {
  id: string;
  type: ContentCardType;
  title: string;
  text: string;
  sourceRefs: string[];
}
