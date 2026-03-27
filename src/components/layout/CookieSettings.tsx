"use client";

import { X } from "lucide-react";

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type CookieSettingsProps = {
  open: boolean;
  preferences: CookiePreferences;
  labels: {
    title: string;
    description: string;
    necessaryTitle: string;
    necessaryDescription: string;
    analyticsTitle: string;
    analyticsDescription: string;
    marketingTitle: string;
    marketingDescription: string;
    save: string;
    cancel: string;
  };
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
  onChange: (preferences: CookiePreferences) => void;
};

function PreferenceRow({
  title,
  description,
  checked,
  disabled = false,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-[28px] bg-white/90 px-5 py-4 shadow-[0_18px_40px_rgba(165,54,13,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-base font-semibold text-dark">{title}</p>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted">{description}</p>
        </div>
        <label className="relative mt-1 inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            disabled={disabled}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
          />
          <span className="h-8 w-14 rounded-full bg-[#e6d7d0] transition peer-checked:bg-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />
          <span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition peer-checked:translate-x-6" />
        </label>
      </div>
    </div>
  );
}

export function CookieSettings({
  open,
  preferences,
  labels,
  onClose,
  onSave,
  onChange,
}: CookieSettingsProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-dark/35 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-[#fcf9f8] shadow-[0_30px_90px_rgba(165,54,13,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/50 bg-[linear-gradient(135deg,rgba(255,240,235,0.95),rgba(255,255,255,0.88))] px-6 py-5">
          <div>
            <h2 className="font-heading text-3xl font-extrabold leading-none text-dark">
              {labels.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{labels.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/80 p-2 text-dark transition hover:scale-105 hover:bg-white"
            aria-label={labels.cancel}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <PreferenceRow
            title={labels.necessaryTitle}
            description={labels.necessaryDescription}
            checked
            disabled
          />
          <PreferenceRow
            title={labels.analyticsTitle}
            description={labels.analyticsDescription}
            checked={preferences.analytics}
            onCheckedChange={(checked) =>
              onChange({ ...preferences, analytics: checked })
            }
          />
          <PreferenceRow
            title={labels.marketingTitle}
            description={labels.marketingDescription}
            checked={preferences.marketing}
            onCheckedChange={(checked) =>
              onChange({ ...preferences, marketing: checked })
            }
          />
        </div>

        <div className="flex flex-col-reverse gap-3 bg-white/70 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e6d7d0] px-5 py-3 text-sm font-semibold text-dark transition hover:bg-white"
          >
            {labels.cancel}
          </button>
          <button
            type="button"
            onClick={() => onSave(preferences)}
            className="rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.25)] transition hover:scale-[1.02]"
          >
            {labels.save}
          </button>
        </div>
      </div>
    </div>
  );
}
