import { z } from "zod";
import { analyzeIdea } from "@/server/ai/analysis";
import { configured } from "@/server/env";
import { langOf } from "@/server/engine/data";
import { handle, HttpError, readBody, requireService, requireUser } from "@/server/http";

const Body = z.object({
  idea: z.string().max(4000),
  lang: z.string().max(5),
  role: z.string().max(120).nullable(),
});

/* Steps 1 and 2: Gemini reads the idea and prepares the next questions */
export async function POST(request: Request) {
  return handle(async () => {
    requireService(configured.gemini);
    await requireUser();
    const { idea, lang, role } = await readBody(request, Body);
    if (idea.trim().length < 10) throw new HttpError(400, "idea_too_short");
    return analyzeIdea({ idea: idea.trim(), lang: langOf(lang), role });
  });
}
