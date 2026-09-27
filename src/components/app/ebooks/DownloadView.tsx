"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { canUse } from "@/lib/app/account";
import type { Tier } from "@/lib/app/catalog";
import { usePlan, type Ebook } from "@/lib/app/store";
import { Cover } from "../ebook/Cover";
import { useEbookDocument } from "../ebook/document";
import button from "../ui/Button.module.css";
import { FlowPage } from "../ui/FlowPage";
import { useUpgrade } from "../ui/Premium";
import { Tag, TierTag } from "../ui/Tag";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import { EbookMissing } from "./EbookMissing";
import styles from "./ebooks.module.css";
import { useEbookRoute } from "./useEbookRoute";

type FormatId = "pdf" | "print" | "epub" | "social";

const FORMATS: { id: FormatId; tier: Tier; icon: ReactNode }[] = [
  { id: "pdf", tier: "basic", icon: <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 16h6" /> },
  { id: "print", tier: "premium", icon: <path d="M7 3v4M3 7h4M17 21v-4M21 17h-4M7 7h10v10H7z" /> },
  { id: "epub", tier: "pro", icon: <path d="M5 4h14v16H5zM9 8h6M9 12h6M9 16h3" /> },
  {
    id: "social",
    tier: "basic",
    icon: (
      <>
        <path d="M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6" />
        <circle cx="15.5" cy="9" r="1.5" />
      </>
    ),
  },
];

export function DownloadView() {
  const { hydrated, ebook } = useEbookRoute();
  if (!hydrated) return null;
  if (!ebook) return <EbookMissing />;
  return <Downloads ebook={ebook} />;
}

function Downloads({ ebook }: { ebook: Ebook }) {
  const { lang, t } = useAppText();
  const plan = usePlan();
  const upgrade = useUpgrade();
  const [notice, setNotice] = useState("");
  const doc = useEbookDocument(ebook.draft);
  const d = t.download;
  const { content, pagination } = doc;

  const count = (kind: "video" | "link") => ebook.draft.media.filter((item) => item.kind === kind).length;
  const printHref = (format: "pdf" | "print") => `/${lang}/app/print/${ebook.id}${format === "print" ? "?for=print" : ""}`;

  return (
    <FlowPage
      wide
      kicker={d.kicker}
      question={d.question}
      back={{ href: `/${lang}/app/ebooks/${ebook.id}`, label: t.common.back }}
      primary={
        <Link href={`/${lang}/app`} className={button.primary}>
          {d.library}
        </Link>
      }
    >
      <div className={styles.download}>
        <div>
          <Cover
            style={doc.style}
            look={doc.look}
            title={content.title}
            author={doc.author}
            series={content.kind}
            image={ebook.draft.images[0]}
            logo={doc.brand.logo}
            number={content.chapters.length}
            className={styles.downloadCover}
          />
          <p className={`${ui.hint} ${styles.meta}`}>
            {d.meta(
              t.common.pages(pagination.pages.length),
              t.common.videos(count("video")),
              t.common.links(count("link")),
            )}
          </p>
        </div>

        <div>
          {FORMATS.map((format) => {
            const { name, text } = d.formats[format.id];
            const unlocked = canUse(format.tier, plan);
            let action: ReactNode;
            if (!unlocked) {
              action = (
                <button
                  type="button"
                  className={`${button.secondary} ${button.small}`}
                  onClick={() =>
                    upgrade({ name, kind: "format", tier: format.tier === "pro" ? "pro" : "premium" })
                  }
                >
                  {d.unlock}
                </button>
              );
            } else if (format.id === "pdf" || format.id === "print") {
              action = (
                <a
                  href={printHref(format.id)}
                  target="_blank"
                  rel="noreferrer"
                  className={`${format.id === "pdf" ? button.primary : button.secondary} ${button.small}`}
                >
                  {d.get}
                </a>
              );
            } else {
              // TODO: generate these files on the server
              action = (
                <button
                  type="button"
                  className={`${button.secondary} ${button.small}`}
                  onClick={() => setNotice(d.later)}
                >
                  {d.get}
                </button>
              );
            }

            return (
              <div key={format.id} className={styles.format}>
                <svg className={`${ui.icon} ${styles.formatIcon}`} viewBox="0 0 24 24" aria-hidden="true">
                  {format.icon}
                </svg>
                <div>
                  <p className={styles.formatName}>
                    {name} {format.id === "pdf" && <Tag variant="quiet">{d.recommended}</Tag>}
                  </p>
                  <p className={styles.formatText}>{text}</p>
                </div>
                {format.tier === "basic" ? <Tag variant="quiet">{d.free}</Tag> : <TierTag tier={format.tier} />}
                {action}
              </div>
            );
          })}
          <p className={`${ui.hint} ${styles.notice}`} role="status">
            {notice}
          </p>
          {plan === "free" && <p className={ui.hint}>{d.credit}</p>}
        </div>
      </div>
    </FlowPage>
  );
}
