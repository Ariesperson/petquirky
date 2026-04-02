"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

type AccountSignOutButtonProps = {
  locale: string;
  labels: {
    signOut: string;
    signingOut: string;
  };
};

export function AccountSignOutButton({ locale, labels }: AccountSignOutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    <div className="pt-4">
      <button
        type="button"
        disabled={submitting}
        onClick={handleLogout}
        className="inline-flex w-full items-center justify-center rounded-[16px] border border-primary/25 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary hover:text-white disabled:opacity-60"
      >
        {submitting ? labels.signingOut : labels.signOut}
      </button>
      {error ? <p className="mt-3 text-center text-xs font-medium text-error">{error}</p> : null}
    </div>
  );
}
