import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";

const DICTIONARIES: Record<Locale, Dictionary> = { en, fr };

/* Server side only: client components receive the strings they need as props */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
