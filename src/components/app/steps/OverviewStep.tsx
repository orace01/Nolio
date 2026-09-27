"use client";

import { useEbooks } from "@/lib/app/store";
import { FlowPage, NextAction } from "../ui/FlowPage";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

export function OverviewStep() {
  const { lang, t } = useAppText();
  const ebooks = useEbooks();
  const o = t.overview;

  return (
    <FlowPage
      kicker={ebooks.length > 0 ? o.kicker : o.kickerFirst}
      question={o.question}
      lead={o.lead}
      back={{ href: `/${lang}/app`, label: t.common.back }}
      primary={<NextAction href={`/${lang}/app/new/idea`} label={o.start} />}
    >
      <ol className={styles.toc} aria-label={o.stepsLabel}>
        {o.steps.map((step, index) => (
          <li key={step.name}>
            <span
              className={`${styles.tocNumber} ${ui.textured} ${index % 2 === 1 ? ui.texturedAlt : ""}`}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className={styles.tocStep}>{step.name}</p>
              <p className={ui.small}>{step.text}</p>
            </div>
            <span className={styles.tocTime}>{step.time}</span>
          </li>
        ))}
      </ol>
    </FlowPage>
  );
}
