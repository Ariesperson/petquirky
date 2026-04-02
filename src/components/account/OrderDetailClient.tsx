import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import type { CompletedCheckoutOrder } from "@/types/checkout";

type OrderDetailClientProps = {
  locale: Locale;
  order: CompletedCheckoutOrder | null;
  labels: {
    orderNumber: string;
    emptyTitle: string;
    emptyDescription: string;
    backToOrders: string;
    status: string;
    total: string;
    email: string;
    placedOn: string;
    shippingAddress: string;
    orderItems: string;
    quantity: string;
  };
};

export function OrderDetailClient({ locale, order, labels }: OrderDetailClientProps) {
  if (!order) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white p-8 shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
          <h1 className="font-heading text-4xl font-extrabold text-dark">{labels.emptyTitle}</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{labels.emptyDescription}</p>
          <Link
            href={`/${locale}/account`}
            className="mt-6 inline-flex rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3 text-sm font-semibold text-white"
          >
            {labels.backToOrders}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-white p-8 shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[#efe2dc] pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold text-dark">
              {labels.orderNumber} {order.id}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              {labels.placedOn}{" "}
              {new Intl.DateTimeFormat(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(order.createdAt))}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {order.status}
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[24px] bg-[#f6f3f2] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{labels.total}</p>
            <p className="mt-3 text-3xl font-extrabold text-primary">{formatPrice(order.total, locale)}</p>
          </div>
          <div className="rounded-[24px] bg-[#f6f3f2] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{labels.email}</p>
            <p className="mt-3 text-base font-semibold text-dark">
              {order.payerEmail ?? order.shippingAddress.email}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-[#f6f3f2] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{labels.orderItems}</p>
          <div className="mt-4 space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={`${order.id}-${item.productId}`}
                  className="flex items-start justify-between gap-4 border-b border-[#e7d8d2] pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-dark">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {labels.quantity}: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-dark">{formatPrice(item.lineTotal, locale)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">{labels.emptyDescription}</p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-[#f6f3f2] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {labels.shippingAddress}
          </p>
          <div className="mt-3 space-y-1 text-sm text-dark">
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <Link
          href={`/${locale}/account`}
          className="mt-8 inline-flex rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3 text-sm font-semibold text-white"
        >
          {labels.backToOrders}
        </Link>
      </div>
    </main>
  );
}
