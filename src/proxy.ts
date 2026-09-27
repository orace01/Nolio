import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  hasLocale,
  LOCALE_COOKIE,
  LOCALES,
  type Locale,
} from "@/i18n/config";

/* The language picked with the switch first, then the browser's languages in
   order of preference */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((entry) => {
      const [tag, ...parameters] = entry.trim().split(";");
      const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
      return {
        language: tag.slice(0, 2).toLowerCase(),
        weight: quality ? Number(quality.trim().slice(2)) : 1,
      };
    })
    .sort((a, b) => b.weight - a.weight);

  for (const { language } of accepted) {
    if (hasLocale(language)) return language;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localized = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (localized) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything but Next.js internals and files with an extension
  matcher: ["/((?!_next|.*\\..*).*)"],
};
