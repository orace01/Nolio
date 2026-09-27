import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLegalDocumentId, LEGAL_DOCUMENT_IDS, LEGAL_DOCUMENTS } from "@/i18n/legal";

/* /legal, /privacy and /terms; any other path is a 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCUMENT_IDS.map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[doc]">): Promise<Metadata> {
  const { lang, doc } = await params;
  if (!hasLocale(lang) || !isLegalDocumentId(doc)) return {};
  return { title: LEGAL_DOCUMENTS[lang][doc].metaTitle };
}

export default async function LegalPage({ params }: PageProps<"/[lang]/[doc]">) {
  const { lang, doc } = await params;
  if (!hasLocale(lang) || !isLegalDocumentId(doc)) notFound();

  return <LegalDocument lang={lang} dict={getDictionary(lang)} id={doc} />;
}
