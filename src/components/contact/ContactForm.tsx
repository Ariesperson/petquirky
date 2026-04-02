"use client";

import { useState } from "react";

type ContactFormProps = {
  locale: string;
  labels: {
    formTitle: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    success: string;
    error: string;
    invalidEmail: string;
  };
};

export function ContactForm({ locale, labels }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    });
    const result = (await response.json()) as { ok?: boolean; error?: string };
    setSubmitting(false);

    if (!response.ok || !result.ok) {
      setError(result.error || labels.error);
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
        <Field label={labels.name} value={name} onChange={setName} type="text" />
        <Field label={labels.email} value={email} onChange={setEmail} type="email" />
        <label className="block space-y-2">
          <span className="ml-1 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
            {labels.message}
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            className="w-full rounded-[14px] bg-[#f6f3f2] p-4 text-dark outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        {notice ? <p className="text-sm font-medium text-success">{notice}</p> : null}
        {error ? <p className="text-sm font-medium text-error">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
        >
          {labels.submit}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
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
        className="w-full rounded-[14px] bg-[#f6f3f2] p-4 text-dark outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
