import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type Category = {
  emoji: string;
  label: string;
};

type CategoryShowcaseProps = {
  locale: Locale;
  title: string;
  browseAllLabel: string;
  categories: Category[];
};

export function CategoryShowcase({
  locale,
  title,
  browseAllLabel,
  categories,
}: CategoryShowcaseProps) {
  return (
    <section className="bg-[#fcf9f8] py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-dark">
            {title}
          </h2>
          <Link
            href={`/${locale}/products`}
            className="text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4"
          >
            {browseAllLabel}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={`/${locale}/products`}
              className="group rounded-[30px] bg-[#f6f3f2] px-5 py-8 text-center transition hover:-translate-y-1 hover:bg-[#ece6e4]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-[0_14px_24px_rgba(165,54,13,0.08)] transition group-hover:scale-110">
                {category.emoji}
              </div>
              <p className="mt-5 text-base font-semibold text-dark">{category.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
