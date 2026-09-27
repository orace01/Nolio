/*
 * The data of an ebook, shared by the browser and the server: the answers of
 * the creation flow (the "dossier"), what the AI adds to it at each step, and
 * the finished ebook. The zod schemas describe what each AI must return; the
 * server validates every answer against them before saving it.
 */

import { z } from "zod";
import {
  DEFAULT_CUSTOM_THEME,
  type CustomTheme,
  type IllustrationId,
  type LengthId,
  type Margins,
  type StyleId,
  type ThemeChoice,
  type ToneId,
} from "./catalog";

export type MediaItem = {
  id: string;
  kind: "video" | "link" | "file";
  title: string;
  url: string;
};

/* ---------- What the AI returns ---------- */

/* Lengths and counts are asked for in the prompts and enforced after
   parsing: not every provider accepts those constraints in a schema */
const text = z.string;

/* Step 1 and 2 (Gemini): what Nolio understood from the idea */
export const AnalysisSchema = z.object({
  /* The idea cannot become an ebook (forbidden or unrelated content) */
  refused: z.boolean(),
  refusalReason: text(),
  type: text(),
  kind: text(),
  subject: text(),
  contents: text(),
  goal: text(),
  summary: text(),
  title: text(),
  subtitle: text(),
  /* What still needs the user's answer */
  open: z.array(text()),
  audiences: z
    .array(
      z.object({
        id: text(),
        name: text(),
        description: text(),
        fromIdea: z.boolean(),
      }),
    ),
  recommendedLength: z.enum(["short", "medium", "long"]),
});

export type Analysis = z.infer<typeof AnalysisSchema>;
export type AudienceSuggestion = Analysis["audiences"][number];

/* Step 4 (Gemini): the planned outline */
export const OutlineSchema = z.object({
  title: text(),
  subtitle: text(),
  chapters: z
    .array(
      z.object({
        title: text(),
        short: text(),
        intro: text(),
        points: z.array(text()),
        /* Ids of the videos from the dossier shown in this chapter */
        videoIds: z.array(text()),
      }),
    ),
  closingTitle: text(),
});

export type Outline = z.infer<typeof OutlineSchema>;

/* Step 5 (Gemini): one written chapter */
export const WrittenChapterSchema = z.object({
  title: text(),
  short: text(),
  intro: text(),
  paragraphs: z.array(text()),
  /* Empty when the chapter has no list */
  checklist: z.array(text()),
  /* Empty strings when the chapter has no box */
  boxTitle: text(),
  boxText: text(),
  /* One sentence before the video, empty without a video */
  videoLead: text(),
});

export type WrittenChapter = z.infer<typeof WrittenChapterSchema>;

/* Step 8 (Gemini): corrections found by the final check */
export const ReviewSchema = z.object({
  fixes: z
    .array(
      z.object({
        chapter: z.number().int(),
        field: z.enum(["title", "intro", "paragraph", "checklist", "boxText", "videoLead"]),
        index: z.number().int(),
        replacement: text(),
      }),
    ),
});

export type Review = z.infer<typeof ReviewSchema>;

/* Step 9 (Gemini): a comment applied to its chapter, or a question back */
export const CommentResultSchema = z.object({
  outcome: z.enum(["applied", "question"]),
  reply: text(),
  title: text(),
  subtitle: text(),
  chapter: WrittenChapterSchema,
});

export type CommentResult = z.infer<typeof CommentResultSchema>;

/* Custom design (Gemini): one proposal of the design studio */
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const fontKey = z.enum(["montserrat", "sourceSerif", "fraunces", "inter", "playfair", "lato", "dmSerif", "dmSans"]);

export const DesignProposalSchema = z.object({
  name: text(),
  description: text(),
  base: z.enum(["monograph", "botanica", "notes", "studio", "editorial", "gallery"]),
  accent: hex,
  soft: hex,
  paper: hex,
  titleFont: fontKey,
  bodyFont: fontKey,
  titleUppercase: z.boolean(),
  margins: z.enum(["narrow", "normal", "wide"]),
  illustrations: z.enum(["none", "photos", "icons", "line", "shapes", "custom"]),
});

export type DesignProposal = z.infer<typeof DesignProposalSchema>;

export const DesignTurnSchema = z.object({
  reply: text(),
  proposals: z.array(DesignProposalSchema),
});

export type DesignTurn = z.infer<typeof DesignTurnSchema>;

export type ChatMessage = { role: "user" | "assistant"; text: string };

