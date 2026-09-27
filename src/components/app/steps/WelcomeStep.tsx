"use client";

import { ROLES } from "@/lib/app/account";
import { updateProfile, useProfile } from "@/lib/app/store";
import field from "../ui/Field.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { Option, OptionGrid } from "../ui/Option";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

export function WelcomeStep() {
  const { lang, t } = useAppText();
  const profile = useProfile();
  const w = t.welcome;
  const answered = profile.role === "other" ? profile.roleOther.trim() !== "" : profile.role !== null;

  return (
    <FlowPage
      kicker={w.kicker(profile.firstName)}
      question={w.question}
      lead={w.lead}
      primary={<NextAction href={`/${lang}/app/new`} label={t.common.continue} disabled={!answered} />}
    >
      <OptionGrid columns={3}>
        {ROLES.map((role) => (
          <Option
            key={role}
            name="role"
            checked={profile.role === role}
            onSelect={() => updateProfile({ role })}
            title={w.roles[role].name}
            description={w.roles[role].description}
          />
        ))}
      </OptionGrid>

      {profile.role === "other" && (
        <div className={`${field.field} ${styles.other}`}>
          <label className={field.label} htmlFor="role-other">
            {w.otherLabel}
          </label>
          <input
            id="role-other"
            className={field.input}
            value={profile.roleOther}
            placeholder={w.otherPlaceholder}
            onChange={(event) => updateProfile({ roleOther: event.target.value })}
            autoFocus
          />
        </div>
      )}
    </FlowPage>
  );
}
