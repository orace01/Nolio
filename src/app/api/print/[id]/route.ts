import { NextResponse } from "next/server";
import { canUse } from "@/lib/app/account";
import { brandOf, EBOOK_COLUMNS, getProfile, toEbook, type EbookRow } from "@/server/engine/data";
import { checkPrintToken } from "@/server/engine/export";
import { handle, HttpError, requireAccounts } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

/* The ebook for the worker's print page, opened with a signed link instead of a session */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireAccounts();
    const { id } = await params;
    const token = new URL(request.url).searchParams.get("token") ?? "";
    if (!checkPrintToken(id, token)) throw new HttpError(401, "invalid_token");
    const { data } = await supabaseAdmin().from("ebooks").select(EBOOK_COLUMNS).eq("id", id).maybeSingle();
    if (!data) throw new HttpError(404, "not_found");
    const row = data as EbookRow;
    const profile = await getProfile(row.user_id);
    return NextResponse.json(
      {
        ebook: toEbook(row),
        author: `${profile.first_name} ${profile.last_name}`.trim(),
        brand: brandOf(profile),
        credit: !canUse("premium", profile.plan),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  });
}
