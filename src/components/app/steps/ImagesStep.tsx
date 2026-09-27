"use client";

import Image from "next/image";
import { useState, type DragEvent } from "react";
import { canUse } from "@/lib/app/account";
import { updateDraft, useDraft, usePlan } from "@/lib/app/store";
import { Drawing } from "../ebook/Visuals";
import button from "../ui/Button.module.css";
import field from "../ui/Field.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { shrinkImage } from "../ui/images";
import { useUpgrade } from "../ui/Premium";
import { TierTag } from "../ui/Tag";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

const MAX_IMAGES = 6;
const MAX_BYTES = 10 * 1024 * 1024;
const GENERATION_MS = 1800;

export function ImagesStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const plan = usePlan();
  const upgrade = useUpgrade();
  const m = t.images;
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const [generating, setGenerating] = useState(false);
  const aiAllowed = canUse("pro", plan);
  const next = `/${lang}/app/new/validation`;

  // TODO: upload the originals once storage exists
  const importFiles = async (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    const accepted = list.filter((file) => /^image\/(jpeg|png)$/.test(file.type) && file.size <= MAX_BYTES);
    const room = MAX_IMAGES - draft.images.length;
    const kept = accepted.slice(0, Math.max(room, 0));
    const shrunk = (await Promise.allSettled(kept.map((file) => shrinkImage(file, 800))))
      .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
      .map((result) => result.value);

    updateDraft((current) => ({ images: [...current.images, ...shrunk].slice(0, MAX_IMAGES) }));
    if (accepted.length > kept.length) setNotice(m.limit(MAX_IMAGES));
    else if (accepted.length < list.length || shrunk.length < kept.length) setNotice(m.rejected);
    else setNotice("");
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    void importFiles(event.dataTransfer.files);
  };

  // TODO: call the image generation service; two drawings stand in for now
  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      updateDraft((current) => ({ aiImages: current.aiImages + 2 }));
      setGenerating(false);
    }, GENERATION_MS);
  };

  return (
    <FlowPage
      wide
      kicker={t.design.kicker(5)}
      question={m.question}
      lead={m.lead}
      back={{ href: `/${lang}/app/new/illustrations`, label: t.common.back }}
      skip={{ href: next, label: m.skip }}
      primary={<NextAction href={next} label={t.common.continue} />}
    >
      <div className={styles.two}>
        <section
          className={draft.images.length > 0 ? `${styles.card} ${styles.cardActive}` : styles.card}
          aria-labelledby="images-import"
        >
          <h2 id="images-import" className={styles.cardTitle}>
            {m.import} <TierTag tier="basic" />
          </h2>
          <label
            className={dragging ? `${styles.drop} ${styles.dragging}` : styles.drop}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <svg className={`${ui.icon} ${styles.dropIcon}`} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />
            </svg>
            <span className={ui.small}>
              {m.drop}
              <br />
              <span className={ui.hint}>
                {m.browse} · {m.formats}
              </span>
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={(event) => {
                void importFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>

          {draft.images.length > 0 && (
            <ul className={styles.thumbs}>
              {draft.images.map((image, index) => (
                <li key={`${index}-${image.length}`}>
                  <Image src={image} alt="" fill sizes="120px" style={{ objectFit: "cover" }} />
                  <button
                    type="button"
                    className={styles.removeThumb}
                    aria-label={m.removeImage(index + 1)}
                    onClick={() => updateDraft({ images: draft.images.filter((_, other) => other !== index) })}
                  >
                    {t.common.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className={ui.hint} role="status">
            {notice || m.count(draft.images.length)}
          </p>
        </section>

        <section
          className={draft.aiImages > 0 ? `${styles.card} ${styles.cardActive}` : styles.card}
          aria-labelledby="images-ai"
        >
          <h2 id="images-ai" className={styles.cardTitle}>
            {m.ai} <TierTag tier="pro" />
          </h2>
          <div className={styles.aiRow}>
            <input
              className={field.input}
              aria-label={m.aiLabel}
              placeholder={m.aiPlaceholder}
              value={draft.aiPrompt}
              disabled={!aiAllowed}
              onChange={(event) => updateDraft({ aiPrompt: event.target.value })}
            />
            {aiAllowed && (
              <button type="button" className={button.secondary} onClick={generate} disabled={generating}>
                {m.generate}
              </button>
            )}
          </div>
          <div className={aiAllowed && draft.aiImages > 0 ? styles.generated : `${styles.generated} ${styles.lockedPart}`}>
            {Array.from({ length: Math.max(2, Math.min(draft.aiImages, 4)) }, (_, index) => (
              <span key={index}>
                <Drawing index={index} />
              </span>
            ))}
          </div>
          <p className={ui.small} role="status">
            {generating ? m.generating : aiAllowed && draft.aiImages > 0 ? m.generated(draft.aiImages) : aiAllowed ? m.aiText : m.aiLocked}
          </p>
          {!aiAllowed && (
            <div>
              <button
                type="button"
                className={`${button.secondary} ${button.small}`}
                onClick={() => upgrade({ name: m.ai, kind: "option", tier: "pro" })}
              >
                {m.discover}
              </button>
            </div>
          )}
        </section>
      </div>
    </FlowPage>
  );
}
