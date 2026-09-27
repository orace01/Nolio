"use client";

/*
 * How the app reaches the server. The runtime says what is configured:
 * with accounts ("remote"), every answer is saved to the server; with a
 * Gemini key, the AI replaces the stand-ins. Anything missing falls back to
 * the demo behavior.
 */

export type Runtime = {
  remote: boolean;
  ai: { gemini: boolean };
};

let runtime: Runtime = { remote: false, ai: { gemini: false } };

export function setRuntime(value: Runtime) {
  runtime = value;
}

export function getRuntime() {
  return runtime;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

export async function api<T>(path: string, init: { method?: string; body?: unknown; form?: FormData } = {}): Promise<T> {
  const response = await fetch(path, {
    method: init.method ?? (init.body || init.form ? "POST" : "GET"),
    headers: init.body ? { "Content-Type": "application/json" } : undefined,
    body: init.form ?? (init.body ? JSON.stringify(init.body) : undefined),
    cache: "no-store",
  });
  if (!response.ok) {
    let code = "server_error";
    try {
      code = ((await response.json()) as { error?: string }).error ?? code;
    } catch {
      // Not a JSON answer
    }
    throw new ApiError(response.status, code);
  }
  return (await response.json()) as T;
}

/* Runs a change after the user stops typing, one per key */
const timers = new Map<string, ReturnType<typeof setTimeout>>();

export function debounce(key: string, run: () => void, ms = 700) {
  clearTimeout(timers.get(key));
  timers.set(
    key,
    setTimeout(() => {
      timers.delete(key);
      run();
    }, ms),
  );
}
