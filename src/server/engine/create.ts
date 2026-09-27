import { buildEbook, paginate } from "@/lib/app/content";
import { outlineKey, type Chapter, type Draft, type EbookContent, type WrittenChapter } from "@/lib/app/model";
import { canUse } from "@/lib/app/account";
import { resolveLook } from "@/lib/app/catalog";
import { chapterBudget, reviewEbook, shortenChapter, writeChapter, writeOutline } from "../ai/writer";
import type { DossierContext } from "../ai/dossier";
import { illustrate } from "../ai/analysis";
import { configured, env } from "../env";
import { supabaseAdmin } from "../supabase";
import { contextFor, getProfile, langOf, type EbookRow, EBOOK_COLUMNS } from "./data";
import { sendReadyEmail } from "./email";
import { exportEbook } from "./export";
import { linkAnswers, videoTitle } from "./media";

/*
 * Creation of an ebook, run by the worker. The four steps match the four
 * lines of the "Creating" screen, which follows `progress`:
 *   0. writing: outline (if not already approved) and every chapter
 *   1. layout: each chapter brought within the room of its pages
 *   2. videos and links: titles, checks, illustrations made to measure
 *   3. final check: proofreading, then the PDF, EPUB and cover files
 */

type Progress = { step: number; ratio: number };

async function save(id: string, patch: Record<string, unknown>) {
  const { error } = await supabaseAdmin()
    .from("ebooks")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

const setProgress = (id: string, progress: Progress) => save(id, { progress });

/* A few calls at a time: fast enough, and gentle on rate limits */
async function inBatches<T, R>(items: T[], size: number, run: (item: T, index: number) => Promise<R>) {
  const results: R[] = new Array(items.length);
  for (let start = 0; start < items.length; start += size) {
    const batch = items.slice(start, start + size);
    const done = await Promise.all(batch.map((item, offset) => run(item, start + offset)));
    done.forEach((result, offset) => (results[start + offset] = result));
  }
  return results;
}

function toChapter(written: WrittenChapter, video: Chapter["video"]): Chapter {
  return {
    title: written.title.trim(),
    short: written.short.trim(),
    intro: written.intro.trim(),
    paragraphs: written.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean),
    checklist: written.checklist.map((item) => item.trim()).filter(Boolean).slice(0, 5),
    box: written.boxTitle.trim() && written.boxText.trim() ? { title: written.boxTitle.trim(), text: written.boxText.trim() } : undefined,
    video,
    videoLead: video ? written.videoLead.trim() : undefined,
  };
}

export function toWritten(chapter: Chapter): WrittenChapter {
  return {
    title: chapter.title,
    short: chapter.short,
    intro: chapter.intro,
    paragraphs: chapter.paragraphs,
    checklist: chapter.checklist ?? [],
    boxTitle: chapter.box?.title ?? "",
    boxText: chapter.box?.text ?? "",
    videoLead: chapter.videoLead ?? "",
  };
}

/* The room a chapter gets, from the same rules as the page layout */
export function budgetFor(draft: Draft, hasVideo: boolean) {
  const roomy = draft.length !== "short";
  return chapterBudget({ twoPages: roomy || hasVideo, video: hasVideo, roomy });
}

function overBudget(chapter: WrittenChapter, budget: ReturnType<typeof chapterBudget>) {
  const paragraphs = chapter.paragraphs.join("").length;
  return (
    chapter.intro.length > budget.intro * 1.15 ||
    paragraphs > budget.paragraphs * 1.15 ||
    chapter.checklist.length > budget.checklist + 1
  );
}

/* Proofreading fixes applied field by field */
function applyReview(content: EbookContent, review: Awaited<ReturnType<typeof reviewEbook>>) {
  for (const fix of review.fixes) {
    const chapter = content.chapters[fix.chapter];
    const value = fix.replacement.trim();
    if (!chapter || !value) continue;
    if (fix.field === "title") chapter.title = value;
    if (fix.field === "intro") chapter.intro = value;
    if (fix.field === "paragraph" && chapter.paragraphs[fix.index] !== undefined) chapter.paragraphs[fix.index] = value;
    if (fix.field === "checklist" && chapter.checklist?.[fix.index] !== undefined) chapter.checklist[fix.index] = value;
    if (fix.field === "boxText" && chapter.box) chapter.box.text = value;
    if (fix.field === "videoLead" && chapter.video) chapter.videoLead = value;
  }
}

/* Pro plan, illustrations "made to measure": one generated image per chapter */
async function customIllustrations(row: EbookRow, context: DossierContext, content: EbookContent) {
  const { draft } = context;
  const look = resolveLook(draft.theme, draft.customTheme);
  const chapters = content.chapters.slice(0, 8);
  const urls = await inBatches(chapters, 2, async (chapter, index) => {
    const image = await illustrate({
      prompt: `Illustration for a chapter titled "${chapter.title}" of the ebook "${content.title}". ${chapter.intro}`,
      illustrations: "custom",
      brief: draft.illustrationBrief,
      accent: look.accent,
    });
    const path = `${row.user_id}/${row.id}/illustration-${index + 1}.${image.type === "image/jpeg" ? "jpg" : "png"}`;
    const storage = supabaseAdmin().storage.from("images");
    const { error } = await storage.upload(path, image.bytes, { contentType: image.type, upsert: true });
    if (error) throw error;
    return storage.getPublicUrl(path).data.publicUrl;
  });
  return urls;
}

