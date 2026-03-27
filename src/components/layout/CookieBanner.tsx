"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { CookieSettings } from "@/components/layout/CookieSettings";

const STORAGE_KEY = "petquirky-gdpr";

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type CookieBannerProps = {
  labels: {
    title: string;
    description: string;
    acceptAll: string;
    necessaryOnly: string;
    managePreferences: string;
    preferencesTitle: string;
    preferencesDescription: string;
    savePreferences: string;
    cancel: string;
    necessaryTitle: string;
    necessaryDescription: string;
    analyticsTitle: string;
    analyticsDescription: string;
    marketingTitle: string;
    marketingDescription: string;
  };
};

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function readStoredPreferences(): CookiePreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<CookiePreferences>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

export function CookieBanner({ labels }: CookieBannerProps) {
  const initialPreferences = readStoredPreferences();
  const [visible, setVisible] = useState(initialPreferences === null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(initialPreferences ?? defaultPreferences);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const handleOpenSettings = () => {
      setVisible(true);
      setSettingsOpen(true);
    };

    window.addEventListener("petquirky:open-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("petquirky:open-cookie-settings", handleOpenSettings);
    };
  }, []);

  const settingsLabels = useMemo(
    () => ({
      title: labels.preferencesTitle,
      description: labels.preferencesDescription,
      necessaryTitle: labels.necessaryTitle,
      necessaryDescription: labels.necessaryDescription,
      analyticsTitle: labels.analyticsTitle,
      analyticsDescription: labels.analyticsDescription,
      marketingTitle: labels.marketingTitle,
      marketingDescription: labels.marketingDescription,
      save: labels.savePreferences,
      cancel: labels.cancel,
    }),
    [labels]
  );

  const persistPreferences = (nextPreferences: CookiePreferences) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
    setPreferences(nextPreferences);
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!hydrated) {
    return null;
  }

  return (
    <>
      {visible ? (
        <div id="cookie-settings" className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
          <div className="mx-auto max-w-6xl rounded-[30px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,240,235,0.98),rgba(255,255,255,0.96))] px-5 py-5 shadow-[0_24px_60px_rgba(165,54,13,0.18)] backdrop-blur-xl sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="font-body text-base font-semibold text-dark">{labels.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{labels.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                <button
                  type="button"
                  onClick={() => persistPreferences(defaultPreferences)}
                  className="rounded-full border border-[#e4d2cb] bg-transparent px-5 py-3 text-sm font-semibold text-dark transition hover:bg-white"
                >
                  {labels.necessaryOnly}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    persistPreferences({
                      necessary: true,
                      analytics: true,
                      marketing: true,
                    })
                  }
                  className="rounded-full bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(216,90,48,0.25)] transition hover:scale-[1.02]"
                >
                  {labels.acceptAll}
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4"
                >
                  {labels.managePreferences}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <CookieSettings
        open={settingsOpen}
        preferences={preferences}
        labels={settingsLabels}
        onClose={() => setSettingsOpen(false)}
        onSave={persistPreferences}
        onChange={setPreferences}
      />
    </>
  );
}
