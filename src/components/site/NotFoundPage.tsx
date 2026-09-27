import Link from "next/link";
import page from "@/components/pages/page.module.css";
import button from "@/components/shared/Button.module.css";
import texture from "@/components/shared/Texture.module.css";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import styles from "./NotFoundPage.module.css";
import { SplitPage } from "./SplitPage";

/* The hero's split card, with a big "404" cut by the bottom edge like its "01" */
export function NotFoundPage({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const t = dict.notFound;

  return (
    <SplitPage
      lang={lang}
      dict={dict}
      decoration={
        <div className={styles.number} aria-hidden="true">
          <span className={`${texture.textured} ${styles.digit}`}>4</span>
          <span className={`${styles.digit} ${styles.white}`}>0</span>
          <span className={`${texture.textured} ${styles.digit}`}>4</span>
        </div>
      }
    >
      <p className={page.kicker}>{t.kicker}</p>
      <h1 className={page.title}>{t.title}</h1>
      <p className={page.lead}>{t.lead}</p>
      <Link href={`/${lang}`} className={`${button.primary} ${styles.cta}`}>
        {t.cta}
      </Link>
    </SplitPage>
  );
}
