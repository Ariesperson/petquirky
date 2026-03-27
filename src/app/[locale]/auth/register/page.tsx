import { RegisterForm } from "@/components/auth/RegisterForm";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#fcf9f8] px-4 py-20">
      <RegisterForm
        locale={locale}
        labels={{
          title: dict.auth.register_title,
          subtitle: dict.auth.register_subtitle,
          fullName: dict.auth.full_name,
          email: dict.auth.email,
          password: dict.auth.password,
          confirmPassword: dict.auth.confirm_password,
          submit: dict.auth.register_submit,
          alreadyHaveAccount: dict.auth.already_have_account,
          login: dict.auth.login_submit,
          privacyPrefix: dict.auth.agree_prefix,
          privacy: dict.footer.privacy,
          terms: dict.footer.terms,
          invalidForm: dict.auth.invalid_registration,
        }}
      />
    </main>
  );
}
