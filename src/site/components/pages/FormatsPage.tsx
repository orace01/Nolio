import Image from "@/components/shared/Image";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { ArrowLink } from "@/components/shared/ArrowLink";
import texture from "@/components/shared/Texture.module.css";
import type { Dictionary } from "@/i18n/dictionaries/en";
import page from "./page.module.css";
import styles from "./FormatsPage.module.css";

const RULES = [16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116];

export function FormatsPage({ t }: { t: Dictionary["formats"] }) {
  const { botanica, monograph, studio, notes } = t.styles;

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.head}>
          <div>
            <p className={page.kicker}>{t.kicker}</p>
            <h2 className={page.title}>{t.title}</h2>
            <p className={page.lead}>{t.lead}</p>
          </div>

          <table className={styles.formats}>
            <caption className={page.label}>{t.caption}</caption>
            <tbody>
              {t.rows.map((format) => (
                <tr key={format.name}>
                  <th scope="row" className={page.label}>
                    {format.name}
                  </th>
                  <td className={page.small}>{format.length}</td>
                  <td className={page.small}>{format.files}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={styles.covers} aria-label={t.stylesLabel}>
          <li>
            <div className={`${styles.cover} ${styles.botanica}`} aria-hidden="true">
              <Image
                src={leaves}
                alt=""
                fill
                sizes="12vw"
                className={styles.coverPhoto}
              />
              <span className={styles.series}>{botanica.name}</span>
              <span className={styles.botanicaTitle}>{botanica.coverTitle}</span>
              <span className={styles.byline}>{botanica.coverByline}</span>
            </div>
            <h3 className={`${page.label} ${styles.name}`}>{botanica.name}</h3>
            <p className={page.small}>{botanica.description}</p>
          </li>

          <li>
            <div className={`${styles.cover} ${styles.monograph}`} aria-hidden="true">
              <span className={styles.series}>{monograph.name}</span>
              <span className={styles.monographTitle}>{monograph.coverTitle}</span>
              <span className={styles.rule} />
              <span className={styles.byline}>{monograph.coverByline}</span>
            </div>
            <h3 className={`${page.label} ${styles.name}`}>{monograph.name}</h3>
            <p className={page.small}>{monograph.description}</p>
          </li>

          <li>
            <div className={`${styles.cover} ${styles.studio}`} aria-hidden="true">
              <span className={styles.series}>{studio.name}</span>
              <span className={`${texture.textured} ${styles.studioNumber}`}>30</span>
              <span className={styles.studioTitle}>{studio.coverTitle}</span>
            </div>
            <h3 className={`${page.label} ${styles.name}`}>{studio.name}</h3>
            <p className={page.small}>{studio.description}</p>
          </li>

          <li>
            <div className={`${styles.cover} ${styles.notes}`} aria-hidden="true">
              <svg className={styles.rules} viewBox="0 0 90 120" preserveAspectRatio="none">
                {RULES.map((y) => (
                  <line key={y} x1="0" y1={y} x2="90" y2={y} />
                ))}
              </svg>
              <span className={styles.stamp} />
              <span className={styles.series}>{notes.name}</span>
              <span className={styles.notesTitle}>{notes.coverTitle}</span>
            </div>
            <h3 className={`${page.label} ${styles.name}`}>{notes.name}</h3>
            <p className={page.small}>{notes.description}</p>
          </li>
        </ul>
      </div>

      <ArrowLink href="#process" className={page.next}>
        {t.next}
      </ArrowLink>
    </>
  );
}
