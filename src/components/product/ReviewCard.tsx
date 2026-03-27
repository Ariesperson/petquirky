import { Star } from "lucide-react";

import type { ProductReview } from "@/lib/products";

type ReviewCardProps = {
  review: ProductReview;
  verifiedLabel: string;
};

function formatRelativeDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewCard({ review, verifiedLabel }: ReviewCardProps) {
  return (
    <article className="rounded-[28px] bg-white p-8 shadow-[0_14px_34px_rgba(165,54,13,0.06)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h4 className="text-lg font-semibold text-dark">{review.authorName}</h4>
            {review.verified ? (
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-success">
                {verifiedLabel}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-primary">
            {Array.from({ length: review.rating }).map((_, index) => (
              <Star key={index} className="size-4 fill-current" />
            ))}
          </div>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {formatRelativeDate(review.date)}
        </span>
      </div>
      <h5 className="text-base font-semibold text-dark">{review.title}</h5>
      <p className="mt-3 text-sm leading-7 text-muted">{review.content}</p>
    </article>
  );
}
