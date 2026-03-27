import { Star } from "lucide-react";

import { RatingDistribution } from "@/components/product/RatingDistribution";
import { ReviewCard } from "@/components/product/ReviewCard";
import type { ProductReview } from "@/lib/products";

type ReviewSectionProps = {
  title: string;
  averageRating: number;
  reviewCount: number;
  reviews: ProductReview[];
  distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  labels: {
    basedOnReviews: string;
    verifiedPurchase: string;
    starsLabel: string;
  };
};

export function ReviewSection({
  title,
  averageRating,
  reviewCount,
  reviews,
  distribution,
  labels,
}: ReviewSectionProps) {
  return (
    <section className="mt-28">
      <div className="flex flex-col gap-12 md:flex-row md:items-start">
        <div className="w-full md:w-80 md:flex-shrink-0">
          <h2 className="font-heading text-3xl font-extrabold text-dark">{title}</h2>
          <div className="mt-6 rounded-[30px] bg-[#f6f3f2] p-8">
            <div className="mb-6 text-center">
              <div className="text-6xl font-extrabold text-primary">
                {averageRating.toFixed(1)}
              </div>
              <div className="mt-3 flex justify-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                {labels.basedOnReviews.replace("{count}", String(reviewCount))}
              </p>
            </div>

            <RatingDistribution items={distribution} labelTemplate={labels.starsLabel} />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          {reviews.map((review) => (
            <ReviewCard
              key={`${review.productId}-${review.authorName}-${review.date}`}
              review={review}
              verifiedLabel={labels.verifiedPurchase}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
