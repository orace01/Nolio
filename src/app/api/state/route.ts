import { configured } from "@/server/env";
import { brandOf, getProfile, listEbooks } from "@/server/engine/data";
import { handle, HttpError, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

/* Everything the app shows, loaded once when it opens */
export async function GET() {
  return handle(async () => {
    if (!configured.supabase) throw new HttpError(503, "not_configured");
    const user = await requireUser();
    const profile = await getProfile(user.id);
    const { data: draft } = await supabaseAdmin()
      .from("ebooks")
      .select("id, dossier")
      .eq("user_id", user.id)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      profile: {
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: user.email ?? "",
        role: profile.role,
        roleOther: profile.role_other,
      },
      plan: profile.plan,
      brand: brandOf(profile),
      draft: draft?.dossier ?? null,
      ebooks: await listEbooks(user.id),
    };
  });
}
