"use client";

import type { CheckoutAddress } from "@/types/checkout";

type OrderReviewProps = {
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    lineLabel: string;
    lineTotal: string;
  }>;
  shippingAddress: CheckoutAddress;
  labels: {
    title: string;
    shippingAddress: string;
    edit: string;
    orderItems: string;
    paymentMethod: string;
    legal: string;
    paypal: string;
    card: string;
    secure: string;
    terms: string;
    privacy: string;
  };
  onEdit: () => void;
  editDisabled?: boolean;
};

export function OrderReview({
  items,
  shippingAddress,
  labels,
  onEdit,
  editDisabled = false,
}: OrderReviewProps) {
  return (
    <section className="lg:col-span-7 space-y-10">
      <h1 className="font-heading text-4xl font-extrabold text-dark">{labels.title}</h1>

      <div className="rounded-[28px] bg-[#f6f3f2] p-8">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-dark">{labels.shippingAddress}</h3>
            <div className="mt-4 space-y-1 text-sm text-muted">
              <p className="font-semibold text-dark">{shippingAddress.fullName}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEdit}
            disabled={editDisabled}
            className="text-sm font-semibold text-primary underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {labels.edit}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark">{labels.orderItems}</h3>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-[24px] bg-white p-4 shadow-[0_14px_34px_rgba(165,54,13,0.06)]">
            <div className="h-24 w-24 overflow-hidden rounded-[18px] bg-[#f6f3f2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-dark">{item.name}</p>
              <p className="text-sm text-muted">{item.lineLabel}</p>
            </div>
            <div className="font-semibold text-dark">{item.lineTotal}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
