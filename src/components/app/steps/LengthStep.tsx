"use client";

import { canUse } from "@/lib/app/account";
import { LENGTHS } from "@/lib/app/catalog";
import { getAnalysis } from "@/lib/app/content";
import { updateDraft, useDraft, usePlan } from "@/lib/app/store";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { Option, OptionGrid } from "../ui/Option";
import { useUpgrade } from "../ui/Premium";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

export function LengthStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const plan = usePlan();
  const upgrade = useUpgrade();
  const l = t.length;
  const recommended = getAnalysis(draft, lang).recommendedLength;

  return (
    <FlowPage
      kicker={l.kicker}
      question={l.question}
      lead={l.lead}
      back={{ href: `/${lang}/app/new/media`, label: t.common.back }}
      primary={<NextAction href={`/${lang}/app/new/summary`} label={t.common.continue} />}
    >
      <OptionGrid columns={3}>
        {LENGTHS.map((length) => {
          const locked = !canUse(length.tier, plan);
          return (
            <Option
              key={length.id}
              name="length"
              checked={draft.length === length.id}
              locked={locked}
              onSelect={() =>
                locked
                  ? upgrade({
                      name: length.name[lang],
                      kind: "length",
                      tier: length.tier === "pro" ? "pro" : "premium",
                      onUnlock: () => updateDraft({ length: length.id }),
                    })
                  : updateDraft({ length: length.id })
              }
              title={length.name[lang]}
              tier={length.tier}
              description={
                <>
                  <span className={styles.pages}>{length.pages[lang]}</span>
                  {length.description[lang]} {length.id === recommended && <b>{l.recommended}</b>}
                </>
              }
            />
          );
        })}
      </OptionGrid>
    </FlowPage>
  );
}
