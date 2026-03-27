"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { OrderCard } from "@/components/account/OrderCard";
import { useAuth } from "@/hooks/useAuth";
import type { Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { listOrdersFromSupabase, readStoredOrders } from "@/lib/orders";
import type { CompletedCheckoutOrder } from "@/types/checkout";

type AccountOrdersClientProps = {
  locale: Locale;
  labels: {
    orders: string;
    profile: string;
    ordersTitle: string;
    ordersSubtitle: string;
    statusProcessing: string;
    viewDetails: string;
    total: string;
    emptyTitle: string;
    emptyDescription: string;
    startShopping: string;
    guestName: string;
    guestEmail: string;
  };
};

export function AccountOrdersClient({ locale, labels }: AccountOrdersClientProps) {
  const { configured, hydrated: authHydrated, user } = useAuth();
  const [orders, setOrders] = useState<CompletedCheckoutOrder[]>(() => readStoredOrders());
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const initials = useMemo(() => {
    const source = user?.fullName ?? labels.guestName;
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [labels.guestName, user?.fullName]);

  useEffect(() => {
    if (!hydrated || !authHydrated || !configured || !user?.id) {
      return;
    }

    let active = true;

    void listOrdersFromSupabase(user.id).then((remoteOrders) => {
      if (!active) {
        return;
      }

      if (remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }
    });

    return () => {
      active = false;
    };
  }, [authHydrated, configured, hydrated, user?.id]);

  if (!hydrated || !authHydrated) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 gap-8 px-4 pb-12 pt-10 md:flex md:px-8">
        <div className="h-44 w-full animate-pulse rounded-[28px] bg-[#f6f3f2] md:w-72" />
        <div className="flex-1 space-y-6">
          <div className="h-28 animate-pulse rounded-[28px] bg-[#f6f3f2]" />
          <div className="h-44 animate-pulse rounded-[28px] bg-[#f6f3f2]" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 gap-8 px-4 pb-12 pt-10 md:flex md:px-8">
      <aside className="mb-8 h-fit w-full rounded-[28px] bg-[#f6f3f2] p-6 md:sticky md:top-24 md:mb-0 md:w-72">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-heading font-extrabold text-white">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark">{user?.fullName ?? labels.guestName}</h2>
            <p className="text-sm text-muted">{user?.email ?? labels.guestEmail}</p>
          </div>
        </div>
        <nav className="space-y-2">
          <div className="rounded-[16px] bg-primary-tint px-4 py-3 text-sm font-semibold text-primary">
            {labels.orders}
          </div>
          <Link
            href={`/${locale}/account/profile`}
            className="block rounded-[16px] px-4 py-3 text-sm font-medium text-muted"
          >
            {labels.profile}
          </Link>
        </nav>
      </aside>

      <section className="flex-1 space-y-6">
        <header>
          <h1 className="font-heading text-4xl font-extrabold text-dark">{labels.ordersTitle}</h1>
          <p className="mt-2 text-sm text-muted">{labels.ordersSubtitle}</p>
        </header>

        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              locale={locale}
              order={{
                id: order.id,
                status: labels.statusProcessing,
                date: new Intl.DateTimeFormat(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(order.createdAt)),
                items: order.shippingAddress.address,
                total: formatPrice(order.total, locale),
                cta: labels.viewDetails,
                totalLabel: labels.total,
              }}
            />
          ))
        ) : (
          <div className="rounded-[28px] bg-white p-8 shadow-[0_14px_34px_rgba(165,54,13,0.06)]">
            <h2 className="font-heading text-3xl font-extrabold text-dark">{labels.emptyTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{labels.emptyDescription}</p>
            <Link
              href={`/${locale}/products`}
              className="mt-6 inline-flex rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3 text-sm font-semibold text-white"
            >
              {labels.startShopping}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
