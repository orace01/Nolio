import Image from "next/image";
import Link from "next/link";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { SOCIAL_ICONS } from "@/components/hero/SocialIcons";
import { ArrowLink } from "@/components/shared/ArrowLink";
import button from "@/components/shared/Button.module.css";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import page from "./page.module.css";
import styles from "./StartPage.module.css";

export function StartPage({ lang, t }: { lang: Locale; t: Dictionary["start"] }) {
  return (
    <>
      <div className={styles.photo}>
        <Image
          src={leaves}
          alt=""
          fill
          sizes="45vw"
          className={styles.photoImage}
        />
        <span className={`${page.bigNumber} ${styles.bigNumber}`} aria-hidden="true">
          06
        </span>
      </div>

      <div className={styles.panel}>
        <p className={page.kicker}>{t.kicker}</p>
        <h2 className={page.title}>{t.title}</h2>
        <p className={page.lead}>{t.lead}</p>

        <div className={styles.actions}>
          <Link href={`/${lang}/signup`} className={button.primary}>
            {t.primary}
          </Link>
          <ArrowLink href={`/${lang}/login`}>{t.secondary}</ArrowLink>
        </div>

        <div className={styles.follow}>
          <span className={page.label}>{t.follow}</span>
          <ul className={styles.socials}>
            {SOCIAL_ICONS.map((icon) => (
              <li key={icon.label}>
                <a href={icon.href} aria-label={icon.label}>
                  <svg
                    viewBox={`0 0 ${icon.width} ${icon.height}`}
                    style={{ aspectRatio: `${icon.width} / ${icon.height}` }}
                    aria-hidden="true"
                  >
                    <path d={icon.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className={styles.legal} aria-label={t.legalLabel}>
          <Link href={`/${lang}/legal`}>{t.legalLinks.legal}</Link>
          <Link href={`/${lang}/privacy`}>{t.legalLinks.privacy}</Link>
          <Link href={`/${lang}/terms`}>{t.legalLinks.terms}</Link>
        </nav>
        <p className={`${page.small} ${styles.copyright}`}>{t.copyright}</p>
      </div>

      <ArrowLink href="#home" className={page.next}>
        {t.back}
      </ArrowLink>
    </>
  );
}
