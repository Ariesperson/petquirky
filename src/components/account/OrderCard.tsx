import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type OrderCardProps = {
  locale: Locale;
  order: {
    id: string;
    status: string;
    date: string;
    items: string;
    itemCount: number;
    itemCountLabel: string;
    itemPreview: Array<{
      name: string;
      image: string;
      quantity: number;
    }>;
    quantityLabel: string;
    subtotal: string;
    subtotalLabel: string;
    total: string;
    cta: string;
    totalLabel: string;
  };
};

export function OrderCard({ locale, order }: OrderCardProps) {
  return (
    <article className="rounded-[32px] bg-white p-6 shadow-[0_18px_40px_rgba(165,54,13,0.08)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              {order.status}
            </span>
            <h3 className="mt-4 font-heading text-3xl font-extrabold text-dark">{order.date}</h3>
            <p className="mt-2 text-sm text-muted">{order.items}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">
              {order.itemCount} {order.itemCountLabel}
            </p>
          </div>
          <div className="min-w-[180px] rounded-[24px] bg-[#f6f3f2] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{order.subtotalLabel}</p>
            <p className="mt-2 text-2xl font-extrabold text-dark">{order.subtotal}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-muted">{order.totalLabel}</p>
            <p className="mt-2 text-3xl font-extrabold text-primary">{order.total}</p>
          </div>
        </div>

        {order.itemPreview.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {order.itemPreview.map((item) => (
              <div key={`${order.id}-${item.name}`} className="rounded-[24px] bg-[#fcf9f8] p-3">
                <div className="h-28 overflow-hidden rounded-[18px] bg-[#f1ecea]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold text-dark">{item.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {order.quantityLabel}: {item.quantity}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            {order.cta}
          </span>
          <Link
            href={`/${locale}/account/orders/${order.id}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-5 py-3 text-sm font-semibold text-white lg:w-auto"
          >
            {order.cta}
          </Link>
        </div>
      </div>
    </article>
  );
}
