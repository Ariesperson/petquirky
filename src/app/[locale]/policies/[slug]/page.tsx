import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/policies/PolicyPage";
import { policyDocuments } from "@/data/policies";
import { createPageMetadata } from "@/lib/seo";
import { getDictionary, isLocale } from "@/lib/i18n";

type PolicySlug = keyof typeof policyDocuments;

type PolicyRoutePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function isPolicySlug(value: string): value is PolicySlug {
  return value in policyDocuments;
}

export async function generateMetadata({ params }: PolicyRoutePageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isPolicySlug(slug)) {
    return {};
  }

  const policy = policyDocuments[slug];

  return createPageMetadata({
    locale,
    path: `/policies/${slug}`,
    title: `${policy.title[locale]} | PetQuirky`,
    description: policy.intro[locale],
  });
}

export default async function PolicyRoutePage({ params }: PolicyRoutePageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isPolicySlug(slug)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const policy = policyDocuments[slug];

  return (
    <PolicyPage
      locale={locale}
      title={policy.title[locale]}
      updatedAt={policy.updatedAt[locale]}
      intro={policy.intro[locale]}
      sections={policy.sections.map((section) => ({
        id: section.id,
        title: section.title[locale],
        paragraphs: section.paragraphs[locale],
        bullets: section.bullets?.[locale],
      }))}
      labels={{
        inThisPolicy: dict.policies.in_this_policy,
        backToTop: dict.policies.back_to_top,
        contact: dict.policies.contact,
      }}
    />
  );
}
