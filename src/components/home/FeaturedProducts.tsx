import { Star } from "lucide-react";

type Product = {
  name: string;
  petType: string;
  price: string;
  compareAtPrice?: string;
  badge?: string;
  rating: string;
  reviews: string;
  emoji: string;
  tone: string;
  addToCartLabel: string;
  ratingLabel: string;
};

type FeaturedProductsProps = {
  title: string;
  subtitle: string;
  products: Product[];
};

export function FeaturedProducts({
  title,
  subtitle,
  products,
}: FeaturedProductsProps) {
  return (
    <section className="bg-[#f6f3f2] py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-dark">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">{subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-[30px] bg-white shadow-[0_20px_44px_rgba(165,54,13,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(165,54,13,0.12)]"
            >
              <div className={`relative h-72 overflow-hidden ${product.tone}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_50%)]" />
                {product.badge ? (
                  <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    {product.badge}
                  </span>
                ) : null}
                <div className="flex h-full items-center justify-center text-[5rem]">
                  {product.emoji}
                </div>
              </div>

              <div className="flex flex-col p-6">
                <div className="flex items-center gap-1 text-sm text-dark">
                  <Star className="size-4 fill-[#fbbf24] text-[#fbbf24]" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted">
                    ({product.reviews} {product.ratingLabel})
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-dark">{product.name}</h3>
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-[#f1ecea] px-3 py-1 text-xs font-medium text-dark/70">
                    {product.petType}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <span className="text-xl font-bold text-primary">{product.price}</span>
                  {product.compareAtPrice ? (
                    <span className="text-sm text-muted line-through">
                      {product.compareAtPrice}
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="mt-6 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  {product.addToCartLabel}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
