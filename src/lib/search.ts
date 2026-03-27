import type { Locale } from "@/lib/i18n";
import { formatPrice, getAllProducts } from "@/lib/products";

export type ProductSearchResult = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: string;
};

export function searchProducts(
  locale: Locale,
  query: string,
  limit = 5
): ProductSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return getAllProducts()
    .filter((product) => {
      const haystack = [
        product.name[locale],
        product.description[locale],
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .slice(0, limit)
    .map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name[locale],
      description: product.description[locale],
      image: product.images[0],
      price: formatPrice(product.price.amount, locale),
    }));
}
