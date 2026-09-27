"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import type { CommentStatus } from "@/lib/app/model";
import { addComment, applyFixes, removeComment, type Ebook, type EbookComment } from "@/lib/app/store";
import { useEbookDocument } from "../ebook/document";
import { EbookPage } from "../ebook/EbookPage";
import button from "../ui/Button.module.css";
import field from "../ui/Field.module.css";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import { EbookMissing } from "./EbookMissing";
import styles from "./ebooks.module.css";
import { useEbookRoute } from "./useEbookRoute";

/* Pages shown together, as in a printed book: the cover alone, then pairs */
function spreadsOf(count: number): [number | null, number | null][] {
  const spreads: [number | null, number | null][] = [[null, 0]];
  for (let index = 1; index < count; index += 2) {
    spreads.push([index, index + 1 < count ? index + 1 : null]);
  }
  return spreads;
}

const spreadOfPage = (index: number) => (index === 0 ? 0 : Math.floor((index + 1) / 2));

type Selection = { page: number; part: string | null };

function Arrow() {
  return (
    <svg viewBox="0 0 40 10" aria-hidden="true">
      <line x1="0" y1="5" x2="39" y2="5" />
      <polyline points="34,1 39.2,5 34,9" />
    </svg>
  );
}

export function ViewerView() {
  const { lang } = useAppText();
  const { hydrated, ebook, id, now } = useEbookRoute();
  const router = useRouter();

  // Still being created: follow the progress instead
  useEffect(() => {
    const creating = ebook?.status ? ebook.status !== "ready" : ebook && Date.now() < ebook.readyAt;
    if (hydrated && ebook && creating) {
      router.replace(`/${lang}/app/ebooks/${id}/creating`);
    }
  }, [hydrated, ebook, id, lang, router]);

  if (!hydrated) return null;
  if (!ebook) return <EbookMissing />;
  return <Viewer key={ebook.id} ebook={ebook} now={now} />;
}

