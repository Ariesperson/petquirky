import Link from "next/link";
import { Star } from "lucide-react";

import { formatPrice, type ProductListingItem } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

type ProductRecommendationProps = {
  locale: Locale;
  product: ProductListingItem;
  eyebrow: string;
  ctaLabel: string;
};

export function ProductRecommendation({
  locale,
  product,
  eyebrow,
  ctaLabel,
}: ProductRecommendationProps) {
  return (
    <section className="rounded-[28px] bg-primary-tint p-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <div className="mt-5 flex flex-col gap-6 rounded-[24px] bg-white p-6 md:flex-row md:items-center">
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="block overflow-hidden rounded-[22px] bg-[#f6f3f2] md:w-48"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name[locale]}
            className="aspect-square h-full w-full object-cover"
          />
        </Link>
        <div className="flex-1">
          <h3 className="font-heading text-2xl font-extrabold text-dark">
            {product.name[locale]}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-dark">
            <Star className="size-4 fill-[#fbbf24] text-[#fbbf24]" />
            <span className="font-semibold">{product.averageRating.toFixed(1)}</span>
            <span className="text-muted">({product.reviewCount})</span>
          </div>
          <p className="mt-4 text-2xl font-extrabold text-primary">
            {formatPrice(product.price.amount, locale)}
          </p>
        </div>
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="inline-flex items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
