"use client";

import { useEffect } from "react";

import { serializeOrderHistoryEntry } from "@/lib/checkout";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { persistOrderToSupabase, readStoredOrders, writeStoredOrders } from "@/lib/orders";
import type { CheckoutAddress } from "@/types/checkout";

type CheckoutSuccessClientProps = {
  orderId: string;
  status: string;
  total: number;
  payerEmail?: string;
  shippingAddress: CheckoutAddress;
};

export function CheckoutSuccessClient({
  orderId,
  status,
  total,
  payerEmail,
  shippingAddress,
}: CheckoutSuccessClientProps) {
  const { clearCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    clearCart();

    const nextEntry = serializeOrderHistoryEntry({
      id: orderId,
      status,
      total,
      payerEmail,
      shippingAddress,
    });
    const history = readStoredOrders();

    const deduped = history.filter((entry) => entry.id !== orderId);
    writeStoredOrders([nextEntry, ...deduped]);

    void persistOrderToSupabase({
      ...nextEntry,
      userId: user?.id,
    });
  }, [clearCart, orderId, payerEmail, shippingAddress, status, total, user?.id]);

  return null;
}
