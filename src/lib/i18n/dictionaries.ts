import uiEn from "@/locales/en/ui.json";
import homeEn from "@/locales/en/home.json";
import servicesEn from "@/locales/en/services.json";
import pagesEn from "@/locales/en/pages.json";
import uiZhTW from "@/locales/zh-TW/ui.json";
import homeZhTW from "@/locales/zh-TW/home.json";
import servicesZhTW from "@/locales/zh-TW/services.json";
import pagesZhTW from "@/locales/zh-TW/pages.json";

import { defaultLocale, type Locale } from "@/lib/i18n/config";

const dictionaries = {
  "zh-TW": {
    ui: uiZhTW,
    home: homeZhTW,
    services: servicesZhTW,
    pages: pagesZhTW,
  },
  en: {
    ui: uiEn,
    home: homeEn,
    services: servicesEn,
    pages: pagesEn,
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
