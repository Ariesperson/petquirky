import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { withServerTimeout } from "@/lib/server-timeout";
import type { CompletedCheckoutOrder, CompletedCheckoutOrderWithItems } from "@/types/checkout";

const ORDERS_TABLE = "orders";
const ORDERS_QUERY_TIMEOUT_MS = 2500;

type PersistServerOrderInput = CompletedCheckoutOrderWithItems;
type SupabaseOrderRow = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  currency: "EUR";
  created_at: string;
  payer_email: string | null;
  shipping_address: CompletedCheckoutOrder["shippingAddress"];
  items: CompletedCheckoutOrderWithItems["items"] | null;
};

function mapSupabaseOrderRow(row: SupabaseOrderRow): CompletedCheckoutOrderWithItems {
  return {
    id: row.id,
    status: row.status,
    total: row.total,
    currency: row.currency,
    createdAt: row.created_at,
    payerEmail: row.payer_email ?? undefined,
    shippingAddress: row.shipping_address,
    items: row.items ?? [],
  };
}

export async function persistOrderFromServer(order: PersistServerOrderInput, userId: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, reason: "supabase-not-configured" };
  }

  if (!userId) {
    return { ok: false as const, reason: "missing-user-id" };
  }

  const { error } = await supabase.from(ORDERS_TABLE).upsert(
    {
      id: order.id,
      user_id: userId,
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

  return { ok: true as const, userId };
}

export async function listOrdersForUserFromServer(userId: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase || !userId) {
    return [] as CompletedCheckoutOrderWithItems[];
  }

  const result = await withServerTimeout(
    supabase
      .from(ORDERS_TABLE)
      .select("id,user_id,status,total,currency,created_at,payer_email,shipping_address,items")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    ORDERS_QUERY_TIMEOUT_MS,
    "Orders query timed out"
  ).catch(() => ({ data: null, error: new Error("Orders query failed") }));
  const { data, error } = result;

  if (error || !data) {
    return [] as CompletedCheckoutOrderWithItems[];
  }

  return (data as SupabaseOrderRow[]).map(mapSupabaseOrderRow);
}

export async function getOrderForUserFromServer(userId: string, orderId: string) {
  const orders = await listOrdersForUserFromServer(userId);
  return orders.find((order) => order.id === orderId) ?? null;
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
