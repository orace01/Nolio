import { getOwnedEbook } from "@/server/engine/data";
import { enqueue } from "@/server/engine/jobs";
import { handle, HttpError, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

/* A creation that failed three times, started again */
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const { id } = await params;
    const row = await getOwnedEbook(user.id, id);
    if (row.status !== "failed") throw new HttpError(409, "not_failed");
    await supabaseAdmin()
      .from("ebooks")
      .update({ status: "queued", error: null, progress: { step: 0, ratio: 0 } })
      .eq("id", id);
    await enqueue("create", id);
  });
}
