/** Public account wire types only. All allowances are selected by the server. */
export type AccountLessonCursor = { updatedAt: string; id: string };
export type UsageDimension = "lessons" | "sentences" | "bytes";
export type AccountLibraryUsage = {
  plan: { key: string; provisional: boolean };
  usage: Record<UsageDimension, number>;
  limits: Record<UsageDimension, number>;
  warningThresholdPercent: number;
  criticalThresholdPercent: number;
  nearLimit: UsageDimension[];
  criticalLimit: UsageDimension[];
  atLimit: UsageDimension[];
  overLimit: UsageDimension[];
};
