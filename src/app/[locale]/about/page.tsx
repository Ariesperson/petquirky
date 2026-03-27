import { notFound } from "next/navigation";

import { createPageMetadata } from "@/lib/seo";
import { getDictionary, isLocale } from "@/lib/i18n";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: "/about",
    title: "About PetQuirky",
    description: "Meet the editorial commerce studio building warm, curious tools for unique pets.",
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-[36px] bg-[#f6f3f2] p-10 md:p-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{dict.about.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl font-extrabold leading-tight text-dark md:text-6xl">
          {dict.about.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{dict.about.subtitle}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] bg-white p-6">
            <h2 className="font-heading text-2xl font-extrabold text-dark">{dict.about.card_one_title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{dict.about.card_one_text}</p>
          </div>
          <div className="rounded-[24px] bg-white p-6">
            <h2 className="font-heading text-2xl font-extrabold text-dark">{dict.about.card_two_title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{dict.about.card_two_text}</p>
          </div>
          <div className="rounded-[24px] bg-white p-6">
            <h2 className="font-heading text-2xl font-extrabold text-dark">{dict.about.card_three_title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{dict.about.card_three_text}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
