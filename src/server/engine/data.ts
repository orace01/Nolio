import { hasLocale, type Locale } from "@/i18n/config";
import { APP_DICTIONARIES } from "@/i18n/app";
import { canUse, PLAN_EBOOKS, usedQuota, type Plan, type RoleId } from "@/lib/app/account";
import { findById, ILLUSTRATIONS, LENGTHS, STYLES, THEMES, type Tier } from "@/lib/app/catalog";
import {
  reviveDraft,
  type Draft,
  type Ebook,
  type EbookComment,
  type EbookContent,
  type EbookFiles,
  type EbookStatus,
} from "@/lib/app/model";
import type { DossierContext } from "../ai/dossier";
import { HttpError } from "../http";
import { supabaseAdmin } from "../supabase";

/* Rows of the database and their conversion to the app's types */

export type EbookRow = {
  id: string;
  user_id: string;
  status: "draft" | EbookStatus;
  lang: string;
  dossier: unknown;
  content: EbookContent | null;
  progress: { step: number; ratio: number };
  files: EbookFiles;
  error: string | null;
  created_at: string;
  ready_at: string | null;
};

export type CommentRow = {
  id: string;
  ebook_id: string;
  page: number;
  part: string | null;
  text: string;
  status: "pending" | "applying" | "applied" | "question";
  reply: string | null;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  role: string | null;
  role_other: string;
  plan: Plan;
  brand: Record<string, unknown>;
};

export const EBOOK_COLUMNS = "id, user_id, status, lang, dossier, content, progress, files, error, created_at, ready_at";

export function toComment(row: CommentRow): EbookComment {
  return {
    id: row.id,
    page: row.page,
    part: row.part,
    text: row.text,
    appliedAt: null,
    status: row.status,
    reply: row.reply ?? undefined,
  };
}

export function toEbook(row: EbookRow, comments: CommentRow[] = []): Ebook {
  const createdAt = new Date(row.created_at).getTime();
  return {
    id: row.id,
    createdAt,
    readyAt: row.ready_at ? new Date(row.ready_at).getTime() : createdAt,
    draft: reviveDraft(row.dossier),
    comments: comments.filter((comment) => comment.ebook_id === row.id).map(toComment),
    lang: row.lang,
    status: row.status === "draft" ? "queued" : row.status,
    progress: row.progress,
    content: row.content,
    // Paths only: the browser asks for signed links when it downloads
    files: row.files,
    error: row.error,
  };
}

export function langOf(value: string): Locale {
  return hasLocale(value) ? value : "fr";
}

export async function getProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabaseAdmin().from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  if (data) return data as ProfileRow;
  // Accounts created before the trigger existed
  const created = { id: userId, first_name: "", last_name: "", role: null, role_other: "", plan: "free" as Plan, brand: {} };
  await supabaseAdmin().from("profiles").upsert(created);
  return created;
}

export function brandOf(profile: ProfileRow) {
  const brand = profile.brand ?? {};
  const read = (key: string) => (typeof brand[key] === "string" ? (brand[key] as string) : "");
  return {
    logo: read("logo") || null,
    photo: read("photo") || null,
    colors: Array.isArray(brand.colors) ? (brand.colors as string[]) : [],
    bio: read("bio"),
    cta: read("cta"),
    link: read("link"),
  };
}

/* The author's name and role, and the brand kit, around the answers */
export function contextFor(profile: ProfileRow, draft: Draft, lang: Locale): DossierContext {
  const role = profile.role
    ? profile.role === "other"
      ? profile.role_other || null
      : APP_DICTIONARIES[lang].welcome.roles[profile.role as RoleId]?.name ?? null
    : null;
  const brand = brandOf(profile);
  return {
    draft,
    lang,
    author: { name: `${profile.first_name} ${profile.last_name}`.trim(), role },
    brand: { bio: brand.bio, cta: brand.cta, link: brand.link },
  };
}

export async function getOwnedEbook(userId: string, id: string): Promise<EbookRow> {
  const { data, error } = await supabaseAdmin()
    .from("ebooks")
    .select(EBOOK_COLUMNS)
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new HttpError(404, "not_found");
  return data as EbookRow;
}

export async function listEbooks(userId: string): Promise<Ebook[]> {
  const db = supabaseAdmin();
  const { data: rows, error } = await db
    .from("ebooks")
    .select(EBOOK_COLUMNS)
    .eq("user_id", userId)
    .neq("status", "draft")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const ids = (rows ?? []).map((row) => row.id);
  const { data: comments } = ids.length
    ? await db.from("comments").select("*").in("ebook_id", ids).order("created_at")
    : { data: [] };
  return (rows as EbookRow[]).map((row) => toEbook(row, (comments ?? []) as CommentRow[]));
}

/* The options of a dossier above the account's plan, checked again on the server */
export function lockedOptions(draft: Draft, plan: Plan): string[] {
  const tiers: [string, Tier][] = [
    ["length", findById(LENGTHS, draft.length).tier],
    ["style", findById(STYLES, draft.style).tier],
    ["theme", draft.theme === "custom" ? "pro" : findById(THEMES, draft.theme).tier],
    ["illustrations", findById(ILLUSTRATIONS, draft.illustrations).tier],
  ];
  if (draft.ownStyle) tiers.push(["ownStyle", "pro"]);
  if (draft.aiImages.some((image) => !image.startsWith("drawing:"))) tiers.push(["aiImages", "pro"]);
  return tiers.filter(([, tier]) => !canUse(tier, plan)).map(([name]) => name);
}

export async function checkQuota(userId: string, plan: Plan) {
  const { data } = await supabaseAdmin()
    .from("ebooks")
    .select("created_at")
    .eq("user_id", userId)
    .neq("status", "draft");
  const used = usedQuota(
    (data ?? []).map((row) => ({ createdAt: new Date(row.created_at).getTime() })),
    plan,
    Date.now(),
  );
  if (used >= PLAN_EBOOKS[plan]) throw new HttpError(403, "quota_reached");
}
