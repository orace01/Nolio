import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { montserrat } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const { meta } = getDictionary(lang);
  return {
    title: { default: meta.title, template: `%s | ${meta.title}` },
    description: meta.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
