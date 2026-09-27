import Image from "next/image";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { ArrowLink } from "@/components/shared/ArrowLink";
import texture from "@/components/shared/Texture.module.css";
import page from "./page.module.css";
import styles from "./ProductsPage.module.css";

const FORMATS = [
  { name: "Lead magnet", length: "15 to 30 pages", files: "PDF" },
  { name: "Guide", length: "40 to 80 pages", files: "PDF and EPUB" },
  { name: "Course companion", length: "60 to 120 pages", files: "PDF and EPUB" },
];

const RULES = [16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116];

export function ProductsPage() {
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.head}>
          <div>
            <p className={page.kicker}>Products</p>
            <h2 className={page.title}>One book. Your art direction.</h2>
            <p className={page.lead}>
              Every Nolio ebook starts from a format and an art direction.
              Together they set the length, the rhythm and the look of each
              page.
            </p>
          </div>

          <table className={styles.formats}>
            <caption className={page.label}>Formats</caption>
            <tbody>
              {FORMATS.map((format) => (
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

        <ul className={styles.covers} aria-label="Art directions">
          <li>
            <div className={`${styles.cover} ${styles.botanica}`} aria-hidden="true">
              <Image
                src={leaves}
                alt=""
                fill
                sizes="12vw"
                className={styles.coverPhoto}
              />
              <span className={styles.series}>Botanica</span>
              <span className={styles.botanicaTitle}>Grow a calmer practice</span>
              <span className={styles.byline}>Coaching guide</span>
            </div>
            <h3 className={`${page.label} ${styles.name}`}>Botanica</h3>
            <p className={page.small}>Photographic and calm, with generous white space.</p>
          </li>

          <li>
            <div className={`${styles.cover} ${styles.monograph}`} aria-hidden="true">
              <span className={styles.series}>Monograph</span>
              <span className={styles.monographTitle}>The focus method</span>
              <span className={styles.rule} />
              <span className={styles.byline}>Guide, 40 pages</span>
            </div>
            <h3 className={`${page.label} ${styles.name}`}>Monograph</h3>
            <p className={page.small}>Pure typography on a strict grid.</p>
          </li>

          <li>
            <div className={`${styles.cover} ${styles.studio}`} aria-hidden="true">
              <span className={styles.series}>Studio</span>
              <span className={`${texture.textured} ${styles.studioNumber}`}>30</span>
              <span className={styles.studioTitle}>Launch in 30 days</span>
            </div>
            <h3 className={`${page.label} ${styles.name}`}>Studio</h3>
            <p className={page.small}>Bold blocks of color and oversized numbers.</p>
          </li>

          <li>
            <div className={`${styles.cover} ${styles.notes}`} aria-hidden="true">
              <svg className={styles.rules} viewBox="0 0 90 120" preserveAspectRatio="none">
                {RULES.map((y) => (
                  <line key={y} x1="0" y1={y} x2="90" y2={y} />
                ))}
              </svg>
              <span className={styles.stamp} />
              <span className={styles.series}>Field notes</span>
              <span className={styles.notesTitle}>Notes on deep work</span>
            </div>
            <h3 className={`${page.label} ${styles.name}`}>Field notes</h3>
            <p className={page.small}>Light, annotated pages made for workbooks.</p>
          </li>
        </ul>
      </div>

      <ArrowLink href="#service" className={page.next}>
        Next page
      </ArrowLink>
    </>
  );
}
