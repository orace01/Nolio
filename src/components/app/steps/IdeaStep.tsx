"use client";

import { updateDraft, useDraft } from "@/lib/app/store";
import { FlowPage, NextAction } from "../ui/FlowPage";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

/* Enough words for the analysis to have something to work with */
export const MIN_IDEA_LENGTH = 25;

export function IdeaStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const i = t.idea;
  const ready = draft.idea.trim().length >= MIN_IDEA_LENGTH;

  return (
    <FlowPage
      kicker={i.kicker}
      question={i.question}
      lead={i.lead}
      back={{ href: `/${lang}/app/new`, label: t.common.back }}
      primary={<NextAction href={`/${lang}/app/new/analysis`} label={i.submit} disabled={!ready} />}
    >
      <textarea
        className={styles.bigTextarea}
        aria-label={i.label}
        aria-describedby="idea-status"
        placeholder={i.placeholder}
        value={draft.idea}
        onChange={(event) => updateDraft({ idea: event.target.value })}
      />
      <p id="idea-status" className={`${ui.hint} ${styles.status}`}>
        {draft.idea.trim() !== "" && !ready ? i.tooShort : ""}
      </p>

      <div className={styles.examples}>
        <div className={styles.examplesHead}>
          <p className={ui.label}>{i.examplesLabel}</p>
          <p className={ui.hint}>{i.examplesHint}</p>
        </div>
        <ul>
          {i.examples.map((example) => (
            <li key={example}>
              <button type="button" className={styles.example} onClick={() => updateDraft({ idea: example })}>
                {example}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </FlowPage>
  );
}
