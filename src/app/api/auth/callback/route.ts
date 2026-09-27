import { NextResponse } from "next/server";
import { supabaseServer } from "@/server/supabase";

/* Links from the account emails (confirmation, new password) land here */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";
  // Only paths of this site, never another address
  const target = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  if (code) {
    const supabase = await supabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(target, url.origin));
}
