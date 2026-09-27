"use client";

import Link from "next/link";
import button from "../ui/Button.module.css";
import flow from "../ui/FlowPage.module.css";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./ebooks.module.css";

/* An ebook id that this browser does not know */
export function EbookMissing() {
  const { lang, t } = useAppText();
  return (
    <div className={flow.flow}>
      <div className={`${flow.inner} ${styles.missing}`}>
        <h1 className={flow.question}>{t.notFound.title}</h1>
        <p className={ui.lead}>{t.notFound.text}</p>
        <Link href={`/${lang}/app`} className={button.primary}>
          {t.notFound.link}
        </Link>
      </div>
    </div>
  );
}
