import { OrderDetailClient } from "@/components/account/OrderDetailClient";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getOrderForUserFromServer } from "@/lib/orders-server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type OrderDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const dict = await getDictionary(locale);
  const order = await getOrderForUserFromServer(user.id, id);

  return (
    <OrderDetailClient
      locale={locale}
      order={order}
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
        orderItems: dict.checkout.order_items,
        quantity: dict.cart.quantity,
      }}
    />
  );
}
