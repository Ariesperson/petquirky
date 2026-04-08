import Link from "next/link";
import { CheckCircle2, Clock3, Mail, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";

import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";
import { emptyCheckoutAddress } from "@/lib/checkout";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getOrderForUserFromServer } from "@/lib/orders-server";
import { formatPrice } from "@/lib/products";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CompletedCheckoutOrderWithItems } from "@/types/checkout";

type CheckoutSuccessPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    orderId?: string;
    status?: string;
    total?: string;
    email?: string;
    shipping?: string;
    warnings?: string;
  }>;
};

function parseShippingAddress(rawValue?: string) {
  if (!rawValue) {
    return emptyCheckoutAddress();
  }

  try {
    return JSON.parse(rawValue) as ReturnType<typeof emptyCheckoutAddress>;
  } catch {
    return emptyCheckoutAddress();
  }
}

function parseWarnings(rawValue?: string) {
  if (!rawValue) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(rawValue) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as string[];
  }
}

function getWarningReason(warnings: string[], prefix: string) {
  const match = warnings.find((entry) => entry.startsWith(prefix));
  return match ? match.slice(prefix.length) : null;
}

function formatOrderDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

async function getDisplayOrder(orderId: string, query: Awaited<CheckoutSuccessPageProps["searchParams"]>) {
  const fallbackOrder: CompletedCheckoutOrderWithItems = {
    id: orderId,
    status: query.status ?? "PROCESSING",
    total: Number(query.total ?? 0),
    currency: "EUR",
    createdAt: new Date().toISOString(),
    payerEmail: query.email,
    shippingAddress: parseShippingAddress(query.shipping),
    items: [],
  };

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    return fallbackOrder;
  }

  const serverOrder = await getOrderForUserFromServer(user.id, orderId);
  return serverOrder ?? fallbackOrder;
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: CheckoutSuccessPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const query = await searchParams;
  const orderId = query.orderId ?? "#PQ-PENDING";
  const displayOrder = await getDisplayOrder(orderId, query);
  const warnings = parseWarnings(query.warnings);
  const hasConfirmationEmailWarning = warnings.some((entry) =>
    entry.startsWith("confirmation-email-failed:")
  );
  const hasSellerNotificationWarning = warnings.some((entry) =>
    entry.startsWith("seller-notification-failed:")
  );
  const confirmationEmailWarningReason = getWarningReason(
    warnings,
    "confirmation-email-failed:"
  );
  const sellerNotificationWarningReason = getWarningReason(
    warnings,
    "seller-notification-failed:"
  );
  const itemCount = displayOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col px-6 pb-20 pt-20">
      <CheckoutSuccessClient
        orderId={displayOrder.id}
        status={displayOrder.status}
        total={displayOrder.total}
        payerEmail={displayOrder.payerEmail ?? displayOrder.shippingAddress.email}
        shippingAddress={displayOrder.shippingAddress}
        createdAt={displayOrder.createdAt}
        items={displayOrder.items}
      />

      <section className="rounded-[36px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,243,242,0.96))] px-6 pb-10 pt-8 text-center shadow-[0_26px_70px_rgba(165,54,13,0.12)] sm:px-10">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_20px_40px_rgba(0,105,76,0.14)]">
            <span className="absolute inset-0 rounded-full border-4 border-success/20 animate-ping" />
            <CheckCircle2 className="relative size-12 text-success" />
          </div>
        </div>

        <h1 className="mt-8 font-heading text-5xl font-extrabold text-primary">
          {dict.checkout.success_title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted">
          {dict.checkout.success_subtitle}
        </p>

        <div className="mt-10 rounded-[30px] bg-[#fff0eb] p-6 text-left shadow-[0_14px_40px_rgba(165,54,13,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                {dict.checkout.order_number}
              </p>
              <p className="mt-2 text-lg font-semibold text-dark">{displayOrder.id}</p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {displayOrder.status}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] bg-white/80 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                {dict.cart.total}
              </p>
              <p className="mt-3 text-3xl font-extrabold text-primary">
                {formatPrice(displayOrder.total, locale)}
              </p>
            </div>
            <div className="rounded-[24px] bg-white/80 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                {dict.auth.email}
              </p>
              <p className="mt-3 break-all text-base font-semibold text-dark">
                {displayOrder.payerEmail ?? displayOrder.shippingAddress.email}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-[24px] bg-white/80 p-5">
              <div className="flex items-center gap-2 text-dark">
                <ShoppingBag className="size-4 text-primary" />
                <p className="text-sm font-bold">{dict.checkout.order_items}</p>
              </div>
              <div className="mt-4 space-y-4">
                {displayOrder.items.length > 0 ? (
                  displayOrder.items.map((item) => (
                    <div
                      key={`${displayOrder.id}-${item.productId}`}
                      className="flex items-center gap-4 rounded-[20px] bg-[#fcf9f8] p-3"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-[16px] bg-[#f6f3f2]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-dark">{item.name}</p>
                        <p className="mt-1 text-sm text-muted">
                          {dict.cart.quantity}: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-dark">
                        {formatPrice(item.lineTotal, locale)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-muted">{dict.account.order_detail_help}</p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[24px] bg-white/80 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  {dict.checkout.shipping_address}
                </p>
                <div className="mt-3 space-y-1 text-sm text-dark">
                  <p className="font-semibold">{displayOrder.shippingAddress.fullName}</p>
                  <p>{displayOrder.shippingAddress.address}</p>
                  <p>
                    {displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.postalCode}
                  </p>
                  <p>{displayOrder.shippingAddress.country}</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-white/80 p-5">
                <div className="flex items-center gap-2 text-dark">
                  <Clock3 className="size-4 text-primary" />
                  <p className="text-sm font-bold">{dict.account.placed_on}</p>
                </div>
                <p className="mt-3 text-sm font-semibold text-dark">
                  {formatOrderDate(locale, displayOrder.createdAt)}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {itemCount} {dict.cart.item_count_label}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-[24px] bg-white/70 p-5 text-sm text-muted">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
                {hasConfirmationEmailWarning
                  ? dict.checkout.success_email_pending
                  : dict.checkout.success_email_notice}
              </p>
            </div>
            <p>{dict.checkout.success_delivery_notice}</p>
            <p>
              {dict.checkout.success_contact_notice}{" "}
              <a href="mailto:969939390@qq.com" className="font-semibold text-primary">
                969939390@qq.com
              </a>
            </p>
            {hasSellerNotificationWarning ? (
              <div className="space-y-2">
                <p className="font-medium text-warning">{dict.checkout.success_internal_notice}</p>
                {sellerNotificationWarningReason ? (
                  <p className="break-words text-xs text-warning/90">
                    Seller notification detail: {sellerNotificationWarningReason}
                  </p>
                ) : null}
              </div>
            ) : null}
            {hasConfirmationEmailWarning && confirmationEmailWarningReason ? (
              <p className="break-words text-xs text-warning/90">
                Confirmation email detail: {confirmationEmailWarningReason}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 rounded-[24px] bg-[#f6f3f2] p-6 text-left sm:p-7">
          <p className="text-sm font-medium leading-7 text-dark">
            {dict.checkout.success_account_prompt}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/account/orders/${displayOrder.id}`}
              className="inline-flex items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3 text-sm font-semibold text-white"
            >
              {dict.account.view_details}
            </Link>
            <Link
              href={`/${locale}/account`}
              className="inline-flex items-center justify-center rounded-[16px] border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              {dict.account.orders}
            </Link>
          </div>
        </div>

        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex w-full items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(165,54,13,0.18)]"
        >
          {dict.checkout.continue_shopping}
        </Link>
      </section>
    </main>
  );
}
