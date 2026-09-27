"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { Chapter } from "@/lib/app/content";
import { videoSource } from "@/lib/app/content";
import type { MediaItem } from "@/lib/app/store";
import { useAppText } from "../useAppText";
import { Cover } from "./Cover";
import { lookStyle, type EbookDocument } from "./document";
import styles from "./EbookPage.module.css";
import { Drawing, LineIcon, Photo, QrCode, Shapes, Silhouette } from "./Visuals";

type EbookPageProps = {
  doc: EbookDocument;
  /* Position in the pagination, from 0 */
  index: number;
  /* Real links, for the PDF; the viewer keeps them inert so a click comments */
  linked?: boolean;
  eager?: boolean;
  photoSizes?: string;
  /* The passage under comment, outlined on the page */
  highlight?: string | null;
  className?: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

export function EbookPage({
  doc,
  index,
  linked = false,
  eager = false,
  photoSizes = "(max-width: 1400px) 26vw, 360px",
  highlight,
  className,
}: EbookPageProps) {
  const { t } = useAppText();
  const { content, pagination, style, look, draft } = doc;
  const page = pagination.pages[index];
  const number = index + 1;
  const left = number % 2 === 0;

  const classes = [
    styles.page,
    styles[style],
    styles[page.kind],
    doc.margins !== "normal" && styles[doc.margins],
    look.textured && styles.textured,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const imageFor = (chapter: number) =>
    draft.images.length > 0 ? draft.images[chapter % draft.images.length] : undefined;

  const photo = (chapter: number, className: string) => (
    <span className={className} data-part="visual">
      <Photo src={imageFor(chapter)} index={chapter + 1} sizes={photoSizes} eager={eager} />
    </span>
  );

  /* The picture that opens a chapter, from the style and the illustration choice */
  const visual = (chapter: number, small: boolean): ReactNode => {
    if (style === "botanica") return null;
    if (style === "gallery") {
      return (
        <span className={small ? styles.frameSmall : styles.frame} data-part="visual">
          <Drawing index={chapter} className={styles.frameDrawing} />
        </span>
      );
    }
    switch (draft.illustrations) {
      case "none":
        return null;
      case "photos":
        return photo(chapter, small ? styles.photoSmall : styles.photoBlock);
      case "icons":
        return (
          <span data-part="visual" className={styles.iconWrap}>
            <LineIcon index={chapter} className={small ? styles.iconSmall : styles.icon} />
          </span>
        );
      case "shapes":
        return (
          <span data-part="visual" className={styles.visualWrap}>
            <Shapes index={chapter} className={small ? styles.shapesSmall : styles.shapes} />
          </span>
        );
      default:
        return (
          <span data-part="visual" className={styles.visualWrap}>
            <Drawing index={chapter} className={small ? styles.drawingSmall : styles.drawing} />
          </span>
        );
    }
  };

  const video = (item: MediaItem) => {
    const source = videoSource(item.url);
    const inside = (
      <>
        <span className={styles.play} />
        <span className={styles.videoText}>
          <span className={styles.videoKind}>
            {t.ebook.video}
            {source ? ` · ${source}` : ""}
          </span>
          <span className={styles.videoName}>{item.title}</span>
        </span>
        <QrCode value={item.url} className={styles.qr} />
      </>
    );
    return linked ? (
      <a className={styles.video} data-part="video" href={item.url} target="_blank" rel="noreferrer">
        {inside}
      </a>
    ) : (
      <div className={styles.video} data-part="video">
        {inside}
      </div>
    );
  };

  const extras = (chapter: Chapter) => (
    <>
      {chapter.checklist && (
        <ul className={styles.checklist} data-part="list">
          {chapter.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {chapter.box && (
        <div className={styles.box} data-part="box">
          <p className={styles.boxTitle}>{chapter.box.title}</p>
          <p>{chapter.box.text}</p>
        </div>
      )}
    </>
  );

  const notesArea = style === "notes" && <span className={styles.notesArea}>Notes</span>;
  const folio = <span className={styles.folio}>{number}</span>;

  let body: ReactNode;

  if (page.kind === "cover") {
    return (
      <div className={classes} style={lookStyle(look)} data-highlight={highlight ?? undefined}>
        <Cover
          fill
          style={style}
          look={look}
          title={content.title}
          author={doc.author}
          series={content.kind}
          image={draft.images[0]}
          logo={doc.brand.logo}
          number={content.chapters.length}
          eager={eager}
          sizes={photoSizes}
        />
      </div>
    );
  }

  if (page.kind === "contents") {
    const closingTitle = content.cta?.label ?? t.ebook.about;
    body = (
      <>
        <span className={styles.run}>{content.title}</span>
        <p className={styles.title} data-part="title">
          {t.ebook.contents}
        </p>
        <span className={styles.rule} />
        <ol
          className={content.chapters.length > 9 ? `${styles.toc} ${styles.dense}` : styles.toc}
          data-part="contents"
        >
          {content.chapters.map((chapter, chapterIndex) => (
            <li key={chapterIndex}>
              <span className={styles.tocNumber}>{pad(chapterIndex + 1)}</span>
              <span>{chapter.title}</span>
              <span className={styles.tocPage}>{pagination.chapterStarts[chapterIndex]}</span>
            </li>
          ))}
          <li>
            <span className={styles.tocNumber} />
            <span>{closingTitle}</span>
            <span className={styles.tocPage}>{pagination.pages.length}</span>
          </li>
        </ol>
        {folio}
      </>
    );
  } else if (page.kind === "closing") {
    const { brand } = doc;
    const cta = content.cta;
    body = (
      <>
        <span className={styles.run}>{t.ebook.about}</span>
        <span className={styles.aboutPhoto} data-part="about">
          {brand.photo ? (
            <Image src={brand.photo} alt="" fill sizes="120px" style={{ objectFit: "cover" }} />
          ) : (
            <Silhouette className={styles.silhouette} />
          )}
        </span>
        <p className={styles.aboutName} data-part="about">
          {doc.author}
        </p>
        <span className={styles.rule} />
        {brand.bio && (
          <div className={styles.text} data-part="about">
            <p>{brand.bio}</p>
          </div>
        )}
        {cta &&
          (linked && cta.url ? (
            <a className={styles.cta} data-part="cta" href={cta.url} target="_blank" rel="noreferrer">
              <span className={styles.ctaLabel}>{cta.label}</span>
              <span className={styles.ctaUrl}>{cta.url}</span>
            </a>
          ) : (
            <div className={styles.cta} data-part="cta">
              <span className={styles.ctaLabel}>{cta.label}</span>
              {cta.url && <span className={styles.ctaUrl}>{cta.url}</span>}
            </div>
          ))}
        {content.resources.length > 0 && (
          <div className={styles.resources} data-part="text">
            <p className={styles.boxTitle}>{t.ebook.resources}</p>
            <ul>
              {content.resources.map((item) => (
                <li key={item.id}>
                  {linked && item.kind === "link" ? (
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {doc.credit && <span className={styles.credit}>{t.ebook.credit}</span>}
        {folio}
      </>
    );
  } else {
    const chapterIndex = page.chapter;
    const chapter = content.chapters[chapterIndex];
    const run = left ? content.title : chapter.short;

    if (page.kind === "opener") {
      body = (
        <>
          <span className={styles.run}>{run}</span>
          {style === "botanica" && photo(chapterIndex, styles.photoBand)}
          {visual(chapterIndex, false)}
          <p className={styles.number}>{pad(chapterIndex + 1)}</p>
          <h2 className={styles.title} data-part="title">
            {chapter.title}
          </h2>
          <span className={styles.rule} />
          <div className={styles.text} data-part="text">
            <p className={styles.intro}>{chapter.intro}</p>
          </div>
          {folio}
        </>
      );
    } else if (page.kind === "body") {
      body = (
        <>
          <span className={styles.run}>{run}</span>
          <div className={styles.text} data-part="text">
            {chapter.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {chapter.video && video(chapter.video)}
          {extras(chapter)}
          {notesArea}
          {style === "gallery" && <Drawing index={chapterIndex + 2} className={styles.vignette} />}
          {folio}
        </>
      );
    } else {
      body = (
        <>
          <span className={styles.run}>{run}</span>
          {style === "botanica" && photo(chapterIndex, styles.photoBand)}
          <div className={styles.numberRow}>
            <p className={styles.number}>{pad(chapterIndex + 1)}</p>
            {visual(chapterIndex, true)}
          </div>
          <h2 className={styles.title} data-part="title">
            {chapter.title}
          </h2>
          <span className={styles.rule} />
          <div className={styles.text} data-part="text">
            <p>{chapter.intro}</p>
            {chapter.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {chapter.video && video(chapter.video)}
          {extras(chapter)}
          {notesArea}
          {folio}
        </>
      );
    }
  }

  return (
    <div className={classes} style={lookStyle(look)} data-highlight={highlight ?? undefined}>
      <div className={styles.inner}>{body}</div>
    </div>
  );
}
