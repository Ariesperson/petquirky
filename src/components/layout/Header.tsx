"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, ShoppingBag, UserRound } from "lucide-react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { useCart } from "@/hooks/useCart";
import { localeLabels, locales, type Locale } from "@/lib/i18n";
import { isNavItemActive } from "@/lib/utils";

type HeaderProps = {
  locale: Locale;
  cartCount?: number;
  dictionary: {
    common: {
      brandPet: string;
      brandQuirky: string;
    };
    locale: {
      label: string;
      names: Record<Locale, string>;
    };
    nav: {
      home: string;
      products: string;
      blog: string;
      about: string;
      contact: string;
      account: string;
      cart: string;
      search: string;
      searchTitle: string;
      searchPlaceholder: string;
      searchEmpty: string;
      openMenu: string;
      closeMenu: string;
    };
  };
};

function replaceLocaleInPath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  return `/${nextLocale}${pathname === "/" ? "" : pathname}`;
}

export function Header({ locale, cartCount = 0, dictionary }: HeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openCart, hydrated } = useCart();
  const isCheckoutPage = pathname === `/${locale}/checkout`;

  if (isCheckoutPage) {
    return null;
  }

  const navItems = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/products`, label: dictionary.nav.products },
    { href: `/${locale}/blog`, label: dictionary.nav.blog },
    { href: `/${locale}/about`, label: dictionary.nav.about },
    { href: `/${locale}/contact`, label: dictionary.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/72 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:hidden">
          <MobileMenu
            locale={locale}
            cartCount={hydrated ? itemCount : cartCount}
            localeLabel={dictionary.locale.label}
            localeNames={dictionary.locale.names}
            labels={{
              home: dictionary.nav.home,
              products: dictionary.nav.products,
              blog: dictionary.nav.blog,
              about: dictionary.nav.about,
              contact: dictionary.nav.contact,
              account: dictionary.nav.account,
              cart: dictionary.nav.cart,
              search: dictionary.nav.search,
              openMenu: dictionary.nav.openMenu,
              closeMenu: dictionary.nav.closeMenu,
            }}
          />
        </div>

        <Link
          href={`/${locale}`}
          className="shrink-0 text-[2rem] font-extrabold leading-none tracking-[-0.03em]"
        >
          <span className="font-heading text-dark">{dictionary.common.brandPet}</span>
          <span className="font-heading text-primary">{dictionary.common.brandQuirky}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition ${
                  active
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "text-dark/72 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label={dictionary.nav.search}
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-dark shadow-[0_10px_24px_rgba(165,54,13,0.12)] transition hover:scale-105"
          >
            <Search className="size-5" />
          </button>

          <div className="relative hidden md:block">
            <details className="group">
              <summary className="flex list-none items-center gap-1 rounded-full bg-white/80 px-4 py-3 text-sm font-semibold text-dark shadow-[0_10px_24px_rgba(165,54,13,0.12)] marker:hidden transition hover:cursor-pointer hover:text-primary">
                {localeLabels[locale]}
                <ChevronDown className="size-4 transition group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 top-full mt-3 w-44 rounded-[24px] bg-white/95 p-2 shadow-[0_20px_40px_rgba(165,54,13,0.14)]">
                {locales.map((nextLocale) => {
                  const href = replaceLocaleInPath(pathname, nextLocale);
                  const active = nextLocale === locale;

                  return (
                    <Link
                      key={nextLocale}
                      href={href}
                      className={`flex items-center justify-between rounded-[18px] px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-primary-tint"
                      }`}
                    >
                      <span>{dictionary.locale.names[nextLocale]}</span>
                      <span className="text-xs">{localeLabels[nextLocale]}</span>
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>

          <Link
            href={`/${locale}/account`}
            aria-label={dictionary.nav.account}
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-white/80 text-dark shadow-[0_10px_24px_rgba(165,54,13,0.12)] transition hover:scale-105 sm:inline-flex"
          >
            <UserRound className="size-5" />
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={dictionary.nav.cart}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-dark shadow-[0_10px_24px_rgba(165,54,13,0.12)] transition hover:scale-105"
          >
            <ShoppingBag className="size-5" />
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
              {hydrated ? itemCount : cartCount}
            </span>
          </button>
        </div>
      </nav>
      {searchOpen ? (
        <SearchOverlay
          locale={locale}
          onClose={() => setSearchOpen(false)}
          labels={{
            title: dictionary.nav.searchTitle,
            placeholder: dictionary.nav.searchPlaceholder,
            empty: dictionary.nav.searchEmpty,
            close: dictionary.nav.closeMenu,
          }}
        />
      ) : null}
    </header>
  );
}
