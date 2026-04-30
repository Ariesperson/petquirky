import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import type { OrderDetailTimelineStepKey, OrderDetailView } from "@/types/checkout";

type OrderDetailClientProps = {
  locale: Locale;
  order: OrderDetailView | null;
  supportEmail: string;
  labels: {
    orderNumber: string;
    reviewTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    backToOrders: string;
    continueShopping: string;
    orderJourney: string;
    timelinePlaced: string;
    timelinePaid: string;
    timelinePreparing: string;
    timelineShipped: string;
    total: string;
    subtotal: string;
    shipping: string;
    pricingSummary: string;
    email: string;
    customer: string;
    placedOn: string;
    shippingAddress: string;
    orderItems: string;
    itemsInOrder: string;
    quantity: string;
    unitPrice: string;
    paymentSummary: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentMethodPaypal: string;
    paymentStatusPaid: string;
    paymentStatusPending: string;
    statusCompleted: string;
    statusProcessing: string;
    statusShipped: string;
    deliveryWindow: string;
    needHelpTitle: string;
    needHelpBody: string;
    contactSupport: string;
    shippingReturns: string;
    privacyPolicy: string;
    termsOfService: string;
    itemCountLabel: string;
    freeShipping: string;
    itemsFallback: string;
  };
};

function formatLongDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function getTimelineLabel(labels: OrderDetailClientProps["labels"], key: OrderDetailTimelineStepKey) {
  switch (key) {
    case "placed":
      return labels.timelinePlaced;
    case "paid":
      return labels.timelinePaid;
    case "preparing":
      return labels.timelinePreparing;
    case "shipped":
      return labels.timelineShipped;
    default:
      return labels.timelinePlaced;
  }
}

function getOrderStatusLabel(labels: OrderDetailClientProps["labels"], status: string) {
  switch (status.trim().toUpperCase()) {
    case "SHIPPED":
      return labels.statusShipped;
    case "COMPLETED":
      return labels.statusCompleted;
    default:
      return labels.statusProcessing;
  }
}

