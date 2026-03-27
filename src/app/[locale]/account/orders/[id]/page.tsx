import { OrderDetailClient } from "@/components/account/OrderDetailClient";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type OrderDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <OrderDetailClient
      locale={locale}
      orderId={id}
      labels={{
        orderNumber: dict.account.order_number,
        emptyTitle: dict.account.order_missing_title,
        emptyDescription: dict.account.order_missing_description,
        backToOrders: dict.account.back_to_orders,
        status: dict.account.status_processing,
        total: dict.cart.total,
        email: dict.auth.email,
        placedOn: dict.account.placed_on,
        shippingAddress: dict.checkout.shipping_address,
      }}
    />
  );
}
