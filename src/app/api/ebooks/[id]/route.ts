import { getOwnedEbook, toEbook, type CommentRow } from "@/server/engine/data";
import { handle, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const { id } = await params;
    const row = await getOwnedEbook(user.id, id);
    const { data } = await supabaseAdmin().from("comments").select("*").eq("ebook_id", id).order("created_at");
    return { ebook: toEbook(row, (data ?? []) as CommentRow[]) };
  });
}

export async function DELETE(_: Request, { params }: Context) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const { id } = await params;
    await getOwnedEbook(user.id, id);
    const db = supabaseAdmin();
    const { data: files } = await db.storage.from("exports").list(`${user.id}/${id}`);
    if (files?.length) await db.storage.from("exports").remove(files.map((file) => `${user.id}/${id}/${file.name}`));
    await db.from("ebooks").delete().eq("id", id);
  });
}
