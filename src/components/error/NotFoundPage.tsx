import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type NotFoundPageProps = {
  locale: Locale;
  labels: {
    title: string;
    description: string;
    home: string;
    browse: string;
    blog: string;
    helpTitle: string;
    helpDescription: string;
    newTitle: string;
    newDescription: string;
    storiesTitle: string;
    storiesDescription: string;
  };
};

export function NotFoundPage({ locale, labels }: NotFoundPageProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-5xl text-center">
        <div className="relative mx-auto mb-12 max-w-lg">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border-[10px] border-[#f6f3f2] shadow-[0_24px_48px_rgba(165,54,13,0.12)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKwJWB071noIaoIOo_Mg83tNDgxtxR6IMRPG5gE5k_D-oIyemfonVo4g6tPVG0KTwi7_gT1chgJOOL4dOt1nsOpuwr86pmT5FsXqk8BvyudY7xHX3s9_dTd2JO4cKoUSFHLtFffxVAJ70lTAvQ0QL2qNXHqxRcfUK-l8wAA39xopDkhZQr_1h2gh1rqKsGspBTRRodIJld5CCdAVS6GB8wgAXx6hNp2GmlL-a-fjhq7dFgCdTVjE-8Cxwdg6tBlZqTpvH-Kr4z1AY"
              alt={labels.title}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>
        <h1 className="font-heading text-6xl font-extrabold leading-tight text-primary md:text-7xl">
          {labels.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
          {labels.description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={`/${locale}`}
            className="inline-flex rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-8 py-4 text-sm font-semibold text-white"
          >
            {labels.home}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="inline-flex rounded-[16px] border-2 border-primary px-8 py-4 text-sm font-semibold text-primary"
          >
            {labels.browse}
          </Link>
        </div>
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <Link href={`/${locale}/contact`} className="rounded-[28px] bg-[#f6f3f2] p-8 text-left">
            <h2 className="font-heading text-2xl font-extrabold text-dark">{labels.helpTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{labels.helpDescription}</p>
          </Link>
          <Link href={`/${locale}/products`} className="rounded-[28px] bg-[#f6f3f2] p-8 text-left">
            <h2 className="font-heading text-2xl font-extrabold text-dark">{labels.newTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{labels.newDescription}</p>
          </Link>
          <Link href={`/${locale}/blog`} className="rounded-[28px] bg-[#f6f3f2] p-8 text-left">
            <h2 className="font-heading text-2xl font-extrabold text-dark">{labels.storiesTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{labels.storiesDescription}</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
