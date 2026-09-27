import { z } from "zod";
import { reviveDraft } from "@/lib/app/model";
import { handle, readBody, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

/*
 * The ebook in progress, saved after each answer of the flow: the server
 * keeps one draft per account, which the AI steps read from.
 */

const Body = z.object({ draft: z.record(z.string(), z.unknown()), lang: z.string().max(5) });

async function currentDraftId(userId: string) {
  const { data } = await supabaseAdmin()
    .from("ebooks")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "draft")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.id as string | undefined;
}

export async function PUT(request: Request) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const { draft, lang } = await readBody(request, Body);
    const dossier = reviveDraft(draft);
    const db = supabaseAdmin();
    const id = await currentDraftId(user.id);
    const now = new Date().toISOString();
    if (id) {
      await db.from("ebooks").update({ dossier, lang, updated_at: now }).eq("id", id);
      return { id };
    }
    const { data, error } = await db
      .from("ebooks")
      .insert({ user_id: user.id, status: "draft", dossier, lang })
      .select("id")
      .single();
    if (error) throw error;
    return { id: data.id };
  });
}

export async function DELETE() {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    await supabaseAdmin().from("ebooks").delete().eq("user_id", user.id).eq("status", "draft");
  });
}
