"use client";

import { useMemo } from "react";
import { suggestAudiences } from "@/lib/app/content";
import { updateDraft, useDraft } from "@/lib/app/store";
import field from "../ui/Field.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { Option, OptionGrid } from "../ui/Option";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

export const OTHER_AUDIENCE = "other";

export function AudienceStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const a = t.audience;
  const suggestions = useMemo(() => suggestAudiences(draft.idea, lang), [draft.idea, lang]);
  const spotted = suggestions.some((suggestion) => suggestion.fromIdea);

  const toggle = (id: string) =>
    updateDraft({
      audiences: draft.audiences.includes(id)
        ? draft.audiences.filter((audience) => audience !== id)
        : [...draft.audiences, id],
    });

  const withOther = draft.audiences.includes(OTHER_AUDIENCE);
  const known = draft.audiences.filter((id) => suggestions.some((suggestion) => suggestion.id === id));
  const answered = known.length > 0 || (withOther && draft.audienceOther.trim() !== "");

  return (
    <FlowPage
      kicker={a.kicker}
      question={a.question}
      lead={spotted ? a.lead : a.leadGeneral}
      back={{ href: `/${lang}/app/new/analysis`, label: t.common.back }}
      primary={<NextAction href={`/${lang}/app/new/media`} label={t.common.continue} disabled={!answered} />}
    >
      <OptionGrid>
        {suggestions.map((suggestion) => (
          <Option
            key={suggestion.id}
            type="checkbox"
            name="audience"
            checked={draft.audiences.includes(suggestion.id)}
            onSelect={() => toggle(suggestion.id)}
            title={suggestion.name}
            description={
              <>
                {suggestion.description} {suggestion.fromIdea && <b>{a.fromIdea}</b>}
              </>
            }
          />
        ))}
        <Option
          type="checkbox"
          name="audience"
          checked={withOther}
          onSelect={() => toggle(OTHER_AUDIENCE)}
          title={a.other.name}
          description={a.other.description}
        />
      </OptionGrid>

      {withOther && (
        <div className={`${field.field} ${styles.other}`}>
          <label className={field.label} htmlFor="audience-other">
            {a.otherLabel}
          </label>
          <input
            id="audience-other"
            className={field.input}
            value={draft.audienceOther}
            placeholder={a.otherPlaceholder}
            onChange={(event) => updateDraft({ audienceOther: event.target.value })}
          />
        </div>
      )}
    </FlowPage>
  );
}
