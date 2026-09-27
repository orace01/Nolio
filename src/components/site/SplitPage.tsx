import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { SiteNav } from "./SiteNav";
import { Stage } from "./Stage";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./SplitPage.module.css";

type SplitPageProps = {
  lang: Locale;
  dict: Dictionary;
  current?: "login" | "signup";
  /* Drawn on the card behind the panel, e.g. the 404's big number */
  decoration?: ReactNode;
  children: ReactNode;
};

/*
 * One framed card split like the hero: the photo on the left, the content on
 * the grey panel. Used by the account pages and the 404.
 */
export function SplitPage({ lang, dict, current, decoration, children }: SplitPageProps) {
  return (
    <Stage lang={lang} top={dict.top} current={current}>
      <div className={styles.frame}>
        <div className={styles.card}>
          <div className={styles.photo}>
            <Image
              src={leaves}
              alt=""
              fill
              preload
              sizes="45vw"
              className={styles.photoImage}
            />
            <div className={styles.side} aria-hidden="true">
              <p className={styles.sideKicker}>{dict.hero.kicker}</p>
              <p className={styles.sideTitle}>{dict.hero.title}</p>
            </div>
          </div>

          <Link href={`/${lang}`} className={styles.brand}>
            Nolio.
          </Link>
          <SiteNav labels={dict.nav} prefix={`/${lang}`} />

          {decoration}
          <div className={styles.panel}>{children}</div>
        </div>
      </div>
    </Stage>
  );
}
