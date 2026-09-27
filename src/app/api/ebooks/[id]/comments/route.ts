import { z } from "zod";
import { getOwnedEbook, toComment, type CommentRow } from "@/server/engine/data";
import { handle, readBody, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

const Body = z.object({
  page: z.number().int().min(1).max(500),
  part: z.string().max(20).nullable(),
  text: z.string().min(1).max(1000),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const { id } = await params;
    await getOwnedEbook(user.id, id);
    const body = await readBody(request, Body);
    const { data, error } = await supabaseAdmin()
      .from("comments")
      .insert({ ebook_id: id, user_id: user.id, page: body.page, part: body.part, text: body.text.trim() })
      .select("*")
      .single();
    if (error) throw error;
    return { comment: toComment(data as CommentRow) };
  });
}
