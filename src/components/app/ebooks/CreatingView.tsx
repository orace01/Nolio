"use client";

import { retryEbook } from "@/lib/app/store";
import button from "../ui/Button.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import { EbookMissing } from "./EbookMissing";
import styles from "./ebooks.module.css";
import { useEbookRoute } from "./useEbookRoute";

export function CreatingView() {
  const { lang, t } = useAppText();
  const { id, hydrated, ebook, now } = useEbookRoute();
  const c = t.creating;

  if (hydrated && !ebook) return <EbookMissing />;

  // On the server, the worker reports its progress; the demo simulates it with time
  const server = Boolean(ebook?.status);
  const total = ebook ? ebook.readyAt - ebook.createdAt : 1;
  const progress = !ebook
    ? 0
    : server
      ? ebook.status === "ready"
        ? 1
        : (ebook.progress?.ratio ?? 0)
      : now
        ? Math.min(1, Math.max(0, (now - ebook.createdAt) / total))
        : 0;
  const done = progress >= 1;
  const failed = ebook?.status === "failed";
  const seconds = ebook && now ? Math.max(0, Math.ceil((ebook.readyAt - now) / 1000)) : 0;
  // Where each task starts and ends on the progress line
  const bounds = server ? [0, 0.57, 0.7, 0.8, 1] : [0, 0.25, 0.5, 0.75, 1];

  if (failed) {
    return (
      <FlowPage
        kicker={c.kicker}
        question={c.failedTitle}
        lead={c.failedText}
        back={{ href: `/${lang}/app`, label: c.library }}
        primary={
          <button type="button" className={button.primary} onClick={() => void retryEbook(id).catch(() => {})}>
            {c.retry}
          </button>
        }
      />
    );
  }

  return (
    <FlowPage
      kicker={c.kicker}
      question={done ? c.questionDone : c.question}
      lead={done ? c.leadDone : c.lead}
      back={{ href: `/${lang}/app`, label: c.library }}
      primary={<NextAction href={`/${lang}/app/ebooks/${id}`} label={c.view} disabled={!done} />}
    >
      {hydrated && ebook && (
        <>
          <span
            className={ui.bar}
            role="progressbar"
            aria-label={c.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <span className={ui.barFill} style={{ width: `${progress * 100}%` }} />
          </span>
          <p className={`${ui.hint} ${styles.remaining}`} aria-live="polite">
            {done ? c.questionDone : server ? c.remainingServer : c.remaining(seconds)}
          </p>
          <ul className={styles.tasks}>
            {c.tasks.map((task, index) => {
              const start = bounds[index];
              const share = bounds[index + 1] - start;
              const state = progress >= start + share ? "done" : progress >= start ? "current" : "waiting";
              return (
                <li key={task}>
                  <span>{task}</span>
                  {state === "current" ? (
                    <span className={ui.bar}>
                      <span className={ui.barFill} style={{ width: `${((progress - start) / share) * 100}%` }} />
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className={state === "waiting" ? `${styles.state} ${styles.waiting}` : styles.state}>
                    {c.states[state]}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </FlowPage>
  );
}
