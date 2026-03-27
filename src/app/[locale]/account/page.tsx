import { AccountOrdersClient } from "@/components/account/AccountOrdersClient";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type AccountPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <AccountOrdersClient
      locale={locale}
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
        guestName: dict.account.guest_name,
        guestEmail: dict.account.guest_email,
      }}
    />
  );
}
