import { NextResponse } from "next/server";

import { isValidEmail } from "@/lib/auth";
import { sendNewsletterSignupEmail } from "@/lib/email";
import { subscribeToNewsletter } from "@/lib/newsletter";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing email address.",
      },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid email address.",
      },
      { status: 400 }
    );
  }

  const result = await subscribeToNewsletter({
    email,
    locale: typeof body?.locale === "string" ? body.locale : undefined,
    source: typeof body?.source === "string" ? body.source : "homepage",
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.reason,
      },
      { status: 502 }
    );
  }

  if (result.created) {
    void sendNewsletterSignupEmail({
      email: result.email,
      locale: typeof body?.locale === "string" ? body.locale : undefined,
      source: typeof body?.source === "string" ? body.source : "homepage",
    });
  }

  return NextResponse.json({
    ok: true,
    created: result.created,
  });
}
