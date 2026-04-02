import { ProfileClient } from "@/components/account/ProfileClient";
import { mapSupabaseUser } from "@/lib/auth";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
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

  return (
    <ProfileClient
      initialUser={mappedUser}
      labels={{
        title: dict.account.profile,
        help: dict.account.profile_help,
        fullName: dict.auth.full_name,
        email: dict.auth.email,
        accountId: dict.account.account_id,
        shippingAddress: dict.checkout.shipping_address,
        address: dict.checkout.address,
        city: dict.checkout.city,
        postalCode: dict.checkout.postal_code,
        country: dict.checkout.country,
        noSavedAddress: dict.account.no_saved_address,
        save: dict.account.save_changes,
        saving: dict.account.saving_changes,
        success: dict.account.profile_saved,
        incompleteAddress: dict.account.incomplete_address,
        emailLocked: dict.account.email_locked,
      }}
    />
  );
}
