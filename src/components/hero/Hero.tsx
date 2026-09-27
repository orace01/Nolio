import Image from "next/image";
import heroLeaves from "@/assets/hero/hero-leaves.jpg";
import styles from "./Hero.module.css";
import { NAV_ITEMS } from "@/components/site/navigation";
import { SOCIAL_ICONS } from "./SocialIcons";

export function Hero() {
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
            Follow <span className={styles.brand}>Nolio</span>
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
            {NAV_ITEMS.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={styles.navLink}
                  aria-current={index === 0 ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className={styles.burger} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={styles.slider} aria-hidden="true">
        <span className={styles.slideIndex}>01</span>
        <span className={styles.slideLabel}>Digital experience</span>
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
        <p className={styles.kicker}>Simple way to</p>
        <h2 className={styles.title}>Get inspired.</h2>
        <p className={styles.lead}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip.
        </p>
        <a href="#about" className={styles.more}>
          Learn more
          <svg className={styles.arrow} viewBox="0 0 74 6" aria-hidden="true">
            <line x1="0" y1="3" x2="73" y2="3" />
            <polyline points="69.5,0.4 73.2,3 69.5,5.6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
