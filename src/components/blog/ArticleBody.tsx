import Link from "next/link";

import { ProductRecommendation } from "@/components/blog/ProductRecommendation";
import type { BlogPost } from "@/data/blog/posts";
import type { Locale } from "@/lib/i18n";
import { formatBlogDate } from "@/lib/blog";
import type { ProductListingItem } from "@/lib/products";

type ArticleBodyProps = {
  locale: Locale;
  post: BlogPost;
  labels: {
    byline: string;
    recommended: string;
    viewProduct: string;
    related: string;
    readMore: string;
  };
  relatedPosts: BlogPost[];
  relatedCategoryLabels: Record<string, string>;
  recommendedProduct?: ProductListingItem;
};

export function ArticleBody({
  locale,
  post,
  labels,
  relatedPosts,
  relatedCategoryLabels,
  recommendedProduct,
}: ArticleBodyProps) {
  const body = post.body[locale];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="text-center">
          <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white">
            {relatedCategoryLabels[post.category]}
          </span>
          <h1 className="mt-6 font-heading text-5xl font-extrabold leading-tight text-dark md:text-6xl">
            {post.title[locale]}
          </h1>
          <div className="mt-5 text-sm font-medium text-muted">
            {labels.byline} · {formatBlogDate(post.publishedAt, locale)} · {post.readingMinutes} min
          </div>
          <div className="relative mt-10 overflow-hidden rounded-[32px] bg-primary-tint shadow-[0_20px_44px_rgba(165,54,13,0.1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title[locale]} className="aspect-[21/9] w-full object-cover" />
          </div>
        </header>

        <div className="mt-14 space-y-12">
          <section className="space-y-6 text-base leading-8 text-muted">
            {body.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          {body.bullets?.length ? (
            <ul className="space-y-4 rounded-[28px] bg-[#f6f3f2] p-8">
              {body.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-base leading-7 text-dark">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {body.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-3xl font-extrabold text-dark">{section.heading}</h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {recommendedProduct ? (
            <ProductRecommendation
              locale={locale}
              product={recommendedProduct}
              eyebrow={labels.recommended}
              ctaLabel={labels.viewProduct}
            />
          ) : null}
        </div>
      </article>

      {relatedPosts.length ? (
        <section className="mx-auto mt-24 max-w-6xl">
          <h2 className="text-center font-heading text-4xl font-extrabold text-dark">
            {labels.related}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/${locale}/blog/${relatedPost.slug}`}
                className="overflow-hidden rounded-[28px] bg-[#f6f3f2] shadow-[0_16px_34px_rgba(165,54,13,0.06)] transition hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={relatedPost.image}
                  alt={relatedPost.title[locale]}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {relatedCategoryLabels[relatedPost.category]}
                  </p>
                  <h3 className="mt-3 font-heading text-2xl font-extrabold text-dark">
                    {relatedPost.title[locale]}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{relatedPost.excerpt[locale]}</p>
                  <span className="mt-5 inline-flex text-sm font-semibold text-primary">
                    {labels.readMore}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
