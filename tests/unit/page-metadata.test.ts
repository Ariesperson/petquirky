import { getSiteUrl } from "@/lib/seo";

describe("page metadata generators", () => {
  it("builds blog article metadata with canonical, hreflang, and image", async () => {
    const { generateMetadata } = await import("@/app/[locale]/blog/[slug]/page");

    const metadata = await generateMetadata({
      params: Promise.resolve({
        locale: "en",
        slug: "best-uvb-lights-for-leopard-geckos-2026",
      }),
    });

    expect(metadata.title).toBe("Best UVB Lights for Leopard Geckos in 2026 | PetQuirky");
    expect(metadata.alternates?.canonical).toBe(
      `${getSiteUrl()}/en/blog/best-uvb-lights-for-leopard-geckos-2026`
    );
    expect(metadata.openGraph?.images?.[0]?.url).toBeTruthy();
  });

  it("returns an empty object for unsupported blog locales", async () => {
    const { generateMetadata } = await import("@/app/[locale]/blog/[slug]/page");

    const metadata = await generateMetadata({
      params: Promise.resolve({
        locale: "it",
        slug: "best-uvb-lights-for-leopard-geckos-2026",
      }),
    });

    expect(metadata).toEqual({});
  });

  it("builds policy metadata using the localized title and intro", async () => {
    const { generateMetadata } = await import("@/app/[locale]/policies/[slug]/page");

    const metadata = await generateMetadata({
      params: Promise.resolve({
        locale: "en",
        slug: "returns",
      }),
    });

    expect(metadata.title).toBe("Shipping and Returns | PetQuirky");
    expect(metadata.description).toContain("14-day returns window");
    expect(metadata.alternates?.canonical).toBe(`${getSiteUrl()}/en/policies/returns`);
  });

  it("returns an empty object for unsupported policy slugs", async () => {
    const { generateMetadata } = await import("@/app/[locale]/policies/[slug]/page");

    const metadata = await generateMetadata({
      params: Promise.resolve({
        locale: "en",
        slug: "faq",
      }),
    });

    expect(metadata).toEqual({});
  });
});
