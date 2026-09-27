import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import JSZip from "jszip";
import puppeteer, { type Browser } from "puppeteer-core";
import type { EbookContent, EbookFiles } from "@/lib/app/model";
import { env } from "../env";
import { supabaseAdmin } from "../supabase";

/*
 * The files of a finished ebook: the interactive PDF, the print PDF, the
 * EPUB and the cover image. The PDFs are the app's own print page, opened by
 * a headless Chrome, so they look exactly like the viewer.
 */

/* ---------- Signed links for the print page ---------- */

const TOKEN_LIFETIME = 10 * 60 * 1000;

function sign(value: string) {
  if (!env.printSecret) throw new Error("NOLIO_PRINT_SECRET is not set");
  return createHmac("sha256", env.printSecret).update(value).digest("base64url");
}

export function printToken(ebookId: string) {
  const expires = Date.now() + TOKEN_LIFETIME;
  return `${expires}.${sign(`${ebookId}.${expires}`)}`;
}

export function checkPrintToken(ebookId: string, token: string) {
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now() || !env.printSecret) return false;
  const expected = Buffer.from(sign(`${ebookId}.${expires}`));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/* ---------- Chrome ---------- */

const CHROME_PATHS = [
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
];

function chromePath() {
  const path = env.chromePath ?? CHROME_PATHS.find((candidate) => existsSync(candidate));
  if (!path) throw new Error("Chrome not found: set CHROME_PATH");
  return path;
}

async function withBrowser<T>(run: (browser: Browser) => Promise<T>) {
  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
  });
  try {
    return await run(browser);
  } finally {
    await browser.close();
  }
}

type Target = { id: string; userId: string; lang: string };

async function openPrintPage(browser: Browser, target: Target, forPrint: boolean) {
  const page = await browser.newPage();
  const query = new URLSearchParams({ token: printToken(target.id), render: "1" });
  if (forPrint) query.set("for", "print");
  await page.goto(`${env.appUrl}/${target.lang}/app/print/${target.id}?${query}`, {
    waitUntil: "networkidle0",
    timeout: 120_000,
  });
  // Set by the print page once the fonts and images are in
  await page.waitForSelector("[data-print-ready]", { timeout: 60_000 });
  return page;
}

/* ---------- EPUB ---------- */

const escape = (value: string) =>
  value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);

