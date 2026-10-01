import Link from "@/components/shared/Link";
import { useEffect, useId, useState } from "react";
import { NAV_IDS } from "@/components/site/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { LanguageSwitch } from "./LanguageSwitch";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  lang: Locale;
  nav: Dictionary["nav"];
  top: Dictionary["top"];
};

/* Phones only: the burger opens the book's menu, the account links and the
   language switch over the whole page */
export function MobileMenu({ lang, nav, top }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.burger}
        aria-label={open ? top.closeMenu : top.menu}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <nav aria-label="Main">
          <ul className={styles.list}>
            {NAV_IDS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={styles.link} onClick={() => setOpen(false)}>
                  {nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.foot}>
          <nav className={styles.account} aria-label={top.account}>
            <Link href={`/${lang}/login`}>{top.login}</Link>
            <Link href={`/${lang}/signup`} className={styles.signup}>
              {top.signup}
            </Link>
          </nav>
          <LanguageSwitch lang={lang} label={top.language} names={top.languageNames} />
        </div>
      </div>
    </>
  );
}
