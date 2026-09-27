import type { Locale } from "@/i18n/config";
import { AnalysisSchema, type Analysis } from "@/lib/app/model";
import { env } from "../env";
import { generateImage, generateJson } from "./gemini";

/*
 * Steps 1 and 2 of the flow: what Nolio understood from the idea, and what
 * the next questions propose. Also the generated images of the Pro plan.
 */

const ANALYSIS_PROMPT = `You are the editor of Nolio, a service that turns an expert's idea into a practical ebook in PDF, often with videos and links (guides, checklists, recipe booklets, course companions, lead magnets). Nolio does not write novels or long books.

Read the author's idea and return what you understood, in the language requested:
- type: the kind of ebook in a short phrase ("Un guide pratique en PDF"), and kind: one or two words for a library label ("Guide").
- subject: the topic in a few words. contents: what the pages will hold (videos, exercises, recipes...). goal: what the author wants from readers (discovery calls, sales, contacts, passing on a method...).
- summary: one sentence that states the ebook, for a recap screen.
- title and subtitle: a working title (max 6 words) and subtitle (max 10 words), concrete and not generic.
- open: 2 to 4 short points still to settle with the author.
- audiences: 3 reader profiles that fit this idea (id in lowercase ascii, name max 5 words, description one short sentence). Set fromIdea true only for profiles the idea explicitly mentions.
- recommendedLength: short (8-15 pages) for most lead magnets and checklists, medium (15-25) when the method has many parts, long (30-40) for courses.
- refused: true only if the idea is illegal, hateful, sexual, dangerous, or impossible to turn into a practical ebook; then explain briefly in refusalReason, otherwise leave it empty.
Never use the em dash character.`;

export async function analyzeIdea(input: { idea: string; lang: Locale; role: string | null }): Promise<Analysis> {
  const parsed = await generateJson({
    schema: AnalysisSchema,
    models: env.geminiModels,
    system: ANALYSIS_PROMPT,
    contents: [
      `Language of the answer: ${input.lang === "fr" ? "French" : "English"}.`,
      input.role ? `The author describes themself as: ${input.role}.` : "",
      "Idea:",
      input.idea,
    ]
      .filter(Boolean)
      .join("\n"),
    // Called from the page as the user types: fail fast, the stand-in takes over
    passes: 1,
    timeoutMs: 12_000,
  });
  return {
    ...parsed,
    audiences: parsed.audiences.slice(0, 4).map((audience, index) => ({
      ...audience,
      id: audience.id.replace(/[^a-z0-9-]/g, "").slice(0, 40) || `audience-${index + 1}`,
    })),
    open: parsed.open.slice(0, 4),
  };
}

const IMAGE_STYLES: Record<string, string> = {
  none: "clean editorial photograph, natural light",
  photos: "clean editorial photograph, natural light",
  icons: "minimal flat illustration with thin lines",
  line: "fine line drawing, single stroke weight, lots of white space",
  shapes: "flat geometric shapes, simple composition",
  custom: "",
};

/* One image in the ebook's illustration style */
export async function illustrate(input: { prompt: string; illustrations: string; brief: string; accent: string }) {
  const style = input.illustrations === "custom" ? input.brief : IMAGE_STYLES[input.illustrations];
  return generateImage(
    [
      input.prompt,
      `Style: ${style || IMAGE_STYLES.photos}.`,
      `Color accent close to ${input.accent}. No text, no letters, no logos, no watermark.`,
    ].join("\n"),
  );
}
