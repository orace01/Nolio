"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatList } from "@/i18n/format";
import { findById, LENGTHS } from "@/lib/app/catalog";
import { getAnalysis } from "@/lib/app/content";
import { useDraft } from "@/lib/app/store";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { useAppText } from "../useAppText";
import { OTHER_AUDIENCE } from "./AudienceStep";
import styles from "./steps.module.css";

export function SummaryStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const s = t.summary;
  const analysis = useMemo(() => getAnalysis(draft, lang), [draft, lang]);
  const suggestions = analysis.audiences;

  const audiences = [
    ...suggestions.filter((suggestion) => draft.audiences.includes(suggestion.id)).map((item) => item.name),
    ...(draft.audiences.includes(OTHER_AUDIENCE) && draft.audienceOther.trim() ? [draft.audienceOther.trim()] : []),
  ];

  const count = (kind: "video" | "link" | "file") => draft.media.filter((item) => item.kind === kind).length;
  const media = [
    count("video") && t.common.videos(count("video")),
    count("link") && t.common.links(count("link")),
    count("file") && t.common.files(count("file")),
  ].filter((part): part is string => Boolean(part));

  const length = findById(LENGTHS, draft.length);
  const base = `/${lang}/app/new`;

  const rows = [
    { key: s.rows.ebook, value: draft.idea.trim() ? analysis.summary : s.missing, href: `${base}/idea` },
    { key: s.rows.audience, value: audiences.length ? `${formatList(lang, audiences)}.` : s.missing, href: `${base}/audience` },
    { key: s.rows.goal, value: draft.idea.trim() ? `${analysis.goal}.` : s.missing, href: `${base}/idea` },
    { key: s.rows.media, value: media.length ? `${formatList(lang, media)}.` : s.none, href: `${base}/media` },
    { key: s.rows.length, value: `${length.name[lang]}, ${length.pages[lang]}.`, href: `${base}/length` },
  ];

  return (
    <FlowPage
      kicker={s.kicker}
      question={s.question}
      lead={s.lead}
      back={{ href: `${base}/length`, label: t.common.back }}
      primary={<NextAction href={`${base}/style`} label={s.continue} />}
    >
      <dl className={styles.recap}>
        {rows.map((row) => (
          <div key={row.key}>
            <dt>{row.key}</dt>
            <dd>{row.value}</dd>
            <Link href={row.href} className={styles.recapEdit} aria-label={s.editLabel(row.key)}>
              {t.common.edit}
            </Link>
          </div>
        ))}
      </dl>
    </FlowPage>
  );
}
