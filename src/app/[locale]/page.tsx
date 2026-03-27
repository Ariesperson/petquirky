import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeroBanner } from "@/components/home/HeroBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustBadges } from "@/components/home/TrustBadges";
import { getDictionary, type Locale } from "@/lib/i18n";

type LocalePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const categories = [
    { emoji: "✨", label: dict.home.category_smart_toys },
    { emoji: "🥣", label: dict.home.category_feeding },
    { emoji: "🏠", label: dict.home.category_habitat },
    { emoji: "📦", label: dict.home.category_all_products },
  ];

  const featuredProducts = [
    {
      name: "AeroBounce Smart Launcher",
      petType: `🐕 ${dict.home.pet_dogs}`,
      price: "89,00 €",
      compareAtPrice: "115,00 €",
      badge: dict.home.badge_bestseller,
      rating: "4.8",
      reviews: "124",
      emoji: "🎾",
      tone: "bg-[#f2dfd3]",
      addToCartLabel: dict.home.featured_add_to_cart,
      ratingLabel: dict.home.featured_rating_count,
    },
    {
      name: "ZenFelt Cat Sanctuary",
      petType: `🐱 ${dict.home.pet_cats}`,
      price: "64,00 €",
      rating: "4.9",
      reviews: "42",
      badge: dict.home.badge_new,
      emoji: "🛏️",
      tone: "bg-[#efe5da]",
      addToCartLabel: dict.home.featured_add_to_cart,
      ratingLabel: dict.home.featured_rating_count,
    },
    {
      name: "TerraSmart Ecosystem V2",
      petType: `🦎 ${dict.home.pet_reptiles}`,
      price: "210,00 €",
      compareAtPrice: "245,00 €",
      badge: dict.home.badge_bestseller,
      rating: "4.7",
      reviews: "88",
      emoji: "🌿",
      tone: "bg-[#dde8df]",
      addToCartLabel: dict.home.featured_add_to_cart,
      ratingLabel: dict.home.featured_rating_count,
    },
    {
      name: "GroomPro Bamboo Set",
      petType: `🐹 ${dict.home.pet_small_pets}`,
      price: "35,00 €",
      rating: "4.8",
      reviews: "15",
      emoji: "🪮",
      tone: "bg-[#f0e5db]",
      addToCartLabel: dict.home.featured_add_to_cart,
      ratingLabel: dict.home.featured_rating_count,
    },
  ];

  const trustItems = [
    {
      icon: "🚚",
      title: dict.home.trust_title_shipping,
      description: dict.home.trust_desc_shipping,
    },
    {
      icon: "🔄",
      title: dict.home.trust_title_returns,
      description: dict.home.trust_desc_returns,
    },
    {
      icon: "🔒",
      title: dict.home.trust_title_payment,
      description: dict.home.trust_desc_payment,
    },
    {
      icon: "✅",
      title: dict.home.trust_title_certified,
      description: dict.home.trust_desc_certified,
    },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <HeroBanner
        locale={locale}
        title={dict.home.hero_title}
        subtitle={dict.home.hero_subtitle}
        ctaLabel={dict.home.hero_cta}
        secondaryCtaLabel={dict.home.hero_secondary_cta}
      />
      <CategoryShowcase
        locale={locale}
        title={dict.home.categories_title}
        browseAllLabel={dict.home.categories_browse_all}
        categories={categories}
      />
      <FeaturedProducts
        title={dict.home.featured_title}
        subtitle={dict.home.featured_subtitle}
        products={featuredProducts}
      />
      <TrustBadges items={trustItems} />
      <Newsletter
        title={dict.home.newsletter_title}
        description={dict.home.newsletter_description}
        placeholder={dict.home.newsletter_placeholder}
        ctaLabel={dict.home.newsletter_cta}
      />
    </main>
  );
}
