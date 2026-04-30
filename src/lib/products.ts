import categories from "@/data/products/categories.json";
import products from "@/data/products/index.json";
import reviews from "@/data/reviews.json";
import type { Locale } from "@/lib/i18n";
import type { PetType, Product, ProductBadge, ProductCategory } from "@/types/product";

export type ProductSortKey =
  | "recommended"
  | "price-low-high"
  | "price-high-low"
  | "newest"
  | "top-rated";

export type ProductReview = (typeof reviews)[number];
export type CategoryDefinition = (typeof categories)[number];

export type ProductListingItem = Product & {
  averageRating: number;
  reviewCount: number;
};

export type ProductFilters = {
  category?: ProductCategory | "all";
  petType?: PetType | "all";
  sort?: ProductSortKey;
  query?: string;
};

const productList = products as unknown as Product[];

function getRatingSummary(productId: string) {
  const productReviews = reviews.filter((review) => review.productId === productId);
  if (productReviews.length === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }

  const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    averageRating: Number((total / productReviews.length).toFixed(1)),
    reviewCount: productReviews.length,
  };
}

export function getAllProducts(): ProductListingItem[] {
  return productList.map((product) => ({
    ...product,
    ...getRatingSummary(product.id),
  }));
}

export function getFeaturedProducts() {
  return getAllProducts().filter((product) => product.featured);
}

export function getProductCategories() {
  return categories as CategoryDefinition[];
}

export function getAllReviews() {
  return reviews as ProductReview[];
}

export function getProductBySlug(slug: string) {
  return getAllProducts().find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return getAllProducts().find((product) => product.id === id);
}

export function getReviewsByProductId(productId: string) {
  return reviews.filter((review) => review.productId === productId);
}

export function getRatingDistribution(productId: string) {
  const productReviews = getReviewsByProductId(productId);
  const total = productReviews.length;
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = productReviews.filter((review) => review.rating === rating).length;
    return {
      rating,
      count,
      percentage: total === 0 ? 0 : Math.round((count / total) * 100),
    };
  });

  return distribution;
}

export function getRelatedProducts(productId: string, category: ProductCategory, locale: Locale) {
  return filterProducts(locale, { category, sort: "recommended" })
    .filter((product) => product.id !== productId)
    .slice(0, 4);
}

function matchesQuery(product: ProductListingItem, locale: Locale, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const haystack = [
    product.name[locale],
    product.description[locale],
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function sortProducts(productsToSort: ProductListingItem[], sort: ProductSortKey) {
  const sortable = [...productsToSort];

  switch (sort) {
    case "price-low-high":
      return sortable.sort((a, b) => a.price.amount - b.price.amount);
    case "price-high-low":
      return sortable.sort((a, b) => b.price.amount - a.price.amount);
    case "newest":
      return sortable.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "top-rated":
      return sortable.sort((a, b) => {
        if (b.averageRating === a.averageRating) {
          return b.reviewCount - a.reviewCount;
        }
        return b.averageRating - a.averageRating;
      });
    case "recommended":
    default:
      return sortable.sort((a, b) => {
        const badgeScore = (badge?: ProductBadge) => {
          switch (badge) {
            case "bestseller":
              return 3;
            case "sale":
              return 2;
            case "new":
              return 1;
            default:
              return 0;
          }
        };

        return (
          Number(b.featured) - Number(a.featured) ||
          badgeScore(b.badge) - badgeScore(a.badge) ||
          b.averageRating - a.averageRating ||
          a.price.amount - b.price.amount
        );
      });
  }
}

export function filterProducts(locale: Locale, filters: ProductFilters) {
  const category = filters.category ?? "all";
  const petType = filters.petType ?? "all";
  const sort = filters.sort ?? "recommended";
  const query = filters.query ?? "";

  const filtered = getAllProducts().filter((product) => {
    const categoryMatch = category === "all" ? true : product.category === category;
    const petTypeMatch = petType === "all" ? true : product.petType.includes(petType);
    const queryMatch = matchesQuery(product, locale, query);

    return categoryMatch && petTypeMatch && queryMatch;
  });

  return sortProducts(filtered, sort);
}

export function formatPrice(amount: number, locale: Locale) {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} €`;
}
