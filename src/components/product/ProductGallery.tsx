import type { Locale } from "@/lib/i18n";
import type { ProductListingItem } from "@/lib/products";

type ProductGalleryProps = {
  locale: Locale;
  product: ProductListingItem;
  badgeLabel?: string | null;
};

export function ProductGallery({ locale, product, badgeLabel }: ProductGalleryProps) {
  const galleryImages = [
    ...product.images,
    ...product.images.slice(0, 1),
    ...product.images.slice(0, 1),
    ...product.images.slice(0, 1),
  ].slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="relative aspect-square overflow-hidden rounded-[30px] bg-[#f6f3f2] shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name[locale]}
          className="h-full w-full object-cover"
        />
        {badgeLabel ? (
          <span className="absolute left-5 top-5 rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            {badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {galleryImages.map((image, index) => (
          <div
            key={`${product.id}-${index}`}
            className={`aspect-square overflow-hidden rounded-[18px] bg-white ${
              index === 0 ? "ring-2 ring-primary" : "opacity-70"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${product.name[locale]} ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
