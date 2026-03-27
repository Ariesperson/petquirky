import { Truck } from "lucide-react";

type ShippingEstimateProps = {
  shippingToLabel: string;
  estimatedDeliveryLabel: string;
};

export function ShippingEstimate({
  shippingToLabel,
  estimatedDeliveryLabel,
}: ShippingEstimateProps) {
  return (
    <div className="mb-10 rounded-[28px] bg-[#f6f3f2] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm font-semibold text-dark">
          <Truck className="size-4 text-primary" />
          {shippingToLabel}
        </span>
        <select className="bg-transparent text-sm font-semibold text-primary outline-none">
          <option>Germany</option>
          <option>France</option>
          <option>Italy</option>
          <option>Spain</option>
          <option>Netherlands</option>
        </select>
      </div>
      <p className="text-sm text-muted">
        {estimatedDeliveryLabel}{" "}
        <span className="font-semibold text-dark">Apr 2 - Apr 6</span>
      </p>
    </div>
  );
}