/* ---------- The dossier: every answer of the creation flow ---------- */

export type Draft = {
  idea: string;
  /* The idea as it was last analyzed, so the analysis only replays after a change */
  analyzed: string;
  analysis: Analysis | null;
  audiences: string[];
  audienceOther: string;
  media: MediaItem[];
  length: LengthId;
  style: StyleId;
  /* "Create my style" (Pro): the layout, colors and fonts designed with the AI */
  ownStyle: boolean;
  margins: Margins;
  theme: ThemeChoice;
  customTheme: CustomTheme;
  designChat: ChatMessage[];
  designProposals: DesignProposal[];
  tone: ToneId;
  address: "formal" | "informal";
  illustrations: IllustrationId;
  illustrationBrief: string;
  /* Imported photos: URLs once uploaded, data URLs in the demo */
  images: string[];
  aiPrompt: string;
  /* Generated images: URLs, or "drawing:n" stand-ins in the demo */
  aiImages: string[];
  /* The outline and the answers it was built from, to rebuild it after a change */
  outline: Outline | null;
  outlineKey: string;
  /* The last creation step visited, where "Resume" leads */
  lastStep: string;
};

export const DEFAULT_DRAFT: Draft = {
  idea: "",
  analyzed: "",
  analysis: null,
  audiences: [],
  audienceOther: "",
  media: [],
  length: "short",
  style: "monograph",
  ownStyle: false,
  margins: "normal",
  theme: "forest",
  customTheme: DEFAULT_CUSTOM_THEME,
  designChat: [],
  designProposals: [],
  tone: "direct",
  address: "formal",
  illustrations: "icons",
  illustrationBrief: "",
  images: [],
  aiPrompt: "",
  aiImages: [],
  outline: null,
  outlineKey: "",
  lastStep: "",
};

/* A stored draft from an older version of the app: fill what is missing */
export function reviveDraft(raw: unknown): Draft {
  const value = raw && typeof raw === "object" ? (raw as Partial<Draft>) : {};
  return {
    ...DEFAULT_DRAFT,
    ...value,
    aiImages: Array.isArray(value.aiImages) ? value.aiImages : [],
    customTheme: { ...DEFAULT_CUSTOM_THEME, ...(value.customTheme ?? {}) },
  };
}

/* The answers the outline depends on: when they change, the outline is rebuilt */
export function outlineKey(draft: Draft, lang: string) {
  return JSON.stringify([
    lang,
    draft.idea.trim(),
    [...draft.audiences].sort(),
    draft.audienceOther.trim(),
    draft.media.map((item) => [item.id, item.kind, item.title]),
    draft.length,
    draft.tone,
    draft.address,
  ]);
}

/* ---------- The finished ebook ---------- */

export type Chapter = {
  title: string;
  /* Running head of the chapter's pages */
  short: string;
  intro: string;
  paragraphs: string[];
  checklist?: string[];
  box?: { title: string; text: string };
  video?: MediaItem;
  videoLead?: string;
};

export type EbookContent = {
  title: string;
  subtitle: string;
  kind: string;
  sample: boolean;
  chapters: Chapter[];
  cta: { label: string; url: string } | null;
  /* Links and files listed on the last page, besides the call to action */
  resources: MediaItem[];
};

export type CommentStatus = "pending" | "applying" | "applied" | "question";

export type EbookComment = {
  id: string;
  page: number;
  /* The passage clicked on the page, or null for the whole page */
  part: string | null;
  text: string;
  /* Demo: set when the fixes are requested, done once it is past */
  appliedAt: number | null;
  /* Server: the state of the fix, and the AI's question when it needs one */
  status?: CommentStatus;
  reply?: string;
};

export type EbookStatus = "queued" | "working" | "ready" | "failed";

export type EbookFiles = { pdf?: string; print?: string; epub?: string; cover?: string };

export type Ebook = {
  id: string;
  createdAt: number;
  /* Demo: creation is simulated and counts as ready from this moment */
  readyAt: number;
  draft: Draft;
  comments: EbookComment[];
  lang?: string;
  /* Server only */
  status?: EbookStatus;
  /* Current task (0 to 3) and overall progress (0 to 1) */
  progress?: { step: number; ratio: number };
  content?: EbookContent | null;
  files?: EbookFiles;
  error?: string | null;
};

export function isEbookReady(ebook: Ebook, now: number) {
  return ebook.status ? ebook.status === "ready" : now !== 0 && now >= ebook.readyAt;
}
