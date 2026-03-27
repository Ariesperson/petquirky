import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type PolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type PolicyPageProps = {
  locale: Locale;
  title: string;
  updatedAt: string;
  intro: string;
  sections: PolicySection[];
  labels: {
    inThisPolicy: string;
    backToTop: string;
    contact: string;
  };
};

export function PolicyPage({
  locale,
  title,
  updatedAt,
  intro,
  sections,
  labels,
}: PolicyPageProps) {
  return (
    <main id="top" className="min-h-screen bg-[#fcf9f8] px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-14 text-center">
          <h1 className="font-heading text-5xl font-extrabold text-primary">{title}</h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">
            {updatedAt}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted">{intro}</p>
        </header>

        <section className="rounded-[28px] bg-[#f6f3f2] p-8">
          <h2 className="font-heading text-2xl font-extrabold text-primary">{labels.inThisPolicy}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 text-sm font-semibold text-dark transition hover:bg-primary-tint"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  {index + 1}
                </span>
                <span>{section.title}</span>
              </a>
            ))}
          </div>
        </section>

        <article className="mt-14 space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="font-heading text-3xl font-extrabold text-dark">{section.title}</h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-6 space-y-4 rounded-[24px] bg-[#f6f3f2] p-6">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-base leading-7 text-dark">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-success" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>

        <div className="mt-16 flex flex-col items-center gap-5">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex rounded-[16px] bg-[linear-gradient(135deg,#d85a30,#ff8a65)] px-6 py-4 text-sm font-semibold text-white"
          >
            {labels.contact}
          </Link>
          <a href="#top" className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            {labels.backToTop}
          </a>
        </div>
      </div>
    </main>
  );
}
