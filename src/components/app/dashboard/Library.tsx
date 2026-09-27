"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/i18n/format";
import { PLAN_EBOOKS, usedQuota } from "@/lib/app/account";
import {
  deleteEbook,
  resetDraft,
  useDraft,
  useEbooks,
  useHydrated,
  useNow,
  usePlan,
  useProfile,
  type Draft,
  type Ebook,
} from "@/lib/app/store";
import { isEbookReady } from "@/lib/app/model";
import { Cover } from "../ebook/Cover";
import { useEbookDocument, type EbookDocument } from "../ebook/document";
import button from "../ui/Button.module.css";
import { Tag } from "../ui/Tag";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./dashboard.module.css";

function BookCover({ doc }: { doc: EbookDocument }) {
  return (
    <Cover
      style={doc.style}
      look={doc.look}
      title={doc.content.title}
      author={doc.author}
      series={doc.content.kind}
      image={doc.draft.images[0]}
      logo={doc.brand.logo}
      number={doc.content.chapters.length}
      sizes="(max-width: 1400px) 22vw, 300px"
    />
  );
}

/* Asks once more before something is deleted for good */
function ConfirmDelete({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const { t } = useAppText();
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button
        type="button"
        className={`${button.text} ${button.quiet}`}
        aria-label={t.library.removeLabel(label)}
        onClick={() => setAsking(true)}
      >
        {t.library.remove}
      </button>
    );
  }

  return (
    <div className={styles.confirm} role="group" aria-label={t.library.removeLabel(label)}>
      <p className={ui.small}>{t.library.confirm}</p>
      <div className={styles.bookActions}>
        <button type="button" className={button.text} onClick={onConfirm}>
          {t.library.confirmYes}
        </button>
        <button type="button" className={`${button.text} ${button.quiet}`} onClick={() => setAsking(false)}>
          {t.library.confirmNo}
        </button>
      </div>
    </div>
  );
}

function EbookCard({ ebook, now }: { ebook: Ebook; now: number }) {
  const { lang, t } = useAppText();
  const doc = useEbookDocument(ebook.draft, { content: ebook.content });
  const ready = isEbookReady(ebook, now);
  const failed = ebook.status === "failed";
  const base = `/${lang}/app/ebooks/${ebook.id}`;
  const videos = ebook.draft.media.filter((item) => item.kind === "video").length;
  const { title, kind } = doc.content;

  return (
    <article className={styles.book}>
      <Link href={ready ? base : `${base}/creating`} className={styles.bookLink}>
        <BookCover doc={doc} />
        <span className={styles.meta}>
          <span className={styles.name}>{title}</span>
          <Tag variant={ready ? "outline" : "quiet"}>
            {ready ? t.library.status.ready : failed ? t.library.status.failed : t.library.status.creating}
          </Tag>
        </span>
      </Link>
      <p className={ui.hint} style={{ marginTop: 4 }}>
        {[kind, t.common.pages(doc.pagination.pages.length), videos > 0 && t.common.videos(videos)]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <p className={ui.hint}>{t.library.created(formatDate(lang, ebook.createdAt))}</p>
      <div className={styles.bookActions}>
        <ConfirmDelete label={title} onConfirm={() => deleteEbook(ebook.id)} />
      </div>
    </article>
  );
}

function DraftCard({ draft }: { draft: Draft }) {
  const { lang, t } = useAppText();
  const doc = useEbookDocument(draft);
  const step = draft.lastStep || "idea";

  return (
    <article className={styles.book}>
      <Link href={`/${lang}/app/new/${step}`} className={styles.bookLink}>
        <BookCover doc={doc} />
        <span className={styles.meta}>
          <span className={styles.name}>{doc.content.title}</span>
          <Tag variant="quiet">{t.library.status.draft}</Tag>
        </span>
      </Link>
      <div className={styles.bookActions}>
        <Link href={`/${lang}/app/new/${step}`} className={button.text}>
          {t.library.resume}
        </Link>
        <ConfirmDelete label={doc.content.title} onConfirm={resetDraft} />
      </div>
    </article>
  );
}

export function Library() {
  const { lang, t } = useAppText();
  const hydrated = useHydrated();
  const ebooks = useEbooks();
  const draft = useDraft();
  const plan = usePlan();
  const profile = useProfile();
  const now = useNow();
  const l = t.library;

  const used = usedQuota(ebooks, plan, now);
  const limit = PLAN_EBOOKS[plan];
  const full = used >= limit;
  const hasDraft = draft.idea.trim() !== "";

  return (
    <div className={styles.content}>
      <div className={styles.head}>
        <div>
          <p className={ui.kicker}>{l.kicker(profile.firstName)}</p>
          <h1 className={ui.h1}>{l.title}</h1>
        </div>
        <div className={styles.usage}>
          <div>
            <p className={ui.label}>{t.common.planLabels[plan]}</p>
            <span className={`${ui.bar} ${styles.usageBar}`}>
              <span className={ui.barFill} style={{ width: `${Math.min(1, used / limit) * 100}%` }} />
            </span>
            <p className={ui.hint}>
              {l.usage(used, limit)}
              {plan !== "free" && ` ${l.usageMonth}`}
            </p>
          </div>
          <Link href={`/${lang}/app/account/plan`} className={button.secondary}>
            {l.plans}
          </Link>
        </div>
      </div>

      {hydrated && (
        <ul className={styles.shelf}>
          {hasDraft && (
            <li>
              <DraftCard draft={draft} />
            </li>
          )}
          {ebooks.map((ebook) => (
            <li key={ebook.id}>
              <EbookCard ebook={ebook} now={now} />
            </li>
          ))}
          {!hasDraft && (
            <li>
              <Link
                href={full ? `/${lang}/app/account/plan` : `/${lang}/app/new`}
                className={styles.new}
                onClick={full ? undefined : () => resetDraft()}
              >
                <svg className={`${ui.icon} ${styles.plus}`} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className={ui.label}>{ebooks.length === 0 ? l.first : l.new}</span>
                <span className={ui.hint}>{full ? l.limit[plan] : l.newHint}</span>
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
