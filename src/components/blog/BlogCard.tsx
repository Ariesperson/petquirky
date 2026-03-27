import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { formatBlogDate } from "@/lib/blog";
import type { BlogPost } from "@/data/blog/posts";

type BlogCardProps = {
  locale: Locale;
  post: BlogPost;
  categoryLabel: string;
  readMoreLabel: string;
};

export function BlogCard({ locale, post, categoryLabel, readMoreLabel }: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] bg-white shadow-[0_18px_34px_rgba(165,54,13,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(165,54,13,0.1)]">
      <Link href={`/${locale}/blog/${post.slug}`} className="block">
        <div className="relative h-64 overflow-hidden bg-primary-tint">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title[locale]}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur">
            {categoryLabel}
          </span>
        </div>
        <div className="flex min-h-[240px] flex-col p-6">
          <h2 className="font-heading text-2xl font-extrabold text-dark transition group-hover:text-primary">
            {post.title[locale]}
          </h2>
          <p className="mt-3 flex-1 text-sm leading-7 text-muted">{post.excerpt[locale]}</p>
          <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <span>{formatBlogDate(post.publishedAt, locale)}</span>
            <span>{post.readingMinutes} min</span>
          </div>
          <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary">
            {readMoreLabel}
          </span>
        </div>
      </Link>
    </article>
  );
}
