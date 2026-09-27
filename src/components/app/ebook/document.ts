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

export function useEbookDocument(draft: Draft): EbookDocument {
  const lang = useLang();
  const brand = useBrand();
  const profile = useProfile();
  const plan = usePlan();

  return useMemo(() => {
    const content = buildEbook(draft, lang, brand);
    return {
      lang,
      draft,
      content,
      pagination: paginate(content, draft),
      style: draft.style,
      look: resolveLook(draft.theme, draft.customTheme),
      margins: draft.ownStyle ? draft.margins : "normal",
      author: `${profile.firstName} ${profile.lastName}`.trim(),
      brand,
      credit: plan === "free",
    };
  }, [draft, lang, brand, profile.firstName, profile.lastName, plan]);
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
