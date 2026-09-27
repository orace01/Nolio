"use client";

import { createBrowserClient } from "@supabase/ssr";

/* The browser's Supabase client, for signing in and out */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
