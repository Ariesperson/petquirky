import { defaultLocale, getDictionary, isLocale, locales } from "@/lib/i18n";
import { proxy } from "@/proxy";
import type { NextRequest } from "next/server";

function createProxyRequest(url: string, headers?: HeadersInit) {
  const nextUrl = new URL(url);
  const requestHeaders = new Headers(headers);

  return {
    headers: {
      get: (key: string) => requestHeaders.get(key),
    },
    nextUrl: {
      pathname: nextUrl.pathname,
      clone: () => new URL(nextUrl.toString()),
    },
  } as unknown as NextRequest;
}

describe("i18n and proxy", () => {
  it("recognizes supported locales only", () => {
    locales.forEach((locale) => {
      expect(isLocale(locale)).toBe(true);
    });
    expect(isLocale("it")).toBe(false);
  });

  it("loads dictionaries for supported locales", async () => {
    const dictionary = await getDictionary(defaultLocale);

    expect(dictionary.nav.home).toBeTruthy();
    expect(dictionary.footer.privacy).toBeTruthy();
  });

  it("redirects locale-less requests using Accept-Language", () => {
    const request = createProxyRequest("https://petquirky.test/products", {
      "accept-language": "de-DE,de;q=0.9,en;q=0.8",
    });

    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://petquirky.test/de/products");
  });

  it("passes through requests that already include a locale prefix", () => {
    const request = createProxyRequest("https://petquirky.test/fr/products");

    const response = proxy(request);

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
