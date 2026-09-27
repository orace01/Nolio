import Image from "next/image";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { SOCIAL_ICONS } from "@/components/hero/SocialIcons";
import { ArrowLink } from "@/components/shared/ArrowLink";
import page from "./page.module.css";
import styles from "./ContactPage.module.css";
import { WaitlistForm } from "./WaitlistForm";

export function ContactPage() {
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
        <p className={page.kicker}>Contact</p>
        <h2 className={page.title}>Join the waitlist.</h2>
        <p className={page.lead}>
          Nolio is opening to a first group of authors. Leave your email and we
          will write to you as soon as your seat is ready.
        </p>

        <WaitlistForm />

        <div className={styles.follow}>
          <span className={page.label}>Follow Nolio</span>
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
        <p className={`${page.small} ${styles.legal}`}>
          © 2026 Nolio. All rights reserved.
        </p>
      </div>

      <ArrowLink href="#home" className={page.next}>
        Back to cover
      </ArrowLink>
    </>
  );
}
