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

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
