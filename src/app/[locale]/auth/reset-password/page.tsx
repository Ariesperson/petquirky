import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type ResetPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#fcf9f8] px-4 py-20">
      <ResetPasswordForm
        locale={locale}
        labels={{
          title: dict.auth.reset_password,
          help: dict.auth.reset_password_help,
          password: dict.auth.password,
          confirmPassword: dict.auth.confirm_password,
          submit: dict.auth.update_password,
          backToLogin: dict.auth.back_to_login,
          invalidPassword: dict.auth.invalid_registration,
          updated: dict.auth.password_updated,
          authUnavailable: dict.auth.auth_unavailable,
        }}
      />
    </main>
  );
}
