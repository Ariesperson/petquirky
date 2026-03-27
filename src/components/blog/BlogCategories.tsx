import Link from "next/link";

import type { BlogCategory } from "@/data/blog/posts";
import type { Locale } from "@/lib/i18n";

type BlogCategoriesProps = {
  locale: Locale;
  currentCategory: BlogCategory;
  categories: Array<{ value: BlogCategory; label: string }>;
};

export function BlogCategories({
  locale,
  currentCategory,
  categories,
}: BlogCategoriesProps) {
  return (
    <div className="mb-14 flex gap-3 overflow-x-auto pb-3">
      {categories.map((category) => {
        const active = category.value === currentCategory;
        const href =
          category.value === "all"
            ? `/${locale}/blog`
            : `/${locale}/blog?category=${category.value}`;

        return (
          <Link
            key={category.value}
            href={href}
            className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition ${
              active
                ? "bg-primary text-white shadow-[0_12px_24px_rgba(165,54,13,0.2)]"
                : "bg-[#eae7e7] text-dark hover:bg-primary-tint"
            }`}
          >
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
