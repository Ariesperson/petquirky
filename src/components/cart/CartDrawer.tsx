"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/products";
import { getFreeShippingThreshold } from "@/lib/shipping";
import type { Locale } from "@/lib/i18n";

type CartDrawerProps = {
  locale: Locale;
  labels: {
    title: string;
    remainingForFreeShipping: string;
    qualifiedForFreeShipping: string;
    quantity: string;
    remove: string;
    subtotal: string;
    viewCart: string;
    checkout: string;
  };
};

export function CartDrawer({ locale, labels }: CartDrawerProps) {
  const pathname = usePathname();
  const {
    hydrated,
    lineItems,
    subtotal,
    itemCount,
    isDrawerOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  if (pathname === `/${locale}/checkout`) {
    return null;
  }

  if (!isDrawerOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close cart drawer"
        className="fixed inset-0 z-[59] bg-dark/35 backdrop-blur-sm"
        onClick={closeCart}
      />

      <aside className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col overflow-hidden rounded-l-[32px] bg-[#fcf9f8] shadow-2xl">
        <header className="flex items-start justify-between px-8 pb-6 pt-8">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-primary">
              {labels.title} ({hydrated ? itemCount : 0})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-dark shadow-sm transition hover:rotate-90"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="px-8 pb-6">
          <FreeShippingBar
            subtotal={subtotal}
            threshold={getFreeShippingThreshold()}
            labels={{
              qualified: labels.qualifiedForFreeShipping,
              remaining: labels.remainingForFreeShipping,
            }}
          />
        </div>

        <section className="flex-1 space-y-6 overflow-y-auto px-8 pb-8">
          {lineItems.map((item) => (
            <CartItem
              key={item.product.id}
              locale={locale}
              product={item.product}
              quantity={item.quantity}
              lineTotal={item.lineTotal}
              quantityLabel={labels.quantity}
              removeLabel={labels.remove}
              onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
              onRemove={() => removeItem(item.product.id)}
            />
          ))}
        </section>

        <footer className="space-y-4 border-t border-[#e4d2cb]/60 bg-[#f6f3f2] p-8">
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted">{labels.subtotal}</span>
            <span className="font-heading text-3xl font-extrabold text-dark">
              {formatPrice(subtotal, locale)}
            </span>
          </div>
          <Link
            href={`/${locale}/cart`}
            onClick={closeCart}
            className="inline-flex w-full items-center justify-center rounded-[18px] border-2 border-primary px-6 py-4 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            {labels.viewCart}
          </Link>
          <Link
            href={`/${locale}/checkout`}
            onClick={closeCart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.25)] transition hover:scale-[1.02]"
          >
            {labels.checkout}
            <ArrowRight className="size-4" />
          </Link>
        </footer>
      </aside>
    </>
  );
}
