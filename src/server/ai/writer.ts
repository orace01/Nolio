import {
  CommentResultSchema,
  OutlineSchema,
  ReviewSchema,
  WrittenChapterSchema,
  type CommentResult,
  type EbookContent,
  type Outline,
  type Review,
  type WrittenChapter,
} from "@/lib/app/model";
import type { z } from "zod";
import { env } from "../env";
import { LENGTH_PLAN, renderDossier, WRITING_RULES, type DossierContext } from "./dossier";
import { generateJson } from "./gemini";

/*
 * The writer: the outline (step 4), the writing (5), fitting the text to the
 * pages (6), the sentences that introduce the videos (7), the final check
 * (8) and the comments (9). Every call starts with the same instructions and
 * dossier, so the calls of one job share Gemini's cache.
 */

const ROLE = `You are the writer and editor of Nolio. Nolio turns an expert's idea into a practical, beautifully laid out ebook in PDF, with clickable videos and links. You write the final text of the ebook from the author's dossier below.`;

function ask<T>(
  schema: z.ZodType<T>,
  context: DossierContext,
  task: string,
  options?: { passes?: number; timeoutMs?: number },
): Promise<T> {
  return generateJson({
    schema,
    models: env.geminiWriterModels,
    system: `${ROLE}\n\n${WRITING_RULES}\n\nDossier:\n${renderDossier(context)}`,
    contents: task,
    ...options,
  });
}

/* Step 4: the outline shown on the validation screen */
export async function writeOutline(context: DossierContext): Promise<Outline> {
  const { draft } = context;
  const plan = LENGTH_PLAN[draft.length];
  const outline = await ask(
    OutlineSchema,
    context,
    `Plan the ebook.
- A working title (max 6 words) and subtitle (max 10 words) that are specific, never generic.
- ${plan.chapters} chapters for ${plan.pages} pages. The first chapter sets up the problem; the last one turns the method into action.
- For each chapter: title (max 9 words), short running head (max 3 words), an intro of one or two sentences (max 220 characters), 2 to 4 key points.
- Place every video of the dossier in the chapter it serves best (videoIds), at most one video per chapter, each video used once. Chapters without a video get an empty list.
- closingTitle: the heading of the last page, built from the call to action when there is one (max 5 words).`,
    // Called from the validation page: fail fast, the worker plans it again anyway
    { passes: 1, timeoutMs: 15_000 },
  );

  const videoIds = new Set(draft.media.filter((item) => item.kind === "video").map((item) => item.id));
  const used = new Set<string>();
  return {
    ...outline,
    chapters: outline.chapters.slice(0, 16).map((chapter) => ({
      ...chapter,
      points: chapter.points.slice(0, 4),
      videoIds: chapter.videoIds.filter((id) => videoIds.has(id) && !used.has(id) && used.add(id)).slice(0, 1),
    })),
  };
}

/* How much text a chapter may hold, from the page layout it will get */
export function chapterBudget(input: { twoPages: boolean; video: boolean; roomy: boolean }) {
  const paragraphs = input.twoPages ? (input.video ? 760 : 980) : 560;
  return { intro: 220, paragraphs: input.roomy ? paragraphs + 120 : paragraphs, checklist: 4 };
}

/* Step 5: one chapter, written to fit its pages */
export async function writeChapter(
  context: DossierContext,
  outline: Outline,
  index: number,
  budget: ReturnType<typeof chapterBudget>,
  video: { title: string } | null,
): Promise<WrittenChapter> {
  const chapter = outline.chapters[index];
  return ask(
    WrittenChapterSchema,
    context,
    `Outline of the ebook "${outline.title}":
${outline.chapters.map((item, i) => `${i + 1}. ${item.title}: ${item.points.join("; ")}`).join("\n")}

Write chapter ${index + 1}: "${chapter.title}".
Planned intro: ${chapter.intro}
Key points: ${chapter.points.join("; ")}

Constraints, because the text must fit the printed pages:
- intro: max ${budget.intro} characters.
- paragraphs: 1 to 4 paragraphs, ${budget.paragraphs} characters at most in total.
- checklist: 0 to ${budget.checklist} short actions the reader can tick (max 60 characters each), only if the chapter calls for action.
- box: an optional short "remember" or "tip" (boxTitle max 3 words, boxText max 160 characters); leave both empty if not useful. Do not use both a checklist of 4 items and a box.
- ${video ? `videoLead: one sentence (max 140 characters) that makes the reader want to watch the video "${video.title}".` : "videoLead: empty, this chapter has no video."}
Keep the title and running head of the outline unless they are clearly improvable.`,
  );
}

/* Step 6: bring a chapter back within its budget */
export async function shortenChapter(
  context: DossierContext,
  chapter: WrittenChapter,
  budget: ReturnType<typeof chapterBudget>,
): Promise<WrittenChapter> {
  return ask(
    WrittenChapterSchema,
    context,
    `This chapter is too long for its pages. Shorten it without losing its substance: intro max ${budget.intro} characters, paragraphs ${budget.paragraphs} characters at most in total, at most ${budget.checklist} checklist items. Keep the same voice, title and running head.

${JSON.stringify(chapter)}`,
  );
}

/* Step 8: the final check of the whole text */
export async function reviewEbook(context: DossierContext, content: EbookContent): Promise<Review> {
  const chapters = content.chapters.map((chapter, index) => ({
    chapter: index,
    title: chapter.title,
    intro: chapter.intro,
    paragraphs: chapter.paragraphs,
    checklist: chapter.checklist ?? [],
    boxText: chapter.box?.text ?? "",
    videoLead: chapter.videoLead ?? "",
  }));
  return ask(
    ReviewSchema,
    context,
    `Proofread the ebook "${content.title}" before delivery. Return only the fixes that matter:
- spelling, grammar, typography of the language (French: non-breaking spaces are handled by the layout, ignore them);
- a claim, figure or name that is not supported by the dossier (rewrite it without the invented detail);
- a contradiction with the dossier (audience, tone, form of address, goal);
- a repetition between chapters, or an em dash character (replace it).
Each fix replaces one field: for "paragraph" and "checklist", index is the position in the list; otherwise index is 0. Keep each replacement about the same length as the original. Return an empty list if the text is fine.

${JSON.stringify(chapters)}`,
  );
}

/* Step 9: apply one comment to the chapter it targets, or ask a question back */
export async function applyComment(
  context: DossierContext,
  input: {
    title: string;
    subtitle: string;
    chapter: WrittenChapter;
    target: string;
    comment: string;
    budget: ReturnType<typeof chapterBudget>;
  },
): Promise<CommentResult> {
  return ask(
    CommentResultSchema,
    context,
    `The author left a comment on their finished ebook "${input.title}" (subtitle: "${input.subtitle}").
Comment target: ${input.target}.
Comment: "${input.comment}"

Apply it by changing only what the comment is about, and return the full chapter below with the change (and the title and subtitle, changed only if the comment is about them).
Keep the chapter within: intro max ${input.budget.intro} characters, paragraphs ${input.budget.paragraphs} characters in total.
If the comment cannot be applied to the text (for example it asks for a new video address, a new photo or a change of design), or is too ambiguous, set outcome to "question", return everything unchanged, and write in reply a short, friendly question or explanation in the ebook's language. Otherwise set outcome to "applied" and write in reply one short sentence saying what you changed.

Chapter:
${JSON.stringify(input.chapter)}`,
  );
}
