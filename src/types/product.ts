import type { Locale } from "@/lib/i18n";

export type ProductCategory =
  | "smart-toys"
  | "feeding"
  | "enrichment"
  | "habitat"
  | "tracking"
  | "grooming";

export type PetType =
  | "cat"
  | "dog"
  | "hamster"
  | "rabbit"
  | "reptile"
  | "bird"
  | "fish"
  | "other";

export type LocalizedText = Record<Locale, string>;

export type ProductBadge = "new" | "bestseller" | "sale";

export type ProductStock = "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
  name: LocalizedText;
  description: LocalizedText;
  price: {
    amount: number;
    currency: "EUR";
  };
  compareAtPrice?: {
    amount: number;
    currency: "EUR";
  };
  images: string[];
  badge?: ProductBadge;
  stock: ProductStock;
  weight: number;
  specifications: Record<string, string>;
  seo: {
    title: LocalizedText;
    description: LocalizedText;
  };
  tags: string[];
  petType: PetType[];
  createdAt: string;
  featured: boolean;
};
