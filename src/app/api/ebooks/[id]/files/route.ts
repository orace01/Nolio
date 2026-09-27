import { getOwnedEbook } from "@/server/engine/data";
import { handle, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

const NAMES = { pdf: "pdf", print: "print.pdf", epub: "epub", cover: "png" } as const;

/* Short-lived download links for the exported files */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const { id } = await params;
    const row = await getOwnedEbook(user.id, id);
    const title = String((row.content as { title?: string } | null)?.title ?? "ebook")
      .normalize("NFD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
    const storage = supabaseAdmin().storage.from("exports");
    const links: Record<string, string> = {};
    for (const key of Object.keys(NAMES) as (keyof typeof NAMES)[]) {
      const path = row.files?.[key];
      if (!path) continue;
      const { data } = await storage.createSignedUrl(path, 600, { download: `${title || "ebook"}.${NAMES[key]}` });
      if (data?.signedUrl) links[key] = data.signedUrl;
    }
    return { links };
  });
}
