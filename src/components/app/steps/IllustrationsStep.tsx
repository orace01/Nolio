"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { canUse } from "@/lib/app/account";
import { ILLUSTRATIONS, type IllustrationId } from "@/lib/app/catalog";
import { updateDraft, useDraft, usePlan } from "@/lib/app/store";
import { Drawing } from "../ebook/Visuals";
import field from "../ui/Field.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { Option, OptionGrid } from "../ui/Option";
import { useUpgrade } from "../ui/Premium";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

/* What each kind of illustration looks like, from the mockup */
const PREVIEWS: Record<IllustrationId, ReactNode> = {
  none: (
    <span className={styles.lines}>
      <span />
      <span />
      <span />
      <span />
    </span>
  ),
  photos: (
    <span className={styles.illusPhoto}>
      <Image src={leaves} alt="" fill sizes="300px" style={{ objectFit: "cover", objectPosition: "40% 55%" }} />
    </span>
  ),
  icons: (
    <svg viewBox="0 0 120 50" aria-hidden="true">
      <circle cx="22" cy="25" r="12" />
      <path d="M22 18v7l5 3" />
      <rect x="48" y="13" width="24" height="24" />
      <path d="M53 25l5 5 9-10M92 37l12-24 12 24zM98 29h12" />
    </svg>
  ),
  line: <Drawing index={0} />,
  shapes: (
    <svg viewBox="0 0 120 60" aria-hidden="true">
      <circle cx="30" cy="30" r="18" fill="#2a3f34" />
      <rect x="52" y="14" width="30" height="30" fill="#8aa596" />
      <path d="M92 46l14-30 14 30z" fill="#c9b99a" />
    </svg>
  ),
  custom: (
    <svg viewBox="0 0 120 50" aria-hidden="true">
      <path d="M60 8v10M60 32v10M43 25h10M67 25h10M48 13l6 6M66 31l6 6M48 37l6-6M66 19l6-6" />
    </svg>
  ),
};

export function IllustrationsStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const plan = usePlan();
  const upgrade = useUpgrade();
  const i = t.illustrations;

  return (
    <FlowPage
      wide
      kicker={t.design.kicker(4)}
      question={i.question}
      lead={i.lead}
      back={{ href: `/${lang}/app/new/writing`, label: t.common.back }}
      primary={<NextAction href={`/${lang}/app/new/images`} label={t.common.continue} />}
    >
      <OptionGrid columns={3}>
        {ILLUSTRATIONS.map((item) => {
          const locked = !canUse(item.tier, plan);
          return (
            <Option
              key={item.id}
              name="illustrations"
              checked={draft.illustrations === item.id}
              locked={locked}
              onSelect={() =>
                locked
                  ? upgrade({
                      name: item.name[lang],
                      kind: "illustration",
                      tier: item.tier === "pro" ? "pro" : "premium",
                      onUnlock: () => updateDraft({ illustrations: item.id }),
                    })
                  : updateDraft({ illustrations: item.id })
              }
              preview={
                <span className={item.id === "shapes" ? `${styles.illusPreview} ${styles.shapes}` : styles.illusPreview}>
                  {PREVIEWS[item.id]}
                </span>
              }
              title={item.name[lang]}
              tier={item.tier}
              description={item.description[lang]}
            />
          );
        })}
      </OptionGrid>

      {draft.illustrations === "custom" && canUse("pro", plan) && (
        <div className={`${field.field} ${styles.brief}`}>
          <label className={field.label} htmlFor="illustration-brief">
            {i.briefLabel}
          </label>
          <input
            id="illustration-brief"
            className={field.input}
            value={draft.illustrationBrief}
            placeholder={i.briefPlaceholder}
            onChange={(event) => updateDraft({ illustrationBrief: event.target.value })}
          />
        </div>
      )}
    </FlowPage>
  );
}
