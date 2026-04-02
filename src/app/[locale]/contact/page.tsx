import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact/ContactForm";
import { createPageMetadata } from "@/lib/seo";
import { getDictionary, isLocale } from "@/lib/i18n";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: "/contact",
    title: "Contact PetQuirky",
    description: "Reach PetQuirky for order support, policy questions, or product guidance.",
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-[#f6f3f2] p-10">
        <h1 className="font-heading text-5xl font-extrabold text-dark">{dict.contact.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{dict.contact.subtitle}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ContactForm
            locale={locale}
            labels={{
              formTitle: dict.contact.form_title,
              name: dict.auth.full_name,
              email: dict.auth.email,
              message: dict.contact.message_label,
              submit: dict.contact.submit,
              success: dict.contact.success,
              error: dict.contact.error,
              invalidEmail: dict.auth.invalid_credentials,
            }}
          />
          <div className="space-y-6">
            <div className="rounded-[24px] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              {dict.contact.email_label}
            </p>
            <a href="mailto:hello@petquirky.com" className="mt-3 block text-lg font-semibold text-primary">
              hello@petquirky.com
            </a>
            </div>
            <div className="rounded-[24px] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                {dict.contact.reply_label}
              </p>
              <p className="mt-3 text-lg font-semibold text-dark">{dict.contact.reply_value}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
