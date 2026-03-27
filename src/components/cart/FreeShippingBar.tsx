type FreeShippingBarProps = {
  subtotal: number;
  threshold: number;
  labels: {
    qualified: string;
    remaining: string;
  };
};

function formatAmount(amount: number) {
  return `${amount.toFixed(2)} €`;
}

export function FreeShippingBar({
  subtotal,
  threshold,
  labels,
}: FreeShippingBarProps) {
  const progress = Math.min(100, (subtotal / threshold) * 100);
  const remaining = Math.max(0, threshold - subtotal);
  const qualified = subtotal >= threshold;

  return (
    <div className="rounded-[28px] bg-[#f6f3f2] p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-dark">
          {qualified
            ? labels.qualified
            : labels.remaining.replace("{amount}", formatAmount(remaining))}
        </p>
        <span className="text-xs font-bold text-primary">
          {formatAmount(subtotal)} / {formatAmount(threshold)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#e4e2e1]">
        <div
          className={`h-full rounded-full ${
            qualified
              ? "bg-[#1D9E75] shadow-[0_0_8px_rgba(29,158,117,0.3)]"
              : "bg-[linear-gradient(135deg,#d85a30,#ff8a65)]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
