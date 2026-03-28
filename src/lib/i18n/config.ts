export const locales = ["zh-TW", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh-TW";
export const localeCookieName = "studio_locale";

export const localeLabels: Record<Locale, string> = {
  "zh-TW": "繁體中文",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function withLocale(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  if (!isLocale(segments[0])) return pathname;
  const rest = segments.slice(1);
  return rest.length === 0 ? "/" : `/${rest.join("/")}`;
}

export function localeFromPath(pathname: string): Locale | null {
  const candidate = pathname.split("/").filter(Boolean)[0];
  return candidate && isLocale(candidate) ? candidate : null;
}
