/*
 * The Nolio worker: takes the jobs of the queue one by one (creating an
 * ebook, applying comments) and runs them with the AI engine.
 * Start it next to the app: `npm run worker`.
 */

import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const { configured } = await import("../src/server/env");
const { claimJob, failJob, finishJob } = await import("../src/server/engine/jobs");
const { runCreate } = await import("../src/server/engine/create");
const { runFixes } = await import("../src/server/engine/fixes");
const { supabaseAdmin } = await import("../src/server/supabase");

const IDLE_MS = 2000;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const missing = [
  !configured.supabase && "Supabase",
  !configured.gemini && "Gemini",
].filter(Boolean);
if (missing.length) {
  console.error(`The worker needs these keys in .env.local: ${missing.join(", ")}.`);
  process.exit(1);
}

let running = true;
process.on("SIGINT", () => (running = false));
process.on("SIGTERM", () => (running = false));

console.log("Nolio worker ready.");

while (running) {
  const job = await claimJob().catch((error) => {
    console.error("queue unavailable", error);
    return null;
  });
  if (!job) {
    await sleep(IDLE_MS);
    continue;
  }

  const started = Date.now();
  console.log(`job ${job.id}: ${job.kind} ${job.ebook_id} (try ${job.attempts})`);
  try {
    if (job.kind === "create") {
      const pages = await runCreate(job.ebook_id);
      console.log(`job ${job.id}: ebook ready, ${pages} pages`);
    } else {
      await runFixes(job.ebook_id);
    }
    await finishJob(job.id);
    console.log(`job ${job.id}: done in ${Math.round((Date.now() - started) / 1000)} s`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`job ${job.id}: failed`, error);
    const gaveUp = await failJob(job, message);
    if (gaveUp) {
      const db = supabaseAdmin();
      if (job.kind === "create") {
        await db.from("ebooks").update({ status: "failed", error: message.slice(0, 500) }).eq("id", job.ebook_id);
      } else {
        await db.from("comments").update({ status: "pending" }).eq("ebook_id", job.ebook_id).eq("status", "applying");
      }
    }
  }
}

console.log("Nolio worker stopped.");
