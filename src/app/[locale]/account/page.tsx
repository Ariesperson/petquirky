import { AccountOrdersClient } from "@/components/account/AccountOrdersClient";
import { mapSupabaseUser } from "@/lib/auth";
import { getDictionary, isLocale } from "@/lib/i18n";
import { buildOrderDetailView } from "@/lib/order-detail";
import { listOrdersForUserFromServer } from "@/lib/orders-server";
import { withServerTimeout } from "@/lib/server-timeout";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type AccountPageProps = {
  params: Promise<{ locale: string }>;
};

const ACCOUNT_AUTH_TIMEOUT_MS = 2500;

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await getSupabaseServerClient();
  const authResult = supabase
    ? await withServerTimeout(
        supabase.auth.getUser(),
        ACCOUNT_AUTH_TIMEOUT_MS,
        "Account auth request timed out"
      ).catch(() => ({ data: { user: null } }))
    : { data: { user: null } };
  const {
    data: { user },
  } = authResult;

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const dict = await getDictionary(locale);
  const mappedUser = mapSupabaseUser(user);
  const orders = await listOrdersForUserFromServer(user.id);
  const orderDetails = orders.map((order) => buildOrderDetailView(order, locale));

  return (
    <AccountOrdersClient
      locale={locale}
      customerName={mappedUser?.fullName ?? user.email ?? dict.account.orders}
      customerEmail={mappedUser?.email ?? user.email ?? ""}
      orders={orderDetails}
      labels={{
        orders: dict.account.orders,
        profile: dict.account.profile,
        ordersTitle: dict.account.orders_title,
        ordersSubtitle: dict.account.orders_subtitle,
        reviewTitle: dict.account.order_review_title,
        orderJourney: dict.account.order_journey,
        statusProcessing: dict.account.status_processing,
        statusCompleted: dict.account.status_completed,
        statusShipped: dict.account.status_shipped,
        viewDetails: dict.account.view_details,
        paymentSummary: dict.account.payment_summary,
        itemCountLabel: dict.cart.item_count_label,
        quantity: dict.cart.quantity,
        subtotal: dict.cart.subtotal,
        total: dict.cart.total,
        emptyTitle: dict.account.empty_title,
        emptyDescription: dict.account.empty_description,
        startShopping: dict.home.hero_cta,
        signOut: dict.account.sign_out,
        signingOut: dict.account.signing_out,
      }}
    />
  );
}
