import { videoSource } from "@/lib/app/content";

/*
 * Videos and links, without AI: the title of a video from its platform
 * (oEmbed, no key needed) and whether a link still answers.
 */

const OEMBED: Record<string, (url: string) => string> = {
  YouTube: (url) => `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
  Vimeo: (url) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  Loom: (url) => `https://www.loom.com/v1/oembed?url=${encodeURIComponent(url)}`,
  Dailymotion: (url) => `https://www.dailymotion.com/services/oembed?url=${encodeURIComponent(url)}`,
};

async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

/* A public address only: the server never fetches its own network */
function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname;
    return !(
      host === "localhost" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      host.includes(":")
    );
  } catch {
    return false;
  }
}

export async function videoTitle(url: string): Promise<string | null> {
  const source = videoSource(url);
  const endpoint = source ? OEMBED[source] : undefined;
  if (!endpoint || !isPublicHttpUrl(url)) return null;
  try {
    const response = await fetchWithTimeout(endpoint(url));
    if (!response.ok) return null;
    const data = (await response.json()) as { title?: unknown };
    return typeof data.title === "string" ? data.title.slice(0, 120) : null;
  } catch {
    return null;
  }
}

export async function linkAnswers(url: string): Promise<boolean> {
  if (!isPublicHttpUrl(url)) return false;
  try {
    let response = await fetchWithTimeout(url, { method: "HEAD" });
    if (response.status === 405 || response.status === 403) response = await fetchWithTimeout(url);
    return response.status < 400;
  } catch {
    return false;
  }
}
