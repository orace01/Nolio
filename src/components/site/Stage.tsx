import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./Stage.module.css";
import { TopBar } from "./TopBar";

type StageProps = {
  lang: Locale;
  top: Dictionary["top"];
  current?: "login" | "signup";
  /* "frame": one card the size of the book; "document": a card that grows with its text */
  variant?: "frame" | "document";
  children: ReactNode;
};

/* The grey backdrop of the pages outside the book */
export function Stage({ lang, top, current, variant = "frame", children }: StageProps) {
  return (
    <main className={variant === "document" ? `${styles.stage} ${styles.document}` : styles.stage}>
      <TopBar lang={lang} t={top} current={current} className={styles.topBar} />
      {children}
    </main>
  );
}
