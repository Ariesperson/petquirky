import { blogPosts, type BlogCategory, type BlogPost } from "@/data/blog/posts";
import type { Locale } from "@/lib/i18n";

export function getAllBlogPosts() {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedBlogPost() {
  return getAllBlogPosts().find((post) => post.featured) ?? getAllBlogPosts()[0];
}

export function getBlogPostBySlug(slug: string) {
  return getAllBlogPosts().find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(slug: string, category: BlogCategory) {
  return getAllBlogPosts()
    .filter((post) => post.slug !== slug && post.category === category)
    .slice(0, 3);
}

export function filterBlogPosts(category?: BlogCategory) {
  if (!category || category === "all") {
    return getAllBlogPosts();
  }

  return getAllBlogPosts().filter((post) => post.category === category);
}

export function getBlogCategoryLabelKey(category: BlogCategory) {
  switch (category) {
    case "cat-care":
      return "cat_care";
    case "dog-care":
      return "dog_care";
    case "reptile-care":
      return "reptile_care";
    case "small-pets":
      return "small_pets";
    case "product-guides":
      return "product_guides";
    case "all":
    default:
      return "all";
  }
}

export function formatBlogDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getLocalizedPostValue<T extends keyof BlogPost>(
  post: BlogPost,
  key: T,
  locale: Locale
) {
  const value = post[key];
  if (typeof value === "object" && value !== null && locale in value) {
    return value[locale as keyof typeof value];
  }

  return value;
}
