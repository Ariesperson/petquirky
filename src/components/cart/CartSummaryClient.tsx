"use client";

import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";
import type { Locale } from "@/lib/i18n";

type CartSummaryClientProps = {
  locale: Locale;
  labels: {
    title: string;
    shippingTo: string;
    subtotal: string;
    shipping: string;
    total: string;
    proceedToCheckout: string;
    continueShopping: string;
    shippingFree: string;
    taxesNotice: string;
  };
};

export function CartSummaryClient({ locale, labels }: CartSummaryClientProps) {
  const { hydrated, subtotal, shipping, total } = useCart();

  return (
    <CartSummary
      locale={locale}
      subtotal={hydrated ? subtotal : 0}
      shipping={hydrated ? shipping : 0}
      total={hydrated ? total : 0}
      labels={labels}
    />
  );
}
