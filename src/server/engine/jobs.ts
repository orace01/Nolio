import { supabaseAdmin } from "../supabase";

export type JobKind = "create" | "fixes";

export type JobRow = {
  id: number;
  kind: JobKind;
  ebook_id: string;
  attempts: number;
};

/* Up to three tries, a minute apart, before the ebook is marked as failed */
export const MAX_ATTEMPTS = 3;

export async function enqueue(kind: JobKind, ebookId: string) {
  const { error } = await supabaseAdmin().from("jobs").insert({ kind, ebook_id: ebookId });
  if (error) throw error;
}

export async function claimJob(): Promise<JobRow | null> {
  const { data, error } = await supabaseAdmin().rpc("claim_job");
  if (error) throw error;
  const rows = (data ?? []) as JobRow[];
  return rows[0] ?? null;
}

export async function finishJob(id: number) {
  await supabaseAdmin().from("jobs").update({ status: "done", error: null }).eq("id", id);
}

/* Puts the job back in the queue, or gives up; returns true when it gave up */
export async function failJob(job: JobRow, message: string) {
  const last = job.attempts >= MAX_ATTEMPTS;
  await supabaseAdmin()
    .from("jobs")
    .update({
      status: last ? "failed" : "queued",
      error: message.slice(0, 1000),
      run_after: new Date(Date.now() + 60_000).toISOString(),
    })
    .eq("id", job.id);
  return last;
}
