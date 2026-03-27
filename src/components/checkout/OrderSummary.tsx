import { formatPrice } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

type CheckoutOrderSummaryProps = {
  locale: Locale;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  labels: {
    title: string;
    subtotal: string;
    shipping: string;
    total: string;
    shippingFree: string;
  };
};

export function OrderSummary({
  locale,
  items,
  subtotal,
  shipping,
  total,
  labels,
}: CheckoutOrderSummaryProps) {
  return (
    <aside className="lg:col-span-5 lg:sticky lg:top-24">
      <div className="rounded-[28px] bg-[#f6f3f2] p-8">
        <h2 className="font-heading text-3xl font-extrabold text-dark">{labels.title}</h2>
        <div className="mt-8 space-y-5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-[18px] bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-dark">{item.name}</p>
                <p className="text-sm text-muted">
                  {item.quantity} x {formatPrice(item.price, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4 border-t border-[#e4d2cb]/60 pt-6">
          <div className="flex justify-between text-muted">
            <span>{labels.subtotal}</span>
            <span>{formatPrice(subtotal, locale)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>{labels.shipping}</span>
            <span className="font-semibold text-success">
              {shipping === 0 ? labels.shippingFree : formatPrice(shipping, locale)}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-xl font-extrabold text-dark">
            <span>{labels.total}</span>
            <span className="text-primary">{formatPrice(total, locale)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