function Viewer({ ebook, now }: { ebook: Ebook; now: number }) {
  const { lang, t } = useAppText();
  const id = ebook.id;
  const v = t.viewer;
  // The text written by the AI, once the server has it
  const doc = useEbookDocument(ebook.draft, { content: ebook.content });
  const pages = doc.pagination.pages;
  const spreads = spreadsOf(pages.length);

  const [spread, setSpread] = useState(0);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [text, setText] = useState("");

  const [left, right] = spreads[spread];
  const target: Selection = selection ?? { page: (left ?? right ?? 0) + 1, part: null };
  const partName = (part: string | null) =>
    part && part in v.parts ? v.parts[part as keyof typeof v.parts] : null;

  const turn = (next: number) => {
    setSpread(Math.min(Math.max(next, 0), spreads.length - 1));
    setSelection(null);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowRight") turn(spread + 1);
      if (event.key === "ArrowLeft") turn(spread - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pick = (index: number) => (event: MouseEvent<HTMLDivElement>) => {
    const part = (event.target as HTMLElement).closest("[data-part]")?.getAttribute("data-part") ?? null;
    setSelection({ page: index + 1, part });
  };

  const comments = ebook.comments;
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  // Server comments carry their status; the demo derives it from time
  const statusOf = (comment: EbookComment): CommentStatus =>
    comment.status ?? (comment.appliedAt === null ? "pending" : now < comment.appliedAt ? "applying" : "applied");
  const pending = comments.filter((comment) => statusOf(comment) === "pending").length;
  const applying = comments.some((comment) => statusOf(comment) === "applying");

  const add = async (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    setSending(true);
    setFailed(false);
    try {
      await addComment(id, { page: target.page, part: target.part, text: value });
      setText("");
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const remove = (commentId: string) => removeComment(id, commentId);

  const apply = () => {
    setFailed(false);
    applyFixes(id).catch(() => setFailed(true));
  };

  const shown = [left, right].filter((index): index is number => index !== null);

  return (
    <div className={styles.body}>
      <section className={styles.viewer} aria-labelledby="ebook-title">
        <h1 id="ebook-title" className={ui.srOnly}>
          {doc.content.title}
        </h1>
        <div className={styles.turn}>
          <button
            type="button"
            className={`${styles.turnButton} ${styles.back}`}
            aria-label={v.previous}
            disabled={spread === 0}
            onClick={() => turn(spread - 1)}
          >
            <Arrow />
          </button>
          <span aria-live="polite">{v.position(shown[0] + 1, shown[1] !== undefined ? shown[1] + 1 : null, pages.length)}</span>
          <button
            type="button"
            className={styles.turnButton}
            aria-label={v.next}
            disabled={spread === spreads.length - 1}
            onClick={() => turn(spread + 1)}
          >
            <Arrow />
          </button>
        </div>

        <div key={spread} className={styles.spread}>
          {[left, right].map((index, side) =>
            index === null ? (
              <div key={side} />
            ) : (
              <div
                key={side}
                className={[
                  styles.sheet,
                  side === 0 ? styles.leftSheet : styles.rightSheet,
                  selection?.page === index + 1 && selection.part === null && styles.selectedSheet,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={pick(index)}
              >
                <EbookPage doc={doc} index={index} highlight={target.page === index + 1 ? target.part : null} />
              </div>
            ),
          )}
        </div>

        <div className={styles.strip} role="group" aria-label={v.pages}>
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={spreadOfPage(index) === spread ? `${styles.stripPage} ${styles.on}` : styles.stripPage}
              aria-label={v.goTo(index + 1)}
              aria-current={target.page === index + 1 ? "page" : undefined}
              onClick={() => {
                setSpread(spreadOfPage(index));
                setSelection({ page: index + 1, part: null });
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>

      <aside className={styles.comments} aria-labelledby="comments-title">
        <div>
          <h2 id="comments-title" className={ui.kicker}>
            {v.kicker}
          </h2>
          <p className={`${ui.small} ${ui.muted}`} style={{ marginTop: 8 }}>
            {v.help}
          </p>
        </div>

        {comments.map((comment) => {
          const status = statusOf(comment);
          return (
            <div key={comment.id} className={status === "applied" ? `${styles.comment} ${styles.applied}` : styles.comment}>
              <p className={styles.where}>
                <span>{v.where(comment.page, partName(comment.part))}</span>
                <span>{v.status[status]}</span>
              </p>
              <p className={styles.commentText}>{comment.text}</p>
              {comment.reply && status !== "pending" && <p className={styles.commentReply}>{comment.reply}</p>}
              {status === "pending" && (
                <button
                  type="button"
                  className={`${button.text} ${button.quiet}`}
                  style={{ marginTop: 4 }}
                  onClick={() => remove(comment.id)}
                >
                  {v.removeComment}
                </button>
              )}
            </div>
          );
        })}

        <form className={styles.commentForm} onSubmit={(event) => void add(event)}>
          <label htmlFor="comment" className={ui.srOnly}>
            {v.commentLabel}
          </label>
          <textarea
            id="comment"
            className={field.textarea}
            placeholder={v.placeholder(target.page, partName(target.part))}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <div className={styles.formRow}>
            <button type="submit" className={`${button.secondary} ${button.small}`} disabled={!text.trim() || sending}>
              {v.add}
            </button>
            {target.part && (
              <button
                type="button"
                className={`${button.text} ${button.quiet}`}
                onClick={() => setSelection({ page: target.page, part: null })}
              >
                {v.clearPart}
              </button>
            )}
          </div>
        </form>

        <div className={styles.final}>
          {failed && (
            <p className={field.error} role="alert">
              {v.failed}
            </p>
          )}
          <button type="button" className={button.secondary} disabled={pending === 0 || applying} onClick={apply}>
            {applying ? v.applying : v.apply(pending)}
          </button>
          <Link href={`/${lang}/app/ebooks/${id}/download`} className={button.primary}>
            {v.download}
          </Link>
        </div>
      </aside>
    </div>
  );
}
