import type { Metadata } from "next";

import { locales, type Locale } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://petquirky.com";

export function getSiteUrl() {
  return siteUrl.replace(/\/$/, "");
}

export function buildLocaleUrl(locale: Locale, path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function buildAlternates(path = "") {
  return Object.fromEntries(locales.map((locale) => [locale, buildLocaleUrl(locale, path)]));
}

export function createPageMetadata(input: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const canonical = buildLocaleUrl(input.locale, input.path);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
      languages: buildAlternates(input.path),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: "PetQuirky",
      locale: input.locale,
      type: "website",
      images: input.image ? [{ url: input.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: input.image ? [input.image] : undefined,
    },
  };
}
