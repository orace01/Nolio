export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/* Remembers the language picked with the switch, read by the proxy on "/" */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/* Set by the proxy from the URL, for pages rendered without route params (the 404) */
export const LOCALE_HEADER = "x-nolio-locale";

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
