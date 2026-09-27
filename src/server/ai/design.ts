import type { Locale } from "@/i18n/config";
import { DesignTurnSchema, type ChatMessage, type DesignTurn } from "@/lib/app/model";
import { env } from "../env";
import { generateJson } from "./gemini";

/*
 * The design studio of the Pro plan. The user describes the look they want,
 * Gemini asks what it needs, then proposes complete designs made of the
 * layouts, fonts and illustration styles Nolio can render.
 */

const SYSTEM = `You are the art director of Nolio, a service that designs practical ebooks in PDF. You help one author create a personal design for their ebook, by conversation.

How to lead the conversation:
- First understand: the feeling they want, their audience, colors they like or must use (brand colors), references. Ask one or two short questions at a time, never a long list.
- As soon as you know enough (usually after one or two answers), propose 2 or 3 complete designs, each with a clear personality. Then refine the one they prefer.
- Keep replies short and warm, in the author's language. Never use the em dash character. No emojis.

What a design is made of (only these values can be rendered):
- base: the page layout: monograph (pure typography, strict grid), botanica (photographic, calm), notes (light pages to annotate), studio (color blocks, giant numbers), editorial (classic serif, magazine), gallery (consistent line illustrations).
- accent: main color; soft: a light tint that goes with it; paper: the page background, very light (close to white or cream). Hex colors like #2a3f34. Text must stay readable on paper, and white text must stay readable on accent.
- titleFont and bodyFont among: montserrat (geometric sans), sourceSerif (reading serif), fraunces (soft display serif), inter (neutral sans), playfair (elegant high-contrast serif), lato (friendly sans), dmSerif (display serif, one weight), dmSans (clean sans). Pair a display font for titles with a readable one for text.
- titleUppercase: true for assertive, structured looks.
- margins: narrow, normal or wide.
- illustrations: none, photos, icons, line, shapes, or custom.

Return proposals only when you actually propose or update designs; otherwise return an empty list.`;

/* "abc" or "#ABC" become "#aabbcc", so a slightly off color does not fail the turn */
function normalizeColors(raw: unknown) {
  if (!raw || typeof raw !== "object") return raw;
  const turn = raw as { proposals?: Record<string, unknown>[] };
  for (const proposal of turn.proposals ?? []) {
    for (const key of ["accent", "soft", "paper"]) {
      const value = String(proposal[key] ?? "").trim().replace(/^#?/, "").toLowerCase();
      proposal[key] = `#${value.length === 3 ? [...value].map((c) => c + c).join("") : value}`;
    }
  }
  return raw;
}

export async function designTurn(input: {
  lang: Locale;
  messages: ChatMessage[];
  context: string;
}): Promise<DesignTurn> {
  const turn = await generateJson({
    schema: DesignTurnSchema,
    models: env.geminiModels,
    system: `${SYSTEM}\n\nAnswer in ${input.lang === "fr" ? "French" : "English"}.\n\nAbout the ebook:\n${input.context}`,
    contents: input.messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.text }],
    })),
    prepare: normalizeColors,
    // A live conversation: fail fast so "no answer, please resend" shows quickly
    passes: 1,
    timeoutMs: 15_000,
  });
  return { reply: turn.reply, proposals: turn.proposals.slice(0, 3) };
}
