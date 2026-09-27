import Image from "next/image";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { SOCIAL_ICONS } from "@/components/hero/SocialIcons";
import { ArrowLink } from "@/components/shared/ArrowLink";
import type { Dictionary } from "@/i18n/dictionaries/en";
import page from "./page.module.css";
import styles from "./ContactPage.module.css";
import { WaitlistForm } from "./WaitlistForm";

export function ContactPage({ t }: { t: Dictionary["contact"] }) {
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
          05
        </span>
      </div>

      <div className={styles.panel}>
        <p className={page.kicker}>{t.kicker}</p>
        <h2 className={page.title}>{t.title}</h2>
        <p className={page.lead}>{t.lead}</p>

        <WaitlistForm t={t.form} />

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
        <p className={`${page.small} ${styles.legal}`}>{t.legal}</p>
      </div>

      <ArrowLink href="#home" className={page.next}>
        {t.back}
      </ArrowLink>
    </>
  );
}
