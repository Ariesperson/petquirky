import { AccountOrdersClient } from "@/components/account/AccountOrdersClient";
import { mapSupabaseUser } from "@/lib/auth";
import { getDictionary, isLocale } from "@/lib/i18n";
import { listOrdersForUserFromServer } from "@/lib/orders-server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type AccountPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const dict = await getDictionary(locale);
  const mappedUser = mapSupabaseUser(user);
  const orders = await listOrdersForUserFromServer(user.id);

  return (
    <AccountOrdersClient
      locale={locale}
      customerName={mappedUser?.fullName ?? user.email ?? dict.account.orders}
      customerEmail={mappedUser?.email ?? user.email ?? ""}
      orders={orders}
      labels={{
        orders: dict.account.orders,
        profile: dict.account.profile,
        ordersTitle: dict.account.orders_title,
        ordersSubtitle: dict.account.orders_subtitle,
        statusProcessing: dict.account.status_processing,
        viewDetails: dict.account.view_details,
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