export function OrderDetailClient({
  locale,
  order,
  supportEmail,
  labels,
}: OrderDetailClientProps) {
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

  const statusLabel = getOrderStatusLabel(labels, order.status);
  const paymentStatusLabel =
    order.paymentState === "paid" ? labels.paymentStatusPaid : labels.paymentStatusPending;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.45fr)_380px] lg:gap-10">
        <section className="space-y-8">
          <div className="rounded-[36px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,243,242,0.96))] p-8 shadow-[0_24px_60px_rgba(165,54,13,0.10)] sm:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/70">
                  {labels.reviewTitle}
                </p>
                <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-dark sm:text-5xl">
                  {labels.orderNumber} {order.id}
                </h1>
                <p className="mt-4 text-base leading-7 text-muted">
                  {labels.placedOn} {formatLongDate(locale, order.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex w-fit rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {statusLabel}
                </span>
                <span className="inline-flex w-fit rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-dark shadow-[0_12px_24px_rgba(165,54,13,0.08)]">
                  {order.itemCount} {labels.itemCountLabel}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/70">
                {labels.orderJourney}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {order.timeline.map((step) => (
                  <div
                    key={step.key}
                    className={`rounded-[26px] p-5 transition ${
                      step.current
                        ? "bg-[linear-gradient(135deg,rgba(216,90,48,0.16),rgba(255,255,255,0.92))] shadow-[0_16px_34px_rgba(165,54,13,0.10)]"
                        : step.completed
                          ? "bg-[#fff2ec]"
                          : "bg-[#f6f3f2]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                          step.completed
                            ? "bg-primary text-white"
                            : "bg-white text-muted shadow-[0_8px_20px_rgba(165,54,13,0.08)]"
                        }`}
                      >
                        {step.completed ? "✓" : "•"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-dark">
                          {getTimelineLabel(labels, step.key)}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {step.date ? formatLongDate(locale, step.date) : statusLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[30px] bg-[#f6f3f2] p-6 shadow-[0_18px_40px_rgba(165,54,13,0.06)]">
              <div className="flex items-center gap-2 text-dark">
                <MapPin className="size-4 text-primary" />
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted">
                  {labels.shippingAddress}
                </p>
              </div>
              <div className="mt-4 space-y-1 text-sm leading-7 text-dark">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="rounded-[30px] bg-[#f6f3f2] p-6 shadow-[0_18px_40px_rgba(165,54,13,0.06)]">
              <div className="flex items-center gap-2 text-dark">
                <Mail className="size-4 text-primary" />
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted">
                  {labels.customer}
                </p>
              </div>
              <div className="mt-4 space-y-3 text-sm text-dark">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                    {labels.email}
                  </p>
                  <p className="mt-1 break-all text-base font-semibold">{order.email}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                    {labels.paymentMethod}
                  </p>
                  <p className="mt-1 text-base font-semibold">{labels.paymentMethodPaypal}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 px-1">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/70">
                  {labels.orderItems}
                </p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold text-dark">
                  {labels.itemsInOrder}
                </h2>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted shadow-[0_12px_24px_rgba(165,54,13,0.08)]">
                {order.itemCount} {labels.itemCountLabel}
              </span>
            </div>

            {order.items.length > 0 ? (
              order.items.map((item) => {
                const cardContent = (
                  <>
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[24px] bg-[#ece7e5] sm:h-28 sm:w-28">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <p className="text-xl font-bold leading-tight text-dark">{item.name}</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                            <span className="rounded-full bg-[#fff7f3] px-3 py-1">
                              {labels.quantity}: {item.quantity}
                            </span>
                            <span className="rounded-full bg-[#fff7f3] px-3 py-1">
                              {labels.unitPrice}: {formatPrice(item.unitPrice, locale)}
                            </span>
                          </div>
                        </div>
                        <div className="text-left lg:text-right">
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                            {labels.total}
                          </p>
                          <p className="mt-2 text-2xl font-extrabold text-primary">
                            {formatPrice(item.lineTotal, locale)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {item.href ? <ExternalLink className="size-5 shrink-0 text-primary" /> : null}
                  </>
                );

                return item.href ? (
                  <Link
                    key={`${order.id}-${item.productId}`}
                    href={item.href}
                    className="flex flex-col gap-4 rounded-[32px] bg-white p-5 shadow-[0_18px_40px_rgba(165,54,13,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_44px_rgba(165,54,13,0.12)] sm:flex-row sm:items-center"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <article
                    key={`${order.id}-${item.productId}`}
                    className="flex flex-col gap-4 rounded-[32px] bg-white p-5 shadow-[0_18px_40px_rgba(165,54,13,0.08)] sm:flex-row sm:items-center"
                  >
                    {cardContent}
                  </article>
                );
              })
            ) : (
              <div className="rounded-[28px] bg-white p-6 text-sm leading-7 text-muted shadow-[0_18px_40px_rgba(165,54,13,0.08)]">
                {labels.itemsFallback}
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[34px] bg-[linear-gradient(180deg,#f6f3f2,#fffefe)] p-7 shadow-[0_24px_60px_rgba(165,54,13,0.10)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-[0_12px_24px_rgba(165,54,13,0.10)]">
                <CreditCard className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/70">
                  {labels.paymentSummary}
                </p>
                <h2 className="mt-1 font-heading text-3xl font-extrabold text-dark">
                  {labels.pricingSummary}
                </h2>
              </div>
            </div>

            <div className="mt-7 space-y-4 rounded-[28px] bg-white/85 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">{labels.paymentMethod}</span>
                <span className="font-semibold text-dark">{labels.paymentMethodPaypal}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">{labels.paymentStatus}</span>
                <span className="font-semibold text-dark">{paymentStatusLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">{labels.subtotal}</span>
                <span className="font-semibold text-dark">{formatPrice(order.subtotal, locale)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">{labels.shipping}</span>
                <span className="font-semibold text-dark">
                  {order.shippingAmount === 0
                    ? labels.freeShipping
                    : formatPrice(order.shippingAmount, locale)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-[22px] bg-[#fff2ec] px-4 py-4">
                <span className="text-base font-bold text-dark">{labels.total}</span>
                <span className="text-2xl font-extrabold text-primary">
                  {formatPrice(order.total, locale)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-[28px] bg-white/85 p-5">
              <div className="flex items-center gap-2 text-dark">
                <Truck className="size-4 text-primary" />
                <p className="text-sm font-bold">{labels.deliveryWindow}</p>
              </div>
              <p className="mt-3 text-base font-semibold text-dark">
                {formatLongDate(locale, order.estimatedDeliveryStart)} -{" "}
                {formatLongDate(locale, order.estimatedDeliveryEnd)}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">{labels.needHelpBody}</p>
            </div>
          </div>

          <div className="rounded-[34px] bg-white p-7 shadow-[0_20px_50px_rgba(165,54,13,0.08)]">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fff2ec] text-primary">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-dark">
                  {labels.needHelpTitle}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted">{labels.needHelpBody}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(165,54,13,0.18)]"
              >
                {labels.contactSupport}
              </Link>
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center justify-center rounded-[18px] bg-[#f6f3f2] px-5 py-3 text-sm font-semibold text-dark transition hover:bg-[#efe7e4]"
              >
                {supportEmail}
              </a>
            </div>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-primary">
              <Link href={`/${locale}/policies/returns`} className="rounded-[18px] bg-[#fff7f3] px-4 py-3">
                {labels.shippingReturns}
              </Link>
              <Link href={`/${locale}/policies/privacy`} className="rounded-[18px] bg-[#fff7f3] px-4 py-3">
                {labels.privacyPolicy}
              </Link>
              <Link href={`/${locale}/policies/terms`} className="rounded-[18px] bg-[#fff7f3] px-4 py-3">
                {labels.termsOfService}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/${locale}/account`}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-white px-5 py-4 text-sm font-semibold text-dark shadow-[0_16px_34px_rgba(165,54,13,0.08)] transition hover:-translate-y-0.5"
            >
              <ArrowLeft className="size-4" />
              {labels.backToOrders}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(165,54,13,0.18)]"
            >
              <Package className="size-4" />
              {labels.continueShopping}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
