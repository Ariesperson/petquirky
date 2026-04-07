import { NextResponse } from "next/server";

import { isValidEmail } from "@/lib/auth";
import { sendContactMessageEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing required fields.",
      },
      { status: 400 }
    );
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid email address.",
      },
      { status: 400 }
    );
  }

  const result = await sendContactMessageEmail({
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    message: String(body.message).trim(),
    locale: typeof body.locale === "string" ? body.locale : undefined,
  });

  if (!result.ok) {
    const error =
      result.reason === "resend-not-configured"
        ? "Contact email delivery is not configured yet."
        : result.reason;

    return NextResponse.json(
      {
        ok: false,
        error,
        reason: result.reason,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
