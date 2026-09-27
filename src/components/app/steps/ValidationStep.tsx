"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { findById, ILLUSTRATIONS, STYLES, THEMES, TONES } from "@/lib/app/catalog";
import { createEbook, resetDraft, useDraft, type Draft } from "@/lib/app/store";
import { Cover } from "../ebook/Cover";
import { useEbookDocument } from "../ebook/document";
import { EbookPage } from "../ebook/EbookPage";
import button from "../ui/Button.module.css";
import { FlowPage } from "../ui/FlowPage";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

export function ValidationStep() {
  const { lang, t } = useAppText();
  const router = useRouter();
  const current = useDraft();
  // Once sent, keep showing what was sent while the next page loads
  const [sent, setSent] = useState<Draft | null>(null);
  const draft = sent ?? current;
  const doc = useEbookDocument(draft);
  const v = t.validation;
  const { content, pagination } = doc;

  // The preview shows how a chapter opens: number, title, illustration
  const opener = pagination.pages.findIndex((page) => page.kind === "opener");
  const single = pagination.pages.findIndex((page) => page.kind === "single");
  const previewIndex = opener !== -1 ? opener : single !== -1 ? single : 1;

  const style = findById(STYLES, draft.style).name[lang];
  const choices = [
    { key: v.choices.style, value: draft.ownStyle ? v.ownStyle(style) : style },
    {
      key: v.choices.colors,
      value: draft.theme === "custom" ? t.colors.custom.name : findById(THEMES, draft.theme).name[lang],
    },
    { key: v.choices.writing, value: findById(TONES, draft.tone).name[lang] },
    { key: v.choices.illustrations, value: findById(ILLUSTRATIONS, draft.illustrations).name[lang] },
  ];

  const submit = () => {
    setSent(draft);
    const id = createEbook(draft);
    resetDraft();
    router.push(`/${lang}/app/ebooks/${id}/creating`);
  };

  return (
    <FlowPage
      wide
      kicker={v.kicker}
      question={v.question}
      lead={v.lead}
      back={{ href: `/${lang}/app/new/images`, label: t.common.back }}
      primary={
        <button type="button" className={button.primary} onClick={submit} disabled={sent !== null}>
          {v.submit}
        </button>
      }
    >
      <div className={styles.validation}>
        <section aria-labelledby="validation-outline">
          <p id="validation-outline" className={ui.label}>
            {v.outline(pagination.pages.length)}
          </p>
          <ol className={styles.outline}>
            {content.chapters.map((chapter, index) => (
              <li key={index}>
                <span className={styles.outlineNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span>{chapter.title}</span>
                <span className={styles.outlineMeta}>
                  {chapter.video && <span className={styles.miniVideo} role="img" aria-label={v.video} />}
                  {v.page(pagination.chapterStarts[index])}
                </span>
              </li>
            ))}
            <li>
              <span className={styles.outlineNumber}>{String(content.chapters.length + 1).padStart(2, "0")}</span>
              <span>{content.cta?.label ?? v.about}</span>
              <span className={styles.outlineMeta}>
                {content.cta && <span className={styles.outlineLink}>{v.link}</span>}
                {v.page(pagination.pages.length)}
              </span>
            </li>
          </ol>
        </section>

        <section aria-labelledby="validation-look">
          <p id="validation-look" className={ui.label}>
            {v.look}
          </p>
          <div className={styles.look}>
            <Cover
              style={doc.style}
              look={doc.look}
              title={content.title}
              author={doc.author}
              series={content.kind}
              image={draft.images[0]}
              logo={doc.brand.logo}
              number={content.chapters.length}
            />
            <EbookPage doc={doc} index={previewIndex} className={styles.lookPage} photoSizes="200px" />
          </div>
          <dl className={styles.choices}>
            {choices.map((choice) => (
              <div key={choice.key}>
                <dt>{choice.key}</dt>
                <dd>{choice.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </FlowPage>
  );
}
