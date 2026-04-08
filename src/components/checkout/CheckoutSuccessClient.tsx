"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import {
  CHECKOUT_ADDRESS_STORAGE_KEY,
  serializeOrderHistoryEntry,
} from "@/lib/checkout";
import { readStoredOrders, writeStoredOrders } from "@/lib/orders";
import type { CheckoutAddress, CheckoutItemPayload } from "@/types/checkout";

type CheckoutSuccessClientProps = {
  orderId: string;
  status: string;
  total: number;
  payerEmail?: string;
  shippingAddress: CheckoutAddress;
  createdAt?: string;
  items?: CheckoutItemPayload[];
};

export function CheckoutSuccessClient({
  orderId,
  status,
  total,
  payerEmail,
  shippingAddress,
  createdAt,
  items,
}: CheckoutSuccessClientProps) {
  const { clearCart } = useCart();
  const { user, saveShippingAddress } = useAuth();

  useEffect(() => {
    const nextOrder = serializeOrderHistoryEntry({
      id: orderId,
      status,
      total,
      payerEmail,
      shippingAddress,
      createdAt,
      items,
    });
    const nextOrders = readStoredOrders().filter((order) => order.id !== orderId);

    writeStoredOrders([nextOrder, ...nextOrders]);
    window.localStorage.setItem(
      CHECKOUT_ADDRESS_STORAGE_KEY,
      JSON.stringify(shippingAddress)
    );

    if (user) {
      void saveShippingAddress(shippingAddress);
    }

    clearCart();
  }, [
    clearCart,
    createdAt,
    items,
    orderId,
    payerEmail,
    saveShippingAddress,
    shippingAddress,
    status,
    total,
    user,
  ]);

  return null;
}
