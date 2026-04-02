"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
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
  const { user, saveShippingAddress } = useAuth();

  useEffect(() => {
    if (user) {
      void saveShippingAddress(shippingAddress);
    }

    clearCart();
  }, [clearCart, orderId, payerEmail, saveShippingAddress, shippingAddress, status, total, user]);

  return null;
}
