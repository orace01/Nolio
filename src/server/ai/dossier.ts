import type { Locale } from "@/i18n/config";
import { findById, LENGTHS, TONES } from "@/lib/app/catalog";
import { getAnalysis } from "@/lib/app/content";
import type { Draft } from "@/lib/app/model";

/* Everything the AI needs to know besides the answers of the flow */
export type DossierContext = {
  draft: Draft;
  lang: Locale;
  author: { name: string; role: string | null };
  brand: { bio: string; cta: string; link: string };
};

const LANGUAGES: Record<Locale, string> = { fr: "French", en: "English" };

/* Page ranges and chapter counts the outline must respect */
export const LENGTH_PLAN = {
  short: { pages: "8 to 15", chapters: "4 to 6" },
  medium: { pages: "15 to 25", chapters: "7 to 10" },
  long: { pages: "30 to 40", chapters: "12 to 16" },
} as const;

/*
 * The dossier as plain text, always rendered the same way for the same
 * answers, so the prompt prefix stays cacheable across the calls of a job.
 */
export function renderDossier({ draft, lang, author, brand }: DossierContext) {
  const analysis = getAnalysis(draft, lang);
  const audiences = [
    ...analysis.audiences.filter((item) => draft.audiences.includes(item.id)).map((item) => item.name),
    ...(draft.audiences.includes("other") && draft.audienceOther.trim() ? [draft.audienceOther.trim()] : []),
  ];
  const length = findById(LENGTHS, draft.length);
  const tone = findById(TONES, draft.tone);
  const videos = draft.media.filter((item) => item.kind === "video");
  const links = draft.media.filter((item) => item.kind === "link");
  const files = draft.media.filter((item) => item.kind === "file");

  const lines = [
    `Language of the ebook: ${LANGUAGES[lang]}.`,
    lang === "fr"
      ? `Address the reader with "${draft.address === "informal" ? "tu" : "vous"}".`
      : "Address the reader as \"you\".",
    `Author: ${author.name || "the author"}${author.role ? `, ${author.role}` : ""}.`,
    "",
    "The author's idea, in their words:",
    draft.idea.trim(),
    "",
    `Type: ${analysis.type}. Topic: ${analysis.subject}. Goal: ${analysis.goal}.`,
    `Readers: ${audiences.join("; ") || "not specified"}.`,
    `Length: ${length.name.en}, ${LENGTH_PLAN[draft.length].pages} pages, ${LENGTH_PLAN[draft.length].chapters} chapters.`,
    `Tone: ${tone.name.en}. Example of the voice: ${tone.sample[lang]}`,
  ];

  if (videos.length) {
    lines.push("", "Videos to place in the chapters (id, title, address):");
    videos.forEach((video) => lines.push(`- ${video.id}: ${video.title} (${video.url})`));
  }
  if (links.length) {
    lines.push("", `Call to action on the last page: ${links[0].title} (${links[0].url}).`);
    links.slice(1).forEach((link) => lines.push(`Resource listed on the last page: ${link.title} (${link.url}).`));
  } else if (brand.cta) {
    lines.push("", `Call to action on the last page: ${brand.cta}${brand.link ? ` (${brand.link})` : ""}.`);
  }
  if (files.length) lines.push(`Attached files, listed as resources: ${files.map((file) => file.title).join(", ")}.`);
  if (brand.bio) lines.push("", `About the author: ${brand.bio}`);

  return lines.join("\n");
}

export const WRITING_RULES = `Writing rules:
- Write like a real editor, never like generic AI content: concrete, specific, useful from the first line.
- Use the author's own method and words from the idea; do not invent credentials, statistics, studies, quotes or client names. A short illustrative example is fine if it stays plausible and modest.
- One idea per paragraph. Short sentences. No filler, no clichés, no hashtags, no emojis.
- Never use the em dash character. Use commas, colons or periods instead.
- Follow the language, the form of address and the tone of the dossier exactly.`;
