"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { isStrongEnoughPassword, isValidEmail } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";

type LoginFormProps = {
  locale: Locale;
  returnTo: string;
  labels: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    remember: string;
    forgotPassword: string;
    submit: string;
    noAccount: string;
    createAccount: string;
    invalidCredentials: string;
  };
};

export function LoginForm({ locale, returnTo, labels }: LoginFormProps) {
  const router = useRouter();
  const { configured, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isValidEmail(email) || !isStrongEnoughPassword(password)) {
      setError(labels.invalidCredentials);
      return;
    }

    if (!configured) {
      setError(labels.invalidCredentials);
      return;
    }

    setSubmitting(true);
    const result = await login({ email, password });
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(returnTo);
  };

  return (
    <div className="w-full max-w-[440px] rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(165,54,13,0.06)]">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-dark">{labels.title}</h1>
        <p className="mt-2 text-sm text-muted">{labels.subtitle}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {labels.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-[14px] bg-[#eae7e7] px-4 py-3.5 text-dark outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {labels.password}
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-[14px] bg-[#eae7e7] px-4 py-3.5 text-dark outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="h-4 w-4 rounded border-[#e0c0b6]" />
            {labels.remember}
          </label>
          <Link href={`/${locale}/auth/forgot-password`} className="font-semibold text-primary">
            {labels.forgotPassword}
          </Link>
        </div>

        {error ? <p className="text-sm font-medium text-error">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.22)] transition hover:scale-[1.02] disabled:opacity-70"
        >
          {labels.submit}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {labels.noAccount}{" "}
        <Link
          href={`/${locale}/auth/register?returnTo=${encodeURIComponent(returnTo)}`}
          className="font-semibold text-primary"
        >
          {labels.createAccount}
        </Link>
      </p>
    </div>
  );
}
