import { describe, expect, it } from "vitest";
import { createLesson, ENGLISH_SAMPLE, JAPANESE_SAMPLE, MAX_LESSON_BYTES, parseLesson, segmentText, validateLesson } from "../src/lib/materials";

describe("lesson material contract", () => {
  it("imports legacy Japanese JSON without relabeling it as English", () => {
    const result = parseLesson(JSON.stringify({ title: "A lesson", sentences: [{ japanese: "こんにちは。", english: "Hello.", chinese: "你好。" }] }), "legacy.json", "en-US");
    expect(result.schemaVersion).toBe(3);
    expect(result.targetLanguage).toBe("ja-JP");
    expect(result.sentences[0]).toMatchObject({ text: "こんにちは。", english: "Hello.", chinese: "你好。", id: "line-1" });
    expect(result.originalText).toBe("こんにちは。");
    expect(result.id).toBeTruthy();
  });

  it("round trips Japanese and English exports while preserving annotations", () => {
    for (const lesson of [JAPANESE_SAMPLE, ENGLISH_SAMPLE]) {
      expect(parseLesson(JSON.stringify(lesson), "lesson.json")).toEqual(lesson);
    }
  });

  it("imports version two app exports and arrays", () => {
    expect(parseLesson(JSON.stringify({ schemaVersion: 2, title: "Old lesson", sentences: [{ id: "existing", japanese: "ありがとう。" }] }), "old.json").sentences[0].id).toBe("existing");
    expect(parseLesson('[{"japanese":"ありがとう。"}]', "array.json").title).toBe("array");
  });

  it("splits Japanese, English, and line breaks while preserving punctuation", () => {
    expect(segmentText("おはよう。元気ですか？\nはい！")).toEqual(["おはよう。", "元気ですか？", "はい！"]);
    expect(segmentText("It costs 3.50 dollars. Can I pay by card?\nThank you!", "en-US")).toEqual(["It costs 3.50 dollars.", "Can I pay by card?", "Thank you!"]);
  });

  it("strips BOM and Markdown structure without discarding original source", () => {
    const source = "\uFEFF# Practice\n- Hello there.\n- How are you?";
    const lesson = parseLesson(source, "practice.md", "en-US");
    expect(lesson.sentences.map((row) => row.text)).toEqual(["Hello there.", "How are you?"]);
    expect(lesson.originalText).toContain("# Practice");
  });

  it("counts practice Unicode characters rather than UTF-16 code units", () => {
    expect(createLesson("😀".repeat(300), "Emoji").sentences[0].text).toBe("😀".repeat(300));
    expect(() => validateLesson({ ...JAPANESE_SAMPLE, sentences: [{ id: "1", text: "😀".repeat(301) }] })).toThrow("300");
    expect(segmentText("😀".repeat(301))).toEqual(["😀".repeat(300), "😀"]);
  });

  it("breaks long unpunctuated passages into editable bounded practice lines", () => {
    const passage = "Practice a little every day ".repeat(30);
    const lesson = createLesson(passage, "Long passage", "en-US");
    expect(lesson.sentences.length).toBeGreaterThan(1);
    expect(lesson.sentences.every((row) => Array.from(row.text).length <= 300)).toBe(true);
    expect(lesson.sentences.map((row) => row.text).join(" ")).toBe(passage.trim());
  });

  it.each([
    { schemaVersion: 4 },
    { targetLanguage: "fr-FR" },
    { level: "B2" },
    { title: " " },
    { topic: "x".repeat(81) },
    { originalText: "x".repeat(60001) },
    { sentences: [] },
    { sentences: Array.from({ length: 201 }, (_, i) => ({ id: String(i), text: "a" })) },
    { sentences: [{ id: "same", text: "a" }, { id: "same", text: "b" }] },
    { sentences: [{ id: "1", text: "a", english: {} }] },
    { sentences: [{ id: "1", text: "a", targetLanguage: "en-US" }] },
  ])("rejects invalid lesson fields: %j", (override) => {
    expect(() => validateLesson({ ...JAPANESE_SAMPLE, ...override })).toThrow();
  });

  it("rejects large real UTF-8 input and annotation-heavy output", () => {
    expect(() => parseLesson("あ".repeat(MAX_LESSON_BYTES / 3 + 1), "large.txt")).toThrow("256 KB");
    const sentences = Array.from({ length: 200 }, (_, i) => ({ id: String(i), text: "a", english: "x".repeat(2000) }));
    expect(() => validateLesson({ ...JAPANESE_SAMPLE, sentences })).toThrow("256 KB");
  });

  it("rejects malformed files and future schema versions", () => {
    expect(() => parseLesson("{no", "bad.json")).toThrow("valid JSON");
    expect(() => parseLesson("hello", "notes.pdf")).toThrow("Extract text");
    expect(() => parseLesson('{"schemaVersion":99,"sentences":[]}', "future.json")).toThrow("version");
  });
});
