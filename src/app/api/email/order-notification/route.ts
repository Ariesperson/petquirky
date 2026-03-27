import { NextResponse } from "next/server";

import { sendNewOrderNotificationEmail } from "@/lib/email";
import type { CheckoutOrderPayload } from "@/types/checkout";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    orderId?: string;
    payerEmail?: string;
    paypalOrderId?: string;
    order?: CheckoutOrderPayload;
  };

  if (!payload.orderId || !payload.payerEmail || !payload.paypalOrderId || !payload.order) {
    return NextResponse.json({ ok: false, error: "Invalid email payload." }, { status: 400 });
  }

  const result = await sendNewOrderNotificationEmail({
    orderId: payload.orderId,
    payerEmail: payload.payerEmail,
    paypalOrderId: payload.paypalOrderId,
    order: payload.order,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
