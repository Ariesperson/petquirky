import { NextResponse } from "next/server";

import { validateCheckoutOrderPayload } from "@/lib/checkout";
import { sendNewOrderNotificationEmail, sendOrderConfirmationEmail } from "@/lib/email";
import { persistOrderFromServer, serializeCompletedOrder } from "@/lib/orders-server";
import { capturePayPalOrder } from "@/lib/paypal";
import { getSupabaseServerClient } from "@/lib/supabase/server";
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

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Supabase is not configured.",
      },
      { status: 501 }
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please sign in before paying.",
      },
      { status: 401 }
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

  const validation = validateCheckoutOrderPayload(payload.order);
  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: validation.reason,
      },
      { status: 400 }
    );
  }

  try {
    const warnings: string[] = [];
    const capture = await capturePayPalOrder(payload.orderId);
    if (capture.status !== "COMPLETED") {
      return NextResponse.json(
        {
          ok: false,
          error: `PayPal capture returned unexpected status: ${capture.status}.`,
        },
        { status: 502 }
      );
    }

    const completedOrder = serializeCompletedOrder({
      id: capture.id,
      status: capture.status,
      total: payload.order.total,
      payerEmail: capture.payer?.email_address ?? payload.order.shippingAddress.email,
      shippingAddress: payload.order.shippingAddress,
      items: payload.order.items,
    });

    const persistResult = await persistOrderFromServer(completedOrder, user.id);
    if (!persistResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Payment captured, but order persistence failed: ${persistResult.reason}.`,
        },
        { status: 502 }
      );
    }

    const confirmationResult = await sendOrderConfirmationEmail({
      orderId: capture.id,
      payerEmail: capture.payer?.email_address ?? payload.order.shippingAddress.email,
      order: payload.order,
      createdAt: completedOrder.createdAt,
    });
    if (!confirmationResult.ok) {
      console.error("Order confirmation email failed", {
        orderId: capture.id,
        reason: confirmationResult.reason,
      });
      warnings.push(`confirmation-email-failed:${confirmationResult.reason}`);
    }

    const notificationResult = await sendNewOrderNotificationEmail({
      orderId: capture.id,
      payerEmail: capture.payer?.email_address ?? payload.order.shippingAddress.email,
      paypalOrderId: payload.orderId,
      order: payload.order,
      createdAt: completedOrder.createdAt,
    });
    if (!notificationResult.ok) {
      console.error("Seller notification email failed", {
        orderId: capture.id,
        sellerEmail: process.env.SELLER_EMAIL,
        reason: notificationResult.reason,
      });
      warnings.push(`seller-notification-failed:${notificationResult.reason}`);
    }

    return NextResponse.json({
      ok: true,
      id: capture.id,
      status: capture.status,
      payerEmail: capture.payer?.email_address,
      warnings,
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
