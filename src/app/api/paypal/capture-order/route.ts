import { NextResponse } from "next/server";

import { sendNewOrderNotificationEmail, sendOrderConfirmationEmail } from "@/lib/email";
import { persistOrderFromServer, serializeCompletedOrder } from "@/lib/orders-server";
import { capturePayPalOrder } from "@/lib/paypal";
import type { CheckoutOrderPayload } from "@/types/checkout";

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

  const payload = (await request.json()) as {
    orderId?: string;
    order?: CheckoutOrderPayload;
  };
  if (!payload.orderId || !payload.order) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing order payload.",
      },
      { status: 400 }
    );
  }

  try {
    const capture = await capturePayPalOrder(payload.orderId);
    const completedOrder = serializeCompletedOrder({
      id: capture.id,
      status: capture.status,
      total: payload.order.total,
      payerEmail: capture.payer?.email_address ?? payload.order.shippingAddress.email,
      shippingAddress: payload.order.shippingAddress,
      items: payload.order.items,
    });

    await persistOrderFromServer(completedOrder);
    await sendOrderConfirmationEmail({
      orderId: capture.id,
      payerEmail: capture.payer?.email_address ?? payload.order.shippingAddress.email,
      order: payload.order,
    });
    await sendNewOrderNotificationEmail({
      orderId: capture.id,
      payerEmail: capture.payer?.email_address ?? payload.order.shippingAddress.email,
      paypalOrderId: payload.orderId,
      order: payload.order,
    });

    return NextResponse.json({
      ok: true,
      id: capture.id,
      status: capture.status,
      payerEmail: capture.payer?.email_address,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to capture PayPal order.",
      },
      { status: 500 }
    );
  }
}
