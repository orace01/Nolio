"use client";

import { useMemo } from "react";
import { canUse } from "@/lib/app/account";
import { MARGINS, resolveLook, STYLES, findById } from "@/lib/app/catalog";
import { buildEbook } from "@/lib/app/content";
import { updateDraft, useDraft, usePlan } from "@/lib/app/store";
import { Cover } from "../ebook/Cover";
import button from "../ui/Button.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { Option, OptionGrid } from "../ui/Option";
import { useUpgrade } from "../ui/Premium";
import { Segmented } from "../ui/Segmented";
import { Tag } from "../ui/Tag";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

export function StyleStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const plan = usePlan();
  const upgrade = useUpgrade();
  const s = t.style;
  const look = resolveLook(draft.theme, draft.customTheme);
  const title = useMemo(() => buildEbook(draft, lang).title, [draft, lang]);
  const ownAllowed = canUse("pro", plan);
  const current = findById(STYLES, draft.style);

  const openOwn = () =>
    ownAllowed
      ? updateDraft({ ownStyle: true })
      : upgrade({ name: s.ownAction, kind: "option", tier: "pro", onUnlock: () => updateDraft({ ownStyle: true }) });

  return (
    <FlowPage
      wide
      kicker={t.design.kicker(1)}
      question={s.question}
      lead={s.lead}
      back={{ href: `/${lang}/app/new/summary`, label: t.common.back }}
      primary={
        <NextAction
          href={`/${lang}/app/new/colors`}
          label={s.continueWith(draft.ownStyle ? s.ownName : current.name[lang])}
        />
      }
    >
      <OptionGrid columns={3}>
        {STYLES.map((style) => {
          const locked = !canUse(style.tier, plan);
          return (
            <Option
              key={style.id}
              compact
              name="style"
              checked={draft.style === style.id}
              locked={locked}
              onSelect={() =>
                locked
                  ? upgrade({
                      name: style.name[lang],
                      kind: "style",
                      tier: "premium",
                      preview: { style: style.id },
                      onUnlock: () => updateDraft({ style: style.id }),
                    })
                  : updateDraft({ style: style.id })
              }
              preview={
                <span className={styles.stylePreview}>
                  <Cover style={style.id} look={look} title={title} className={styles.styleCover} />
                </span>
              }
              title={style.name[lang]}
              tier={style.tier}
              description={style.description[lang]}
            />
          );
        })}
      </OptionGrid>

      {draft.ownStyle && ownAllowed ? (
        <div className={styles.ownPanel}>
          <div>
            <p className={ui.label}>{s.ownTitle}</p>
            <p className={ui.small}>{s.ownText}</p>
          </div>
          <Tag variant="filled">{t.common.tiers.pro}</Tag>
          <Segmented
            name="margins"
            legend={s.ownMargins}
            value={draft.margins}
            options={MARGINS.map((margin) => ({ id: margin.id, label: margin.name[lang] }))}
            onChange={(margins) => updateDraft({ margins })}
          />
          <button
            type="button"
            className={`${button.text} ${button.quiet}`}
            onClick={() => updateDraft({ ownStyle: false })}
          >
            {s.ownLeave}
          </button>
        </div>
      ) : (
        <button type="button" className={styles.own} onClick={openOwn}>
          <span className={ui.small}>
            {s.own} <b>{s.ownAction}</b>
            {s.ownRest}
          </span>
          <Tag variant="filled">{t.common.tiers.pro}</Tag>
        </button>
      )}
    </FlowPage>
  );
}
