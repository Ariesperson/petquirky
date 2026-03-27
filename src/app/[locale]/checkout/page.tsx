import { notFound } from "next/navigation";

import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getDictionary, isLocale } from "@/lib/i18n";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <CheckoutClient
      locale={locale}
      labels={{
        brand: `${dict.common.brand_pet}${dict.common.brand_quirky}`,
        backToCart: dict.checkout.back_to_cart,
        stepShipping: dict.checkout.step_shipping,
        stepReview: dict.checkout.review_title,
        stepPayment: dict.checkout.step_payment,
        shippingTitle: dict.checkout.shipping_title,
        shippingSubtitle: dict.checkout.shipping_subtitle,
        login: dict.auth.login_submit,
        fullName: dict.auth.full_name,
        email: dict.auth.email,
        address: dict.checkout.address,
        city: dict.checkout.city,
        postalCode: dict.checkout.postal_code,
        country: dict.checkout.country,
        continueToReview: dict.checkout.continue_to_review,
        emptyTitle: dict.cart.empty,
        emptyDescription: dict.checkout.empty_description,
        returnToCart: dict.checkout.back_to_cart,
        shippingAddress: dict.checkout.shipping_address,
        edit: dict.checkout.edit,
        orderItems: dict.checkout.order_items,
        paymentMethod: dict.checkout.payment_method,
        legal: dict.checkout.legal,
        paypal: dict.checkout.paypal,
        card: dict.checkout.card,
        secure: dict.checkout.secure,
        terms: dict.footer.terms,
        privacy: dict.footer.privacy,
        summaryTitle: dict.checkout.summary_title,
        subtotal: dict.cart.subtotal,
        shipping: dict.cart.shipping,
        total: dict.cart.total,
        shippingFree: dict.cart.free_shipping,
        paypalUnavailable: dict.checkout.paypal_unavailable,
        paypalError: dict.checkout.paypal_error,
        processing: dict.checkout.processing,
      }}
    />
  );
}
