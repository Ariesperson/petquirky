import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeroBanner } from "@/components/home/HeroBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustBadges } from "@/components/home/TrustBadges";
import { getDictionary, type Locale } from "@/lib/i18n";
import { filterProducts } from "@/lib/products";

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

  const featuredProducts = filterProducts(locale, { sort: "recommended" }).slice(0, 4);
  const petTypeLabels: Record<string, string> = {
    cat: `🐈 ${dict.products.pet_cats}`,
    dog: `🐕 ${dict.products.pet_dogs}`,
    reptile: `🦎 ${dict.products.pet_reptiles}`,
    hamster: `🐹 ${dict.products.pet_hamsters}`,
    rabbit: `🐇 ${dict.products.pet_rabbits}`,
    bird: `🐦 ${dict.products.pet_birds}`,
    fish: `🐠 ${dict.products.pet_fish}`,
    other: dict.products.pet_other,
  };

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
        locale={locale}
        title={dict.home.featured_title}
        subtitle={dict.home.featured_subtitle}
        products={featuredProducts}
        labels={{
          addToCart: dict.home.featured_add_to_cart,
          reviews: dict.products.reviews_label,
          badges: {
            new: dict.products.badge_new,
            bestseller: dict.products.badge_bestseller,
            sale: dict.products.badge_sale,
          },
          petTypes: petTypeLabels,
        }}
      />
      <TrustBadges items={trustItems} />
      <Newsletter
        locale={locale}
        title={dict.home.newsletter_title}
        description={dict.home.newsletter_description}
        placeholder={dict.home.newsletter_placeholder}
        ctaLabel={dict.home.newsletter_cta}
        successLabel={dict.home.newsletter_success}
        errorLabel={dict.home.newsletter_error}
        invalidLabel={dict.home.newsletter_invalid}
        alreadyLabel={dict.home.newsletter_already}
        processingLabel={dict.home.newsletter_processing}
      />
    </main>
  );
}
