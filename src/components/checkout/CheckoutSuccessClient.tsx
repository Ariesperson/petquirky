"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import {
  CHECKOUT_ADDRESS_STORAGE_KEY,
} from "@/lib/checkout";
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
  shippingAddress,
}: CheckoutSuccessClientProps) {
  const { clearCart } = useCart();
  const { user, saveShippingAddress } = useAuth();

  useEffect(() => {
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
    saveShippingAddress,
    shippingAddress,
    user,
  ]);

  return null;
}
