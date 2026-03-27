import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type OrderCardProps = {
  locale: Locale;
  order: {
    id: string;
    status: string;
    date: string;
    items: string;
    total: string;
    cta: string;
    totalLabel: string;
  };
};

export function OrderCard({ locale, order }: OrderCardProps) {
  return (
    <article className="rounded-[28px] bg-white p-6 shadow-[0_14px_34px_rgba(165,54,13,0.06)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            {order.status}
          </span>
          <h3 className="mt-4 font-heading text-3xl font-extrabold text-dark">{order.date}</h3>
          <p className="mt-2 text-sm text-muted">{order.items}</p>
        </div>
        <div className="min-w-[160px]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{order.totalLabel}</p>
          <p className="mt-2 text-3xl font-extrabold text-primary">{order.total}</p>
          <Link
            href={`/${locale}/account/orders/${order.id}`}
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-5 py-3 text-sm font-semibold text-white"
          >
            {order.cta}
          </Link>
        </div>
      </div>
    </article>
  );
}
