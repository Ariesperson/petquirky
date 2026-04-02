"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import type { AuthUser } from "@/lib/auth";
import { emptyCheckoutAddress } from "@/lib/checkout";

type ProfileClientProps = {
  initialUser: AuthUser | null;
  labels: {
    title: string;
    help: string;
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
  };
};

export function ProfileClient({ initialUser, labels }: ProfileClientProps) {
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-white p-8 shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
        <h1 className="font-heading text-4xl font-extrabold text-dark">{labels.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{labels.help}</p>
        <form className="mt-8 space-y-6" onSubmit={handleSave}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={labels.fullName} value={fullName} onChange={setFullName} />
            <ReadOnlyField label={labels.accountId} value={activeUser?.id.slice(0, 8) ?? ""} />
            <div className="sm:col-span-2">
              <ReadOnlyField label={labels.email} value={activeUser?.email ?? ""} />
              <p className="mt-2 text-xs text-muted">{labels.emailLocked}</p>
            </div>
          </div>
          <div className="rounded-[24px] bg-[#f6f3f2] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              {labels.shippingAddress}
            </p>
            {!savedAddress ? <p className="mt-3 text-sm text-muted">{labels.noSavedAddress}</p> : null}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label={labels.address} value={address} onChange={setAddress} />
              <Field label={labels.city} value={city} onChange={setCity} />
              <Field label={labels.postalCode} value={postalCode} onChange={setPostalCode} />
              <Field label={labels.country} value={country} onChange={setCountry} />
            </div>
          </div>
          {notice ? <p className="text-sm font-medium text-success">{notice}</p> : null}
          {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
          <div className="flex justify-start">
            <button
              type="submit"
              disabled={!activeUser || submitting}
              className="inline-flex min-w-[180px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.18)] disabled:opacity-60"
            >
              {submitting ? labels.saving || "Saving..." : labels.save || "Save Changes"}
            </button>
          </div>
        </form>
      </div>
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[14px] bg-[#eae7e7] px-4 py-3.5 text-dark outline-none focus:ring-2 focus:ring-primary/20"
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
      <input className="w-full rounded-[14px] bg-[#eae7e7] px-4 py-3.5 text-dark" value={value} readOnly />
    </label>
  );
}
