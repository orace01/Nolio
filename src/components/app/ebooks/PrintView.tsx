"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/app/api";
import { reviveDraft } from "@/lib/app/model";
import type { Brand, Ebook } from "@/lib/app/store";
import { useEbookDocument, type DocumentOverrides } from "../ebook/document";
import { EbookPage } from "../ebook/EbookPage";
import button from "../ui/Button.module.css";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import { EbookMissing } from "./EbookMissing";
import styles from "./ebooks.module.css";
import { useEbookRoute } from "./useEbookRoute";

type PrintViewProps = {
  forPrint: boolean;
  /* Signed link of the worker: the ebook comes from the server, not the browser */
  token: string | null;
  /* Opened by the worker: no toolbar and no print window */
  render: boolean;
};

type PrintData = { ebook: Ebook; author: string; brand: Brand; credit: boolean };

/*
 * Every page of the ebook at A5. In the demo, the browser's "Save as PDF";
 * with the server, the page the worker turns into the PDF files.
 */
export function PrintView({ forPrint, token, render }: PrintViewProps) {
  const { hydrated, ebook, id } = useEbookRoute();
  const [data, setData] = useState<PrintData | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!token) return;
    api<PrintData>(`/api/print/${id}?token=${encodeURIComponent(token)}`)
      .then((result) => setData({ ...result, ebook: { ...result.ebook, draft: reviveDraft(result.ebook.draft) } }))
      .catch(() => setMissing(true));
  }, [id, token]);

  if (token) {
    if (missing) return <EbookMissing />;
    if (!data) return null;
    return (
      <PrintPages
        ebook={data.ebook}
        overrides={{ content: data.ebook.content, author: data.author, brand: data.brand, credit: data.credit }}
        forPrint={forPrint}
        render
      />
    );
  }

  if (!hydrated) return null;
  if (!ebook) return <EbookMissing />;
  return <PrintPages ebook={ebook} overrides={{ content: ebook.content }} forPrint={forPrint} render={render} />;
}

function PrintPages({
  ebook,
  overrides,
  forPrint,
  render,
}: {
  ebook: Ebook;
  overrides: DocumentOverrides;
  forPrint: boolean;
  render: boolean;
}) {
  const { lang, t } = useAppText();
  const doc = useEbookDocument(ebook.draft, overrides);
  const [ready, setReady] = useState(false);

  // Fonts and images first; then the worker prints, or the browser opens its print window
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      document.fonts.ready,
      ...Array.from(document.images, (image) => (image.complete ? Promise.resolve() : image.decode().catch(() => {}))),
    ]).then(() => {
      if (cancelled) return;
      setReady(true);
      if (!render) setTimeout(() => window.print(), 300);
    });
    return () => {
      cancelled = true;
    };
  }, [render]);

  return (
    <div className={styles.print} data-print-ready={ready ? "" : undefined}>
      <style>{"@page { size: A5; margin: 0; }"}</style>
      {!render && (
        <div className={styles.printBar}>
          <div>
            <h1 className={ui.label}>{t.print.title}</h1>
            <p className={ui.hint} style={{ marginTop: 6 }}>
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
      )}
      <div className={render ? `${styles.printPages} ${styles.printRender}` : styles.printPages}>
        {doc.pagination.pages.map((_, index) => (
          <div key={index} data-print-page="">
            <EbookPage doc={doc} index={index} linked={!forPrint} eager photoSizes="600px" className={styles.printSheet} />
          </div>
        ))}
      </div>
    </div>
  );
}
