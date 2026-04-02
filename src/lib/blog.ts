import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  blogPosts,
  type BlogBody,
  type BlogCategory,
  type BlogPost,
} from "@/data/blog/posts";
import type { Locale } from "@/lib/i18n";

const blogContentDirectory = join(process.cwd(), "src/data/blog");
const localeSectionPattern = /^\[(en|de|fr|es)\]\s*$/gm;

function parseMarkdownBody(content: string): BlogBody {
  const intro: string[] = [];
  const sections: BlogBody["sections"] = [];
  const bullets: string[] = [];
  let recommendedProductSlug: string | undefined;
  let activeSection: BlogBody["sections"][number] | null = null;

  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) {
      continue;
    }

    if (lines.length === 1 && /^\[product:[a-z0-9-]+\]$/i.test(lines[0])) {
      recommendedProductSlug = lines[0].slice(9, -1);
      continue;
    }

    if (lines.every((line) => line.startsWith("- "))) {
      bullets.push(...lines.map((line) => line.slice(2).trim()));
      continue;
    }

    if (lines[0].startsWith("## ")) {
      activeSection = {
        heading: lines[0].slice(3).trim(),
        paragraphs: lines.slice(1).join(" ").trim() ? [lines.slice(1).join(" ").trim()] : [],
      };
      sections.push(activeSection);
      continue;
    }

    const paragraph = lines.join(" ").trim();
    if (!paragraph) {
      continue;
    }

    if (activeSection) {
      activeSection.paragraphs.push(paragraph);
    } else {
      intro.push(paragraph);
    }
  }

  return {
    intro,
    bullets: bullets.length > 0 ? bullets : undefined,
    sections,
    recommendedProductSlug,
  };
}

function parseLocalizedMarkdown(slug: string): Record<Locale, BlogBody> {
  const fileContent = readFileSync(join(blogContentDirectory, `${slug}.md`), "utf8");
  const sections = Array.from(fileContent.matchAll(localeSectionPattern));
  const bodies = {} as Record<Locale, BlogBody>;

  sections.forEach((match, index) => {
    const locale = match[1] as Locale;
    const start = match.index ?? 0;
    const contentStart = start + match[0].length;
    const contentEnd = index + 1 < sections.length ? sections[index + 1].index ?? fileContent.length : fileContent.length;
    const bodyContent = fileContent.slice(contentStart, contentEnd).trim();
    bodies[locale] = parseMarkdownBody(bodyContent);
  });

  return bodies;
}

export function getAllBlogPosts() {
  return blogPosts
    .map((post) => ({
      ...post,
      body: parseLocalizedMarkdown(post.slug),
    }))
    .sort(
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
