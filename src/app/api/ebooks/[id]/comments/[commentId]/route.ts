import { handle, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

/* A pending comment withdrawn by the author */
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const { id, commentId } = await params;
    await supabaseAdmin()
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("ebook_id", id)
      .eq("user_id", user.id)
      .eq("status", "pending");
  });
}
