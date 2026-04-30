"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";

import { OrderReview } from "@/components/checkout/OrderReview";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PayPalButton } from "@/components/checkout/PayPalButton";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { useAuth } from "@/hooks/useAuth";
import {
  buildCheckoutOrderPayload,
  CHECKOUT_ADDRESS_STORAGE_KEY,
  emptyCheckoutAddress,
  hasMeaningfulCheckoutAddressValue,
  isCheckoutAddressComplete,
  readStoredCheckoutAddress,
} from "@/lib/checkout";
import type { Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/hooks/useCart";
import type { CheckoutAddress } from "@/types/checkout";

type CheckoutClientProps = {
  locale: Locale;
  labels: {
    brand: string;
    backToCart: string;
    stepShipping: string;
    stepReview: string;
    stepPayment: string;
    shippingTitle: string;
    shippingSubtitle: string;
    login: string;
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    continueToReview: string;
    emptyTitle: string;
    emptyDescription: string;
    returnToCart: string;
    shippingAddress: string;
    edit: string;
    orderItems: string;
    paymentMethod: string;
    legal: string;
    paypal: string;
    card: string;
    secure: string;
    terms: string;
    privacy: string;
    returns: string;
    summaryTitle: string;
    subtotal: string;
    shipping: string;
    total: string;
    shippingFree: string;
    paypalUnavailable: string;
    paypalError: string;
    processing: string;
    loginRequired: string;
    loginRequiredCta: string;
    checkoutAuthTitle: string;
    checkoutAuthBody: string;
    checkoutAuthLogin: string;
    checkoutAuthRegister: string;
    orderNumber: string;
    paymentPendingTitle: string;
    paymentPendingDescription: string;
    paymentSuccessTitle: string;
    paymentSuccessDescription: string;
    paymentRedirecting: string;
  };
};

type CapturedOrderState = {
  href: string;
  orderId: string;
  status: string;
};

function StepNav({
  currentStep,
  labels,
}: {
  currentStep: 1 | 2 | 3;
  labels: Pick<CheckoutClientProps["labels"], "stepShipping" | "stepReview" | "stepPayment">;
}) {
  const steps = [
    { number: 1, label: labels.stepShipping },
    { number: 2, label: labels.stepReview },
    { number: 3, label: labels.stepPayment },
  ];

  return (
    <nav className="mb-10 grid w-full grid-cols-3 items-start gap-2 sm:mb-12 sm:flex sm:items-center sm:justify-center sm:gap-4 md:gap-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex min-w-0 items-center justify-center gap-2 sm:gap-4">
          <div
            className={`flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 ${
              step.number > currentStep ? "opacity-40" : ""
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-10 sm:w-10 ${
                step.number < currentStep
                  ? "bg-success text-white"
                  : step.number === currentStep
                    ? "bg-primary text-white"
                    : "bg-[#e4e2e1] text-muted"
              }`}
            >
              {step.number}
            </span>
            <span
              className={`min-w-0 max-w-full text-xs font-semibold leading-tight sm:text-base ${
                step.number === currentStep ? "text-primary" : "text-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 ? (
            <span className="hidden h-px w-8 bg-[#e4d2cb] sm:block md:w-16" />
          ) : null}
        </div>
      ))}
    </nav>
  );
}

function CheckoutAuthCard({
  loginHref,
  registerHref,
  labels,
}: {
  loginHref: string;
  registerHref: string;
  labels: Pick<
    CheckoutClientProps["labels"],
    "checkoutAuthTitle" | "checkoutAuthBody" | "checkoutAuthLogin" | "checkoutAuthRegister"
  >;
}) {
  return (
    <div className="rounded-[28px] bg-[#fff0eb] p-7 text-center shadow-[0_20px_44px_rgba(165,54,13,0.10)] sm:p-8">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-[0_14px_30px_rgba(165,54,13,0.12)]">
        <LockKeyhole className="size-7" />
      </span>
      <h2 className="mt-5 font-heading text-3xl font-extrabold text-dark">
        {labels.checkoutAuthTitle}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
        {labels.checkoutAuthBody}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={loginHref}
          className="inline-flex items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(165,54,13,0.18)]"
        >
          {labels.checkoutAuthLogin}
        </Link>
        <Link
          href={registerHref}
          className="inline-flex items-center justify-center rounded-[18px] bg-white px-6 py-3 text-sm font-semibold text-primary shadow-[0_12px_24px_rgba(165,54,13,0.08)]"
        >
          {labels.checkoutAuthRegister}
        </Link>
      </div>
    </div>
  );
}

function PaymentStatusCard({
  phase,
  capturedOrder,
  labels,
}: {
  phase: "processing" | "success";
  capturedOrder: CapturedOrderState | null;
  labels: Pick<
    CheckoutClientProps["labels"],
    | "secure"
    | "stepPayment"
    | "orderNumber"
    | "paymentPendingTitle"
    | "paymentPendingDescription"
    | "paymentSuccessTitle"
    | "paymentSuccessDescription"
    | "paymentRedirecting"
  >;
}) {
  const isSuccess = phase === "success" && capturedOrder;

  return (
    <div className="flex min-h-[288px] flex-col items-center justify-center rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(252,249,248,0.98)_52%,_rgba(246,243,242,1)_100%)] px-6 text-center shadow-[0_24px_60px_rgba(165,54,13,0.12)]">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/90 shadow-[0_18px_34px_rgba(165,54,13,0.12)]">
        {isSuccess ? (
          <>
            <span className="absolute inset-0 rounded-full bg-success/10 animate-ping" />
            <CheckCircle2 className="relative size-12 text-success" />
          </>
        ) : (
          <>
            <span className="absolute inset-0 rounded-full border border-primary/10" />
            <LoaderCircle className="relative size-11 animate-spin text-primary" />
          </>
        )}
      </div>

      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-primary/60">
        {labels.stepPayment}
      </p>
      <h2 className="mt-3 font-heading text-3xl font-extrabold text-dark">
        {isSuccess ? labels.paymentSuccessTitle : labels.paymentPendingTitle}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted">
        {isSuccess ? labels.paymentSuccessDescription : labels.paymentPendingDescription}
      </p>

      {isSuccess && capturedOrder ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-dark shadow-[0_12px_24px_rgba(165,54,13,0.08)]">
            {labels.orderNumber}: {capturedOrder.orderId}
          </span>
          <span className="rounded-full bg-success/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-success">
            {capturedOrder.status}
          </span>
        </div>
      ) : null}

      <p className="mt-6 text-xs font-semibold text-primary/80">
        {isSuccess ? labels.paymentRedirecting : labels.secure}
      </p>
    </div>
  );
}

export function CheckoutClient({ locale, labels }: CheckoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hydrated, lineItems, subtotal, shipping, total } = useCart();
  const { hydrated: authHydrated, user } = useAuth();
  const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>(() =>
    emptyCheckoutAddress()
  );
  const [paymentPhase, setPaymentPhase] = useState<"idle" | "processing" | "success">("idle");
  const [capturedOrder, setCapturedOrder] = useState<CapturedOrderState | null>(null);

  useEffect(() => {
    if (!hydrated || !authHydrated) {
      return;
    }

    const hasTypedValue = hasMeaningfulCheckoutAddressValue(shippingAddress);
    if (hasTypedValue) {
      return;
    }

    const storedAddress = readStoredCheckoutAddress();
    if (!storedAddress && !user) {
      return;
    }

    startTransition(() => {
      setShippingAddress({
        fullName: storedAddress?.fullName || user?.fullName || "",
        email: storedAddress?.email || user?.email || "",
        address: storedAddress?.address || "",
        city: storedAddress?.city || "",
        postalCode: storedAddress?.postalCode || "",
        country: storedAddress?.country || "France",
      });
    });
  }, [authHydrated, hydrated, shippingAddress, user]);

  useEffect(() => {
    if (paymentPhase !== "success" || !capturedOrder) {
      return;
    }

    router.prefetch(capturedOrder.href);
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        router.push(capturedOrder.href);
      });
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [capturedOrder, paymentPhase, router]);

  const isPaymentBusy = paymentPhase !== "idle";
  const currentStep: 1 | 2 | 3 = isPaymentBusy
    ? 3
    : searchParams.get("step") === "review"
      ? 2
      : 1;
  const query = searchParams.toString();
  const returnTo = query ? `${pathname}?${query}` : pathname;
  const encodedReturnTo = encodeURIComponent(returnTo);
  const loginHref = `/${locale}/auth/login?returnTo=${encodedReturnTo}`;
  const registerHref = `/${locale}/auth/register?returnTo=${encodedReturnTo}`;
  const items = useMemo(
    () =>
      lineItems.map((item) => ({
        id: item.product.id,
        productId: item.product.id,
        name: item.product.name[locale],
        image: item.product.images[0],
        quantity: item.quantity,
        price: item.product.price.amount,
        unitPrice: item.product.price.amount,
        lineTotalNumber: item.lineTotal,
        lineLabel: `${item.quantity} x ${formatPrice(item.product.price.amount, locale)}`,
        lineTotal: formatPrice(item.lineTotal, locale),
      })),
    [lineItems, locale]
  );

  const orderPayload = useMemo(
    () =>
      buildCheckoutOrderPayload({
        locale,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotalNumber,
        })),
        shippingAddress,
        subtotal,
        shipping,
        total,
      }),
    [items, locale, shippingAddress, shipping, subtotal, total]
  );

  const updateSearchStep = (step: "shipping" | "review") => {
    if (isPaymentBusy) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    if (step === "shipping") {
      nextParams.delete("step");
    } else {
      nextParams.set("step", step);
    }

    startTransition(() => {
      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    });
  };

  const handleShippingSubmit = (value: CheckoutAddress) => {
    setShippingAddress(value);
    setPaymentPhase("idle");
    setCapturedOrder(null);
    window.localStorage.setItem(CHECKOUT_ADDRESS_STORAGE_KEY, JSON.stringify(value));
    updateSearchStep("review");
  };

  const handleShippingChange = (value: CheckoutAddress) => {
    setShippingAddress(value);
  };

  const handlePaymentStart = () => {
    setPaymentPhase("processing");
    setCapturedOrder(null);
  };

  const handlePaymentError = () => {
    setPaymentPhase("idle");
    setCapturedOrder(null);
  };

  const handlePaymentSuccess = (result: {
    id: string;
    status: string;
    payerEmail?: string;
    warnings: string[];
  }) => {
    const successParams = new URLSearchParams({
      orderId: result.id,
      status: result.status,
      total: orderPayload.total.toFixed(2),
      email: result.payerEmail ?? orderPayload.shippingAddress.email,
      shipping: JSON.stringify(orderPayload.shippingAddress),
    });

    if (result.warnings.length > 0) {
      successParams.set("warnings", JSON.stringify(result.warnings));
    }

    setCapturedOrder({
      href: `/${locale}/checkout/success?${successParams.toString()}`,
      orderId: result.id,
      status: result.status,
    });
    setPaymentPhase("success");
  };

  if (!hydrated || !authHydrated) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <div className="h-14 w-48 animate-pulse rounded-full bg-[#f1e8e4]" />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center px-6 pb-20 pt-20 text-center">
        <h1 className="font-heading text-5xl font-extrabold text-primary">{labels.emptyTitle}</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted">{labels.emptyDescription}</p>
        <Link
          href={`/${locale}/cart`}
          className="mt-8 inline-flex rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-8 py-4 text-sm font-semibold text-white"
        >
          {labels.returnToCart}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
      <header className="flex items-center justify-between py-4">
        <div className="font-heading text-3xl font-extrabold text-primary">{labels.brand}</div>
        {isPaymentBusy ? (
          <span className="text-sm font-semibold text-muted/60">{labels.backToCart}</span>
        ) : (
          <Link
            href={`/${locale}/cart`}
            className="text-sm font-semibold text-muted hover:text-primary"
          >
            {labels.backToCart}
          </Link>
        )}
      </header>

      <StepNav
        currentStep={currentStep}
        labels={{
          stepShipping: labels.stepShipping,
          stepReview: labels.stepReview,
          stepPayment: labels.stepPayment,
        }}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {currentStep === 2 || currentStep === 3 ? (
          <section className="space-y-10 lg:col-span-7">
            <OrderReview
              items={items}
              locale={locale}
              shippingAddress={shippingAddress}
              labels={{
                title: labels.stepReview,
                shippingAddress: labels.shippingAddress,
                edit: labels.edit,
                orderItems: labels.orderItems,
                paymentMethod: labels.paymentMethod,
                legal: labels.legal,
                paypal: labels.paypal,
                card: labels.card,
                secure: labels.secure,
                terms: labels.terms,
                privacy: labels.privacy,
                returns: labels.returns,
              }}
              onEdit={() => updateSearchStep("shipping")}
              editDisabled={isPaymentBusy}
            />
            <div className="relative overflow-hidden rounded-[28px] bg-[#f6f3f2] p-6 sm:p-8">
              {!user ? (
                <CheckoutAuthCard
                  loginHref={loginHref}
                  registerHref={registerHref}
                  labels={{
                    checkoutAuthTitle: labels.checkoutAuthTitle,
                    checkoutAuthBody: labels.checkoutAuthBody,
                    checkoutAuthLogin: labels.checkoutAuthLogin,
                    checkoutAuthRegister: labels.checkoutAuthRegister,
                  }}
                />
              ) : (
                <div className={isPaymentBusy ? "pointer-events-none opacity-0" : "transition-opacity duration-300"}>
                  <PayPalButton
                    orderPayload={orderPayload}
                    disabled={!isCheckoutAddressComplete(shippingAddress)}
                    labels={{
                      paypal: labels.paypal,
                      card: labels.card,
                      secure: labels.secure,
                      unavailable: labels.paypalUnavailable,
                      error: labels.paypalError,
                      processing: labels.processing,
                      loginRequired: labels.loginRequired,
                      login: labels.loginRequiredCta,
                    }}
                    onPaymentStart={handlePaymentStart}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    onPaymentCancel={handlePaymentError}
                  />
                </div>
              )}

              {isPaymentBusy ? (
                <div className="absolute inset-0 p-8">
                  <PaymentStatusCard
                    phase={paymentPhase === "success" ? "success" : "processing"}
                    capturedOrder={capturedOrder}
                    labels={{
                      secure: labels.secure,
                      stepPayment: labels.stepPayment,
                      orderNumber: labels.orderNumber,
                      paymentPendingTitle: labels.paymentPendingTitle,
                      paymentPendingDescription: labels.paymentPendingDescription,
                      paymentSuccessTitle: labels.paymentSuccessTitle,
                      paymentSuccessDescription: labels.paymentSuccessDescription,
                      paymentRedirecting: labels.paymentRedirecting,
                    }}
                  />
                </div>
              ) : null}
            </div>
          </section>
        ) : (
          <ShippingForm
            locale={locale}
            value={shippingAddress}
            loginHref={loginHref}
            onChange={handleShippingChange}
            onSubmit={handleShippingSubmit}
            labels={{
              title: labels.shippingTitle,
              subtitle: labels.shippingSubtitle,
              login: labels.login,
              fullName: labels.fullName,
              email: labels.email,
              address: labels.address,
              city: labels.city,
              postalCode: labels.postalCode,
              country: labels.country,
              continueToReview: labels.continueToReview,
            }}
          />
        )}

        <OrderSummary
          locale={locale}
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          labels={{
            title: labels.summaryTitle,
            subtotal: labels.subtotal,
            shipping: labels.shipping,
            total: labels.total,
            shippingFree: labels.shippingFree,
          }}
        />
      </div>
    </main>
  );
}
