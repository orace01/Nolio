import type { Locale } from "./config";

/* "€12" in English, "12 €" in French */
export function formatPrice(locale: Locale, amount: number) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
