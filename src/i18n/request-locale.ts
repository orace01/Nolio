import { headers } from "next/headers";
import { DEFAULT_LOCALE, hasLocale, LOCALE_HEADER, type Locale } from "./config";

/* The language of the requested URL, for pages that receive no route params */
export async function getRequestLocale(): Promise<Locale> {
  const locale = (await headers()).get(LOCALE_HEADER);
  return locale && hasLocale(locale) ? locale : DEFAULT_LOCALE;
}
