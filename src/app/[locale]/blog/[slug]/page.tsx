import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/blog/ArticleBody";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";
import { getDictionary, isLocale } from "@/lib/i18n";

type BlogArticlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const post = getBlogPostBySlug(slug);
  if (!post) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${post.title[locale]} | PetQuirky`,
    description: post.seoDescription[locale],
    image: post.image,
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, post.category);
  const categoryLabels = {
    "cat-care": dict.blog.cat_care,
    "dog-care": dict.blog.dog_care,
    "reptile-care": dict.blog.reptile_care,
    "small-pets": dict.blog.small_pets,
    "product-guides": dict.blog.product_guides,
  };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title[locale],
          description: post.seoDescription[locale],
          image: post.image,
          datePublished: post.publishedAt,
          author: {
            "@type": "Organization",
            name: "PetQuirky",
          },
        }}
      />
      <ArticleBody
        locale={locale}
        post={post}
        relatedPosts={relatedPosts}
        relatedCategoryLabels={categoryLabels}
        labels={{
          byline: dict.blog.byline,
          recommended: dict.blog.recommended_product,
          viewProduct: dict.blog.view_product,
          related: dict.blog.related_articles,
          readMore: dict.blog.read_more,
        }}
      />
    </>
  );
}
