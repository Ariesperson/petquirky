"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  };
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
    <nav className="mb-12 flex items-center justify-center gap-4 md:gap-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-4">
          <div className={`flex items-center gap-3 ${step.number > currentStep ? "opacity-40" : ""}`}>
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                step.number < currentStep
                  ? "bg-success text-white"
                  : step.number === currentStep
                    ? "bg-primary text-white"
                    : "bg-[#e4e2e1] text-muted"
              }`}
            >
              {step.number}
            </span>
            <span className={`font-semibold ${step.number === currentStep ? "text-primary" : "text-muted"}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 ? <span className="h-px w-8 bg-[#e4d2cb] md:w-16" /> : null}
        </div>
      ))}
    </nav>
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

  const currentStep = searchParams.get("step") === "review" ? 2 : 1;
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
    window.localStorage.setItem(CHECKOUT_ADDRESS_STORAGE_KEY, JSON.stringify(value));
    updateSearchStep("review");
  };

  const handleShippingChange = (value: CheckoutAddress) => {
    setShippingAddress(value);
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
        <Link href={`/${locale}/cart`} className="text-sm font-semibold text-muted hover:text-primary">
          {labels.backToCart}
        </Link>
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
        {currentStep === 2 ? (
          <section className="space-y-10 lg:col-span-7">
            <OrderReview
              items={items}
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
              }}
              onEdit={() => updateSearchStep("shipping")}
            />
            <div className="rounded-[28px] bg-[#f6f3f2] p-8">
              <PayPalButton
                locale={locale}
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
              />
            </div>
          </section>
        ) : (
          <ShippingForm
            locale={locale}
            value={shippingAddress}
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
