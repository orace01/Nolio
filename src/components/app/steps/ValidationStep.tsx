"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError, getRuntime } from "@/lib/app/api";
import { findById, ILLUSTRATIONS, STYLES, THEMES, TONES } from "@/lib/app/catalog";
import { outlineKey, type Outline } from "@/lib/app/model";
import {
  createEbook,
  resetDraft,
  updateDraft,
  useBrand,
  useDraft,
  useHydrated,
  useProfile,
  type Draft,
} from "@/lib/app/store";
import { Cover } from "../ebook/Cover";
import { useEbookDocument } from "../ebook/document";
import { EbookPage } from "../ebook/EbookPage";
import button from "../ui/Button.module.css";
import field from "../ui/Field.module.css";
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
  const hydrated = useHydrated();
  const profile = useProfile();
  const brand = useBrand();
  const [error, setError] = useState("");
  const [outlineFailed, setOutlineFailed] = useState(false);

  // Gemini plans the outline from the latest answers; it is kept until they change
  const key = outlineKey(draft, lang);
  const planning =
    hydrated && !sent && getRuntime().ai.gemini && !outlineFailed && (!draft.outline || draft.outlineKey !== key);

  useEffect(() => {
    if (!planning) return;
    let cancelled = false;
    api<{ outline: Outline; key: string }>("/api/ai/outline", {
      body: {
        draft,
        lang,
        author: { name: `${profile.firstName} ${profile.lastName}`.trim(), role: null },
        brand: { bio: brand.bio, cta: brand.cta, link: brand.link },
      },
    })
      .then(({ outline, key: builtFor }) => !cancelled && updateDraft({ outline, outlineKey: builtFor }))
      // The preview stays on the stand-in; the worker plans the outline again anyway
      .catch(() => !cancelled && setOutlineFailed(true));
    return () => {
      cancelled = true;
    };
    // The request depends on the answers only through their key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planning, key]);

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

  const submit = async () => {
    setSent(draft);
    setError("");
    try {
      const id = await createEbook(draft, lang);
      // The server already turned its copy of the draft into the ebook
      resetDraft({ keepOnServer: true });
      router.push(`/${lang}/app/ebooks/${id}/creating`);
    } catch (issue) {
      setSent(null);
      const code = issue instanceof ApiError ? issue.code : "";
      setError(code === "quota_reached" ? v.quota : code === "plan_required" ? v.planRequired : v.failed);
    }
  };

  return (
    <FlowPage
      wide
      kicker={v.kicker}
      question={v.question}
      lead={v.lead}
      back={{ href: `/${lang}/app/new/images`, label: t.common.back }}
      primary={
        <button type="button" className={button.primary} onClick={submit} disabled={sent !== null || planning}>
          {v.submit}
        </button>
      }
    >
      <div className={styles.validation}>
        <section aria-labelledby="validation-outline">
          <p id="validation-outline" className={ui.label}>
            {v.outline(pagination.pages.length)}
          </p>
          {planning ? (
            <div className={styles.analyzing} role="status" style={{ marginTop: 16 }}>
              <p className={ui.small}>{v.planning}</p>
              <span className={styles.sweep} />
            </div>
          ) : (
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
          )}
          {error && (
            <p className={field.error} role="alert" style={{ marginTop: 14 }}>
              {error}
            </p>
          )}
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
