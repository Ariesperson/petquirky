"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { isStrongEnoughPassword, isValidEmail } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";

type RegisterFormProps = {
  locale: Locale;
  returnTo: string;
  labels: {
    title: string;
    subtitle: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    passwordHint: string;
    submit: string;
    alreadyHaveAccount: string;
    login: string;
    privacyPrefix: string;
    privacy: string;
    terms: string;
    missingFields: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
    acceptTermsRequired: string;
    authUnavailable: string;
    confirmationSent: string;
  };
};

export function RegisterForm({ locale, returnTo, labels }: RegisterFormProps) {
  const router = useRouter();
  const { configured, register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const submittedFullName = String(formData.get("fullName") ?? "").trim();
    const submittedEmail = String(formData.get("email") ?? "").trim();
    const submittedPassword = String(formData.get("password") ?? "");
    const submittedConfirmPassword = String(formData.get("confirmPassword") ?? "");
    const acceptedTerms = formData.get("acceptedTerms") === "on";

    if (!submittedFullName || !submittedEmail || !submittedPassword || !submittedConfirmPassword) {
      setError(labels.missingFields);
      return;
    }

    if (!isValidEmail(submittedEmail)) {
      setError(labels.missingFields);
      return;
    }

    if (!isStrongEnoughPassword(submittedPassword)) {
      setError(labels.passwordTooShort);
      return;
    }

    if (submittedPassword !== submittedConfirmPassword) {
      setError(labels.passwordsDoNotMatch);
      return;
    }

    if (!acceptedTerms) {
      setError(labels.acceptTermsRequired);
      return;
    }

    if (!configured) {
      setError(labels.authUnavailable);
      return;
    }

    setSubmitting(true);
    const result = await register({
      email: submittedEmail,
      password: submittedPassword,
      fullName: submittedFullName,
      emailRedirectTo: `${window.location.origin}/${locale}/auth/confirm?next=${encodeURIComponent(
        returnTo
      )}`,
    });
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.requiresEmailConfirmation) {
      setSuccess(labels.confirmationSent);
      return;
    }

    router.push(returnTo);
  };

  return (
    <div className="w-full max-w-[460px] rounded-[28px] bg-white p-10 shadow-[0_20px_40px_rgba(165,54,13,0.06)]">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-primary">{labels.title}</h1>
        <p className="mt-2 text-sm text-muted">{labels.subtitle}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Field
          id="register-full-name"
          name="fullName"
          autoComplete="name"
          label={labels.fullName}
          value={fullName}
          onChange={setFullName}
        />
        <Field
          id="register-email"
          name="email"
          autoComplete="email"
          label={labels.email}
          value={email}
          onChange={setEmail}
          type="email"
        />
        <Field
          id="register-password"
          name="password"
          autoComplete="new-password"
          label={labels.password}
          value={password}
          onChange={setPassword}
          type="password"
        />
        <p className="-mt-3 text-xs text-muted">{labels.passwordHint}</p>
        <Field
          id="register-confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          label={labels.confirmPassword}
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
        />

        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#e0c0b6]"
          />
          <span>
            {labels.privacyPrefix}{" "}
            <Link href={`/${locale}/policies/privacy`} className="font-semibold text-primary">
              {labels.privacy}
            </Link>{" "}
            {labels.terms}{" "}
            <Link href={`/${locale}/policies/terms`} className="font-semibold text-primary">
              {labels.terms}
            </Link>
          </span>
        </label>

        {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
        {success ? <p className="text-sm font-medium text-success">{success}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.22)] transition hover:scale-[1.02] disabled:opacity-70"
        >
          {labels.submit}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {labels.alreadyHaveAccount}{" "}
        <Link
          href={`/${locale}/auth/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="font-semibold text-primary"
        >
          {labels.login}
        </Link>
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  name,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  name: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[14px] bg-[#eae7e7] px-4 py-3.5 text-dark outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
