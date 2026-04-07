import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact/ContactForm";
import { mapSupabaseUser } from "@/lib/auth";
import { getSellerEmail } from "@/lib/email";
import { createPageMetadata } from "@/lib/seo";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const dict = await getDictionary(locale);
  const mappedUser = mapSupabaseUser(user);
  const sellerEmail = getSellerEmail();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-[#f6f3f2] p-10">
        <h1 className="font-heading text-5xl font-extrabold text-dark">{dict.contact.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{dict.contact.subtitle}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ContactForm
            locale={locale}
            initialName={mappedUser?.fullName ?? ""}
            initialEmail={mappedUser?.email ?? ""}
            labels={{
              formTitle: dict.contact.form_title,
              name: dict.auth.full_name,
              email: dict.auth.email,
              message: dict.contact.message_label,
              submit: dict.contact.submit,
              sending: dict.contact.sending,
              success: dict.contact.success,
              error: dict.contact.error,
              invalidEmail: dict.contact.invalid_email,
              namePlaceholder: dict.contact.name_placeholder,
              emailPlaceholder: dict.contact.email_placeholder,
              messagePlaceholder: dict.contact.message_placeholder,
            }}
          />
          <div className="space-y-6">
            <div className="rounded-[24px] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                {dict.contact.email_label}
              </p>
              <a href={`mailto:${sellerEmail}`} className="mt-3 block text-lg font-semibold text-primary">
                {sellerEmail}
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
