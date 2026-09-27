import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { LanguageSwitch } from "./LanguageSwitch";
import styles from "./TopBar.module.css";

type TopBarProps = {
  lang: Locale;
  t: Dictionary["top"];
  current?: "login" | "signup";
  className?: string;
};

/* Account links and language switch, in the grey margin above the frame */
export function TopBar({ lang, t, current, className }: TopBarProps) {
  return (
    <div className={className ? `${styles.bar} ${className}` : styles.bar}>
      <nav className={styles.account} aria-label={t.account}>
        <Link
          href={`/${lang}/login`}
          className={styles.link}
          aria-current={current === "login" ? "page" : undefined}
        >
          {t.login}
        </Link>
        <Link
          href={`/${lang}/signup`}
          className={`${styles.link} ${styles.signup}`}
          aria-current={current === "signup" ? "page" : undefined}
        >
          {t.signup}
        </Link>
      </nav>
      <LanguageSwitch lang={lang} label={t.language} names={t.languageNames} />
    </div>
  );
}
