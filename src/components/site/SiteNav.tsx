import { NAV_IDS } from "@/components/site/navigation";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./SiteNav.module.css";

type SiteNavProps = {
  labels: Dictionary["nav"];
  /* Page shown as current, underlined */
  current?: string;
  /* "" inside the book, "/en" or "/fr" from the other pages */
  prefix?: string;
  className?: string;
};

/* The book's menu, at the same place on every framed page */
export function SiteNav({ labels, current, prefix = "", className }: SiteNavProps) {
  return (
    <nav className={className ? `${styles.nav} ${className}` : styles.nav} aria-label="Main">
      <ul className={styles.list}>
        {NAV_IDS.map((id) => (
          <li key={id}>
            <a
              href={`${prefix}#${id}`}
              className={styles.link}
              aria-current={id === current ? "page" : undefined}
            >
              {labels[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
