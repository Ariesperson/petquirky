"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

type ProfileClientProps = {
  locale: string;
  labels: {
    title: string;
    guestName: string;
    guestEmail: string;
    help: string;
    signOut: string;
    authUnavailable: string;
  };
};

export function ProfileClient({ locale, labels }: ProfileClientProps) {
  const router = useRouter();
  const { configured, hydrated, user, logout } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    setError("");
    setSubmitting(true);
    const result = await logout();
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(`/${locale}/auth/login`);
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-white p-8 shadow-[0_18px_42px_rgba(165,54,13,0.08)]">
        <h1 className="font-heading text-4xl font-extrabold text-dark">{labels.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {configured ? labels.help : labels.authUnavailable}
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <input
            className="rounded-[14px] bg-[#eae7e7] px-4 py-3.5"
            value={hydrated ? user?.fullName ?? labels.guestName : ""}
            readOnly
          />
          <input
            className="rounded-[14px] bg-[#eae7e7] px-4 py-3.5"
            value={hydrated ? user?.id.slice(0, 8) ?? "guest" : ""}
            readOnly
          />
          <input
            className="rounded-[14px] bg-[#eae7e7] px-4 py-3.5 sm:col-span-2"
            value={hydrated ? user?.email ?? labels.guestEmail : ""}
            readOnly
          />
        </div>
        {error ? <p className="mt-6 text-sm font-medium text-error">{error}</p> : null}
        <button
          type="button"
          disabled={!configured || !user || submitting}
          onClick={handleLogout}
          className="mt-8 inline-flex rounded-[14px] border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:opacity-60"
        >
          {labels.signOut}
        </button>
      </div>
    </main>
  );
}
