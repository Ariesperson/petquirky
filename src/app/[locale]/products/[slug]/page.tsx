import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ReviewSection } from "@/components/product/ReviewSection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getProductBySlug,
  getRatingDistribution,
  getRelatedProducts,
  getReviewsByProductId,
} from "@/lib/products";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildLocaleUrl, createPageMetadata } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const product = getProductBySlug(slug);
  if (!product) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/products/${slug}`,
    title: product.seo.title[locale],
    description: product.seo.description[locale],
    image: product.images[0],
  });
}

function getBadgeLabel(
  badge: "new" | "bestseller" | "sale" | undefined,
  labels: {
    new: string;
    bestseller: string;
    sale: string;
  }
) {
  if (!badge) {
    return null;
  }

  return labels[badge];
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const badgeLabels = {
    new: dict.products.badge_new,
    bestseller: dict.products.badge_bestseller,
    sale: dict.products.badge_sale,
  };

  const badgeLabel = getBadgeLabel(product.badge, badgeLabels);
  const productReviews = getReviewsByProductId(product.id);
  const distribution = getRatingDistribution(product.id);
  const relatedProducts = getRelatedProducts(product.id, product.category, locale as Locale);
  const productUrl = buildLocaleUrl(locale, `/products/${slug}`);

  const petTypeLabels: Record<string, string> = {
    cat: `🐈 ${dict.products.pet_cats}`,
    dog: `🐕 ${dict.products.pet_dogs}`,
    reptile: `🦎 ${dict.products.pet_reptiles}`,
    hamster: `🐹 ${dict.products.pet_hamsters}`,
    rabbit: `🐇 ${dict.products.pet_rabbits}`,
    bird: `🐦 ${dict.products.pet_birds}`,
    fish: `🐠 ${dict.products.pet_fish}`,
    other: dict.products.pet_other,
  };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name[locale],
          description: product.description[locale],
          image: product.images,
          sku: product.id,
          category: product.category,
          url: productUrl,
          brand: {
            "@type": "Brand",
            name: "PetQuirky",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: product.price.currency,
            price: product.price.amount.toFixed(2),
            availability:
              product.stock === "out_of_stock"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            url: productUrl,
          },
          aggregateRating:
            product.reviewCount > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: product.averageRating.toFixed(1),
                  reviewCount: product.reviewCount,
                }
              : undefined,
          review: productReviews.slice(0, 3).map((review) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: review.authorName,
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
            },
            headline: review.title,
            reviewBody: review.content,
            datePublished: review.date,
          })),
        }}
      />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-muted">
          <Link href={`/${locale}`} className="transition hover:text-primary">
            {dict.nav.home}
          </Link>
          <ChevronRight className="size-4" />
          <Link href={`/${locale}/products`} className="transition hover:text-primary">
            {dict.product_detail.breadcrumb_products}
          </Link>
          <ChevronRight className="size-4" />
          <span className="font-semibold text-dark">{product.name[locale]}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] xl:gap-20">
          <ProductGallery locale={locale} product={product} badgeLabel={badgeLabel} />
          <ProductInfo
            locale={locale}
            product={product}
            petTypeLabels={petTypeLabels}
            badgeLabel={badgeLabel}
            labels={{
              addToCart: dict.product.add_to_cart,
              quantity: dict.product_detail.quantity,
              mobileAddToCart: dict.product_detail.add_to_cart_mobile,
              overviewTitle: dict.product_detail.overview_title,
              shippingTo: dict.product_detail.shipping_to,
              estimatedDelivery: dict.product_detail.estimated_delivery,
              freeShipping: dict.product_detail.free_shipping,
              returns: dict.product_detail.returns,
              certified: dict.product_detail.certified,
              reviews: dict.products.reviews_label,
            }}
          />
        </div>

        <ProductSpecs
          title={dict.product_detail.details_title}
          specifications={product.specifications}
          weight={product.weight}
        />

        <ReviewSection
          title={dict.product_detail.reviews_title}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
          reviews={productReviews}
          distribution={distribution}
          labels={{
            basedOnReviews: dict.product_detail.based_on_reviews,
            verifiedPurchase: dict.product_detail.verified_purchase,
            starsLabel: dict.product_detail.distribution_stars,
          }}
        />

        <RelatedProducts
          locale={locale}
          title={dict.product_detail.related_title}
          products={relatedProducts}
          labels={{
            addToCart: dict.product.add_to_cart,
            reviews: dict.products.reviews_label,
            badges: badgeLabels,
            petTypes: petTypeLabels,
          }}
        />
      </main>
    </>
  );
}
