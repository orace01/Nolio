"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/i18n/config";
import styles from "./LanguageSwitch.module.css";

type LanguageSwitchProps = {
  lang: Locale;
  label: string;
  names: Record<Locale, string>;
};

/*
 * Links to the same page in the other language. Both languages share the same
 * layout, so the scroll position is kept and the book stays on the same page.
 */
export function LanguageSwitch({ lang, label, names }: LanguageSwitchProps) {
  const rest = usePathname().replace(/^\/[a-z]{2}(?=\/|$)/, "");

  return (
    <nav className={styles.switch} aria-label={label}>
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${rest}`}
          scroll={false}
          hrefLang={locale}
          lang={locale}
          aria-label={names[locale]}
          aria-current={locale === lang ? "true" : undefined}
          className={styles.option}
          onClick={() => {
            document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
          }}
        >
          {locale}
        </Link>
      ))}
    </nav>
  );
}
