import { outlineKey } from "@/lib/app/model";
import { writeOutline } from "@/server/ai/writer";
import { DossierBody, dossierContext } from "@/server/context";
import { configured } from "@/server/env";
import { handle, readBody, requireService, requireUser } from "@/server/http";

/* Step 4: Gemini plans the outline shown on the validation screen */
export async function POST(request: Request) {
  return handle(async () => {
    requireService(configured.gemini);
    const user = await requireUser();
    const context = await dossierContext(user, await readBody(request, DossierBody));
    const outline = await writeOutline(context);
    return { outline, key: outlineKey(context.draft, context.lang) };
  });
}
