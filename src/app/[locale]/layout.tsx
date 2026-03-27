import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <AuthProvider>
      <CartProvider>
        <div data-locale={locale as Locale} className="flex min-h-full flex-col">
        <Header
          locale={locale}
          dictionary={{
            common: {
              brandPet: dict.common.brand_pet,
              brandQuirky: dict.common.brand_quirky,
            },
            locale: {
              label: dict.locale.label,
              names: {
                en: dict.locale.en,
                de: dict.locale.de,
                fr: dict.locale.fr,
                es: dict.locale.es,
              },
            },
            nav: {
              home: dict.nav.home,
              products: dict.nav.products,
              blog: dict.nav.blog,
              about: dict.nav.about,
              contact: dict.nav.contact,
              account: dict.nav.account,
              cart: dict.nav.cart,
              search: dict.nav.search,
              searchTitle: dict.nav.search_title,
              searchPlaceholder: dict.nav.search_placeholder,
              searchEmpty: dict.nav.search_empty,
              openMenu: dict.nav.open_menu,
              closeMenu: dict.nav.close_menu,
            },
          }}
        />
        {children}
        <Footer
          locale={locale}
          dictionary={{
            footer: {
              shopTitle: dict.footer.shop_title,
              supportTitle: dict.footer.support_title,
              legalTitle: dict.footer.legal_title,
              socialTitle: dict.footer.social_title,
              allProducts: dict.footer.all_products,
              smartToys: dict.footer.smart_toys,
              feedingEnrichment: dict.footer.feeding_enrichment,
              habitatEquipment: dict.footer.habitat_equipment,
              faq: dict.footer.faq,
              shippingReturns: dict.footer.shipping_returns,
              contactSupport: dict.footer.contact_support,
              privacy: dict.footer.privacy,
              terms: dict.footer.terms,
              cookieSettings: dict.footer.cookie_settings,
              tiktok: dict.footer.tiktok,
              instagram: dict.footer.instagram,
              individualSeller: dict.footer.individual_seller,
              copyright: dict.footer.copyright,
            },
          }}
        />
        <CookieBanner
          labels={{
            title: dict.cookie.title,
            description: dict.cookie.description,
            acceptAll: dict.cookie.accept_all,
            necessaryOnly: dict.cookie.necessary_only,
            managePreferences: dict.cookie.manage_preferences,
            preferencesTitle: dict.cookie.preferences_title,
            preferencesDescription: dict.cookie.preferences_description,
            savePreferences: dict.cookie.save_preferences,
            cancel: dict.cookie.cancel,
            necessaryTitle: dict.cookie.necessary_title,
            necessaryDescription: dict.cookie.necessary_description,
            analyticsTitle: dict.cookie.analytics_title,
            analyticsDescription: dict.cookie.analytics_description,
            marketingTitle: dict.cookie.marketing_title,
            marketingDescription: dict.cookie.marketing_description,
          }}
        />
        <CartDrawer
          locale={locale}
          labels={{
            title: dict.cart.title,
            remainingForFreeShipping: dict.cart.remaining_for_free_shipping,
            qualifiedForFreeShipping: dict.cart.qualified_free_shipping,
            quantity: dict.cart.quantity,
            remove: dict.cart.remove,
            subtotal: dict.cart.subtotal,
            viewCart: dict.cart.view_cart,
            checkout: dict.cart.checkout,
          }}
        />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
