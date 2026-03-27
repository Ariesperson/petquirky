type RatingDistributionProps = {
  items: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  labelTemplate: string;
};

export function RatingDistribution({
  items,
  labelTemplate,
}: RatingDistributionProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.rating} className="flex items-center gap-3 text-xs font-bold">
          <span className="w-14 text-muted">
            {labelTemplate.replace("{rating}", String(item.rating))}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e4e2e1]">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <span className="w-8 text-right text-muted">{item.percentage}%</span>
        </div>
      ))}
    </div>
  );
}
