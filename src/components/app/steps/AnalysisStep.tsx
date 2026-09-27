"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { analyzeIdea } from "@/lib/app/content";
import { updateDraft, useDraft, useHydrated } from "@/lib/app/store";
import button from "../ui/Button.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

/* How long the stand-in analysis pretends to think */
const ANALYSIS_MS = 1600;

export function AnalysisStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const hydrated = useHydrated();
  const a = t.analysis;
  const idea = draft.idea.trim();
  const analysis = useMemo(() => analyzeIdea(idea, lang), [idea, lang]);
  // The analysis replays only when the idea changed since the last one
  const analyzing = hydrated && idea !== "" && draft.analyzed !== idea;

  useEffect(() => {
    if (!analyzing) return;
    const timer = setTimeout(() => updateDraft({ analyzed: idea }), ANALYSIS_MS);
    return () => clearTimeout(timer);
  }, [analyzing, idea]);

  const quote = idea.length > 170 ? `${idea.slice(0, 170).replace(/\s+\S*$/, "")}…` : idea;
  const found = [
    { key: a.labels.type, value: analysis.type },
    { key: a.labels.subject, value: analysis.subject },
    { key: a.labels.contents, value: analysis.contents },
    { key: a.labels.goal, value: analysis.goal },
  ];

  let body = null;
  if (!hydrated) {
    body = null;
  } else if (idea === "") {
    body = (
      <div className={styles.open}>
        <p className={ui.small}>{a.empty}</p>
        <p>
          <Link href={`/${lang}/app/new/idea`} className={button.text}>
            {a.emptyLink}
          </Link>
        </p>
      </div>
    );
  } else if (analyzing) {
    body = (
      <div className={styles.analyzing} role="status">
        <p className={ui.small}>{a.analyzing}</p>
        <span className={styles.sweep} />
      </div>
    );
  } else {
    body = (
      <>
        <blockquote className={styles.idea}>
          {lang === "fr" ? `« ${quote} »` : `“${quote}”`}
        </blockquote>
        <ul className={styles.found}>
          {found.map((item) => (
            <li key={item.key}>
              <span className={`${ui.check} ${styles.foundCheck}`} aria-hidden="true" />
              <div>
                <p className={styles.foundKey}>{item.key}</p>
                <p className={styles.foundValue}>{item.value}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.open}>
          <p className={ui.label}>{a.open}</p>
          <p className={ui.small}>{a.openText}</p>
        </div>
      </>
    );
  }

  return (
    <FlowPage
      kicker={a.kicker}
      question={a.question}
      lead={a.lead}
      back={{ href: `/${lang}/app/new/idea`, label: t.common.back }}
      primary={
        <NextAction
          href={`/${lang}/app/new/audience`}
          label={t.common.continue}
          disabled={!hydrated || idea === "" || analyzing}
        />
      }
    >
      {body}
    </FlowPage>
  );
}
