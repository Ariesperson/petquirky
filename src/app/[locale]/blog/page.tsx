import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCategories } from "@/components/blog/BlogCategories";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { getFeaturedBlogPost, filterBlogPosts } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";
import { getDictionary, isLocale } from "@/lib/i18n";
import type { BlogCategory } from "@/data/blog/posts";

type BlogListingPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: BlogListingPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: "/blog",
    title: "PetQuirky Blog",
    description: "Care guides, smart product stories, and practical advice for unique pets.",
  });
}

export default async function BlogListingPage({
  params,
  searchParams,
}: BlogListingPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const { category } = await searchParams;
  const dict = await getDictionary(locale);
  const allowedCategories: BlogCategory[] = [
    "all",
    "cat-care",
    "dog-care",
    "reptile-care",
    "small-pets",
    "product-guides",
  ];
  const currentCategory = allowedCategories.includes(category as BlogCategory)
    ? (category as BlogCategory)
    : "all";
  const featuredPost = getFeaturedBlogPost();
  const posts = filterBlogPosts(currentCategory);

  const categories: Array<{ value: BlogCategory; label: string }> = [
    { value: "all", label: dict.blog.all },
    { value: "cat-care", label: dict.blog.cat_care },
    { value: "dog-care", label: dict.blog.dog_care },
    { value: "reptile-care", label: dict.blog.reptile_care },
    { value: "small-pets", label: dict.blog.small_pets },
    { value: "product-guides", label: dict.blog.product_guides },
  ];

  const categoryLabels: Record<string, string> = Object.fromEntries(
    categories.map((item) => [item.value, item.label])
  );

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-heading text-5xl font-extrabold text-dark">{dict.blog.title}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">{dict.blog.subtitle}</p>
      </header>

      <BlogCategories
        locale={locale}
        currentCategory={currentCategory}
        categories={categories}
      />

      {featuredPost && currentCategory === "all" ? (
        <FeaturedArticle
          locale={locale}
          post={featuredPost}
          categoryLabel={categoryLabels[featuredPost.category]}
          readMoreLabel={dict.blog.read_more}
        />
      ) : null}

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            locale={locale}
            post={post}
            categoryLabel={categoryLabels[post.category]}
            readMoreLabel={dict.blog.read_more}
          />
        ))}
      </section>
    </main>
  );
}
