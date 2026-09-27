"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { api, getRuntime } from "@/lib/app/api";
import { analyzeIdea, getAnalysis } from "@/lib/app/content";
import type { Analysis } from "@/lib/app/model";
import { updateDraft, useDraft, useHydrated, useProfile } from "@/lib/app/store";
import button from "../ui/Button.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

/* How long the stand-in analysis of the demo pretends to think */
const ANALYSIS_MS = 1600;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function AnalysisStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const profile = useProfile();
  const hydrated = useHydrated();
  const a = t.analysis;
  const idea = draft.idea.trim();
  const analysis = useMemo(() => getAnalysis(draft, lang), [draft, lang]);
  // The analysis replays only when the idea changed since the last one
  const analyzing = hydrated && idea !== "" && draft.analyzed !== idea;
  const role =
    profile.role === "other" ? profile.roleOther || null : profile.role ? t.welcome.roles[profile.role].name : null;

  useEffect(() => {
    if (!analyzing) return;
    let cancelled = false;
    const run = async () => {
      let result: Analysis;
      if (getRuntime().ai.gemini) {
        // Gemini reads the idea; the stand-in takes over if it cannot answer
        result = await api<Analysis>("/api/ai/analyze", { body: { idea, lang, role } }).catch(() =>
          analyzeIdea(idea, lang),
        );
      } else {
        await wait(ANALYSIS_MS);
        result = analyzeIdea(idea, lang);
      }
      if (cancelled) return;
      updateDraft((current) => ({
        analyzed: idea,
        analysis: result,
        // Profiles suggested for a previous idea no longer apply
        audiences: current.audiences.filter(
          (id) => id === "other" || result.audiences.some((audience) => audience.id === id),
        ),
      }));
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [analyzing, idea, lang, role]);

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
  } else if (analysis.refused) {
    body = (
      <div className={styles.open} role="alert">
        <p className={ui.label}>{a.refused}</p>
        <p className={ui.small}>{analysis.refusalReason}</p>
        <p>
          <Link href={`/${lang}/app/new/idea`} className={button.text}>
            {a.emptyLink}
          </Link>
        </p>
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
          <p className={ui.small}>{analysis.open.length ? `${analysis.open.join(", ")}.` : a.openText}</p>
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
          disabled={!hydrated || idea === "" || analyzing || analysis.refused}
        />
      }
    >
      {body}
    </FlowPage>
  );
}
