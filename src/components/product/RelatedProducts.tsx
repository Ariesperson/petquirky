import { ProductCard } from "@/components/product/ProductCard";
import type { Locale } from "@/lib/i18n";
import type { ProductListingItem } from "@/lib/products";

type RelatedProductsProps = {
  locale: Locale;
  title: string;
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

export function RelatedProducts({
  locale,
  title,
  products,
  labels,
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-28">
      <h2 className="font-heading text-3xl font-extrabold text-dark">{title}</h2>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            locale={locale}
            product={product}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
}
