import { paginate } from "@/lib/app/content";
import type { Draft, EbookContent } from "@/lib/app/model";
import { applyComment } from "../ai/writer";
import { supabaseAdmin } from "../supabase";
import { contextFor, getProfile, langOf, EBOOK_COLUMNS, type CommentRow, type EbookRow } from "./data";
import { exportEbook } from "./export";
import { budgetFor, toWritten } from "./create";

/*
 * Step 9: the comments left on a finished ebook. Each one is applied to the
 * chapter of its page, or answered with a question, then the files are made
 * again.
 */

const NOT_TEXT: Record<string, Record<"fr" | "en", string>> = {
  closing: {
    fr: "Cette page vient de votre kit de marque : modifiez votre bio, votre photo ou votre appel à l’action dans Kit de marque, puis relancez les corrections.",
    en: "This page comes from your brand kit: change your bio, photo or call to action in Brand kit, then apply the fixes again.",
  },
  contents: {
    fr: "Le sommaire suit les titres des chapitres : commentez la page du chapitre à renommer.",
    en: "The contents follow the chapter titles: comment on the page of the chapter to rename.",
  },
};

export async function runFixes(ebookId: string) {
  const db = supabaseAdmin();
  const { data, error } = await db.from("ebooks").select(EBOOK_COLUMNS).eq("id", ebookId).single();
  if (error) throw error;
  const row = data as EbookRow;
  if (!row.content) throw new Error("ebook without content");

  const { data: rows } = await db
    .from("comments")
    .select("*")
    .eq("ebook_id", ebookId)
    .eq("status", "applying")
    .order("created_at");
  const comments = (rows ?? []) as CommentRow[];
  if (!comments.length) return;

  const lang = langOf(row.lang);
  const draft = row.dossier as Draft;
  const profile = await getProfile(row.user_id);
  const context = contextFor(profile, draft, lang);
  const content: EbookContent = structuredClone(row.content);

  for (const comment of comments) {
    const pages = paginate(content, draft).pages;
    const page = pages[comment.page - 1];
    let status: CommentRow["status"] = "applied";
    let reply = "";

    if (!page || page.kind === "closing" || page.kind === "contents") {
      status = "question";
      reply = NOT_TEXT[page?.kind ?? "contents"][lang];
    } else {
      // The cover is about the title: it goes with the first chapter as context
      const index = page.kind === "cover" ? 0 : page.chapter;
      const chapter = content.chapters[index];
      const target =
        page.kind === "cover"
          ? "the cover (title and subtitle of the ebook)"
          : `chapter ${index + 1}, ${comment.part ? `the ${comment.part}` : "the whole page"}`;
      const result = await applyComment(context, {
        title: content.title,
        subtitle: content.subtitle,
        chapter: toWritten(chapter),
        target,
        comment: comment.text,
        budget: budgetFor(draft, Boolean(chapter.video)),
      });
      status = result.outcome;
      reply = result.reply;
      if (result.outcome === "applied") {
        content.title = result.title.trim() || content.title;
        content.subtitle = result.subtitle.trim() || content.subtitle;
        content.chapters[index] = {
          ...chapter,
          title: result.chapter.title,
          short: result.chapter.short,
          intro: result.chapter.intro,
          paragraphs: result.chapter.paragraphs,
          checklist: result.chapter.checklist.slice(0, 5),
          box:
            result.chapter.boxTitle && result.chapter.boxText
              ? { title: result.chapter.boxTitle, text: result.chapter.boxText }
              : undefined,
          videoLead: chapter.video ? result.chapter.videoLead : undefined,
        };
      }
    }

    await db
      .from("comments")
      .update({ status, reply, applied_at: new Date().toISOString() })
      .eq("id", comment.id);
  }

  await db.from("ebooks").update({ content, updated_at: new Date().toISOString() }).eq("id", ebookId);
  const files = await exportEbook({
    id: ebookId,
    userId: row.user_id,
    lang,
    author: context.author.name,
    content,
  });
  await db.from("ebooks").update({ files, updated_at: new Date().toISOString() }).eq("id", ebookId);
}
