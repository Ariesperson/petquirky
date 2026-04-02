import Link from "next/link";

import { formatPrice } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

type CartSummaryProps = {
  locale: Locale;
  subtotal: number;
  shipping: number;
  total: number;
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

export function CartSummary({
  locale,
  subtotal,
  shipping,
  total,
  labels,
}: CartSummaryProps) {
  return (
    <div className="sticky top-28">
      <div className="rounded-[32px] bg-[#f6f3f2] p-8 shadow-sm">
        <h2 className="font-heading text-3xl font-extrabold text-dark">{labels.title}</h2>

        <div className="mt-8 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {labels.shippingTo}
          </label>
          <select className="w-full rounded-[24px] bg-white px-6 py-4 font-medium text-dark outline-none focus:ring-2 focus:ring-primary/20">
            <option>Germany</option>
            <option>France</option>
            <option>Netherlands</option>
            <option>Italy</option>
            <option>Spain</option>
          </select>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between text-muted">
            <span>{labels.subtotal}</span>
            <span className="font-bold text-dark">{formatPrice(subtotal, locale)}</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span>{labels.shipping}</span>
            <span className="font-bold text-[#1D9E75]">
              {shipping === 0 ? labels.shippingFree : formatPrice(shipping, locale)}
            </span>
          </div>
          <div className="h-px bg-[#e4d2cb]/60" />
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-dark">{labels.total}</span>
            <span className="text-3xl font-extrabold text-primary">
              {formatPrice(total, locale)}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href={`/${locale}/checkout`}
            className="inline-flex w-full items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-5 text-base font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.24)] transition hover:scale-[1.02]"
          >
            {labels.proceedToCheckout}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="inline-flex w-full items-center justify-center rounded-[18px] border-2 border-primary px-6 py-4 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            {labels.continueShopping}
          </Link>
        </div>
      </div>

      <p className="mt-6 px-4 text-center text-xs leading-6 text-muted">{labels.taxesNotice}</p>
    </div>
  );
}
