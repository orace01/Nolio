"use client";

import { useRef, useState, type FormEvent } from "react";
import { api } from "@/lib/app/api";
import { hostname, videoSource } from "@/lib/app/content";
import { newId, updateDraft, useDraft, type MediaItem } from "@/lib/app/store";
import button from "../ui/Button.module.css";
import field from "../ui/Field.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

/* A pasted address, completed with https:// when it was left out */
function parseLink(value: string): string | null {
  const text = value.trim();
  if (!text) return null;
  try {
    const url = new URL(/^[a-z]+:\/\//i.test(text) ? text : `https://${text}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function MediaStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const m = t.media;
  const [link, setLink] = useState("");
  const [invalid, setInvalid] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const add = (event: FormEvent) => {
    event.preventDefault();
    const url = parseLink(link);
    if (!url) {
      setInvalid(true);
      return;
    }
    const video = videoSource(url) !== null;
    const videos = draft.media.filter((item) => item.kind === "video").length;
    const item: MediaItem = {
      id: newId(),
      kind: video ? "video" : "link",
      title: video ? m.videoTitle(videos + 1) : hostname(url),
      url,
    };
    updateDraft({ media: [...draft.media, item] });
    setLink("");
    setInvalid(false);

    // The platform's own title replaces "Video 1", unless the user renamed it meanwhile
    if (video) {
      void api<{ title: string | null }>("/api/media/inspect", { body: { url } })
        .then(({ title }) => {
          if (!title) return;
          updateDraft((current) => ({
            media: current.media.map((entry) =>
              entry.id === item.id && entry.title === item.title ? { ...entry, title } : entry,
            ),
          }));
        })
        .catch(() => {});
    }
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    // TODO: upload the files once storage exists; only their names are kept for now
    const items: MediaItem[] = Array.from(files).map((file) => ({
      id: newId(),
      kind: "file",
      title: file.name,
      url: "",
    }));
    updateDraft({ media: [...draft.media, ...items] });
  };

  const rename = (id: string, title: string) =>
    updateDraft({ media: draft.media.map((item) => (item.id === id ? { ...item, title } : item)) });

  const remove = (id: string) => updateDraft({ media: draft.media.filter((item) => item.id !== id) });

  const firstLink = draft.media.find((item) => item.kind === "link")?.id;
  const hint = (item: MediaItem) => {
    if (item.kind === "video") return m.videoHint(videoSource(item.url) ?? "");
    if (item.kind === "file") return m.fileHint;
    return item.id === firstLink ? m.ctaHint : m.resourceHint;
  };

  return (
    <FlowPage
      kicker={m.kicker}
      question={m.question}
      lead={m.lead}
      back={{ href: `/${lang}/app/new/audience`, label: t.common.back }}
      primary={<NextAction href={`/${lang}/app/new/length`} label={t.common.continue} />}
    >
      {draft.media.length > 0 ? (
        <ul className={styles.media}>
          {draft.media.map((item, index) => (
            <li key={item.id}>
              {item.kind === "video" ? (
                <span className={styles.thumb} aria-hidden="true" />
              ) : (
                <svg className={`${ui.icon} ${styles.mediaIcon}`} viewBox="0 0 24 24" aria-hidden="true">
                  {item.kind === "link" ? (
                    <path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" />
                  ) : (
                    <path d="M6 3h8l4 4v14H6zM14 3v4h4" />
                  )}
                </svg>
              )}
              <div>
                <input
                  className={styles.mediaTitle}
                  value={item.title}
                  aria-label={`${m.titleLabel} ${index + 1}`}
                  onChange={(event) => rename(item.id, event.target.value)}
                />
                <p className={ui.hint}>{hint(item)}</p>
              </div>
              <button
                type="button"
                className={`${button.text} ${button.quiet}`}
                aria-label={m.removeLabel(item.title)}
                onClick={() => remove(item.id)}
              >
                {t.common.remove}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`${ui.small} ${ui.muted} ${styles.empty}`}>{m.empty}</p>
      )}

      <form className={styles.add} onSubmit={add} noValidate>
        <input
          className={field.input}
          type="url"
          inputMode="url"
          value={link}
          placeholder={m.placeholder}
          aria-label={m.label}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "media-error" : undefined}
          onChange={(event) => {
            setLink(event.target.value);
            setInvalid(false);
          }}
        />
        <button type="submit" className={button.secondary}>
          {m.add}
        </button>
      </form>
      {invalid && (
        <p id="media-error" className={field.error} role="alert" style={{ marginTop: 8 }}>
          {m.invalid}
        </p>
      )}

      <p className={`${ui.hint} ${styles.files}`}>
        {m.files}{" "}
        <button type="button" className={styles.inlineLink} onClick={() => fileInput.current?.click()}>
          {m.filesLink}
        </button>
      </p>
      <input
        ref={fileInput}
        type="file"
        accept="application/pdf,image/*"
        multiple
        hidden
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </FlowPage>
  );
}
