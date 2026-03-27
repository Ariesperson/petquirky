import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type ForgotPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#fcf9f8] px-4 py-20">
      <ForgotPasswordForm
        locale={locale}
        labels={{
          title: dict.auth.forgot_password,
          help: dict.auth.forgot_password_help,
          email: dict.auth.email,
          submit: dict.auth.send_reset_link,
          backToLogin: dict.auth.back_to_login,
          invalidEmail: dict.auth.invalid_credentials,
          resetSent: dict.auth.reset_sent,
          authUnavailable: dict.auth.auth_unavailable,
        }}
      />
    </main>
  );
}
