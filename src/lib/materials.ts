export type TargetLanguage = "ja-JP" | "en-US";

export type LessonSentence = {
  id: string;
  text: string;
  english: string;
  chinese: string;
  japaneseTranslation: string;
  speaker: string;
  topic: string;
};

export type Lesson = {
  schemaVersion: 3;
  id: string;
  title: string;
  targetLanguage: TargetLanguage;
  level: string;
  topic: string;
  sourceName: string;
  originalText: string;
  sentences: LessonSentence[];
};

export const MAX_LESSON_BYTES = 256 * 1024;
export const LEVELS: Record<TargetLanguage, readonly string[]> = {
  "ja-JP": ["", "N5", "N4", "N3", "N2", "N1"],
  "en-US": ["", "A1", "A2", "B1", "B2", "C1", "C2"],
};

export class MaterialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MaterialError";
  }
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new MaterialError("Choose a lesson JSON object with a list of sentences.");
  }
  return value as Record<string, unknown>;
}

function field(value: unknown, name: string, max: number, required = false, unicode = false): string {
  if (value === undefined || value === null) {
    if (required) throw new MaterialError(`${name} is required.`);
    return "";
  }
  if (typeof value !== "string") throw new MaterialError(`${name} must be text.`);
  const result = value.trim();
  if ((unicode ? Array.from(value).length : value.length) > max || (required && !result)) {
    throw new MaterialError(`${name} must contain ${required ? "1–" : "at most "}${max} characters.`);
  }
  return result;
}

/** Validate and copy only the fields understood by the app. Never trust imported JSON. */
export function validateLesson(value: unknown): Lesson {
  const input = record(value);
  if (input.schemaVersion !== 3) throw new MaterialError("This lesson version is not supported. Use schema version 3.");
  const targetLanguage = input.targetLanguage;
  if (targetLanguage !== "ja-JP" && targetLanguage !== "en-US") {
    throw new MaterialError("Choose Japanese or English as the learning language.");
  }
  const level = field(input.level, "Level", 10);
  if (!LEVELS[targetLanguage].includes(level)) throw new MaterialError("Choose a level that matches the learning language.");
  if (!Array.isArray(input.sentences) || input.sentences.length < 1 || input.sentences.length > 200) {
    throw new MaterialError("Use 1–200 practice sentences per lesson.");
  }
  const seen = new Set<string>();
  const sentences = input.sentences.map((item, index): LessonSentence => {
    const row = record(item);
    const id = field(row.id, `Sentence ${index + 1} ID`, 120, true);
    if (seen.has(id)) throw new MaterialError("Each sentence needs a unique ID.");
    seen.add(id);
    if (row.targetLanguage !== undefined && row.targetLanguage !== targetLanguage) {
      throw new MaterialError("All sentences must use the lesson's learning language.");
    }
    return {
      id,
      text: field(row.text, `Sentence ${index + 1}`, 300, true, true),
      english: field(row.english, "English translation", 2000),
      chinese: field(row.chinese, "Chinese translation", 2000),
      japaneseTranslation: field(row.japaneseTranslation, "Japanese translation", 2000),
      speaker: field(row.speaker, "Speaker", 2000),
      topic: field(row.topic, "Sentence topic", 80),
    };
  });
  const lesson: Lesson = {
    schemaVersion: 3,
    id: field(input.id, "Lesson ID", 120) || crypto.randomUUID(),
    title: field(input.title, "Lesson title", 120, true),
    targetLanguage,
    level,
    topic: field(input.topic, "Topic", 80),
    sourceName: field(input.sourceName, "Source name", 255),
    originalText: field(input.originalText ?? sentences.map((row) => row.text).join("\n"), "Original text", 60000, false, true),
    sentences,
  };
  if (new TextEncoder().encode(JSON.stringify(lesson)).byteLength > MAX_LESSON_BYTES) {
    throw new MaterialError("The lesson is larger than 256 KB. Split it into smaller lessons.");
  }
  return lesson;
}

/** Keep line boundaries and sentence punctuation; authors can adjust every result. */
export function segmentText(text: string, language: TargetLanguage = "ja-JP"): string[] {
  const segmenter = new Intl.Segmenter(language, { granularity: "sentence" });
  return text.replace(/^\uFEFF/, "").split(/\r\n|\r|\n/)
    .flatMap((line) => [...segmenter.segment(line)].map((part) => part.segment.trim()))
    .flatMap((part) => {
      const chunks: string[] = [];
      let characters = Array.from(part);
      while (characters.length > 300) {
        let end = 300;
        for (let index = 299; index >= 150; index--) {
          if (" 、，,；;：:".includes(characters[index])) { end = index + 1; break; }
        }
        chunks.push(characters.slice(0, end).join("").trim());
        characters = characters.slice(end);
      }
      chunks.push(characters.join("").trim());
      return chunks;
    })
    .filter(Boolean);
}

export function createLesson(text: string, title: string, language: TargetLanguage = "ja-JP"): Lesson {
  return validateLesson({
    schemaVersion: 3,
    title,
    targetLanguage: language,
    originalText: text,
    sentences: segmentText(text, language).map((sentence, index) => ({ id: `line-${index + 1}`, text: sentence })),
  });
}

