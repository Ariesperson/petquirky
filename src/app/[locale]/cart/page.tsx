import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

import { CartView } from "@/components/cart/CartView";
import { CartSummaryClient } from "@/components/cart/CartSummaryClient";
import { getDictionary, isLocale } from "@/lib/i18n";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl flex-1 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
        <Link href={`/${locale}`} className="transition hover:text-primary">
          {dict.nav.home}
        </Link>
        <ChevronRight className="size-4" />
        <span className="font-semibold text-dark">{dict.cart.title}</span>
      </nav>

      <header className="mb-10 text-center md:text-left">
        <h1 className="font-heading text-4xl font-extrabold tracking-[-0.04em] text-dark md:text-5xl">
          {dict.cart.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartView
            locale={locale}
            labels={{
              empty: dict.cart.empty,
              quantity: dict.cart.quantity,
              remove: dict.cart.remove,
              continueShopping: dict.cart.continue,
              qualifiedForFreeShipping: dict.cart.qualified_free_shipping,
              remainingForFreeShipping: dict.cart.remaining_for_free_shipping,
            }}
          />
        </div>
        <div className="lg:col-span-4">
          <CartSummaryClient
            locale={locale}
            labels={{
              title: dict.cart.summary_title,
              shippingTo: dict.cart.shipping_to,
              subtotal: dict.cart.subtotal,
              shipping: dict.cart.shipping,
              total: dict.cart.total,
              proceedToCheckout: dict.cart.checkout,
              continueShopping: dict.cart.continue,
              shippingFree: dict.cart.free_shipping,
              taxesNotice: dict.cart.taxes_notice,
            }}
          />
        </div>
      </div>
    </main>
  );
}
