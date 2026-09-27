import type { Metadata } from "next";
import { NotFoundPage } from "@/components/site/NotFoundPage";
import { getDictionary } from "@/i18n/get-dictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { montserrat } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLocale();
  return { title: `${getDictionary(lang).notFound.metaTitle} | Nolio` };
}

/* Unmatched URLs. It is rendered without the [lang] layout, so it brings its
   own document, styles and font. */
export default async function GlobalNotFound() {
  const lang = await getRequestLocale();

  return (
    <html lang={lang} className={montserrat.variable}>
      <body>
        <NotFoundPage lang={lang} />
      </body>
    </html>
  );
}
