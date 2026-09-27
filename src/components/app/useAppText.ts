"use client";

import { useParams } from "next/navigation";
import { DEFAULT_LOCALE, hasLocale, type Locale } from "@/i18n/config";
import { APP_DICTIONARIES } from "@/i18n/app";

export function useLang(): Locale {
  const { lang } = useParams<{ lang: string }>();
  return hasLocale(lang) ? lang : DEFAULT_LOCALE;
}

/* The app strings in the language of the URL, plus that language */
export function useAppText() {
  const lang = useLang();
  return { lang, t: APP_DICTIONARIES[lang] };
}