export function parseLesson(text: string, filename: string, language: TargetLanguage = "ja-JP"): Lesson {
  if (new TextEncoder().encode(text).byteLength > MAX_LESSON_BYTES) {
    throw new MaterialError("Choose a UTF-8 file smaller than 256 KB.");
  }
  if (filename.length > 255) throw new MaterialError("Use a filename of at most 255 characters.");
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!["txt", "md", "json"].includes(extension ?? "")) {
    throw new MaterialError("Choose a UTF-8 .txt, .md, or lesson .json file. Extract text from PDFs or images first.");
  }
  const title = filename.replace(/\.(txt|md|json)$/i, "").trim();
  const source = text.replace(/^\uFEFF/, "");
  if (extension !== "json") {
    // Markdown structural markers do not belong in spoken practice sentences.
    const passage = extension === "md"
      ? source.split(/\r?\n/).filter((line) => !/^\s*(?:#{1,6}\s|```|~~~)/.test(line))
        .map((line) => line.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+|>\s*)/, "")).join("\n")
      : source;
    return validateLesson({ ...createLesson(passage, title, language), sourceName: filename, originalText: source });
  }
  let decoded: unknown;
  try { decoded = JSON.parse(source); } catch {
    throw new MaterialError("This file is not valid JSON. Check its formatting and try again.");
  }
  const input = Array.isArray(decoded) ? { sentences: decoded } : record(decoded);
  if (input.schemaVersion !== undefined && ![1, 2, 3].includes(input.schemaVersion as number)) {
    throw new MaterialError("This lesson version is not supported.");
  }
  if (input.schemaVersion === 3) {
    return validateLesson({ ...input, sourceName: input.sourceName ?? filename });
  }
  if (!Array.isArray(input.sentences)) throw new MaterialError("The JSON needs a list of sentences.");
  // Versions 1 and 2 predate English lessons; a selected UI language must not relabel them.
  if (input.targetLanguage !== undefined && input.targetLanguage !== "ja-JP") {
    throw new MaterialError("English lessons must use schema version 3.");
  }
  const sentences = input.sentences.map((item, index) => {
    const row = record(item);
    return { ...row, id: row.id === undefined || row.id === null || row.id === "" ? `line-${index + 1}` : row.id, text: row.text ?? row.japanese };
  });
  return validateLesson({
    ...input,
    schemaVersion: 3,
    title: input.title ?? title,
    targetLanguage: "ja-JP",
    sourceName: input.sourceName ?? filename,
    sentences,
  });
}

export const JAPANESE_SAMPLE: Lesson = validateLesson({
  schemaVersion: 3, id: "sample-japanese-weekend", title: "A weekend in Kyoto", targetLanguage: "ja-JP", level: "N4", topic: "Travel & everyday life", sourceName: "Sample lesson",
  sentences: [
    { id: "line-1", text: "週末は京都へ行く予定です。", english: "I'm planning to go to Kyoto this weekend.", chinese: "週末我打算去京都。" },
    { id: "line-2", text: "駅で友達と待ち合わせをします。", english: "I'll meet my friend at the station.", chinese: "我會在車站和朋友碰面。" },
    { id: "line-3", text: "天気がよければ、川のそばを散歩しましょう。", english: "If the weather is nice, let's take a walk by the river.", chinese: "如果天氣好的話，一起去河邊散步吧。" },
    { id: "line-4", text: "このお店で抹茶を飲んでみたいです。", english: "I'd like to try the matcha at this shop.", chinese: "我想試試這家店的抹茶。" },
    { id: "line-5", text: "帰る前に、お土産を買うつもりです。", english: "I intend to buy souvenirs before going home.", chinese: "回家之前，我打算買伴手禮。" },
  ],
});

export const ENGLISH_SAMPLE: Lesson = validateLesson({
  schemaVersion: 3, id: "sample-english-cafe", title: "A conversation at the café", targetLanguage: "en-US", level: "A2", topic: "Food & conversation", sourceName: "Sample lesson",
  sentences: [
    { id: "line-1", text: "Good morning! What can I get for you?", speaker: "Barista", japaneseTranslation: "おはようございます。ご注文は何になさいますか。", chinese: "早安！請問您想點什麼？" },
    { id: "line-2", text: "I'd like a small coffee, please.", speaker: "Customer", japaneseTranslation: "小さいコーヒーを一杯お願いします。", chinese: "我想要一杯小杯咖啡，謝謝。" },
    { id: "line-3", text: "Would you like it hot or iced?", speaker: "Barista", japaneseTranslation: "温かいものと冷たいもの、どちらになさいますか。", chinese: "您要熱的還是冰的？" },
    { id: "line-4", text: "Iced, please. Could I also have a sandwich?", speaker: "Customer", japaneseTranslation: "冷たいものをお願いします。サンドイッチもいただけますか。", chinese: "冰的，謝謝。我還可以點一份三明治嗎？" },
    { id: "line-5", text: "Of course. Is that for here or to go?", speaker: "Barista", japaneseTranslation: "もちろんです。店内でお召し上がりですか、お持ち帰りですか。", chinese: "當然可以。請問內用還是外帶？" },
  ],
});

export const SAMPLE_LESSONS = [JAPANESE_SAMPLE, ENGLISH_SAMPLE] as const;
