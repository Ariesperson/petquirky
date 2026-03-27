import type { Locale } from "@/lib/i18n";

export type BlogCategory =
  | "all"
  | "cat-care"
  | "dog-care"
  | "reptile-care"
  | "small-pets"
  | "product-guides";

export type BlogPost = {
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
  body: Record<
    Locale,
    {
      intro: string[];
      bullets?: string[];
      sections: Array<{
        heading: string;
        paragraphs: string[];
      }>;
      recommendedProduct?: {
        title: string;
        price: number;
        href: string;
      };
    }
  >;
};

export const blogPosts: BlogPost[] = [
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
    body: {
      en: {
        intro: [
          "Modern reptile care has moved well beyond generic bulbs and guesswork. In 2026, the best UVB systems for leopard geckos balance low-zone exposure, stable output, and easier daily management.",
          "The goal is not to flood the enclosure with harsh light. It is to create a believable day rhythm and a basking gradient that supports calcium metabolism without overstressing a crepuscular species.",
        ],
        bullets: [
          "Choose T5 fixtures with consistent output over compact bulbs.",
          "Keep the UVB and heat source on the same side to build a clear sun patch.",
          "Re-check distance after changing mesh tops or fixture mounts.",
        ],
        sections: [
          {
            heading: "Why UVB Still Matters",
            paragraphs: [
              "Low-level UVB helps leopard geckos produce vitamin D3 naturally and supports better calcium use. Even for a species that prefers dawn and dusk activity, the right range can reduce long-term husbandry risk.",
              "The biggest mistake is treating UVB as an all-or-nothing debate. Good setups are controlled, measured, and positioned with intent.",
            ],
          },
          {
            heading: "What to Look for in 2026",
            paragraphs: [
              "The strongest systems this year pair steady spectrum output with easier timer control. Look for fixtures with dependable replacement schedules and enough fixture length to create a broad, usable zone.",
              "If your enclosure has dense mesh or deep mounting height, account for output loss. A technically good bulb can still underperform if the placement is poor.",
            ],
          },
        ],
        recommendedProduct: {
          title: "Smart UVB Controller Pro",
          price: 89,
          href: "/products/smart-uvb-controller-pro",
        },
      },
      de: {
        intro: [
          "Moderne Reptilienhaltung geht längst über Standardbirnen und Bauchgefühl hinaus. Die besten UVB-Systeme 2026 kombinieren geringe, sichere Intensität mit stabiler Leistung.",
          "Ziel ist kein grelles Licht im ganzen Terrarium, sondern ein glaubwürdiger Tagesrhythmus und ein sauberer Wärmegradient.",
        ],
        bullets: [
          "T5-Systeme sind Kompaktlampen meist überlegen.",
          "UVB und Wärmequelle sollten dieselbe Sonnenzone bilden.",
          "Nach Änderungen an Mesh oder Halterung den Abstand neu prüfen.",
        ],
        sections: [
          {
            heading: "Warum UVB wichtig bleibt",
            paragraphs: [
              "Niedrig dosiertes UVB unterstützt die natürliche Vitamin-D3-Bildung und damit den Kalziumstoffwechsel.",
              "Der häufigste Fehler ist, UVB nur als Ja-Nein-Thema zu behandeln. Gute Setups sind kontrolliert und bewusst platziert.",
            ],
          },
          {
            heading: "Worauf 2026 zu achten ist",
            paragraphs: [
              "Die besten Systeme liefern konstante Spektren und lassen sich zuverlässig steuern.",
              "Bei dichtem Mesh oder tiefer Montage muss Leistungsabfall eingeplant werden.",
            ],
          },
        ],
        recommendedProduct: {
          title: "Smart UVB Controller Pro",
          price: 89,
          href: "/products/smart-uvb-controller-pro",
        },
      },
      fr: {
        intro: [
          "Les soins reptiliens modernes dépassent largement les ampoules génériques et l’improvisation. En 2026, les meilleurs systèmes UVB offrent un niveau doux mais stable.",
          "L’objectif n’est pas d’inonder tout le terrarium de lumière, mais de créer un rythme naturel et une zone de basking cohérente.",
        ],
        bullets: [
          "Privilégiez les rampes T5 plutôt que les ampoules compactes.",
          "Placez UVB et chaleur du même côté pour créer une vraie zone solaire.",
          "Revérifiez la distance après tout changement de grille ou de support.",
        ],
        sections: [
          {
            heading: "Pourquoi les UVB restent essentiels",
            paragraphs: [
              "Un faible niveau d’UVB aide le gecko léopard à synthétiser naturellement la vitamine D3 et à mieux utiliser le calcium.",
              "L’erreur classique est de traiter les UVB comme un débat binaire. Un bon montage est mesuré et intentionnel.",
            ],
          },
          {
            heading: "Les bons critères en 2026",
            paragraphs: [
              "Les meilleurs modèles combinent stabilité du spectre et gestion plus simple au quotidien.",
              "Si le terrarium a une grille dense ou une grande hauteur, il faut tenir compte de la perte d’intensité.",
            ],
          },
        ],
        recommendedProduct: {
          title: "Smart UVB Controller Pro",
          price: 89,
          href: "/products/smart-uvb-controller-pro",
        },
      },
      es: {
        intro: [
          "El cuidado reptil moderno ya no depende de bombillas genéricas ni de intuición. En 2026, los mejores sistemas UVB equilibran una exposición suave con una salida estable.",
          "La meta no es llenar todo el terrario de luz, sino crear un ritmo diario creíble y una buena zona de asoleo.",
        ],
        bullets: [
          "Elige sistemas T5 frente a bombillas compactas.",
          "Coloca UVB y calor en el mismo lado para crear una zona solar clara.",
          "Revisa la distancia después de cambiar mallas o soportes.",
        ],
        sections: [
          {
            heading: "Por qué el UVB sigue importando",
            paragraphs: [
              "Un nivel bajo de UVB ayuda al gecko leopardo a producir vitamina D3 de forma natural y a aprovechar mejor el calcio.",
              "El error más común es tratar el UVB como un debate de sí o no. Los buenos montajes son medidos e intencionales.",
            ],
          },
          {
            heading: "Qué buscar en 2026",
            paragraphs: [
              "Los mejores sistemas de este año combinan un espectro estable con un control diario más sencillo.",
              "Si el recinto tiene malla densa o mucha altura, hay que compensar la pérdida de intensidad.",
            ],
          },
        ],
        recommendedProduct: {
          title: "Smart UVB Controller Pro",
          price: 89,
          href: "/products/smart-uvb-controller-pro",
        },
      },
    },
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
    body: {
      en: {
        intro: [
          "A well-designed enrichment routine gives indoor cats controlled novelty, movement, and reward.",
        ],
        sections: [
          {
            heading: "Rotate Instead of Overloading",
            paragraphs: [
              "Too many toys at once quickly become visual wallpaper. Rotating a smaller set keeps interest high without making the home feel chaotic.",
            ],
          },
        ],
      },
      de: { intro: ["Eine gute Beschäftigungsroutine gibt Wohnungskatzen Bewegung und Abwechslung."], sections: [{ heading: "Rotieren statt überladen", paragraphs: ["Zu viele Spielzeuge gleichzeitig verlieren schnell ihren Reiz."] }] },
      fr: { intro: ["Une bonne routine d’enrichissement apporte mouvement et nouveauté au chat d’intérieur."], sections: [{ heading: "Faire tourner les jouets", paragraphs: ["Trop de jouets à la fois deviennent vite invisibles."] }] },
      es: { intro: ["Una buena rutina de enriquecimiento aporta movimiento y novedad al gato de interior."], sections: [{ heading: "Rotar en lugar de saturar", paragraphs: ["Demasiados juguetes a la vez pierden su efecto rápidamente."] }] },
    },
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
    body: {
      en: { intro: ["Puppies learn faster when rewards are timely, predictable, and motivating."], sections: [{ heading: "Turn Meals into Training Moments", paragraphs: ["Using daily food portions helps keep sessions short and valuable without overfeeding."] }] },
      de: { intro: ["Welpen lernen schneller mit klaren und wertvollen Belohnungen."], sections: [{ heading: "Mahlzeiten als Training nutzen", paragraphs: ["Tagesrationen halten Einheiten kurz und effektiv."] }] },
      fr: { intro: ["Les chiots apprennent mieux avec des récompenses claires et motivantes."], sections: [{ heading: "Transformer les repas en apprentissage", paragraphs: ["La ration quotidienne rend les séances courtes et cohérentes."] }] },
      es: { intro: ["Los cachorros aprenden mejor con recompensas claras y motivadoras."], sections: [{ heading: "Convierte las comidas en entrenamiento", paragraphs: ["La ración diaria ayuda a mantener sesiones breves y eficaces."] }] },
    },
  },
];
