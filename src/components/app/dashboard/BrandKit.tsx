"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { initials } from "@/lib/app/account";
import { DEFAULT_DRAFT, updateBrand, useBrand, useEbooks, useProfile } from "@/lib/app/store";
import { useEbookDocument } from "../ebook/document";
import { EbookPage } from "../ebook/EbookPage";
import { Silhouette } from "../ebook/Visuals";
import button from "../ui/Button.module.css";
import field from "../ui/Field.module.css";
import { shrinkImage } from "../ui/images";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./dashboard.module.css";

const MAX_COLORS = 6;

/* The "+" swatch: a color input that adds its color once the picker closes */
function AddColor({ label, text, onAdd }: { label: string; text: string; onAdd: (color: string) => void }) {
  const input = useRef<HTMLInputElement>(null);

  // React's onChange fires on every move of the picker; "change" fires once
  useEffect(() => {
    const element = input.current;
    if (!element) return;
    const onChange = () => onAdd(element.value);
    element.addEventListener("change", onChange);
    return () => element.removeEventListener("change", onChange);
  }, [onAdd]);

  return (
    <label className={`${styles.swatch} ${styles.addSwatch}`}>
      <span className={styles.swatchColor} aria-hidden="true">
        +
      </span>
      {text}
      <input ref={input} type="color" defaultValue="#2a3f34" aria-label={label} />
    </label>
  );
}

export function BrandKit() {
  const { t } = useAppText();
  const brand = useBrand();
  const profile = useProfile();
  const ebooks = useEbooks();
  const b = t.brand;
  // The last page of the latest ebook, showing the kit's own call to action
  const latest = ebooks[0]?.draft;
  const draft = useMemo(() => ({ ...(latest ?? DEFAULT_DRAFT), media: [] }), [latest]);
  const doc = useEbookDocument(draft);

  const upload = async (files: FileList | null, key: "logo" | "photo") => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const data = await shrinkImage(file, key === "logo" ? 400 : 600, key === "logo" ? "image/png" : "image/jpeg");
      updateBrand({ [key]: data });
    } catch {
      // An unreadable file changes nothing
    }
  };

  const addColor = (color: string) => {
    if (brand.colors.includes(color) || brand.colors.length >= MAX_COLORS) return;
    updateBrand({ colors: [...brand.colors, color] });
  };

  return (
    <div className={styles.brand}>
      <section className={styles.form} aria-labelledby="brand-title">
        <div>
          <p className={ui.kicker}>{b.kicker}</p>
          <h1 id="brand-title" className={ui.h1}>
            {b.title}
          </h1>
          <p className={ui.lead}>{b.lead}</p>
        </div>

        <div className={styles.row}>
          <div className={field.field}>
            <span className={field.label}>{b.logo}</span>
            <label className={styles.upload}>
              <span className={brand.logo ? `${styles.monogram} ${styles.monogramImage}` : styles.monogram}>
                {brand.logo ? (
                  <Image src={brand.logo} alt="" fill sizes="54px" style={{ objectFit: "contain" }} />
                ) : (
                  initials(profile.firstName, profile.lastName)
                )}
              </span>
              <span className={ui.small}>
                {brand.logo ? b.logoReplace : b.logoAction}
                <br />
                <span className={ui.hint}>{b.logoHint}</span>
              </span>
              <input
                type="file"
                accept="image/png,image/svg+xml,image/jpeg"
                onChange={(event) => {
                  void upload(event.target.files, "logo");
                  event.target.value = "";
                }}
              />
            </label>
            {brand.logo && (
              <button type="button" className={`${button.text} ${button.quiet}`} onClick={() => updateBrand({ logo: null })}>
                {b.removeFile}
              </button>
            )}
          </div>

          <div className={field.field}>
            <span className={field.label}>{b.photo}</span>
            <label className={styles.upload}>
              <span className={styles.portrait}>
                {brand.photo ? (
                  <Image src={brand.photo} alt="" fill sizes="54px" style={{ objectFit: "cover" }} />
                ) : (
                  <Silhouette />
                )}
              </span>
              <span className={ui.small}>
                {brand.photo ? b.photoReplace : b.photoAction}
                <br />
                <span className={ui.hint}>{b.photoHint}</span>
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(event) => {
                  void upload(event.target.files, "photo");
                  event.target.value = "";
                }}
              />
            </label>
            {brand.photo && (
              <button type="button" className={`${button.text} ${button.quiet}`} onClick={() => updateBrand({ photo: null })}>
                {b.removeFile}
              </button>
            )}
          </div>
        </div>

        <div className={field.field}>
          <span className={field.label}>{b.colors}</span>
          <div className={styles.swatches}>
            {brand.colors.map((color) => (
              <span key={color} className={styles.swatch}>
                <span className={styles.swatchColor} style={{ background: color }} />
                {color}
                <button
                  type="button"
                  className={styles.swatchRemove}
                  aria-label={b.removeColor(color)}
                  onClick={() => updateBrand({ colors: brand.colors.filter((other) => other !== color) })}
                >
                  {t.common.remove}
                </button>
              </span>
            ))}
            {brand.colors.length < MAX_COLORS && <AddColor label={b.addColorLabel} text={b.addColor} onAdd={addColor} />}
          </div>
          <span className={field.hint}>{b.colorsHint}</span>
        </div>

        <div className={field.field}>
          <label className={field.label} htmlFor="brand-bio">
            {b.bio}
          </label>
          <textarea
            id="brand-bio"
            className={field.textarea}
            style={{ minHeight: 76 }}
            placeholder={b.bioPlaceholder}
            value={brand.bio}
            onChange={(event) => updateBrand({ bio: event.target.value })}
          />
        </div>

        <div className={styles.row}>
          <div className={field.field}>
            <label className={field.label} htmlFor="brand-cta">
              {b.cta}
            </label>
            <input
              id="brand-cta"
              className={field.input}
              placeholder={b.ctaPlaceholder}
              value={brand.cta}
              onChange={(event) => updateBrand({ cta: event.target.value })}
            />
          </div>
          <div className={field.field}>
            <label className={field.label} htmlFor="brand-link">
              {b.link}
            </label>
            <input
              id="brand-link"
              className={field.input}
              type="url"
              inputMode="url"
              placeholder={b.linkPlaceholder}
              value={brand.link}
              onChange={(event) => updateBrand({ link: event.target.value })}
            />
          </div>
        </div>

        <p className={ui.hint}>{b.saved}</p>
      </section>

      <aside className={styles.preview} aria-label={b.preview}>
        <p className={ui.kicker}>{b.preview}</p>
        <EbookPage doc={doc} index={doc.pagination.pages.length - 1} className={styles.previewPage} photoSizes="400px" />
      </aside>
    </div>
  );
}
