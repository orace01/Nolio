import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import WebSocket from "ws";
import { configured, env } from "./env";

/*
 * Nolio never uses Supabase Realtime, but the client still builds a
 * RealtimeClient at construction time and throws immediately if no
 * WebSocket constructor exists globally - true on Node 20 (added as a
 * global only in Node 22). Passing the `ws` package's constructor avoids
 * the crash without ever opening a socket.
 */
const realtime = { transport: WebSocket as unknown as typeof globalThis.WebSocket };

/* The signed-in user's client, reading the session from the cookies */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(env.supabaseUrl!, env.supabaseKey!, {
    realtime,
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: the proxy refreshes the session instead
        }
      },
    },
  });
}

let admin: SupabaseClient | undefined;

/* Full access, for the API after it checked the user, and for the worker */
export function supabaseAdmin() {
  admin ??= createClient(env.supabaseUrl!, env.supabaseSecret!, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime,
  });
  return admin;
}

export async function currentUser() {
  if (!configured.supabase) return null;
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
