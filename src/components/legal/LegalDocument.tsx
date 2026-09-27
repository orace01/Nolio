import Link from "next/link";
import type { ReactNode } from "react";
import page from "@/components/pages/page.module.css";
import { SiteNav } from "@/components/site/SiteNav";
import { Stage } from "@/components/site/Stage";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { LEGAL_DOCUMENT_IDS, LEGAL_DOCUMENTS, type LegalDocumentId } from "@/i18n/legal";
import styles from "./LegalDocument.module.css";

/* Text between [brackets] is still to be completed: highlight it */
function withPlaceholders(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\])/).map((part, index) =>
    part.startsWith("[") ? (
      <mark key={index} className={styles.placeholder}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

type LegalDocumentProps = {
  lang: Locale;
  dict: Dictionary;
  id: LegalDocumentId;
};

export function LegalDocument({ lang, dict, id }: LegalDocumentProps) {
  const doc = LEGAL_DOCUMENTS[lang][id];

  return (
    <Stage lang={lang} top={dict.top} variant="document">
      <article className={styles.card}>
        <Link href={`/${lang}`} className={styles.brand}>
          Nolio.
        </Link>
        <SiteNav labels={dict.nav} prefix={`/${lang}`} />

        <header className={styles.header}>
          <p className={page.kicker}>{dict.start.legalLabel}</p>
          <h1 className={page.title}>{doc.title}</h1>
          <p className={styles.updated}>{withPlaceholders(doc.updated)}</p>
          <p className={page.lead}>{doc.intro}</p>
        </header>

        {doc.sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={`${page.label} ${styles.sectionTitle}`}>{section.title}</h2>
            <div className={styles.sectionBody}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {withPlaceholders(paragraph)}
                </p>
              ))}
            </div>
          </section>
        ))}

        <footer className={styles.footer}>
          <nav className={styles.documents} aria-label={dict.start.legalLabel}>
            {LEGAL_DOCUMENT_IDS.map((other) => (
              <Link
                key={other}
                href={`/${lang}/${other}`}
                aria-current={other === id ? "page" : undefined}
              >
                {dict.start.legalLinks[other]}
              </Link>
            ))}
          </nav>
          <p className={`${page.small} ${styles.copyright}`}>{dict.start.copyright}</p>
        </footer>
      </article>
    </Stage>
  );
}
