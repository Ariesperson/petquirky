import type { User } from "@supabase/supabase-js";
import type { CheckoutAddress } from "@/types/checkout";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  shippingAddress?: CheckoutAddress;
};

export type AuthActionResult = {
  error?: string;
  requiresEmailConfirmation?: boolean;
};

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongEnoughPassword(password: string) {
  return password.trim().length >= 8;
}

export function getSupabasePublicEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabasePublicEnv();
  return Boolean(url && anonKey);
}

export function mapSupabaseUser(user: User | null): AuthUser | null {
  if (!user?.email) {
    return null;
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name
      : user.email.split("@")[0];
  const shippingMetadata = user.user_metadata?.shipping_address;
  const shippingAddress =
    shippingMetadata &&
    typeof shippingMetadata === "object" &&
    typeof shippingMetadata.address === "string" &&
    typeof shippingMetadata.city === "string" &&
    typeof shippingMetadata.postalCode === "string" &&
    typeof shippingMetadata.country === "string"
      ? {
          fullName:
            typeof shippingMetadata.fullName === "string" && shippingMetadata.fullName.trim()
              ? shippingMetadata.fullName
              : fullName,
          email:
            typeof shippingMetadata.email === "string" && shippingMetadata.email.trim()
              ? shippingMetadata.email
              : user.email,
          address: shippingMetadata.address,
          city: shippingMetadata.city,
          postalCode: shippingMetadata.postalCode,
          country: shippingMetadata.country,
        }
      : undefined;

  return {
    id: user.id,
    email: user.email,
    fullName,
    shippingAddress,
  };
}
