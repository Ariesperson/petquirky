import "server-only";

import { isValidEmail } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const NEWSLETTER_TABLE = "newsletter_subscribers";

export type NewsletterSignupInput = {
  email: string;
  locale?: string;
  source?: string;
};

export function normalizeNewsletterEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function subscribeToNewsletter(input: NewsletterSignupInput) {
  const email = normalizeNewsletterEmail(input.email);

  if (!isValidEmail(email)) {
    return { ok: false as const, reason: "invalid-email" };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, reason: "supabase-not-configured" };
  }

  const { error } = await supabase.from(NEWSLETTER_TABLE).insert({
    email,
    locale: input.locale ?? null,
    source: input.source ?? "homepage",
  });

  if (!error) {
    return { ok: true as const, created: true, email };
  }

  if (error.code === "23505") {
    return { ok: true as const, created: false, email };
  }

  return { ok: false as const, reason: error.message };
}
