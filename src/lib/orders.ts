"use client";

import { isSupabaseConfigured } from "@/lib/auth";
import { ORDER_HISTORY_STORAGE_KEY } from "@/lib/checkout";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CheckoutItemPayload, CompletedCheckoutOrder } from "@/types/checkout";

const ORDERS_TABLE = "orders";

export function readStoredOrders() {
  if (typeof window === "undefined") {
    return [] as CompletedCheckoutOrder[];
  }

  const rawValue = window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
  if (!rawValue) {
    return [] as CompletedCheckoutOrder[];
  }

  try {
    const parsed = JSON.parse(rawValue) as CompletedCheckoutOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type PersistOrderInput = CompletedCheckoutOrder & {
  userId?: string | null;
};

type SupabaseOrderRow = {
  id: string;
  user_id: string | null;
  status: string;
  total: number;
  currency: "EUR";
  created_at: string;
  payer_email: string | null;
  shipping_address: CompletedCheckoutOrder["shippingAddress"];
  items: CheckoutItemPayload[] | null;
};

export function writeStoredOrders(nextOrders: CompletedCheckoutOrder[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(nextOrders.slice(0, 12)));
}

export async function persistOrderToSupabase(order: PersistOrderInput) {
  if (!order.userId || !isSupabaseConfigured()) {
    return { ok: false as const, reason: "not-configured" };
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false as const, reason: "missing-client" };
  }

  const { error } = await supabase.from(ORDERS_TABLE).upsert(
    {
      id: order.id,
      user_id: order.userId,
      status: order.status,
      total: order.total,
      currency: order.currency,
      created_at: order.createdAt,
      payer_email: order.payerEmail ?? null,
      shipping_address: order.shippingAddress,
      items: order.items ?? [],
    },
    { onConflict: "id" }
  );

  if (error) {
    return { ok: false as const, reason: error.message };
  }

  return { ok: true as const };
}

export async function listOrdersFromSupabase(userId: string) {
  if (!isSupabaseConfigured()) {
    return [] as CompletedCheckoutOrder[];
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return [] as CompletedCheckoutOrder[];
  }

  const { data, error } = await supabase
    .from(ORDERS_TABLE)
    .select("id,user_id,status,total,currency,created_at,payer_email,shipping_address,items")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as CompletedCheckoutOrder[];
  }

  return (data as SupabaseOrderRow[]).map((row) => ({
    id: row.id,
    status: row.status,
    total: row.total,
    currency: row.currency,
    createdAt: row.created_at,
    payerEmail: row.payer_email ?? undefined,
    shippingAddress: row.shipping_address,
    items: row.items ?? [],
  }));
}
