import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { configured } from "./env";
import { currentUser } from "./supabase";

export type ApiUser = { id: string; email: string | null };

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message?: string,
  ) {
    super(message ?? code);
  }
}

/*
 * The signed-in user. Without Supabase (demo), the AI routes stay usable in
 * development only, so a local key can be tried before accounts exist.
 */
export async function requireUser(): Promise<ApiUser> {
  if (!configured.supabase) {
    if (process.env.NODE_ENV === "development") return { id: "demo", email: null };
    throw new HttpError(503, "not_configured");
  }
  const user = await currentUser();
  if (!user) throw new HttpError(401, "unauthorized");
  return { id: user.id, email: user.email ?? null };
}

export function requireService(ready: boolean) {
  if (!ready) throw new HttpError(503, "not_configured");
}

export function requireAccounts() {
  if (!configured.supabase) throw new HttpError(503, "not_configured");
}

export async function readBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new HttpError(400, "invalid_json");
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new HttpError(400, "invalid_body", parsed.error.message);
  return parsed.data;
}

/* Runs a route handler and turns errors into JSON answers */
export async function handle(run: () => Promise<unknown>) {
  try {
    const result = await run();
    return result instanceof Response ? result : NextResponse.json(result ?? { ok: true });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    }
    // An AI provider refused: busy or out of credit, or another failure
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") {
      console.error("AI provider error", status, error instanceof Error ? error.message : error);
      const busy = status === 429 || status === 503 || status === 504 || status === 529;
      return NextResponse.json({ error: busy ? "ai_busy" : "ai_error" }, { status: busy ? 503 : 502 });
    }
    console.error(error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
