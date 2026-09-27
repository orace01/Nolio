"use client";

import { useMemo, type CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import { FONT_VARIABLES, resolveLook, TITLE_WEIGHTS, type Look, type Margins, type StyleId } from "@/lib/app/catalog";
import { buildEbook, paginate, type EbookContent, type Pagination } from "@/lib/app/content";
import { useBrand, usePlan, useProfile, type Brand, type Draft } from "@/lib/app/store";
import { useLang } from "../useAppText";

/* Everything needed to draw an ebook: its content, its pages and its look */
export type EbookDocument = {
  lang: Locale;
  draft: Draft;
  content: EbookContent;
  pagination: Pagination;
  style: StyleId;
  look: Look;
  margins: Margins;
  author: string;
  brand: Brand;
  /* Free plan: "Made with Nolio" on the last page */
  credit: boolean;
};

/* What the print page receives from the server instead of the local stores */
export type DocumentOverrides = {
  content?: EbookContent | null;
  author?: string;
  brand?: Brand;
  credit?: boolean;
};

export function useEbookDocument(draft: Draft, overrides: DocumentOverrides = {}): EbookDocument {
  const lang = useLang();
  const localBrand = useBrand();
  const profile = useProfile();
  const plan = usePlan();
  const brand = overrides.brand ?? localBrand;
  const author = overrides.author ?? `${profile.firstName} ${profile.lastName}`.trim();
  const credit = overrides.credit ?? plan === "free";
  const written = overrides.content;

  return useMemo(() => {
    // The text written by the AI once the ebook exists, else the preview built from the dossier
    const content = written ?? buildEbook(draft, lang, brand);
    return {
      lang,
      draft,
      content,
      pagination: paginate(content, draft),
      style: draft.style,
      look: resolveLook(draft.theme, draft.customTheme),
      margins: draft.ownStyle ? draft.margins : "normal",
      author,
      brand,
      credit,
    };
  }, [draft, lang, brand, author, credit, written]);
}

/* The theme as CSS custom properties, read by covers and pages */
export function lookStyle(look: Look): CSSProperties {
  return {
    "--accent": look.accent,
    "--soft": look.soft,
    "--paper": look.paper,
    "--title-font": FONT_VARIABLES[look.titleFont],
    "--body-font": FONT_VARIABLES[look.bodyFont],
    "--title-weight": TITLE_WEIGHTS[look.titleFont],
    "--title-case": look.titleUppercase ? "uppercase" : "none",
  } as CSSProperties;
}
