import { PrintView } from "@/components/app/ebooks/PrintView";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("print");

/* ?for=print: the version for the printer, without clickable links */
export default async function Page({ searchParams }: PageProps<"/[lang]/app/print/[id]">) {
  const { for: target } = await searchParams;
  return <PrintView forPrint={target === "print"} />;
}
