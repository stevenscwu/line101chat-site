import { restaurantPhrases, vocabUnit001 } from "@/src/content";

export interface MissionData {
  title: string;
  supportJa: string;
  summary: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface ProgressData {
  streakDays: number;
  xp: number;
  level: number;
  weeklyTargetMinutes: number;
  weeklyStudiedMinutes: number;
  totalStudySessions: number;
}

export interface QuestItem {
  id: string;
  title: string;
  rewardXp: number;
  status: "todo" | "doing" | "done";
}

export interface LearningPathNode {
  id: string;
  title: string;
  type: "lesson" | "review" | "milestone" | "challenge";
  status: "completed" | "current" | "locked";
  xpReward: number;
  subtitle: string;
}

export interface MaterialFile {
  id: string;
  fileName: string;
  type: "pdf" | "image" | "text";
  uploadedAt: string;
  status: "processed" | "processing";
  extractedItems: number;
}

export interface SocialIdea {
  id: string;
  title: string;
  hook: string;
  caption: string;
  format: "short" | "reel" | "story";
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
}

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  detail: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: "穩定" | "有點卡" | "有突破";
  confidence: number;
  reflection: string;
}

export const missionData: MissionData = {
  title: "今天完成 25 分鐘發音挑戰，並輸出 1 句日文心得",
  supportJa: "今日は25分の発音チャレンジと、日文一文アウトプット。",
  summary: "目標不求多，只求完成。今天有開口，就值得加分。",
  ctaPrimary: "開始任務",
  ctaSecondary: "查看完整計畫"
};

export const progressData: ProgressData = {
  streakDays: 18,
  xp: 4280,
  level: 9,
  weeklyTargetMinutes: 280,
  weeklyStudiedMinutes: 195,
  totalStudySessions: 67
};

export const dailyQuests: QuestItem[] = [
  {
    id: "quest-001",
    title: "Shadowing 5 句餐廳情境句",
    rewardXp: 120,
    status: "doing"
  },
  {
    id: "quest-002",
    title: "複習 15 個弱項單字",
    rewardXp: 100,
    status: "todo"
  },
  {
    id: "quest-003",
    title: "寫 60 字學習日誌",
    rewardXp: 90,
    status: "todo"
  },
  {
    id: "quest-004",
    title: "錄製 30 秒「今日一句」短片",
    rewardXp: 140,
    status: "done"
  }
];

export const learningPathNodes: LearningPathNode[] = [
  {
    id: "node-001",
    title: "單元 1：餐廳對話",
    type: "lesson",
    status: "completed",
    xpReward: 200,
    subtitle: "基本點餐與禮貌句"
  },
  {
    id: "node-002",
    title: "單元 2：意圖表達",
    type: "lesson",
    status: "completed",
    xpReward: 210,
    subtitle: "〜ようと思います"
  },
  {
    id: "node-003",
    title: "週回顧：口說穩定度",
    type: "review",
    status: "current",
    xpReward: 180,
    subtitle: "速度與長音修正"
  },
  {
    id: "node-004",
    title: "里程碑：連續 21 天",
    type: "milestone",
    status: "locked",
    xpReward: 300,
    subtitle: "穩定學習習慣達標"
  },
  {
    id: "node-005",
    title: "挑戰關：1 分鐘自我介紹",
    type: "challenge",
    status: "locked",
    xpReward: 360,
    subtitle: "無稿口說錄音"
  }
];

export const materialFiles: MaterialFile[] = [
  {
    id: "file-001",
    fileName: "N3_文法筆記_2026-03-22.pdf",
    type: "pdf",
    uploadedAt: "2026-03-22 21:18",
    status: "processed",
    extractedItems: 28
  },
  {
    id: "file-002",
    fileName: "餐廳情境句_手機截圖.png",
    type: "image",
    uploadedAt: "2026-03-23 08:04",
    status: "processed",
    extractedItems: 12
  },
  {
    id: "file-003",
    fileName: "今日聽力筆記.txt",
    type: "text",
    uploadedAt: "2026-03-24 07:31",
    status: "processing",
    extractedItems: 0
  }
];

export const journalPrompts: string[] = [
  "今天哪一句日文你最有把握？",
  "哪個發音點今天最卡？為什麼？",
  "明天只做一件事，你要選哪一件？"
];

export const journalEntries: JournalEntry[] = [
  {
    id: "journal-001",
    date: "2026-03-24",
    mood: "有突破",
    confidence: 4,
    reflection: "今天把「いただけますか」講順了，速度放慢後反而更穩。"
  },
  {
    id: "journal-002",
    date: "2026-03-23",
    mood: "穩定",
    confidence: 3,
    reflection: "IT 單字能連成句子了，但音調還有一點台味。"
  }
];

export const socialIdeas: SocialIdea[] = [
  {
    id: "idea-001",
    title: "今日一句",
    hook: "50後學日語 Day 18：今天終於講順一句",
    caption:
      "今天我反覆練了「辛さは控えめにしていただけますか」。速度慢一點，發音反而更自然。#50後學日語 #台灣人學日文",
    format: "short"
  },
  {
    id: "idea-002",
    title: "卡關回顧",
    hook: "我今天卡在長音，這樣修正有差",
    caption:
      "把句子切短 + 0.85x 慢速練習，再回到正常速度，明顯比較穩。今天有開口就算贏。#日本語修行中",
    format: "reel"
  },
  {
    id: "idea-003",
    title: "一週總結",
    hook: "第 12 週，沒爆發但有進步",
    caption:
      "這週重點：連續學習、練口說、保留真實卡點。不是天才路線，是長期路線。#日語學習記錄",
    format: "story"
  }
];

export const badgeItems: BadgeItem[] = [
  {
    id: "badge-001",
    name: "開口勇者",
    description: "連續 7 天完成發音練習",
    icon: "🎙️",
    unlocked: true,
    progress: 100
  },
  {
    id: "badge-002",
    name: "詞彙鍊金師",
    description: "累積 100 個主動複習單字",
    icon: "📘",
    unlocked: true,
    progress: 100
  },
  {
    id: "badge-003",
    name: "21 天耐力章",
    description: "連續學習 21 天",
    icon: "🔥",
    unlocked: false,
    progress: 86
  },
  {
    id: "badge-004",
    name: "公開紀錄者",
    description: "發布 10 則學習短內容",
    icon: "📱",
    unlocked: false,
    progress: 40
  }
];

export const activityFeed: ActivityItem[] = [
  {
    id: "act-001",
    time: "今天 07:32",
    title: "新增素材",
    detail: "上傳《今日聽力筆記.txt》，系統開始抽取句型。"
  },
  {
    id: "act-002",
    time: "昨天 21:19",
    title: "完成發音挑戰",
    detail: "餐廳情境句完成 5 句 shadowing，獲得 120 XP。"
  },
  {
    id: "act-003",
    time: "昨天 20:55",
    title: "寫入日誌",
    detail: "紀錄「長音控制」卡點，並設定明日修正目標。"
  }
];

export const encouragementBanners = [
  "今天有開口，就值得鼓勵。",
  "你不是在比快，你是在把日語變成自己的能力。",
  "50後開始，一樣可以走出自己的語感曲線。"
];

export const phraseOfTheDay = restaurantPhrases[2];
export const vocabularyOfTheDay = vocabUnit001[0];
