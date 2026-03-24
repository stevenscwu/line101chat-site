import { LearningDisplayMode, LearningDisplayResult } from "@/lib/learning/types";

export function resolveDisplayMode(mode: LearningDisplayMode): LearningDisplayResult {
  switch (mode) {
    case "beginner":
      return { showKanaByDefault: true, showZhByDefault: true };
    case "study":
      return { showKanaByDefault: false, showZhByDefault: true };
    case "immersion":
      return { showKanaByDefault: false, showZhByDefault: false };
    default:
      return { showKanaByDefault: true, showZhByDefault: true };
  }
}
