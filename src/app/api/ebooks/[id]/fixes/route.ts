import { getOwnedEbook } from "@/server/engine/data";
import { enqueue } from "@/server/engine/jobs";
import { handle, HttpError, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

/* "Apply the fixes": pending comments go to the worker */
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const { id } = await params;
    const row = await getOwnedEbook(user.id, id);
    if (row.status !== "ready") throw new HttpError(409, "not_ready");
    const { data } = await supabaseAdmin()
      .from("comments")
      .update({ status: "applying" })
      .eq("ebook_id", id)
      .eq("status", "pending")
      .select("id");
    if (!data?.length) throw new HttpError(409, "nothing_to_apply");
    await enqueue("fixes", id);
  });
}
