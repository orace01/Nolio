"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Ebook } from "@/lib/app/store";
import { useEbookDocument } from "../ebook/document";
import { EbookPage } from "../ebook/EbookPage";
import button from "../ui/Button.module.css";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import { EbookMissing } from "./EbookMissing";
import styles from "./ebooks.module.css";
import { useEbookRoute } from "./useEbookRoute";

/*
 * Every page of the ebook at A5, for the browser's "Save as PDF".
 * TODO: produce the PDF on the server, with real QR codes and bleed.
 */
export function PrintView({ forPrint }: { forPrint: boolean }) {
  const { hydrated, ebook } = useEbookRoute();
  if (!hydrated) return null;
  if (!ebook) return <EbookMissing />;
  return <PrintPages ebook={ebook} forPrint={forPrint} />;
}

function PrintPages({ ebook, forPrint }: { ebook: Ebook; forPrint: boolean }) {
  const { lang, t } = useAppText();
  const doc = useEbookDocument(ebook.draft);

  // Opens the print window once fonts and images are in
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      document.fonts.ready,
      ...Array.from(document.images, (image) => (image.complete ? Promise.resolve() : image.decode().catch(() => {}))),
    ]).then(() => {
      if (!cancelled) setTimeout(() => window.print(), 300);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.print}>
      <style>{"@page { size: A5; margin: 0; }"}</style>
      <div className={styles.printBar}>
        <div>
          <h1 className={ui.label}>{t.print.title}</h1>
          <p className={`${ui.hint}`} style={{ marginTop: 6 }}>
            {t.print.text}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href={`/${lang}/app/ebooks/${ebook.id}/download`} className={button.text}>
            {t.print.back}
          </Link>
          <button type="button" className={button.primary} onClick={() => window.print()}>
            {t.print.action}
          </button>
        </div>
      </div>
      <div className={styles.printPages}>
        {doc.pagination.pages.map((_, index) => (
          <EbookPage
            key={index}
            doc={doc}
            index={index}
            linked={!forPrint}
            eager
            photoSizes="600px"
            className={styles.printSheet}
          />
        ))}
      </div>
    </div>
  );
}
