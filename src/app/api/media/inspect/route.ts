import { z } from "zod";
import { videoSource } from "@/lib/app/content";
import { videoTitle } from "@/server/engine/media";
import { handle, readBody, requireUser } from "@/server/http";

const Body = z.object({ url: z.string().url().max(2000) });

/* Step 2, videos and links: the platform and the title of a pasted video */
export async function POST(request: Request) {
  return handle(async () => {
    await requireUser();
    const { url } = await readBody(request, Body);
    const source = videoSource(url);
    return { source, title: source ? await videoTitle(url) : null };
  });
}
