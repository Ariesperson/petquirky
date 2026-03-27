import { NotFoundPage } from "@/components/error/NotFoundPage";
import { defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  return (
    <NotFoundPage
      locale={defaultLocale}
      labels={{
        title: "Oops! Page Not Found",
        description: "Looks like this page wandered off. Try heading back home, browsing products, or reading one of our latest stories.",
        home: "Go Home",
        browse: "Browse Products",
        blog: "Visit Blog",
        helpTitle: "Need Help?",
        helpDescription: "Our tiny support team can help you find the right page or answer your order questions.",
        newTitle: "New Arrivals",
        newDescription: "See the latest smart gear and curious finds for unique pets.",
        storiesTitle: "Our Blog",
        storiesDescription: "Read care guides, product notes, and practical pet stories.",
      }}
    />
  );
}
