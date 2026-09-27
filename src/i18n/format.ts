import type { Locale } from "./config";

/* "€12" in English, "12 €" in French */
export function formatPrice(locale: Locale, amount: number) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* "videos, links and files" in English, "vidéos, liens et fichiers" in French */
export function formatList(locale: Locale, items: string[]) {
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(items);
}

/* "27 September 2026" in English, "27 septembre 2026" in French */
export function formatDate(locale: Locale, time: number) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { dateStyle: "long" }).format(time);
}
