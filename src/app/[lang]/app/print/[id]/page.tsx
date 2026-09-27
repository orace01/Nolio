import { PrintView } from "@/components/app/ebooks/PrintView";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("print");

/*
 * ?for=print: the version for the printer, without clickable links.
 * ?token=…&render=1: opened by the worker to make the PDF files.
 */
export default async function Page({ searchParams }: PageProps<"/[lang]/app/print/[id]">) {
  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : null;
  return <PrintView forPrint={query.for === "print"} token={token} render={query.render === "1"} />;
}
