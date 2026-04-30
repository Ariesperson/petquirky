import { LoginForm } from "@/components/auth/LoginForm";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ returnTo?: string }>;
};

function getSafeReturnTo(locale: string, value?: string) {
  return value?.startsWith(`/${locale}/`) ? value : `/${locale}/account`;
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const dict = await getDictionary(locale);
  const returnTo = getSafeReturnTo(locale, query.returnTo);

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#fcf9f8] px-4 py-20">
      <LoginForm
        locale={locale}
        returnTo={returnTo}
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
