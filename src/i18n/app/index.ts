import type { Metadata } from "next";
import { hasLocale, type Locale } from "../config";
import { en, type AppDictionary } from "./en";
import { fr } from "./fr";

/*
 * Strings of the application behind the login. Unlike the site's
 * dictionaries, they are also bundled for the browser: the app is made of
 * client components and some strings are functions (counts, plurals).
 */
export const APP_DICTIONARIES: Record<Locale, AppDictionary> = { en, fr };

export type { AppDictionary };

/* generateMetadata for an app page: its title in the page's language */
export function appTitle(key: keyof AppDictionary["titles"]) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ lang: string }>;
  }): Promise<Metadata> {
    const { lang } = await params;
    return hasLocale(lang) ? { title: APP_DICTIONARIES[lang].titles[key] } : {};
  };
}
