import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

function detectLocale(acceptLanguage: string | null): (typeof locales)[number] {
  const normalized = (acceptLanguage ?? "").toLowerCase();
  return locales.find((locale) => normalized.includes(locale)) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = detectLocale(request.headers.get("accept-language"));
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico|robots.txt|sitemap.xml).*)"],
};
