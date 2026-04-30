"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { defaultLocale, isLocale } from "@/lib/i18n";
import type { CheckoutOrderPayload } from "@/types/checkout";

type PayPalButtonProps = {
  orderPayload: CheckoutOrderPayload;
  disabled?: boolean;
  loginHref?: string;
  onPaymentStart?: () => void;
  onPaymentSuccess?: (result: {
    id: string;
    status: string;
    payerEmail?: string;
    warnings: string[];
  }) => void;
  onPaymentError?: (message: string) => void;
  onPaymentCancel?: () => void;
  labels: {
    paypal: string;
    card: string;
    secure: string;
    unavailable: string;
    error: string;
    processing: string;
    loginRequired: string;
    login: string;
  };
};

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const FALLBACK_CAPTURE_DELAY_MS = 600;

type CaptureOrderResult = {
  id?: string;
  status?: string;
  payerEmail?: string;
  warnings?: string[];
  error?: string;
};

export function PayPalButton({
  orderPayload,
  disabled = false,
  loginHref,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  labels,
}: PayPalButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pendingOrderIdRef = useRef<string | null>(null);
  const captureInFlightRef = useRef(false);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const resolutionRef = useRef<"idle" | "pending" | "success" | "cancelled" | "error">("idle");
  const isUnavailable = !paypalClientId;

  const resetPendingOrder = () => {
    pendingOrderIdRef.current = null;
    captureInFlightRef.current = false;
    if (fallbackTimeoutRef.current) {
      window.clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
  };

  const shouldSilenceFallbackError = (message: string) =>
    /ORDER_NOT_APPROVED|PAYER_ACTION_REQUIRED|INSTRUMENT_DECLINED|payer/i.test(message);

  const hasResolvedSuccessfully = () => resolutionRef.current === "success";

  const buildSuccessHref = useCallback(
    (result: { id: string; status: string; payerEmail?: string; warnings: string[] }) => {
      const locale = isLocale(orderPayload.locale) ? orderPayload.locale : defaultLocale;
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

      return `/${locale}/checkout/success?${successParams.toString()}`;
    },
    [orderPayload.locale, orderPayload.shippingAddress, orderPayload.total]
  );

  const captureOrder = useCallback(async (orderId: string, source: "approve" | "fallback") => {
    if (hasResolvedSuccessfully() || resolutionRef.current === "cancelled") {
      return;
    }

    if (captureInFlightRef.current) {
      return;
    }

    captureInFlightRef.current = true;
    resolutionRef.current = "pending";
    setIsSubmitting(true);
    onPaymentStart?.();

    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          order: orderPayload,
        }),
      });
      const result = (await response.json()) as CaptureOrderResult;

      if (!response.ok || !result.id || !result.status) {
        const message = result.error || labels.error;
        resetPendingOrder();

        if (source === "fallback" && shouldSilenceFallbackError(message)) {
          resolutionRef.current = "cancelled";
          setIsSubmitting(false);
          onPaymentCancel?.();
          return;
        }

        if (hasResolvedSuccessfully()) {
          return;
        }

        resolutionRef.current = "error";
        setIsSubmitting(false);
        setError(message);
        onPaymentError?.(message);
        return;
      }

      resetPendingOrder();
      resolutionRef.current = "success";
      const successResult = {
        id: result.id,
        status: result.status,
        payerEmail: result.payerEmail ?? orderPayload.shippingAddress.email,
        warnings: result.warnings ?? [],
      };

      if (onPaymentSuccess) {
        onPaymentSuccess(successResult);
      } else {
        router.push(buildSuccessHref(successResult));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : labels.error;
      resetPendingOrder();

      if (source === "fallback" && shouldSilenceFallbackError(message)) {
        resolutionRef.current = "cancelled";
        setIsSubmitting(false);
        onPaymentCancel?.();
        return;
      }

      if (hasResolvedSuccessfully()) {
        return;
      }

      resolutionRef.current = "error";
      setIsSubmitting(false);
      setError(message);
      onPaymentError?.(message);
    }
  }, [
    buildSuccessHref,
    labels.error,
    onPaymentCancel,
    onPaymentError,
    onPaymentStart,
    onPaymentSuccess,
    orderPayload,
    router,
  ]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (hasResolvedSuccessfully() || resolutionRef.current === "cancelled") {
        return;
      }

      if (!pendingOrderIdRef.current || captureInFlightRef.current) {
        return;
      }

      if (fallbackTimeoutRef.current) {
        window.clearTimeout(fallbackTimeoutRef.current);
      }

      fallbackTimeoutRef.current = window.setTimeout(() => {
        const nextOrderId = pendingOrderIdRef.current;
        if (
          !nextOrderId ||
          captureInFlightRef.current ||
          hasResolvedSuccessfully() ||
          resolutionRef.current === "cancelled"
        ) {
          return;
        }

        void captureOrder(nextOrderId, "fallback");
      }, FALLBACK_CAPTURE_DELAY_MS);
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      if (fallbackTimeoutRef.current) {
        window.clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, [captureOrder]);

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
            disabled={disabled || isSubmitting}
            forceReRender={[orderPayload.total, orderPayload.currency, isSubmitting]}
            createOrder={async () => {
              setError(null);
              resolutionRef.current = "idle";
              setIsSubmitting(false);
              resetPendingOrder();
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

              pendingOrderIdRef.current = data.orderId;
              resolutionRef.current = "pending";
              return data.orderId;
            }}
            onApprove={async (data) => {
              if (hasResolvedSuccessfully()) {
                return;
              }

              if (!data.orderID) {
                const message = labels.error;
                resetPendingOrder();
                resolutionRef.current = "error";
                setError(message);
                onPaymentError?.(message);
                return;
              }

              pendingOrderIdRef.current = data.orderID;
              await captureOrder(data.orderID, "approve");
            }}
            onError={() => {
              if (hasResolvedSuccessfully()) {
                return;
              }

              resetPendingOrder();
              resolutionRef.current = "error";
              setIsSubmitting(false);
              setError(labels.error);
              onPaymentError?.(labels.error);
            }}
            onCancel={() => {
              if (hasResolvedSuccessfully()) {
                return;
              }

              resetPendingOrder();
              resolutionRef.current = "cancelled";
              setIsSubmitting(false);
              onPaymentCancel?.();
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
      {disabled && loginHref ? (
        <Link href={loginHref} className="block text-center text-xs font-semibold text-primary">
          {labels.loginRequired} {labels.login}
        </Link>
      ) : null}
      {error ? <p className="text-center text-xs font-medium text-primary">{error}</p> : null}
    </div>
  );
}
