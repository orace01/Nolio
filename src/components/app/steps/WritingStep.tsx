"use client";

import { TONES } from "@/lib/app/catalog";
import { updateDraft, useDraft } from "@/lib/app/store";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { Option, OptionGrid } from "../ui/Option";
import { Segmented } from "../ui/Segmented";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

export function WritingStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const w = t.writing;
  // "Vous" or "tu" only exists in French
  const informal = lang === "fr" && draft.address === "informal";

  return (
    <FlowPage
      kicker={t.design.kicker(3)}
      question={w.question}
      lead={w.lead}
      back={{ href: `/${lang}/app/new/colors`, label: t.common.back }}
      primary={<NextAction href={`/${lang}/app/new/illustrations`} label={t.common.continue} />}
    >
      <OptionGrid>
        {TONES.map((tone) => (
          <Option
            key={tone.id}
            name="tone"
            checked={draft.tone === tone.id}
            onSelect={() => updateDraft({ tone: tone.id })}
            title={tone.name[lang]}
            description={<span className={styles.quote}>{informal ? tone.informal : tone.sample[lang]}</span>}
          />
        ))}
      </OptionGrid>

      {lang === "fr" && (
        <Segmented
          className={styles.address}
          name="address"
          legend={w.address}
          value={draft.address}
          options={[
            { id: "formal", label: w.formal },
            { id: "informal", label: w.informal },
          ]}
          onChange={(address) => updateDraft({ address })}
        />
      )}
    </FlowPage>
  );
}
