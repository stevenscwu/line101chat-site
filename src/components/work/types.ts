export type WorkFeaturedProject = {
  id: string;
  category: string;
  title: string;
  summary: string;
  highlights: [string, string, string];
  stack: string;
  href: string;
  cta: string;
  secondaryHref?: string;
  secondaryCta?: string;
  coverLabel: string;
  coverTitle: string;
  coverTone: "indigo" | "emerald" | "amber" | "slate";
};

export type WorkArchiveProject = {
  id: string;
  category: string;
  title: string;
  summary: string;
  href?: string;
  cta: string;
  coverTone: "indigo" | "emerald" | "amber" | "slate";
};
