import { NextResponse } from "next/server";

import { sendOrderConfirmationEmail } from "@/lib/email";
import type { CheckoutOrderPayload } from "@/types/checkout";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    orderId?: string;
    payerEmail?: string;
    order?: CheckoutOrderPayload;
  };

  if (!payload.orderId || !payload.payerEmail || !payload.order) {
    return NextResponse.json({ ok: false, error: "Invalid email payload." }, { status: 400 });
  }

  const result = await sendOrderConfirmationEmail({
    orderId: payload.orderId,
    payerEmail: payload.payerEmail,
    order: payload.order,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
