"use client";

import { useState } from "react";

type ContactFormProps = {
  locale: string;
  initialName?: string;
  initialEmail?: string;
  labels: {
    formTitle: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    invalidEmail: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
  };
};

export function ContactForm({ locale, initialName = "", initialEmail = "", labels }: ContactFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(labels.error);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(labels.invalidEmail);
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locale,
        name,
        email,
        message,
      }),
    }).catch(() => null);

    if (!response) {
      setSubmitting(false);
      setError(labels.error);
      return;
    }

    const result = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string; reason?: string }
      | null;
    setSubmitting(false);

    if (!response.ok || !result?.ok) {
      setError(result?.error || result?.reason || labels.error);
      return;
    }

    setName("");
    setEmail("");
    setMessage("");
    setNotice(labels.success);
  };

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-[0_14px_34px_rgba(165,54,13,0.06)]">
      <h2 className="font-heading text-3xl font-extrabold text-dark">{labels.formTitle}</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Field
          label={labels.name}
          value={name}
          onChange={setName}
          type="text"
          placeholder={labels.namePlaceholder}
        />
        <Field
          label={labels.email}
          value={email}
          onChange={setEmail}
          type="email"
          placeholder={labels.emailPlaceholder}
        />
        <label className="block space-y-2">
          <span className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {labels.message}
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            placeholder={labels.messagePlaceholder}
            className="w-full rounded-[16px] bg-[#f6f3f2] px-4 py-4 text-dark outline-none placeholder:text-muted/55 focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </label>
        {notice ? <p className="text-sm font-medium text-success">{notice}</p> : null}
        {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {submitting ? labels.sending : labels.submit}
        </button>
      </form>
    </div>
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
  placeholder: string;
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
        className="w-full rounded-[16px] bg-[#f6f3f2] px-4 py-4 text-dark outline-none placeholder:text-muted/55 focus:bg-white focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
