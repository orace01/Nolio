import Image from "next/image";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { ArrowLink } from "@/components/shared/ArrowLink";
import type { Dictionary } from "@/i18n/dictionaries/en";
import page from "./page.module.css";
import styles from "./AboutPage.module.css";

export function AboutPage({ t }: { t: Dictionary["about"] }) {
  return (
    <>
      <div className={styles.text}>
        <p className={page.kicker}>{t.kicker}</p>
        <h2 className={page.title}>{t.title}</h2>
        <p className={page.lead}>{t.lead}</p>
        <ol className={styles.principles}>
          {t.principles.map((principle, index) => (
            <li key={principle.title}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={`${page.label} ${styles.principleTitle}`}>
                {principle.title}
              </h3>
              <p className={`${page.small} ${styles.principleText}`}>
                {principle.text}
              </p>
            </li>
          ))}
        </ol>
        <ArrowLink href="#formats" className={styles.more}>
          {t.next}
        </ArrowLink>
      </div>

      <div className={styles.photo}>
        <Image
          src={leaves}
          alt=""
          fill
          sizes="30vw"
          className={styles.photoImage}
        />
        <span className={`${page.bigNumber} ${styles.bigNumber}`} aria-hidden="true">
          02
        </span>
      </div>
    </>
  );
}
