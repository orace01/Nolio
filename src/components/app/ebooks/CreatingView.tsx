"use client";

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

  const total = ebook ? ebook.readyAt - ebook.createdAt : 1;
  const progress = ebook && now ? Math.min(1, Math.max(0, (now - ebook.createdAt) / total)) : 0;
  const done = progress >= 1;
  const seconds = ebook && now ? Math.max(0, Math.ceil((ebook.readyAt - now) / 1000)) : 0;
  // The four tasks share the time equally
  const share = 1 / c.tasks.length;

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
            {done ? c.questionDone : c.remaining(seconds)}
          </p>
          <ul className={styles.tasks}>
            {c.tasks.map((task, index) => {
              const start = index * share;
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
