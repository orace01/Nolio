import { lang } from "next/root-params";
import { NotFoundPage } from "@/components/site/NotFoundPage";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";

/* notFound() called inside a page; unmatched URLs use app/global-not-found.tsx.
   The locale comes from the route, not the request, so pages stay static. */
export default async function NotFound() {
  const locale = await lang();
  return <NotFoundPage lang={hasLocale(locale) ? locale : DEFAULT_LOCALE} />;
}
