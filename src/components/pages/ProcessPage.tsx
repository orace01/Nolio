import { ArrowLink } from "@/components/shared/ArrowLink";
import texture from "@/components/shared/Texture.module.css";
import type { Dictionary } from "@/i18n/dictionaries/en";
import page from "./page.module.css";
import styles from "./ProcessPage.module.css";

export function ProcessPage({ t }: { t: Dictionary["process"] }) {
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.head}>
          <div>
            <p className={page.kicker}>{t.kicker}</p>
            <h2 className={page.title}>{t.title}</h2>
          </div>
          <p className={page.lead}>{t.lead}</p>
        </div>

        <ol className={styles.steps}>
          {t.steps.map((step, index) => (
            <li key={step.title}>
              <div className={styles.stepHead}>
                <span className={`${texture.textured} ${styles.stepNumber}`} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < t.steps.length - 1 && <span className={styles.stepLine} />}
              </div>
              <h3 className={`${page.label} ${styles.stepTitle}`}>{step.title}</h3>
              <p className={`${page.small} ${styles.stepText}`}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <ArrowLink href="#pricing" className={page.next}>
        {t.next}
      </ArrowLink>
    </>
  );
}
