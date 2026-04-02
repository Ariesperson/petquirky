import { ProductCard } from "@/components/product/ProductCard";
import type { Locale } from "@/lib/i18n";
import type { ProductListingItem } from "@/lib/products";

type FeaturedProductsProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  products: ProductListingItem[];
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

export function FeaturedProducts({
  locale,
  title,
  subtitle,
  products,
  labels,
}: FeaturedProductsProps) {
  return (
    <section className="bg-[#f6f3f2] py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-dark">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">{subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} locale={locale} product={product} labels={labels} />
          ))}
        </div>
      </div>
    </section>
  );
}
