import { randomUUID } from "node:crypto";
import { handle, HttpError, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};
const MAX_BYTES = 10 * 1024 * 1024;

/* Photos of the ebook and the brand kit, stored with the account */
export async function POST(request: Request) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new HttpError(400, "no_file");
    const extension = TYPES[file.type];
    if (!extension) throw new HttpError(415, "unsupported_type");
    if (file.size > MAX_BYTES) throw new HttpError(413, "too_large");

    const path = `${user.id}/uploads/${randomUUID()}.${extension}`;
    const storage = supabaseAdmin().storage.from("images");
    const { error } = await storage.upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
    if (error) throw error;
    return { url: storage.getPublicUrl(path).data.publicUrl };
  });
}
