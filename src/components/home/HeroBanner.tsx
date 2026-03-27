import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type HeroBannerProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
};

const petTiles = [
  { emoji: "🐈", className: "bg-[#f4d9c9]" },
  { emoji: "🐕", className: "bg-[#f2e3d6]" },
  { emoji: "🦎", className: "bg-[#dce8da]" },
  { emoji: "🐹", className: "bg-[#efe4d5]" },
];

export function HeroBanner({
  locale,
  title,
  subtitle,
  ctaLabel,
  secondaryCtaLabel,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff0eb_0%,#fcf9f8_62%,#ffffff_100%)] py-12 sm:py-16 lg:py-24">
      <div className="absolute right-[-9rem] top-[-5rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <div className="relative z-10">
          <h1 className="mt-4 max-w-2xl font-heading text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] text-dark sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-7 py-4 text-base font-semibold text-white shadow-[0_20px_38px_rgba(216,90,48,0.28)] transition hover:scale-[1.02]"
            >
              {ctaLabel}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center justify-center rounded-full bg-white/85 px-7 py-4 text-base font-semibold text-dark shadow-[0_14px_32px_rgba(165,54,13,0.1)] transition hover:bg-white"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4 rounded-[34px] bg-white/75 p-3 shadow-[0_28px_70px_rgba(165,54,13,0.15)] backdrop-blur-sm sm:p-4 lg:rotate-[2deg]">
            {petTiles.map((tile, index) => (
              <div
                key={tile.emoji}
                className={`group relative aspect-square overflow-hidden rounded-[28px] ${tile.className} ${
                  index === 1 ? "translate-y-6" : ""
                } ${index === 2 ? "-translate-y-4" : ""}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_55%)]" />
                <div className="flex h-full flex-col justify-between p-5">
                  <span className="text-6xl drop-shadow-sm transition group-hover:scale-110">
                    {tile.emoji}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -bottom-5 -left-3 hidden max-w-[220px] rounded-[28px] bg-white px-5 py-4 shadow-[0_24px_50px_rgba(165,54,13,0.16)] lg:block">
            <div className="flex items-center gap-3 text-dark">
              <span className="text-2xl">✦</span>
              <span className="h-px flex-1 bg-primary/25" />
              <span className="text-2xl">✦</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
