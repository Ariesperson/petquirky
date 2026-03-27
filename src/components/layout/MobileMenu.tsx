"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";

import { localeLabels, locales, type Locale } from "@/lib/i18n";

type MobileMenuProps = {
  locale: Locale;
  labels: {
    home: string;
    products: string;
    blog: string;
    about: string;
    contact: string;
    account: string;
    cart: string;
    search: string;
    openMenu: string;
    closeMenu: string;
  };
  localeLabel: string;
  localeNames: Record<Locale, string>;
  cartCount?: number;
};

function replaceLocaleInPath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  return `/${nextLocale}${pathname === "/" ? "" : pathname}`;
}

export function MobileMenu({
  locale,
  labels,
  localeLabel,
  localeNames,
  cartCount = 0,
}: MobileMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { href: `/${locale}`, label: labels.home },
    { href: `/${locale}/products`, label: labels.products },
    { href: `/${locale}/blog`, label: labels.blog },
    { href: `/${locale}/about`, label: labels.about },
    { href: `/${locale}/contact`, label: labels.contact },
  ];

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? labels.closeMenu : labels.openMenu}
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-dark shadow-[0_10px_24px_rgba(165,54,13,0.12)] transition hover:scale-105 md:hidden"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[65] bg-dark/35 backdrop-blur-sm md:hidden">
          <div className="absolute inset-x-3 top-3 rounded-[32px] bg-[#fcf9f8] p-5 shadow-[0_24px_60px_rgba(165,54,13,0.18)]">
            <div className="flex items-center justify-between">
              <div className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {localeLabel}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={labels.closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark shadow-sm"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {navItems.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center rounded-[22px] px-4 py-3 text-base font-semibold transition ${
                      active
                        ? "bg-primary text-white shadow-[0_16px_28px_rgba(216,90,48,0.22)]"
                        : "bg-white/80 text-dark hover:bg-primary-tint"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Link
                href={`/${locale}/search`}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center rounded-[24px] bg-white px-3 py-4 text-sm font-semibold text-dark shadow-sm"
              >
                <Search className="mb-2 size-5" />
                {labels.search}
              </Link>
              <Link
                href={`/${locale}/account`}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center rounded-[24px] bg-white px-3 py-4 text-sm font-semibold text-dark shadow-sm"
              >
                <UserRound className="mb-2 size-5" />
                {labels.account}
              </Link>
              <Link
                href={`/${locale}/cart`}
                onClick={() => setIsOpen(false)}
                className="relative flex flex-col items-center rounded-[24px] bg-white px-3 py-4 text-sm font-semibold text-dark shadow-sm"
              >
                <ShoppingBag className="mb-2 size-5" />
                {labels.cart}
                <span className="absolute right-3 top-3 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              </Link>
            </div>

            <div className="mt-5 rounded-[28px] bg-[#f6f3f2] p-4">
              <div className="mt-3 flex flex-wrap gap-2">
                {locales.map((nextLocale) => {
                  const href = replaceLocaleInPath(pathname, nextLocale);
                  const active = nextLocale === locale;

                  return (
                    <Link
                      key={nextLocale}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-primary text-white"
                          : "bg-white text-dark hover:bg-primary-tint"
                      }`}
                    >
                      {localeLabels[nextLocale]} · {localeNames[nextLocale]}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
