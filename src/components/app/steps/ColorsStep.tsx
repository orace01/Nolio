"use client";

import { useMemo } from "react";
import { canUse } from "@/lib/app/account";
import { FONT_NAMES, FONT_VARIABLES, THEMES, TITLE_WEIGHTS, type FontKey } from "@/lib/app/catalog";
import { buildEbook } from "@/lib/app/content";
import { updateDraft, useBrand, useDraft, usePlan } from "@/lib/app/store";
import field from "../ui/Field.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { Option, OptionGrid } from "../ui/Option";
import { useUpgrade } from "../ui/Premium";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

const FONTS = Object.keys(FONT_NAMES) as FontKey[];

type SampleProps = {
  accent: string;
  swatches: string[];
  titleFont: FontKey;
  bodyFont: FontKey;
  uppercase: boolean;
  title: string;
  body: string;
};

/* Colors and fonts of a theme, on a piece of paper */
function ThemeSample({ accent, swatches, titleFont, bodyFont, uppercase, title, body }: SampleProps) {
  return (
    <span className={styles.themePreview}>
      <span className={styles.swatches}>
        {swatches.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </span>
      <span
        className={styles.sampleTitle}
        style={{
          fontFamily: FONT_VARIABLES[titleFont],
          fontWeight: TITLE_WEIGHTS[titleFont],
          textTransform: uppercase ? "uppercase" : "none",
          color: accent,
        }}
      >
        {title}
      </span>
      <span className={styles.sampleBody} style={{ fontFamily: FONT_VARIABLES[bodyFont] }}>
        {body}
      </span>
    </span>
  );
}

export function ColorsStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const plan = usePlan();
  const brand = useBrand();
  const upgrade = useUpgrade();
  const c = t.colors;
  const { title, subtitle } = useMemo(() => buildEbook(draft, lang), [draft, lang]);
  const customAllowed = canUse("pro", plan);
  const custom = draft.customTheme;

  const selectCustom = () =>
    customAllowed
      ? updateDraft({ theme: "custom" })
      : upgrade({ name: c.custom.name, kind: "option", tier: "pro", onUnlock: () => updateDraft({ theme: "custom" }) });

  return (
    <FlowPage
      wide
      kicker={t.design.kicker(2)}
      question={c.question}
      lead={c.lead}
      back={{ href: `/${lang}/app/new/style`, label: t.common.back }}
      primary={<NextAction href={`/${lang}/app/new/writing`} label={t.common.continue} />}
    >
      <OptionGrid columns={3}>
        {THEMES.map((theme) => {
          const locked = !canUse(theme.tier, plan);
          return (
            <Option
              key={theme.id}
              name="theme"
              checked={draft.theme === theme.id}
              locked={locked}
              onSelect={() =>
                locked
                  ? upgrade({
                      name: theme.name[lang],
                      kind: "theme",
                      tier: "premium",
                      preview: { theme: theme.id },
                      onUnlock: () => updateDraft({ theme: theme.id }),
                    })
                  : updateDraft({ theme: theme.id })
              }
              preview={
                <ThemeSample
                  accent={theme.accent}
                  swatches={[theme.accent, theme.soft, theme.paper]}
                  titleFont={theme.titleFont}
                  bodyFont={theme.bodyFont}
                  uppercase={theme.titleUppercase}
                  title={title}
                  body={subtitle}
                />
              }
              title={theme.name[lang]}
              tier={theme.tier}
              description={c.description(
                theme.colorName[lang],
                FONT_NAMES[theme.titleFont],
                FONT_NAMES[theme.bodyFont],
              )}
            />
          );
        })}
        <Option
          name="theme"
          checked={draft.theme === "custom"}
          locked={!customAllowed}
          onSelect={selectCustom}
          preview={
            draft.theme === "custom" ? (
              <ThemeSample
                accent={custom.accent}
                swatches={[custom.accent]}
                titleFont={custom.titleFont}
                bodyFont={custom.bodyFont}
                uppercase={custom.titleFont === "montserrat"}
                title={title}
                body={subtitle}
              />
            ) : (
              <span className={styles.customPreview}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            )
          }
          title={c.custom.name}
          tier="pro"
          description={c.custom.description}
        />
      </OptionGrid>

      {draft.theme === "custom" && customAllowed && (
        <div className={styles.editor}>
          <div className={field.field}>
            <label className={field.label} htmlFor="custom-accent">
              {c.accent}
            </label>
            <div className={styles.colorField}>
              <input
                id="custom-accent"
                type="color"
                className={styles.colorInput}
                value={custom.accent}
                onChange={(event) => updateDraft({ customTheme: { ...custom, accent: event.target.value } })}
              />
              {brand.colors.length > 0 && (
                <div className={styles.brandSwatches} role="group" aria-label={c.brandColors}>
                  {brand.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={styles.brandSwatch}
                      style={{ background: color }}
                      aria-label={c.useColor(color)}
                      title={c.useColor(color)}
                      onClick={() => updateDraft({ customTheme: { ...custom, accent: color } })}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          {(["titleFont", "bodyFont"] as const).map((key) => (
            <div key={key} className={field.field}>
              <label className={field.label} htmlFor={`custom-${key}`}>
                {c[key]}
              </label>
              <select
                id={`custom-${key}`}
                className={field.select}
                value={custom[key]}
                onChange={(event) =>
                  updateDraft({ customTheme: { ...custom, [key]: event.target.value as FontKey } })
                }
              >
                {FONTS.map((font) => (
                  <option key={font} value={font}>
                    {FONT_NAMES[font]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </FlowPage>
  );
}
