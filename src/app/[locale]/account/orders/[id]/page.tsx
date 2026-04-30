import { OrderDetailClient } from "@/components/account/OrderDetailClient";
import { getSellerEmail } from "@/lib/email";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildOrderDetailView } from "@/lib/order-detail";
import { getOrderForUserFromServer } from "@/lib/orders-server";
import { withServerTimeout } from "@/lib/server-timeout";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type OrderDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const ACCOUNT_AUTH_TIMEOUT_MS = 2500;

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await getSupabaseServerClient();
  const authResult = supabase
    ? await withServerTimeout(
        supabase.auth.getUser(),
        ACCOUNT_AUTH_TIMEOUT_MS,
        "Order auth request timed out"
      ).catch(() => ({ data: { user: null } }))
    : { data: { user: null } };
  const {
    data: { user },
  } = authResult;

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const dict = await getDictionary(locale);
  const order = await getOrderForUserFromServer(user.id, id);
  const orderDetail = order ? buildOrderDetailView(order, locale) : null;

  return (
    <OrderDetailClient
      locale={locale}
      order={orderDetail}
      supportEmail={getSellerEmail()}
      labels={{
        orderNumber: dict.account.order_number,
        reviewTitle: dict.account.order_review_title,
        emptyTitle: dict.account.order_missing_title,
        emptyDescription: dict.account.order_missing_description,
        backToOrders: dict.account.back_to_orders,
        continueShopping: dict.checkout.continue_shopping,
        orderJourney: dict.account.order_journey,
        timelinePlaced: dict.account.timeline_placed,
        timelinePaid: dict.account.timeline_paid,
        timelinePreparing: dict.account.timeline_preparing,
        timelineShipped: dict.account.timeline_shipped,
        total: dict.cart.total,
        subtotal: dict.cart.subtotal,
        shipping: dict.cart.shipping,
        pricingSummary: dict.account.pricing_summary,
        email: dict.auth.email,
        customer: dict.account.customer,
        placedOn: dict.account.placed_on,
        shippingAddress: dict.checkout.shipping_address,
        orderItems: dict.checkout.order_items,
        itemsInOrder: dict.account.items_in_order,
        quantity: dict.cart.quantity,
        unitPrice: dict.account.unit_price,
        paymentSummary: dict.account.payment_summary,
        paymentMethod: dict.account.payment_method,
        paymentStatus: dict.account.payment_status,
        paymentMethodPaypal: dict.account.payment_method_paypal,
        paymentStatusPaid: dict.account.payment_status_paid,
        paymentStatusPending: dict.account.payment_status_pending,
        statusCompleted: dict.account.status_completed,
        statusProcessing: dict.account.status_processing,
        statusShipped: dict.account.status_shipped,
        deliveryWindow: dict.account.delivery_window,
        needHelpTitle: dict.account.need_help_title,
        needHelpBody: dict.account.need_help_body,
        contactSupport: dict.footer.contact_support,
        shippingReturns: dict.footer.shipping_returns,
        privacyPolicy: dict.footer.privacy,
        termsOfService: dict.footer.terms,
        itemCountLabel: dict.cart.item_count_label,
        freeShipping: dict.cart.free_shipping,
        itemsFallback: dict.account.order_detail_help,
      }}
    />
  );
}
