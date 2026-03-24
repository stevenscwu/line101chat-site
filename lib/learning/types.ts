export type LearningDisplayMode = "beginner" | "study" | "immersion";

export interface PhraseItem {
  id: string;
  ja: string;
  kana: string;
  zhTW: string;
  context: string;
  difficulty: "easy" | "medium" | "challenge";
}

export interface VocabItem {
  id: string;
  word: string;
  kana: string;
  zhTW: string;
  partOfSpeech: string;
  exampleJa: string;
  exampleKana: string;
  exampleZhTW: string;
  dueInDays: number;
  weaknessScore: number;
}

export interface LearningDisplayResult {
  showKanaByDefault: boolean;
  showZhByDefault: boolean;
}
