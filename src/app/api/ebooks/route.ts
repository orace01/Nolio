import { z } from "zod";
import { reviveDraft } from "@/lib/app/model";
import {
  checkQuota,
  EBOOK_COLUMNS,
  getProfile,
  langOf,
  listEbooks,
  lockedOptions,
  toEbook,
  type EbookRow,
} from "@/server/engine/data";
import { enqueue } from "@/server/engine/jobs";
import { handle, HttpError, readBody, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

export async function GET() {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    return { ebooks: await listEbooks(user.id) };
  });
}

const Body = z.object({ draft: z.record(z.string(), z.unknown()), lang: z.string().max(5) });

/* "Approve and create my ebook": the draft becomes a job for the worker */
export async function POST(request: Request) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const body = await readBody(request, Body);
    const draft = reviveDraft(body.draft);
    if (draft.idea.trim().length < 10) throw new HttpError(400, "idea_missing");

    const profile = await getProfile(user.id);
    const locked = lockedOptions(draft, profile.plan);
    if (locked.length) throw new HttpError(403, "plan_required", locked.join(", "));
    await checkQuota(user.id, profile.plan);

    const db = supabaseAdmin();
    // The saved draft is replaced by the ebook
    await db.from("ebooks").delete().eq("user_id", user.id).eq("status", "draft");
    const { data, error } = await db
      .from("ebooks")
      .insert({ user_id: user.id, status: "queued", lang: langOf(body.lang), dossier: draft })
      .select(EBOOK_COLUMNS)
      .single();
    if (error) throw error;
    await enqueue("create", data.id);
    return { ebook: toEbook(data as EbookRow) };
  });
}
