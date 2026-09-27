"use client";

import Link from "next/link";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/i18n/config";
import styles from "./LanguageSwitch.module.css";

type LanguageSwitchProps = {
  lang: Locale;
  label: string;
  names: Record<Locale, string>;
  className?: string;
};

/*
 * Both languages share the same layout, so the scroll position is kept on
 * switch and the book stays open on the same page.
 */
export function LanguageSwitch({ lang, label, names, className }: LanguageSwitchProps) {
  return (
    <nav
      className={className ? `${styles.switch} ${className}` : styles.switch}
      aria-label={label}
    >
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}`}
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
