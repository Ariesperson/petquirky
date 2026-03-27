"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import type { Locale } from "@/lib/i18n";
import type { CheckoutOrderPayload } from "@/types/checkout";

type PayPalButtonProps = {
  locale: Locale;
  orderPayload: CheckoutOrderPayload;
  disabled?: boolean;
  labels: {
    paypal: string;
    card: string;
    secure: string;
    unavailable: string;
    error: string;
    processing: string;
  };
};

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export function PayPalButton({ locale, orderPayload, disabled = false, labels }: PayPalButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isUnavailable = !paypalClientId;

  return (
    <div className="space-y-4">
      {isUnavailable ? (
        <button
          type="button"
          disabled
          className="inline-flex w-full items-center justify-center rounded-full bg-[#f6d990] px-6 py-4 font-semibold text-[#111827] opacity-70"
        >
          {labels.unavailable}
        </button>
      ) : (
        <PayPalScriptProvider
          options={{
            clientId: paypalClientId,
            currency: "EUR",
            intent: "capture",
            components: "buttons",
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical", shape: "pill", label: "paypal" }}
            disabled={disabled}
            forceReRender={[orderPayload.total, orderPayload.currency]}
            createOrder={async () => {
              setError(null);
              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(orderPayload),
              });
              const data = (await response.json()) as { orderId?: string; error?: string };

              if (!response.ok || !data.orderId) {
                throw new Error(data.error || labels.error);
              }

              return data.orderId;
            }}
            onApprove={async (data) => {
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                  order: orderPayload,
                }),
              });
              const result = (await response.json()) as {
                id?: string;
                status?: string;
                payerEmail?: string;
                error?: string;
              };

              if (!response.ok || !result.id || !result.status) {
                setError(result.error || labels.error);
                return;
              }

              const successParams = new URLSearchParams({
                orderId: result.id,
                status: result.status,
                total: orderPayload.total.toFixed(2),
                email: result.payerEmail ?? orderPayload.shippingAddress.email,
                shipping: JSON.stringify(orderPayload.shippingAddress),
              });

              router.push(`/${locale}/checkout/success?${successParams.toString()}`);
            }}
            onError={() => {
              setError(labels.error);
            }}
          />
        </PayPalScriptProvider>
      )}
      <button
        type="button"
        disabled
        className="inline-flex w-full items-center justify-center rounded-full text-sm font-semibold text-primary"
      >
        {labels.card}
      </button>
      <p className="text-center text-xs text-muted">{labels.secure}</p>
      {disabled ? <p className="text-center text-xs text-muted">{labels.processing}</p> : null}
      {error ? <p className="text-center text-xs font-medium text-primary">{error}</p> : null}
    </div>
  );
}
