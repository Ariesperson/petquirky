import Link from "next/link";
import { Star } from "lucide-react";

import { formatPrice, type ProductListingItem } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

type ProductCardProps = {
  locale: Locale;
  product: ProductListingItem;
  labels: {
    addToCart: string;
    reviews: string;
    badges: {
      new: string;
      bestseller: string;
      sale: string;
    };
    petTypes: Record<string, string>;
  };
};

function getBadgeLabel(
  badge: ProductListingItem["badge"],
  labels: ProductCardProps["labels"]["badges"]
) {
  if (!badge) {
    return null;
  }

  return labels[badge];
}

export function ProductCard({ locale, product, labels }: ProductCardProps) {
  const badgeLabel = getBadgeLabel(product.badge, labels.badges);

  return (
    <article className="group flex h-full flex-col rounded-[30px] bg-white p-4 shadow-[0_18px_42px_rgba(165,54,13,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(165,54,13,0.13)]">
      <div className="relative mb-6 aspect-square overflow-hidden rounded-[24px] bg-[#f6f3f2]">
        <Link href={`/${locale}/products/${product.slug}`} className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name[locale]}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        </Link>
        {badgeLabel ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            {badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-1 text-xs text-dark">
          <Star className="size-4 fill-[#fbbf24] text-[#fbbf24]" />
          <span className="font-semibold">{product.averageRating.toFixed(1)}</span>
          <span className="text-muted">
            ({product.reviewCount} {labels.reviews})
          </span>
        </div>

        <h3 className="mt-2 font-heading text-2xl leading-tight text-dark transition group-hover:text-primary">
          <Link href={`/${locale}/products/${product.slug}`}>{product.name[locale]}</Link>
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {product.petType.map((petType) => (
            <span
              key={petType}
              className="rounded-md bg-[#f0eded] px-2 py-1 text-[10px] font-bold text-dark/70"
            >
              {labels.petTypes[petType]}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price.amount, locale)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.compareAtPrice.amount, locale)}
              </span>
            ) : null}
          </div>

          <Link
            href={`/${locale}/products/${product.slug}`}
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            {labels.addToCart}
          </Link>
        </div>
      </div>
    </article>
  );
}
