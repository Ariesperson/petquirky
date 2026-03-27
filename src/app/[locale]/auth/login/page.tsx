import { LoginForm } from "@/components/auth/LoginForm";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#fcf9f8] px-4 py-20">
      <LoginForm
        locale={locale}
        labels={{
          title: dict.auth.login_title,
          subtitle: dict.auth.login_subtitle,
          email: dict.auth.email,
          password: dict.auth.password,
          remember: dict.auth.remember,
          forgotPassword: dict.auth.forgot_password,
          submit: dict.auth.login_submit,
          noAccount: dict.auth.no_account,
          createAccount: dict.auth.create_account,
          invalidCredentials: dict.auth.invalid_credentials,
        }}
      />
    </main>
  );
}
