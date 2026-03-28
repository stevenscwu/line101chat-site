import { getDictionary } from "@/lib/i18n/dictionaries";
import { type Locale } from "@/lib/i18n/config";

export async function getLocaleDictionary(locale: Locale) {
  return getDictionary(locale);
}
