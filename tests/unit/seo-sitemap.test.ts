import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { policyDocuments } from "@/data/policies";
import {
  buildAlternates,
  buildLocaleUrl,
  createPageMetadata,
  getSiteUrl,
} from "@/lib/seo";

describe("seo and policy coverage", () => {
  it("builds localized URLs and alternates", () => {
    expect(buildLocaleUrl("en", "/products")).toBe(`${getSiteUrl()}/en/products`);
    expect(buildAlternates("/products")).toEqual({
      en: `${getSiteUrl()}/en/products`,
      de: `${getSiteUrl()}/de/products`,
      fr: `${getSiteUrl()}/fr/products`,
      es: `${getSiteUrl()}/es/products`,
    });
  });

  it("creates metadata with canonical and hreflang entries", () => {
    const metadata = createPageMetadata({
      locale: "en",
      path: "/products",
      title: "Products | PetQuirky",
      description: "PetQuirky product listing",
    });

    expect(metadata.alternates?.canonical).toBe(`${getSiteUrl()}/en/products`);
    expect(metadata.alternates?.languages?.fr).toBe(`${getSiteUrl()}/fr/products`);
    expect(metadata.openGraph?.url).toBe(`${getSiteUrl()}/en/products`);
  });

  it("includes localized product and content URLs in the sitemap", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${getSiteUrl()}/en/products`);
    expect(urls).toContain(`${getSiteUrl()}/fr/blog`);
    expect(urls.some((url) => url.includes("/de/products/ceramic-sculpted-slow-feeder"))).toBe(
      true
    );
  });

  it("publishes sitemap.xml in robots.txt", () => {
    const result = robots();

    expect(result.sitemap).toBe(`${getSiteUrl()}/sitemap.xml`);
  });

  it("locks the returns policy to 14 days", () => {
    expect(policyDocuments.returns.intro.en).toContain("14-day");
    expect(policyDocuments.returns.sections[1].title.en).toContain("14-Day");
    expect(policyDocuments.returns.intro.en).not.toContain("30-day");
  });
});
