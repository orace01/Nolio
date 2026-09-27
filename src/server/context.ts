import { z } from "zod";
import type { Locale } from "@/i18n/config";
import { reviveDraft, type Draft } from "@/lib/app/model";
import type { DossierContext } from "./ai/dossier";
import { contextFor, getProfile, langOf } from "./engine/data";
import { configured } from "./env";
import type { ApiUser } from "./http";

/* What the AI routes receive: the dossier as the browser has it right now */
export const DossierBody = z.object({
  draft: z.record(z.string(), z.unknown()),
  lang: z.string().max(5),
  /* Demo mode only (no accounts): who the author is */
  author: z.object({ name: z.string().max(160), role: z.string().max(120).nullable() }).optional(),
  brand: z.object({ bio: z.string().max(600), cta: z.string().max(120), link: z.string().max(500) }).optional(),
});

export async function dossierContext(
  user: ApiUser,
  body: z.infer<typeof DossierBody>,
): Promise<DossierContext & { draft: Draft; lang: Locale }> {
  const draft = reviveDraft(body.draft);
  const lang = langOf(body.lang);
  if (configured.supabase) return contextFor(await getProfile(user.id), draft, lang);
  return {
    draft,
    lang,
    author: body.author ?? { name: "", role: null },
    brand: body.brand ?? { bio: "", cta: "", link: "" },
  };
}
