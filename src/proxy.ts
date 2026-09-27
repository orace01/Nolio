import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  hasLocale,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  LOCALES,
  type Locale,
} from "@/i18n/config";
import { configured, env } from "@/server/env";

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

/*
 * With accounts: refreshes the session cookie on every page, and sends
 * visitors without a session from the app to the login page. The print page
 * opened by the worker carries a signed token instead of a session.
 */
async function withSession(request: NextRequest, locale: Locale, headers: Headers) {
  let response = NextResponse.next({ request: { headers } });
  if (!configured.supabase) return response;

  const supabase = createServerClient(env.supabaseUrl!, env.supabaseKey!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        const refreshed = new Headers(request.headers);
        refreshed.set(LOCALE_HEADER, locale);
        response = NextResponse.next({ request: { headers: refreshed } });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();

  const { pathname, searchParams } = request.nextUrl;
  const inApp = pathname === `/${locale}/app` || pathname.startsWith(`/${locale}/app/`);
  const printing = pathname.startsWith(`/${locale}/app/print/`) && searchParams.has("token");
  if (inApp && !printing && !data.user) {
    const login = request.nextUrl.clone();
    login.pathname = `/${locale}/login`;
    login.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(login);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = LOCALES.find(
    (candidate) => pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`),
  );
  if (locale) {
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, locale);
    return withSession(request, locale, headers);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything but Next.js internals, the API and files with an extension
  matcher: ["/((?!_next|api/|.*\\..*).*)"],
};
