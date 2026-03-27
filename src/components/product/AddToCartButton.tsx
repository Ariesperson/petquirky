"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";

import { useCart } from "@/hooks/useCart";

type AddToCartButtonProps = {
  productId: string;
  addToCartLabel: string;
  quantityLabel: string;
  mobileLabel: string;
};

export function AddToCartButton({
  productId,
  addToCartLabel,
  quantityLabel,
  mobileLabel,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  return (
    <>
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-muted">{quantityLabel}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex h-14 items-center rounded-[20px] bg-[#f6f3f2] px-2">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-white"
              aria-label="decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-12 text-center text-lg font-bold text-dark">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-white"
              aria-label="increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => addItem(productId, quantity)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[20px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.25)] transition hover:scale-[1.02]"
          >
            <ShoppingBag className="size-4" />
            {addToCartLabel}
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/50 bg-[#fcf9f8]/94 px-4 py-3 shadow-[0_-12px_40px_rgba(165,54,13,0.12)] backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => addItem(productId, quantity)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white"
        >
          <ShoppingBag className="size-4" />
          {mobileLabel}
        </button>
      </div>
    </>
  );
}
