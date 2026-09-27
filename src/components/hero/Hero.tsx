import Image from "next/image";
import heroLeaves from "@/assets/hero/hero-leaves.jpg";
import { NAV_IDS } from "@/components/site/navigation";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./Hero.module.css";
import { SOCIAL_ICONS } from "./SocialIcons";

type HeroProps = {
  t: Dictionary["hero"];
  nav: Dictionary["nav"];
};

export function Hero({ t, nav }: HeroProps) {
  return (
    <div className={styles.card}>
      <div className={styles.photo}>
        <Image
          src={heroLeaves}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="(max-width: 768px) 50vw, 45vw"
          className={styles.photoImage}
        />
      </div>

      <div className={styles.number} aria-hidden="true">
        <span className={`${styles.textured} ${styles.numberZero}`}>0</span>
        <span className={styles.numberOne}>1</span>
      </div>

      <h1 className={styles.word}>
        <span className={styles.wordLight}>Nolio.</span>
        <span
          className={`${styles.textured} ${styles.wordTextured}`}
          aria-hidden="true"
        >
          Nolio.
        </span>
      </h1>

      <header>
        <div className={styles.follow}>
          <p>
            {t.follow} <span className={styles.brand}>Nolio</span>
          </p>
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

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.navList}>
            {NAV_IDS.map((id, index) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={styles.navLink}
                  aria-current={index === 0 ? "page" : undefined}
                >
                  {nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className={styles.slider} aria-hidden="true">
        <span className={styles.slideIndex}>01</span>
        <span className={styles.slideLabel}>{t.slideLabel}</span>
        <svg className={styles.chevronUp} viewBox="0 0 6 3">
          <polyline points="0.5,2.6 3,0.4 5.5,2.6" />
        </svg>
        <svg className={styles.chevronDown} viewBox="0 0 6 3">
          <polyline points="0.5,0.4 3,2.6 5.5,0.4" />
        </svg>
        <div className={styles.dots}>
          <span className={styles.dotActive} />
          <span className={styles.dotLine} />
          <span className={styles.dotGroup}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
        </div>
      </div>

      <div className={styles.intro}>
        <p className={styles.kicker}>{t.kicker}</p>
        <h2 className={styles.title}>{t.title}</h2>
        <p className={styles.lead}>{t.lead}</p>
        <a href="#about" className={styles.more}>
          {t.cta}
          <svg className={styles.arrow} viewBox="0 0 74 6" aria-hidden="true">
            <line x1="0" y1="3" x2="73" y2="3" />
            <polyline points="69.5,0.4 73.2,3 69.5,5.6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
