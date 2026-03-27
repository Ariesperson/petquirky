"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { formatPrice, type ProductListingItem } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

type CartItemProps = {
  locale: Locale;
  product: ProductListingItem;
  quantity: number;
  lineTotal: number;
  quantityLabel: string;
  removeLabel: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItem({
  locale,
  product,
  quantity,
  lineTotal,
  quantityLabel,
  removeLabel,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <article className="group flex flex-col gap-6 rounded-[28px] bg-white p-6 shadow-[0_14px_34px_rgba(165,54,13,0.06)] md:flex-row">
      <div className="h-32 w-full overflow-hidden rounded-[20px] bg-[#f0eded] md:w-32 md:flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name[locale]}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl text-dark">{product.name[locale]}</h3>
            <button
              type="button"
              onClick={onRemove}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-error"
            >
              <Trash2 className="size-4" />
              {removeLabel}
            </button>
          </div>
          <p className="text-xl font-bold text-primary">{formatPrice(lineTotal, locale)}</p>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {quantityLabel}
          </span>
          <div className="flex items-center rounded-full bg-[#eae7e7] px-2 py-1">
            <button
              type="button"
              onClick={onDecrease}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-dark transition hover:text-primary"
            >
              <Minus className="size-4" />
            </button>
            <span className="px-4 font-bold text-dark">{quantity}</span>
            <button
              type="button"
              onClick={onIncrease}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-dark transition hover:text-primary"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
