import { StudyMaterial } from "@/lib/content/types";

export const materials: StudyMaterial[] = [
  {
    id: "m-greeting-01",
    title: "Morning Greeting Flow",
    type: "dialogue",
    topic: "Daily Conversation Basics",
    japaneseText: `おはようございます。今日はいい天気ですね。はい、散歩に行きたいです。`,
    translation:
      "Good morning. The weather is nice today. Yes, I want to go for a walk.",
    tags: ["daily", "greeting", "easy-shadowing"],
    createdAt: "2026-03-01",
    updatedAt: "2026-03-22"
  },
  {
    id: "m-grammar-02",
    title: "〜ようと思います Pattern",
    type: "grammar",
    topic: "Intentions and Plans",
    japaneseText: `来月から毎日三十分日本語を勉強しようと思います。週末は会話の練習を増やそうと思います。`,
    translation:
      "From next month, I plan to study Japanese for 30 minutes every day. On weekends, I plan to increase speaking practice.",
    tags: ["n4", "grammar", "planning"],
    createdAt: "2026-03-03",
    updatedAt: "2026-03-20"
  },
  {
    id: "m-vocab-03",
    title: "IT Work Vocabulary Set A",
    type: "vocab",
    topic: "Workplace and Engineering Terms",
    japaneseText: `要件、設計、実装、検証、改善。会議、報告、優先順位、品質、継続。`,
    translation:
      "Requirements, design, implementation, verification, improvement. Meeting, report, priority, quality, continuity.",
    tags: ["it", "work", "n3"],
    createdAt: "2026-03-04",
    updatedAt: "2026-03-23"
  },
  {
    id: "m-listening-04",
    title: "Station Announcement Practice",
    type: "listening",
    topic: "Transit and Directions",
    japaneseText: `次は台北駅です。お降りの方はお忘れ物のないようご注意ください。`,
    translation:
      "Next is Taipei Station. Passengers getting off, please make sure not to forget your belongings.",
    tags: ["listening", "transport", "polite"],
    createdAt: "2026-03-05",
    updatedAt: "2026-03-21"
  },
  {
    id: "m-reading-05",
    title: "Short Reflection Paragraph",
    type: "reading",
    topic: "Personal Learning Reflection",
    japaneseText: `五十歳を過ぎてから新しい言語を学ぶのは簡単ではありません。しかし、毎日続けると少しずつ自信がついてきます。`,
    translation:
      "Learning a new language after age 50 is not easy. However, if I continue every day, I gradually gain confidence.",
    tags: ["reflection", "motivation", "reading"],
    createdAt: "2026-03-08",
    updatedAt: "2026-03-24"
  }
];
