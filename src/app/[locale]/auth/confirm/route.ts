import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { isLocale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params;
  if (!isLocale(locale)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? `/${locale}/account`;

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = next.startsWith("/") ? next : `/${locale}/account`;
  redirectUrl.search = "";
  redirectUrl.hash = "";

  if (tokenHash && type) {
    const supabase = await getSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });

      if (!error) {
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  redirectUrl.pathname = `/${locale}/auth/login`;
  redirectUrl.searchParams.set("error", "confirmation_link_invalid");
  return NextResponse.redirect(redirectUrl);
}
