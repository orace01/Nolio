"use client";

/*
 * Imported pictures are shrunk and kept as data URLs in the browser storage
 * until uploads exist. SVG files are kept as they are.
 */
export function shrinkImage(file: File, maxSize: number, type: "image/jpeg" | "image/png" = "image/jpeg"): Promise<string> {
  if (file.type === "image/svg+xml") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(type, 0.78));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable image"));
    };
    image.src = url;
  });
}

/*
 * A picture ready for the ebook: uploaded with the account (a sharper copy),
 * or kept in the browser as a data URL in the demo.
 */
export async function storeImage(file: File, demoSize: number, type: "image/jpeg" | "image/png" = "image/jpeg") {
  const { api, getRuntime } = await import("@/lib/app/api");
  if (!getRuntime().remote) return shrinkImage(file, demoSize, type);

  const data = await shrinkImage(file, 1800, type);
  const blob = await (await fetch(data)).blob();
  const form = new FormData();
  form.append("file", new File([blob], file.name, { type: blob.type }));
  const { url } = await api<{ url: string }>("/api/uploads", { form });
  return url;
}