export async function runCreate(ebookId: string) {
  const db = supabaseAdmin();
  const { data, error } = await db.from("ebooks").select(EBOOK_COLUMNS).eq("id", ebookId).single();
  if (error) throw error;
  const row = data as EbookRow;
  if (row.status === "ready") return;

  const lang = langOf(row.lang);
  const profile = await getProfile(row.user_id);
  let draft = row.dossier as Draft;
  const context = contextFor(profile, draft, lang);
  await save(ebookId, { status: "working", error: null, progress: { step: 0, ratio: 0.03 } });

  // 0. Writing: reuse the outline the user approved, unless the answers changed since
  const outline =
    draft.outline && draft.outlineKey === outlineKey(draft, lang) ? draft.outline : await writeOutline(context);
  await setProgress(ebookId, { step: 0, ratio: 0.1 });

  const videos = new Map(draft.media.filter((item) => item.kind === "video").map((video) => [video.id, video]));
  const videoOf = (index: number) =>
    outline.chapters[index].videoIds.map((id) => videos.get(id)).find(Boolean) ?? undefined;

  let written = 0;
  const chapters = await inBatches(outline.chapters, 3, async (_, index) => {
    const video = videoOf(index);
    const chapter = await writeChapter(context, outline, index, budgetFor(draft, Boolean(video)), video ?? null);
    written += 1;
    await setProgress(ebookId, { step: 0, ratio: 0.1 + 0.45 * (written / outline.chapters.length) });
    return chapter;
  });

  // 1. Layout: every chapter within the room of its pages
  await setProgress(ebookId, { step: 1, ratio: 0.57 });
  const fitted = await inBatches(chapters, 3, async (chapter, index) => {
    const budget = budgetFor(draft, Boolean(videoOf(index)));
    const result = overBudget(chapter, budget) ? await shortenChapter(context, chapter, budget) : chapter;
    return { ...result, checklist: result.checklist.slice(0, budget.checklist) };
  });

  // 2. Videos and links
  await setProgress(ebookId, { step: 2, ratio: 0.7 });
  const media = await Promise.all(
    draft.media.map(async (item) => {
      if (item.kind !== "video") return item;
      // Titles left as "Video 1" take the platform's title
      if (!/^(vid[ée]o|video)\s*\d+$/i.test(item.title.trim())) return item;
      const title = await videoTitle(item.url);
      return title ? { ...item, title } : item;
    }),
  );
  draft = { ...draft, media };
  const unreachable = (
    await Promise.all(
      media
        .filter((item) => item.kind !== "file" && item.url)
        .map(async (item) => ((await linkAnswers(item.url)) ? null : item.url)),
    )
  ).filter(Boolean);
  if (unreachable.length) console.warn(`ebook ${ebookId}: links not answering`, unreachable);

  const base = buildEbook(draft, lang, context.brand);
  const byId = new Map(media.map((item) => [item.id, item]));
  const content: EbookContent = {
    ...base,
    title: outline.title,
    subtitle: outline.subtitle,
    sample: false,
    chapters: fitted.map((chapter, index) => {
      const video = videoOf(index);
      return toChapter(chapter, video ? byId.get(video.id) : undefined);
    }),
  };

  if (draft.illustrations === "custom" && canUse("pro", profile.plan) && configured.gemini) {
    try {
      draft = { ...draft, aiImages: [...draft.aiImages, ...(await customIllustrations(row, context, content))] };
    } catch (issue) {
      // The ebook stays complete with line drawings instead
      console.error(`ebook ${ebookId}: illustrations failed`, issue);
    }
  }

  // 3. Final check, then the files
  await setProgress(ebookId, { step: 3, ratio: 0.8 });
  applyReview(content, await reviewEbook({ ...context, draft }, content));
  await save(ebookId, { dossier: draft, content, progress: { step: 3, ratio: 0.88 } });

  const files = await exportEbook({
    id: ebookId,
    userId: row.user_id,
    lang,
    author: context.author.name,
    content,
  });
  await save(ebookId, {
    status: "ready",
    files,
    progress: { step: 4, ratio: 1 },
    ready_at: new Date().toISOString(),
  });

  const { data: user } = await db.auth.admin.getUserById(row.user_id);
  if (user.user?.email) {
    await sendReadyEmail({
      to: user.user.email,
      lang,
      title: content.title,
      link: `${env.appUrl}/${lang}/app/ebooks/${ebookId}`,
    }).catch((issue) => console.error("email failed", issue));
  }

  // Number of pages, for the worker's log
  return paginate(content, draft).pages.length;
}
