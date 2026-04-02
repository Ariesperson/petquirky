"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { isValidEmail } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";

type ForgotPasswordFormProps = {
  locale: Locale;
  labels: {
    title: string;
    help: string;
    email: string;
    submit: string;
    backToLogin: string;
    invalidEmail: string;
    resetSent: string;
    authUnavailable: string;
  };
};

export function ForgotPasswordForm({ locale, labels }: ForgotPasswordFormProps) {
  const { configured, requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!isValidEmail(email)) {
      setError(labels.invalidEmail);
      return;
    }

    if (!configured) {
      setError(labels.authUnavailable);
      return;
    }

    setSubmitting(true);
    const redirectTo = `${window.location.origin}/${locale}/auth/confirm?next=/${locale}/auth/reset-password`;
    const result = await requestPasswordReset({ email, redirectTo });
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setNotice(labels.resetSent);
  };

  return (
    <div className="w-full max-w-[440px] rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(165,54,13,0.06)]">
      <h1 className="font-heading text-4xl font-extrabold text-dark">{labels.title}</h1>
      <p className="mt-3 text-sm leading-7 text-muted">{labels.help}</p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="forgot-password-email"
            className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted"
          >
            {labels.email}
          </label>
          <input
            id="forgot-password-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-[14px] bg-[#eae7e7] px-4 py-3.5 text-dark outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
        {notice ? <p className="text-sm font-medium text-success">{notice}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white disabled:opacity-70"
        >
          {labels.submit}
        </button>
      </form>
      <Link href={`/${locale}/auth/login`} className="mt-6 inline-flex text-sm font-semibold text-primary">
        {labels.backToLogin}
      </Link>
    </div>
  );
}
