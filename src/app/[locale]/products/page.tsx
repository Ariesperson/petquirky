import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CategoryFilter } from "@/components/product/CategoryFilter";
import { PetTypeFilter } from "@/components/product/PetTypeFilter";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchBar } from "@/components/product/SearchBar";
import { SortSelect } from "@/components/product/SortSelect";
import {
  filterProducts,
  getProductCategories,
  type ProductSortKey,
} from "@/lib/products";
import { getDictionary, isLocale } from "@/lib/i18n";
import type { PetType, ProductCategory } from "@/types/product";
import { notFound } from "next/navigation";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    petType?: string;
    sort?: string;
  }>;
};

const sortValues: ProductSortKey[] = [
  "recommended",
  "price-low-high",
  "price-high-low",
  "newest",
  "top-rated",
];

const productCategoryValues: ProductCategory[] = [
  "smart-toys",
  "feeding",
  "enrichment",
  "habitat",
  "tracking",
  "grooming",
];

const petTypeValues: PetType[] = [
  "cat",
  "dog",
  "reptile",
  "hamster",
  "rabbit",
  "bird",
  "fish",
  "other",
];

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const query = await searchParams;
  const dict = await getDictionary(locale);

  const category = productCategoryValues.includes(query.category as ProductCategory)
    ? (query.category as ProductCategory)
    : "all";
  const petType = petTypeValues.includes(query.petType as PetType)
    ? (query.petType as PetType)
    : "all";
  const sort = sortValues.includes(query.sort as ProductSortKey)
    ? (query.sort as ProductSortKey)
    : "recommended";

  const products = filterProducts(locale, {
    category,
    petType,
    sort,
    query: query.q,
  });

  const categoryDefinitions = getProductCategories();

  const categoryLabels: Record<string, string> = {
    "smart-toys": dict.products.category_smart_toys,
    feeding: dict.products.category_feeding,
    enrichment: dict.products.category_feeding,
    habitat: dict.products.category_habitat,
    tracking: dict.products.category_tracking,
    grooming: dict.products.category_grooming,
  };

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
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href={`/${locale}`} className="transition hover:text-primary">
          {dict.nav.home}
        </Link>
        <ChevronRight className="size-4" />
        <span className="font-semibold text-dark">{dict.nav.products}</span>
      </nav>

      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-heading text-5xl font-extrabold tracking-[-0.04em] text-primary md:text-6xl">
            {dict.products.page_title}
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-7 text-muted">
            {dict.products.page_subtitle.replace("{count}", String(products.length))}
          </p>
        </div>
      </div>

      <SearchBar placeholder={dict.products.search_placeholder} />

      <section className="mb-12 rounded-[32px] bg-[#f6f3f2] p-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-start gap-6">
            <CategoryFilter
              label={dict.products.category_label}
              value={category}
              options={[
                { value: "all", label: dict.products.all_categories },
                ...categoryDefinitions.map((item) => ({
                  value: item.id,
                  label: categoryLabels[item.id],
                })),
              ]}
            />
            <PetTypeFilter
              label={dict.products.pet_type_label}
              value={petType}
              options={[
                { value: "all", label: dict.products.all_pets },
                { value: "cat", label: dict.products.pet_cats },
                { value: "dog", label: dict.products.pet_dogs },
                { value: "reptile", label: dict.products.pet_reptiles },
                { value: "hamster", label: dict.products.pet_hamsters },
                { value: "rabbit", label: dict.products.pet_rabbits },
              ]}
            />
          </div>

          <SortSelect
            label={dict.products.sort_label}
            value={sort}
            options={[
              { value: "recommended", label: dict.products.sort_recommended },
              { value: "price-low-high", label: dict.products.sort_price_low_high },
              { value: "price-high-low", label: dict.products.sort_price_high_low },
              { value: "newest", label: dict.products.sort_newest },
              { value: "top-rated", label: dict.products.sort_top_rated },
            ]}
          />
        </div>
      </section>

      {products.length === 0 ? (
        <section className="rounded-[32px] bg-white px-6 py-14 text-center shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
          <h2 className="font-heading text-3xl font-extrabold text-dark">
            {dict.products.empty_title}
          </h2>
          <p className="mt-3 text-base text-muted">{dict.products.empty_description}</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              locale={locale}
              product={product}
              labels={{
                addToCart: dict.product.add_to_cart,
                reviews: dict.products.reviews_label,
                badges: {
                  new: dict.products.badge_new,
                  bestseller: dict.products.badge_bestseller,
                  sale: dict.products.badge_sale,
                },
                petTypes: petTypeLabels,
              }}
            />
          ))}
        </section>
      )}
    </main>
  );
}
