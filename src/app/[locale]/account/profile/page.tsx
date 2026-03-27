import { ProfileClient } from "@/components/account/ProfileClient";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <ProfileClient
      locale={locale}
      labels={{
        title: dict.account.profile,
        guestName: dict.account.guest_name,
        guestEmail: dict.account.guest_email,
        help: dict.account.profile_help,
        signOut: dict.account.sign_out,
        authUnavailable: dict.auth.auth_unavailable,
      }}
    />
  );
}
