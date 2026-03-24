export type SupportedLocale = "zh-TW" | "ja-JP";

export interface UiDictionary {
  siteName: string;
  siteTagline: string;
  nav?: Record<string, string>;
  actions: Record<string, string>;
  labels: Record<string, string>;
  system?: Record<string, string>;
  displayMode?: Record<string, string>;
}

export interface BrandDictionary {
  brandName?: string;
  brandSubtitle?: string;
  hero?: {
    headline: string;
    supportJa: string;
    description: string;
  };
  microCopy?: string[];
  philosophy?: {
    title: string;
    body: string;
  };
  about?: {
    motivation: string;
    mission: string;
  };
  heroSupport?: string;
  encouragement?: string[];
}

export interface PagesDictionary {
  [page: string]: {
    title: string;
    subtitle?: string;
    [key: string]: string | undefined;
  };
}

export interface LocaleBundle {
  ui: UiDictionary;
  brand: BrandDictionary;
  pages: PagesDictionary;
}
