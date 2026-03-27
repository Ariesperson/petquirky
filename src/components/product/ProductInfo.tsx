import { ShieldCheck, Star } from "lucide-react";

import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ShippingEstimate } from "@/components/product/ShippingEstimate";
import { formatPrice, type ProductListingItem } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

type ProductInfoProps = {
  locale: Locale;
  product: ProductListingItem;
  petTypeLabels: Record<string, string>;
  badgeLabel?: string | null;
  labels: {
    addToCart: string;
    quantity: string;
    mobileAddToCart: string;
    overviewTitle: string;
    shippingTo: string;
    estimatedDelivery: string;
    freeShipping: string;
    returns: string;
    certified: string;
    reviews: string;
  };
};

export function ProductInfo({
  locale,
  product,
  petTypeLabels,
  badgeLabel,
  labels,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {badgeLabel ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {badgeLabel}
          </span>
        ) : null}
        {product.petType.map((petType) => (
          <span
            key={petType}
            className="rounded-full bg-[#eae7e7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-dark/70"
          >
            {petTypeLabels[petType]}
          </span>
        ))}
      </div>

      <h1 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-dark lg:text-5xl">
        {product.name[locale]}
      </h1>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1 text-primary">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="size-4 fill-current" />
          ))}
        </div>
        <p className="text-sm font-semibold text-dark">
          {product.averageRating.toFixed(1)} ({product.reviewCount} {labels.reviews})
        </p>
      </div>

      <div className="mt-8 flex items-baseline gap-4">
        <span className="text-4xl font-extrabold text-primary">
          {formatPrice(product.price.amount, locale)}
        </span>
        {product.compareAtPrice ? (
          <span className="text-xl text-muted line-through">
            {formatPrice(product.compareAtPrice.amount, locale)}
          </span>
        ) : null}
      </div>

      <div className="mt-8">
        <AddToCartButton
          productId={product.id}
          addToCartLabel={labels.addToCart}
          quantityLabel={labels.quantity}
          mobileLabel={labels.mobileAddToCart}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 border-y border-[#e4d2cb]/60 py-6 text-[11px] font-bold uppercase tracking-[0.16em] text-dark/72 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span>🚚</span>
          {labels.freeShipping}
        </div>
        <div className="flex items-center gap-2">
          <span>🔄</span>
          {labels.returns}
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-success" />
          {labels.certified}
        </div>
      </div>

      <ShippingEstimate
        shippingToLabel={labels.shippingTo}
        estimatedDeliveryLabel={labels.estimatedDelivery}
      />

      <section>
        <h2 className="font-heading text-3xl font-extrabold text-dark">
          {labels.overviewTitle}
        </h2>
        <p className="mt-4 text-base leading-8 text-muted">{product.description[locale]}</p>
      </section>
    </div>
  );
}
