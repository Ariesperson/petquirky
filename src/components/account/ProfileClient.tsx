"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, IdCard, MapPin, Sparkles } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import type { AuthUser } from "@/lib/auth";
import { emptyCheckoutAddress } from "@/lib/checkout";
import type { Locale } from "@/lib/i18n";

type ProfileClientProps = {
  locale: Locale;
  initialUser: AuthUser | null;
  labels: {
    title: string;
    help: string;
    orders: string;
    fullName: string;
    email: string;
    accountId: string;
    shippingAddress: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    noSavedAddress: string;
    save: string;
    saving: string;
    success: string;
    incompleteAddress: string;
    emailLocked: string;
    startShopping: string;
  };
};

export function ProfileClient({ locale, initialUser, labels }: ProfileClientProps) {
  const { hydrated, user, updateProfile } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const activeUser = hydrated ? user ?? initialUser : initialUser;
  const savedAddress = activeUser?.shippingAddress;
  const [fullName, setFullName] = useState(activeUser?.fullName ?? "");
  const [address, setAddress] = useState(savedAddress?.address ?? "");
  const [city, setCity] = useState(savedAddress?.city ?? "");
  const [postalCode, setPostalCode] = useState(savedAddress?.postalCode ?? "");
  const [country, setCountry] = useState(savedAddress?.country ?? emptyCheckoutAddress().country);
  const initials = (activeUser?.fullName ?? initialUser?.fullName ?? "PQ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeUser) {
      return;
    }

    setError("");
    setNotice("");

    const trimmedFullName = fullName.trim();
    const nextAddress = {
      fullName: trimmedFullName,
      email: activeUser.email,
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    };
    const hasAnyAddressValue = [
      nextAddress.address,
      nextAddress.city,
      nextAddress.postalCode,
      nextAddress.country,
    ].some((value) => value.length > 0);
    const isAddressComplete = [
      nextAddress.address,
      nextAddress.city,
      nextAddress.postalCode,
      nextAddress.country,
    ].every((value) => value.length > 0);

    if (!trimmedFullName) {
      setError(`${labels.fullName} is required.`);
      return;
    }

    if (hasAnyAddressValue && !isAddressComplete) {
      setError(labels.incompleteAddress);
      return;
    }

    setSubmitting(true);
    const result = await updateProfile({
      fullName: trimmedFullName,
      shippingAddress: hasAnyAddressValue ? nextAddress : null,
    });
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setNotice(labels.success);
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 gap-8 px-4 pb-12 pt-10 md:flex md:px-8">
      <aside className="mb-8 h-fit w-full rounded-[34px] bg-[linear-gradient(180deg,rgba(246,243,242,0.98),rgba(255,255,255,0.92))] p-6 shadow-[0_22px_52px_rgba(165,54,13,0.08)] md:sticky md:top-24 md:mb-0 md:w-80">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] text-2xl font-heading font-extrabold text-white shadow-[0_18px_38px_rgba(165,54,13,0.18)]">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark">{activeUser?.fullName ?? initialUser?.fullName}</h2>
            <p className="text-sm text-muted">{activeUser?.email ?? initialUser?.email ?? ""}</p>
          </div>
        </div>

        <div className="mb-6 grid gap-3">
          <div className="rounded-[24px] bg-white/80 p-4">
            <div className="flex items-center gap-2 text-primary">
              <IdCard className="size-4" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]">{labels.accountId}</p>
            </div>
            <p className="mt-3 text-xl font-extrabold text-dark">{activeUser?.id.slice(0, 8) ?? ""}</p>
          </div>
          <div className="rounded-[24px] bg-white/80 p-4">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="size-4" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]">{labels.shippingAddress}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-dark">
              {savedAddress ? `${savedAddress.city}, ${savedAddress.country}` : labels.noSavedAddress}
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href={`/${locale}/account`}
            className="block rounded-[18px] px-4 py-3 text-sm font-medium text-muted transition hover:bg-white/70"
          >
            {labels.orders}
          </Link>
          <div className="rounded-[18px] bg-primary-tint px-4 py-3 text-sm font-semibold text-primary">
            {labels.title}
          </div>
        </nav>

        <Link
          href={`/${locale}/products`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-white px-5 py-3 text-sm font-semibold text-dark shadow-[0_16px_34px_rgba(165,54,13,0.08)] transition hover:-translate-y-0.5"
        >
          <Home className="size-4" />
          {labels.startShopping}
        </Link>
      </aside>

      <section className="flex-1 space-y-6">
        <header className="rounded-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,243,242,0.96))] p-8 shadow-[0_24px_60px_rgba(165,54,13,0.08)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/70">
                {labels.title}
              </p>
              <h1 className="mt-3 font-heading text-4xl font-extrabold text-dark sm:text-5xl">
                {labels.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{labels.help}</p>
            </div>
            <div className="rounded-[24px] bg-white/80 p-4 shadow-[0_14px_30px_rgba(165,54,13,0.08)]">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-4" />
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]">{labels.email}</p>
              </div>
              <p className="mt-3 break-all text-sm leading-6 text-dark">
                {activeUser?.email ?? initialUser?.email ?? ""}
              </p>
            </div>
          </div>
        </header>

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={labels.fullName} value={fullName} onChange={setFullName} />
              <ReadOnlyField label={labels.accountId} value={activeUser?.id.slice(0, 8) ?? ""} />
              <div className="sm:col-span-2">
                <ReadOnlyField label={labels.email} value={activeUser?.email ?? ""} />
                <p className="mt-2 text-xs text-muted">{labels.emailLocked}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-[linear-gradient(180deg,rgba(246,243,242,0.98),rgba(255,255,255,0.94))] p-8 shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
            <div className="flex items-center gap-2 text-dark">
              <MapPin className="size-4 text-primary" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                {labels.shippingAddress}
              </p>
            </div>
            {!savedAddress ? <p className="mt-3 text-sm text-muted">{labels.noSavedAddress}</p> : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={labels.address} value={address} onChange={setAddress} />
              <Field label={labels.city} value={city} onChange={setCity} />
              <Field label={labels.postalCode} value={postalCode} onChange={setPostalCode} />
              <Field label={labels.country} value={country} onChange={setCountry} />
            </div>
          </div>

          {notice ? (
            <div className="rounded-[24px] bg-success/10 px-5 py-4 text-sm font-medium text-success">
              {notice}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-[24px] bg-error/10 px-5 py-4 text-sm font-medium text-error">
              {error}
            </div>
          ) : null}

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={!activeUser || submitting}
              className="inline-flex min-w-[180px] items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.18)] disabled:opacity-60"
            >
              {submitting ? labels.saving || "Saving..." : labels.save || "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[18px] bg-[#eae7e7] px-4 py-3.5 text-dark outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <input
        aria-label={label}
        className="w-full rounded-[18px] bg-[#eae7e7] px-4 py-3.5 text-dark"
        value={value}
        readOnly
      />
    </label>
  );
}
