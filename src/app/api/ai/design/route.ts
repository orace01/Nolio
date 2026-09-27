import { z } from "zod";
import { renderDossier } from "@/server/ai/dossier";
import { designTurn } from "@/server/ai/design";
import { DossierBody, dossierContext } from "@/server/context";
import { configured } from "@/server/env";
import { handle, HttpError, readBody, requireService, requireUser } from "@/server/http";
import { getProfile } from "@/server/engine/data";
import { canUse } from "@/lib/app/account";

const Body = DossierBody.extend({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().max(2000) }))
    .min(1)
    .max(40),
  brandColors: z.array(z.string().max(7)).max(6),
});

/* The design studio (Pro): one turn of the conversation with Gemini */
export async function POST(request: Request) {
  return handle(async () => {
    requireService(configured.gemini);
    const user = await requireUser();
    const body = await readBody(request, Body);
    if (configured.supabase && !canUse("pro", (await getProfile(user.id)).plan)) {
      throw new HttpError(403, "plan_required");
    }
    const context = await dossierContext(user, body);
    const brand = body.brandColors.length ? `\nBrand colors: ${body.brandColors.join(", ")}.` : "";
    return designTurn({
      lang: context.lang,
      messages: body.messages,
      context: renderDossier(context) + brand,
    });
  });
}
