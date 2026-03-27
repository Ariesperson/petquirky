"use client";

import Link from "next/link";

import { CartItem } from "@/components/cart/CartItem";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { useCart } from "@/hooks/useCart";
import { getFreeShippingThreshold } from "@/lib/shipping";
import type { Locale } from "@/lib/i18n";

type CartViewProps = {
  locale: Locale;
  labels: {
    empty: string;
    quantity: string;
    remove: string;
    continueShopping: string;
    qualifiedForFreeShipping: string;
    remainingForFreeShipping: string;
  };
};

export function CartView({ locale, labels }: CartViewProps) {
  const { hydrated, lineItems, subtotal, updateQuantity, removeItem } = useCart();

  if (!hydrated) {
    return (
      <section className="rounded-[32px] bg-white px-6 py-16 shadow-[0_18px_42px_rgba(165,54,13,0.08)]" />
    );
  }

  if (lineItems.length === 0) {
    return (
      <section className="rounded-[32px] bg-white px-6 py-16 text-center shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
        <p className="text-base text-muted">{labels.empty}</p>
        <Link
          href={`/${locale}/products`}
          className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          {labels.continueShopping}
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <FreeShippingBar
        subtotal={subtotal}
        threshold={getFreeShippingThreshold()}
        labels={{
          qualified: labels.qualifiedForFreeShipping,
          remaining: labels.remainingForFreeShipping,
        }}
      />

      <div className="space-y-6">
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
      </div>

      <div className="hidden pt-4 md:block">
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 font-semibold text-primary transition hover:gap-3"
        >
          {labels.continueShopping}
        </Link>
      </div>
    </div>
  );
}
