import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog/posts";
import { getAllProducts } from "@/lib/products";
import { buildLocaleUrl, getSiteUrl } from "@/lib/seo";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/products",
    "/blog",
    "/about",
    "/contact",
    "/account",
    "/cart",
    "/policies/privacy",
    "/policies/terms",
    "/policies/returns",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    staticPaths.forEach((path) => {
      entries.push({
        url: buildLocaleUrl(locale, path),
        lastModified: new Date(),
      });
    });

    getAllProducts().forEach((product) => {
      entries.push({
        url: buildLocaleUrl(locale, `/products/${product.slug}`),
        lastModified: new Date(product.createdAt),
      });
    });

    blogPosts.forEach((post) => {
      entries.push({
        url: buildLocaleUrl(locale, `/blog/${post.slug}`),
        lastModified: new Date(post.publishedAt),
      });
    });
  }

  entries.push({
    url: getSiteUrl(),
    lastModified: new Date(),
  });

  return entries;
}
