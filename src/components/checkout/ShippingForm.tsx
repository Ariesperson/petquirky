"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { CheckoutAddress } from "@/types/checkout";

type ShippingFormProps = {
  locale: Locale;
  value: CheckoutAddress;
  loginHref: string;
  onChange: (value: CheckoutAddress) => void;
  onSubmit: (value: CheckoutAddress) => void;
  labels: {
    title: string;
    subtitle: string;
    login: string;
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    continueToReview: string;
  };
};

export function ShippingForm({ value, loginHref, onChange, onSubmit, labels }: ShippingFormProps) {
  return (
    <section className="space-y-10 lg:col-span-7">
      <div>
        <h1 className="font-heading text-4xl font-extrabold text-dark">{labels.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {labels.subtitle}{" "}
          <Link href={loginHref} className="font-semibold text-primary">
            {labels.login}
          </Link>
        </p>
      </div>

      <form
        className="mt-10 space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(value);
        }}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field
            label={labels.fullName}
            type="text"
            value={value.fullName}
            placeholder="Ada Lovelace"
            onChange={(nextValue) => onAddressFieldChange("fullName", nextValue, value, onChange)}
          />
          <Field
            label={labels.email}
            type="email"
            value={value.email}
            placeholder="ada@example.com"
            onChange={(nextValue) => onAddressFieldChange("email", nextValue, value, onChange)}
          />
        </div>
        <Field
          label={labels.address}
          type="text"
          value={value.address}
          placeholder="1 Rue de Test"
          onChange={(nextValue) => onAddressFieldChange("address", nextValue, value, onChange)}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Field
              label={labels.city}
              type="text"
              value={value.city}
              placeholder="Paris"
              onChange={(nextValue) => onAddressFieldChange("city", nextValue, value, onChange)}
            />
          </div>
          <Field
            label={labels.postalCode}
            type="text"
            value={value.postalCode}
            placeholder="75001"
            onChange={(nextValue) =>
              onAddressFieldChange("postalCode", nextValue, value, onChange)
            }
          />
        </div>
        <label className="block space-y-2">
          <span className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {labels.country}
          </span>
          <select
            value={value.country}
            onChange={(event) =>
              onAddressFieldChange("country", event.target.value, value, onChange)
            }
            className="w-full appearance-none rounded-[18px] bg-[#f6f3f2] px-4 py-4 text-base font-medium text-dark outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-primary/20"
          >
            <option>France</option>
            <option>Germany</option>
            <option>Italy</option>
            <option>Spain</option>
            <option>Netherlands</option>
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex min-w-[240px] items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-10 py-4 text-base font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.22)] transition hover:scale-[1.02]"
        >
          {labels.continueToReview}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={type === "email" ? "email" : "on"}
        className="w-full rounded-[18px] bg-[#f6f3f2] px-4 py-4 text-base font-medium text-dark outline-none placeholder:text-muted/55 focus:bg-white focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function onAddressFieldChange(
  field: keyof CheckoutAddress,
  nextValue: string,
  value: CheckoutAddress,
  onChange: (value: CheckoutAddress) => void
) {
  onChange({
    ...value,
    [field]: nextValue,
  });
}
