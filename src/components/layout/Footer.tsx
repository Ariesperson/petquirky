"use client";

import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
  dictionary: {
    footer: {
      shopTitle: string;
      supportTitle: string;
      legalTitle: string;
      socialTitle: string;
      allProducts: string;
      smartToys: string;
      feedingEnrichment: string;
      habitatEquipment: string;
      faq: string;
      shippingReturns: string;
      contactSupport: string;
      privacy: string;
      terms: string;
      cookieSettings: string;
      tiktok: string;
      instagram: string;
      individualSeller: string;
      copyright: string;
    };
  };
};

export function Footer({ locale, dictionary }: FooterProps) {
  const footerGroups = [
    {
      title: dictionary.footer.shopTitle,
      links: [
        { href: `/${locale}/products`, label: dictionary.footer.allProducts },
        { href: `/${locale}/products`, label: dictionary.footer.smartToys },
        { href: `/${locale}/products`, label: dictionary.footer.feedingEnrichment },
        { href: `/${locale}/products`, label: dictionary.footer.habitatEquipment },
      ],
    },
    {
      title: dictionary.footer.supportTitle,
      links: [
        { href: `/${locale}/contact`, label: dictionary.footer.faq },
        { href: `/${locale}/policies/returns`, label: dictionary.footer.shippingReturns },
        { href: `/${locale}/contact`, label: dictionary.footer.contactSupport },
      ],
    },
    {
      title: dictionary.footer.legalTitle,
      links: [
        { href: `/${locale}/policies/privacy`, label: dictionary.footer.privacy },
        { href: `/${locale}/policies/terms`, label: dictionary.footer.terms },
      ],
    },
    {
      title: dictionary.footer.socialTitle,
      links: [
        { href: "https://www.tiktok.com", label: dictionary.footer.tiktok },
        { href: "https://www.instagram.com", label: dictionary.footer.instagram },
      ],
    },
  ];

  return (
    <footer className="mt-auto bg-dark text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h2 className="font-heading text-2xl font-extrabold">{group.title}</h2>
            <div className="mt-5 space-y-3">
              {group.links.map((link) => (
                <Link
                  key={`${group.title}-${link.label}`}
                  href={link.href}
                  className="block text-sm font-medium text-white/72 transition hover:text-white"
                  target={link.href.startsWith("https://") ? "_blank" : undefined}
                  rel={link.href.startsWith("https://") ? "noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              ))}
              {group.title === dictionary.footer.legalTitle ? (
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new Event("petquirky:open-cookie-settings"))
                  }
                  className="block text-sm font-medium text-white/72 transition hover:text-white"
                >
                  {dictionary.footer.cookieSettings}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-white/72 sm:px-6 lg:px-8">
          <p>{dictionary.footer.copyright}</p>
          <p>{dictionary.footer.individualSeller}</p>
        </div>
      </div>
    </footer>
  );
}
