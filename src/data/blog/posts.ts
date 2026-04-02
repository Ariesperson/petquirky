import type { Locale } from "@/lib/i18n";

export type BlogCategory =
  | "all"
  | "cat-care"
  | "dog-care"
  | "reptile-care"
  | "small-pets"
  | "product-guides";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogBody = {
  intro: string[];
  bullets?: string[];
  sections: BlogSection[];
  recommendedProductSlug?: string;
};

export type BlogPostDefinition = {
  slug: string;
  category: Exclude<BlogCategory, "all">;
  featured: boolean;
  publishedAt: string;
  readingMinutes: number;
  image: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  seoDescription: Record<Locale, string>;
  tags: string[];
};

export type BlogPost = BlogPostDefinition & {
  body: Record<Locale, BlogBody>;
};

export const blogPosts: BlogPostDefinition[] = [
  {
    slug: "best-uvb-lights-for-leopard-geckos-2026",
    category: "reptile-care",
    featured: true,
    publishedAt: "2026-03-15",
    readingMinutes: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGIDSRZtWZdatlrZJwMxjTDBNocHUB1ngpBHQjnznz_BlPA4ME4Q7wCRnV6u_U4DVHcTm58MVsIxboQiVm0yLxkzeLqPXqw5RCDx9-NPhPbMnsDbazn1JcwEt1hIWpg8zLx-hhDS_nU57Bryd4oh3I5IM1ljiTY7GR60O_OlDQAnBO5H40o1TMbsuXbnfGngv3D7_eXujx5hweRzpixYVLRkusEnwLsyfLrK9AbwYb6DghIFeVz5DNMajprjaLgYdMk3lER49s4wg",
    title: {
      en: "Best UVB Lights for Leopard Geckos in 2026",
      de: "Die besten UVB-Lampen für Leopardgeckos 2026",
      fr: "Les meilleures lampes UVB pour les geckos léopards en 2026",
      es: "Las mejores luces UVB para geckos leopardo en 2026",
    },
    excerpt: {
      en: "A practical guide to safer UVB setups, smart timers, and basking gradients for healthy leopard geckos.",
      de: "Ein praxisnaher Leitfaden für sichere UVB-Setups, smarte Timer und gesunde Wärmegradienten.",
      fr: "Un guide pratique pour des installations UVB sûres, des minuteries intelligentes et un bon gradient thermique.",
      es: "Una guía práctica sobre configuraciones UVB seguras, temporizadores inteligentes y gradientes de asoleo saludables.",
    },
    seoDescription: {
      en: "Compare the most reliable UVB options for leopard geckos and learn how to position them correctly.",
      de: "Vergleichen Sie zuverlässige UVB-Optionen für Leopardgeckos und ihre richtige Platzierung.",
      fr: "Comparez les meilleures options UVB pour geckos léopards et leur positionnement optimal.",
      es: "Compara las opciones UVB más fiables para geckos leopardo y aprende a colocarlas correctamente.",
    },
    tags: ["reptile", "gecko", "uvb", "lighting"],
  },
  {
    slug: "why-your-cat-needs-enrichment-every-day",
    category: "cat-care",
    featured: false,
    publishedAt: "2026-02-28",
    readingMinutes: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkgGNnVhBMRhTtLwPEoPSTgOAjn4RgR4YHKhCrAy7OkLOWqAQMZs9HhacwgEDKKagdi_iGkDweA-e0bRKweLsVIXGZ3ZgrR-LFYxJMVhYU7QrWqWOmQ3mcbimGI8oBu-PCIKF_r2bvhZH9Nx6_viliEsn1QIZfuqzbeCInmByKCD9DlEmbiVbISr9tvN0YVEzgmwLPfw0VOYfivicDfUhysz9T2zWmluC1eeU-h8Wk7KLELSvsDZHF9EFdPSaPDHHwdEnXmExsfxg",
    title: {
      en: "Why Your Cat Needs Enrichment Every Day",
      de: "Warum Ihre Katze täglich Beschäftigung braucht",
      fr: "Pourquoi votre chat a besoin d’enrichissement chaque jour",
      es: "Por qué tu gato necesita enriquecimiento cada día",
    },
    excerpt: {
      en: "Indoor cats need more than naps and bowls. Daily enrichment lowers stress and sharpens healthy instincts.",
      de: "Wohnungskatzen brauchen mehr als Schlaf und Näpfe. Tägliche Beschäftigung senkt Stress und stärkt gesunde Instinkte.",
      fr: "Les chats d’intérieur ont besoin de plus qu’un coussin et une gamelle. L’enrichissement quotidien réduit le stress.",
      es: "Los gatos de interior necesitan más que siestas y cuencos. El enriquecimiento diario reduce el estrés.",
    },
    seoDescription: {
      en: "Learn how short daily rituals, toy rotation, and scent play improve indoor cat wellbeing.",
      de: "Wie kurze Rituale, Spielzeugrotation und Geruchsspiele das Wohlbefinden von Wohnungskatzen verbessern.",
      fr: "Comment les rituels quotidiens et la rotation des jouets améliorent le bien-être du chat d’intérieur.",
      es: "Cómo los rituales diarios y la rotación de juguetes mejoran el bienestar del gato de interior.",
    },
    tags: ["cat", "enrichment", "toys"],
  },
  {
    slug: "smart-feeding-for-puppy-training",
    category: "dog-care",
    featured: false,
    publishedAt: "2026-02-12",
    readingMinutes: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8eWdq0EydEDwJXKTUymfBSHjxIu8MMWsJcEx4_3Qy4tuEGIlqdtOyDC5FnzKB0wXl883Xk23rgb9rVgRII5ddMrUfRj2K1Gl1UEI-M2z0zMCLIsOkGhVlR2nWx-kLN9xD2C6TBankZC1NOd9vjH4v1TaTX2GWoWfiQIdTH6ID6OprLI5TvHuHUF82x1u96N5MnKXSaepA9QtJnAbbYD8RGdZ6s9ffcm3j_QW1Cuk22Plf7h_TH9AcuAdangT9q8WSPerv9uY4GWc",
    title: {
      en: "Smart Feeding for Puppy Training",
      de: "Smarte Fütterung für das Welpentraining",
      fr: "Une alimentation intelligente pour l’éducation du chiot",
      es: "Alimentación inteligente para entrenar a tu cachorro",
    },
    excerpt: {
      en: "Use part of your puppy’s daily ration as focused rewards instead of treating meals and training as separate systems.",
      de: "Nutzen Sie einen Teil der Tagesration als fokussierte Belohnung statt Mahlzeiten und Training zu trennen.",
      fr: "Utilisez une partie de la ration quotidienne comme récompense au lieu de séparer repas et entraînement.",
      es: "Usa parte de la ración diaria como recompensa en lugar de separar comida y entrenamiento.",
    },
    seoDescription: {
      en: "A calm, practical guide to using daily food as a better reinforcement tool for puppies.",
      de: "Ein ruhiger, praxisnaher Leitfaden für Futter als Belohnung im Welpentraining.",
      fr: "Un guide pratique pour utiliser la ration quotidienne comme outil d’apprentissage.",
      es: "Una guía práctica para usar la comida diaria como mejor herramienta de refuerzo.",
    },
    tags: ["dog", "training", "feeding"],
  },
];