function xhtml(title: string, lang: string, body: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}">
<head><meta charset="utf-8"/><title>${escape(title)}</title><link rel="stylesheet" href="style.css"/></head>
<body>${body}</body>
</html>`;
}

export async function buildEpub(input: {
  id: string;
  lang: string;
  author: string;
  content: EbookContent;
  cover: Buffer | null;
}) {
  const { content, lang } = input;
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`,
  );
  zip.file(
    "OEBPS/style.css",
    `body{font-family:serif;line-height:1.6;margin:0 5%}h1,h2{font-family:sans-serif;line-height:1.15}.box{border-left:3px solid #2a3f34;padding:.5em 1em;margin:1em 0}.video a{font-weight:bold}.cover{text-align:center}.cover img{max-width:100%}`,
  );

  const chapters = content.chapters.map((chapter, index) => {
    const parts = [
      `<h2>${escape(chapter.title)}</h2>`,
      `<p><em>${escape(chapter.intro)}</em></p>`,
      ...chapter.paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`),
    ];
    if (chapter.video) {
      if (chapter.videoLead) parts.push(`<p>${escape(chapter.videoLead)}</p>`);
      parts.push(`<p class="video"><a href="${escape(chapter.video.url)}">${escape(chapter.video.title)}</a></p>`);
    }
    if (chapter.checklist?.length) {
      parts.push(`<ul>${chapter.checklist.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`);
    }
    if (chapter.box) {
      parts.push(`<div class="box"><p><strong>${escape(chapter.box.title)}</strong></p><p>${escape(chapter.box.text)}</p></div>`);
    }
    zip.file(`OEBPS/chapter-${index + 1}.xhtml`, xhtml(chapter.title, lang, parts.join("\n")));
    return { id: `chapter-${index + 1}`, title: chapter.title };
  });

  const closing = [
    `<h2>${escape(input.author)}</h2>`,
    content.cta?.url
      ? `<p><a href="${escape(content.cta.url)}">${escape(content.cta.label)}</a></p>`
      : content.cta
        ? `<p>${escape(content.cta.label)}</p>`
        : "",
    ...content.resources.map((item) =>
      item.url ? `<p><a href="${escape(item.url)}">${escape(item.title)}</a></p>` : `<p>${escape(item.title)}</p>`,
    ),
  ].join("\n");
  zip.file("OEBPS/closing.xhtml", xhtml(input.author, lang, closing));

  const titlePage = [
    input.cover ? `<div class="cover"><img src="cover.png" alt="${escape(content.title)}"/></div>` : "",
    `<h1>${escape(content.title)}</h1>`,
    `<p>${escape(content.subtitle)}</p>`,
    `<p>${escape(input.author)}</p>`,
  ].join("\n");
  zip.file("OEBPS/title.xhtml", xhtml(content.title, lang, titlePage));
  if (input.cover) zip.file("OEBPS/cover.png", input.cover);

  const items = [{ id: "title", title: content.title }, ...chapters, { id: "closing", title: input.author }];
  zip.file(
    "OEBPS/nav.xhtml",
    xhtml(
      content.title,
      lang,
      `<nav epub:type="toc"><ol>${items.map((item) => `<li><a href="${item.id}.xhtml">${escape(item.title)}</a></li>`).join("")}</ol></nav>`,
    ),
  );
  zip.file(
    "OEBPS/content.opf",
    `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="${lang}">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">urn:uuid:${input.id}</dc:identifier>
<dc:title>${escape(content.title)}</dc:title>
<dc:creator>${escape(input.author)}</dc:creator>
<dc:language>${lang}</dc:language>
<meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</meta>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="style" href="style.css" media-type="text/css"/>
${input.cover ? `<item id="cover" href="cover.png" media-type="image/png" properties="cover-image"/>` : ""}
${items.map((item) => `<item id="${item.id}" href="${item.id}.xhtml" media-type="application/xhtml+xml"/>`).join("\n")}
</manifest>
<spine>${items.map((item) => `<itemref idref="${item.id}"/>`).join("")}</spine>
</package>`,
  );

  return zip.generateAsync({ type: "nodebuffer", mimeType: "application/epub+zip" });
}

/* ---------- Everything, uploaded to the private bucket ---------- */

export async function exportEbook(target: Target & { author: string; content: EbookContent }): Promise<EbookFiles> {
  const folder = `${target.userId}/${target.id}`;
  const upload = async (name: string, data: Buffer | Uint8Array, contentType: string) => {
    const path = `${folder}/${name}`;
    const { error } = await supabaseAdmin().storage.from("exports").upload(path, data, { contentType, upsert: true });
    if (error) throw error;
    return path;
  };

  const { pdf, print, cover } = await withBrowser(async (browser) => {
    const interactive = await openPrintPage(browser, target, false);
    const pdf = await interactive.pdf({ printBackground: true, preferCSSPageSize: true });
    await interactive.setViewport({ width: 900, height: 1300, deviceScaleFactor: 2 });
    const first = await interactive.$("[data-print-page]");
    const cover = first ? Buffer.from(await first.screenshot({ type: "png" })) : null;
    await interactive.close();

    const printable = await openPrintPage(browser, target, true);
    const print = await printable.pdf({ printBackground: true, preferCSSPageSize: true });
    await printable.close();
    return { pdf, print, cover };
  });

  const epub = await buildEpub({ id: target.id, lang: target.lang, author: target.author, content: target.content, cover });

  return {
    pdf: await upload("nolio.pdf", pdf, "application/pdf"),
    print: await upload("nolio-print.pdf", print, "application/pdf"),
    epub: await upload("nolio.epub", epub, "application/epub+zip"),
    cover: cover ? await upload("cover.png", cover, "image/png") : undefined,
  };
}
