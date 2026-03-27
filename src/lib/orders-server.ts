import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CompletedCheckoutOrder, CompletedCheckoutOrderWithItems } from "@/types/checkout";

const ORDERS_TABLE = "orders";

type PersistServerOrderInput = CompletedCheckoutOrderWithItems;

export async function persistOrderFromServer(order: PersistServerOrderInput) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, reason: "supabase-not-configured" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, reason: "guest-or-missing-user" };
  }

  const { error } = await supabase.from(ORDERS_TABLE).upsert(
    {
      id: order.id,
      user_id: user.id,
      status: order.status,
      total: order.total,
      currency: order.currency,
      created_at: order.createdAt,
      payer_email: order.payerEmail ?? null,
      shipping_address: order.shippingAddress,
      items: order.items,
    },
    { onConflict: "id" }
  );

  if (error) {
    return { ok: false as const, reason: error.message };
  }

  return { ok: true as const, userId: user.id };
}

export function serializeCompletedOrder(input: {
  id: string;
  status: string;
  total: number;
  payerEmail?: string;
  shippingAddress: CompletedCheckoutOrder["shippingAddress"];
  items: CompletedCheckoutOrderWithItems["items"];
}): CompletedCheckoutOrderWithItems {
  return {
    id: input.id,
    status: input.status,
    total: input.total,
    currency: "EUR",
    createdAt: new Date().toISOString(),
    payerEmail: input.payerEmail,
    shippingAddress: input.shippingAddress,
    items: input.items,
  };
}
