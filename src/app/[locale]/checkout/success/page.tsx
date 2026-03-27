import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";
import { emptyCheckoutAddress } from "@/lib/checkout";

type CheckoutSuccessPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    orderId?: string;
    status?: string;
    total?: string;
    email?: string;
    shipping?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: CheckoutSuccessPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const query = await searchParams;
  const shippingAddress = (() => {
    if (!query.shipping) {
      return emptyCheckoutAddress();
    }

    try {
      return JSON.parse(query.shipping) as ReturnType<typeof emptyCheckoutAddress>;
    } catch {
      return emptyCheckoutAddress();
    }
  })();
  const orderId = query.orderId ?? "#PQ-PENDING";
  const status = query.status ?? dict.account.status_processing;
  const total = Number(query.total ?? 0);
  const payerEmail = query.email ?? shippingAddress.email;

  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center px-6 pb-20 pt-24 text-center">
      <CheckoutSuccessClient
        orderId={orderId}
        status={status}
        total={total}
        payerEmail={payerEmail}
        shippingAddress={shippingAddress}
      />
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="size-14 text-success" />
      </div>
      <h1 className="mt-8 font-heading text-5xl font-extrabold text-primary">
        {dict.checkout.success_title}
      </h1>
      <p className="mt-3 text-base leading-7 text-muted">{dict.checkout.success_subtitle}</p>

      <div className="mt-10 w-full rounded-[28px] bg-primary-tint p-8 text-left shadow-sm">
        <div className="flex items-start justify-between border-b border-primary/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              {dict.checkout.order_number}
            </p>
            <p className="mt-1 text-lg font-semibold text-dark">{orderId}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {status}
          </span>
        </div>
        <div className="mt-6 space-y-4 text-sm text-muted">
          <p>{dict.checkout.success_email_notice}</p>
          <p>{dict.checkout.success_delivery_notice}</p>
          <p>
            {dict.checkout.success_contact_notice}{" "}
            <a href="mailto:hello@petquirky.com" className="font-semibold text-primary">
              hello@petquirky.com
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 w-full rounded-[24px] bg-[#f6f3f2] p-6">
        <p className="text-sm font-medium text-dark">{dict.checkout.success_account_prompt}</p>
        <Link
          href={`/${locale}/auth/register`}
          className="mt-4 inline-flex rounded-[14px] border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          {dict.auth.register_submit}
        </Link>
      </div>

      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex w-full items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white"
      >
        {dict.checkout.continue_shopping}
      </Link>
    </main>
  );
}
