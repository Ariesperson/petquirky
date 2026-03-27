import Link from "next/link";

import type { BlogPost } from "@/data/blog/posts";
import type { Locale } from "@/lib/i18n";
import { formatBlogDate } from "@/lib/blog";

type FeaturedArticleProps = {
  locale: Locale;
  post: BlogPost;
  categoryLabel: string;
  readMoreLabel: string;
};

export function FeaturedArticle({
  locale,
  post,
  categoryLabel,
  readMoreLabel,
}: FeaturedArticleProps) {
  return (
    <section className="mb-20 overflow-hidden rounded-[32px] bg-[#f6f3f2] shadow-[0_16px_36px_rgba(165,54,13,0.08)]">
      <div className="grid grid-cols-1 md:grid-cols-[1.45fr_1fr]">
        <div className="relative min-h-[320px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title[locale]}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {categoryLabel}
          </span>
          <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-dark">
            {post.title[locale]}
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">{post.excerpt[locale]}</p>
          <div className="mt-6 text-sm font-medium text-muted">
            {formatBlogDate(post.publishedAt, locale)} · {post.readingMinutes} min
          </div>
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className="mt-8 inline-flex items-center text-sm font-semibold text-primary"
          >
            {readMoreLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
