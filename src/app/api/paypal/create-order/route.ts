import { NextResponse } from "next/server";

import { createPayPalOrder } from "@/lib/paypal";
import type { CheckoutOrderPayload } from "@/types/checkout";

function isValidOrderPayload(value: unknown): value is CheckoutOrderPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<CheckoutOrderPayload>;
  return (
    Array.isArray(payload.items) &&
    payload.items.length > 0 &&
    typeof payload.total === "number" &&
    typeof payload.subtotal === "number" &&
    typeof payload.shipping === "number" &&
    typeof payload.locale === "string" &&
    typeof payload.shippingAddress?.fullName === "string" &&
    typeof payload.shippingAddress?.email === "string"
  );
}

export async function POST(request: Request) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "PayPal is not configured.",
      },
      { status: 501 }
    );
  }

  const payload = await request.json();
  if (!isValidOrderPayload(payload)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid checkout payload.",
      },
      { status: 400 }
    );
  }

  try {
    const order = await createPayPalOrder(payload);

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      status: order.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to create PayPal order.",
      },
      { status: 500 }
    );
  }
}
