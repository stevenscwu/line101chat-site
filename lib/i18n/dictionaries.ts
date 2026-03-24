import zhBrandRaw from "@/src/locales/zh-TW/brand.json";
import zhPagesRaw from "@/src/locales/zh-TW/pages.json";
import zhUiRaw from "@/src/locales/zh-TW/ui.json";
import jaBrandRaw from "@/src/locales/ja-JP/brand.json";
import jaUiRaw from "@/src/locales/ja-JP/ui.json";
import { LocaleBundle, SupportedLocale } from "@/lib/i18n/types";

const zhBundle: LocaleBundle = {
  ui: zhUiRaw,
  brand: zhBrandRaw,
  pages: zhPagesRaw
};

const typedZhPages = zhPagesRaw as Record<string, { title: string; subtitle?: string }>;
const jaFallbackPages = Object.fromEntries(
  Object.entries(typedZhPages).map(([key, value]) => [
    key,
    {
      title: value.title ?? key,
      subtitle: value.subtitle
    }
  ])
) as Record<string, { title: string; subtitle?: string }>;

const jaBundle: LocaleBundle = {
  ui: jaUiRaw,
  brand: jaBrandRaw,
  pages: jaFallbackPages
};

const localeMap: Record<SupportedLocale, LocaleBundle> = {
  "zh-TW": zhBundle,
  "ja-JP": jaBundle
};

export function getDictionary(locale: SupportedLocale = "zh-TW"): LocaleBundle {
  return localeMap[locale] ?? localeMap["zh-TW"];
}

export function getDefaultDictionary(): LocaleBundle {
  return getDictionary("zh-TW");
}
