/*
 * Server configuration, read from the environment (see .env.example).
 * Gemini runs the whole AI engine; Supabase holds the accounts and data.
 * Each is optional: without its keys the app keeps working in demo mode,
 * with the stand-ins of src/lib/app/content.ts.
 */

const read = (name: string) => process.env[name]?.trim() || undefined;

const list = (name: string, fallback: string) =>
  (read(name) ?? fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseKey: read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  supabaseSecret: read("SUPABASE_SECRET_KEY"),

  geminiKey: read("GEMINI_API_KEY"),
  /* Quick answers: analysis of the idea, design studio */
  geminiModels: list("GEMINI_MODELS", "gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash"),
  /* Writing: outline, chapters, final check, comments. The Pro model needs a
     paid key; without it, the Flash models take over */
  geminiWriterModels: list(
    "GEMINI_WRITER_MODELS",
    "gemini-3.1-pro-preview,gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash",
  ),
  /* Generated images (needs a paid key) */
  geminiImageModels: list("GEMINI_IMAGE_MODELS", "gemini-3.1-flash-image,gemini-2.5-flash-image"),

  /* Public address of the app, opened by the worker to print the PDFs */
  appUrl: (read("APP_URL") ?? "http://localhost:3000").replace(/\/$/, ""),
  /* Signs the links the worker uses to open an ebook without a session */
  printSecret: read("NOLIO_PRINT_SECRET"),
  chromePath: read("CHROME_PATH"),

  resendKey: read("RESEND_API_KEY"),
  emailFrom: read("EMAIL_FROM") ?? "Nolio <hello@nolio.app>",

  /* Until payments exist, the plan buttons switch the plan directly */
  allowPlanSwitch: read("NOLIO_ALLOW_PLAN_SWITCH") !== "false",
};

export const configured = {
  supabase: Boolean(env.supabaseUrl && env.supabaseKey && env.supabaseSecret),
  gemini: Boolean(env.geminiKey),
};

/* What the browser may know about the configuration */
export function publicRuntime() {
  return {
    remote: configured.supabase,
    ai: { gemini: configured.gemini },
  };
}

export type Runtime = ReturnType<typeof publicRuntime>;
