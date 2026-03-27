import type { Locale } from "@/lib/i18n";

type PolicyDocument = {
  title: Record<Locale, string>;
  updatedAt: Record<Locale, string>;
  intro: Record<Locale, string>;
  sections: Array<{
    id: string;
    title: Record<Locale, string>;
    paragraphs: Record<Locale, string[]>;
    bullets?: Record<Locale, string[]>;
  }>;
};

export const policyDocuments: Record<"privacy" | "terms" | "returns", PolicyDocument> = {
  privacy: {
    title: {
      en: "Privacy Policy",
      de: "Datenschutzerklärung",
      fr: "Politique de confidentialité",
      es: "Política de privacidad",
    },
    updatedAt: {
      en: "Last updated: March 26, 2026",
      de: "Zuletzt aktualisiert: 26. März 2026",
      fr: "Dernière mise à jour : 26 mars 2026",
      es: "Última actualización: 26 de marzo de 2026",
    },
    intro: {
      en: "PetQuirky collects only the information needed to serve customers, fulfill orders, and keep the store secure.",
      de: "PetQuirky erhebt nur die Daten, die für Service, Bestellabwicklung und Sicherheit erforderlich sind.",
      fr: "PetQuirky ne collecte que les informations nécessaires au service, aux commandes et à la sécurité du site.",
      es: "PetQuirky solo recopila la información necesaria para atender pedidos, dar soporte y proteger la tienda.",
    },
    sections: [
      {
        id: "collect",
        title: {
          en: "Information We Collect",
          de: "Welche Daten wir erheben",
          fr: "Informations collectées",
          es: "Información que recopilamos",
        },
        paragraphs: {
          en: [
            "We collect account details, checkout details, and basic technical data needed to operate the storefront.",
            "This may include your name, email address, shipping details, order history, browser data, and cookie preferences.",
          ],
          de: [
            "Wir erfassen Kontodaten, Checkout-Daten und technische Basisdaten für den Betrieb des Shops.",
            "Dazu gehören Name, E-Mail, Lieferadresse, Bestellhistorie, Browserdaten und Cookie-Einstellungen.",
          ],
          fr: [
            "Nous collectons les données de compte, de commande et les données techniques nécessaires au fonctionnement de la boutique.",
            "Cela peut inclure votre nom, votre e-mail, votre adresse de livraison, votre historique de commande et vos préférences de cookies.",
          ],
          es: [
            "Recopilamos datos de cuenta, datos de compra y datos técnicos básicos necesarios para operar la tienda.",
            "Esto puede incluir nombre, correo, dirección de envío, historial de pedidos y preferencias de cookies.",
          ],
        },
      },
      {
        id: "usage",
        title: {
          en: "How We Use Your Data",
          de: "Wie wir Ihre Daten nutzen",
          fr: "Utilisation de vos données",
          es: "Cómo usamos tus datos",
        },
        paragraphs: {
          en: [
            "We use your data to process orders, provide customer support, improve the site, and comply with legal obligations.",
          ],
          de: [
            "Wir nutzen Ihre Daten zur Bestellabwicklung, für Support, zur Optimierung der Website und zur Erfüllung rechtlicher Pflichten.",
          ],
          fr: [
            "Nous utilisons vos données pour traiter les commandes, assurer le support, améliorer le site et respecter nos obligations légales.",
          ],
          es: [
            "Usamos tus datos para procesar pedidos, ofrecer soporte, mejorar el sitio y cumplir obligaciones legales.",
          ],
        },
      },
      {
        id: "rights",
        title: {
          en: "Your Rights",
          de: "Ihre Rechte",
          fr: "Vos droits",
          es: "Tus derechos",
        },
        paragraphs: {
          en: ["If you are in the EEA, you may request access, correction, deletion, or export of your personal data."],
          de: ["Wenn Sie sich im EWR befinden, können Sie Auskunft, Berichtigung, Löschung oder Export Ihrer Daten verlangen."],
          fr: ["Si vous êtes dans l’EEE, vous pouvez demander l’accès, la correction, la suppression ou l’export de vos données."],
          es: ["Si estás en el EEE, puedes solicitar acceso, corrección, eliminación o exportación de tus datos."],
        },
      },
    ],
  },
  terms: {
    title: {
      en: "Terms of Service",
      de: "Nutzungsbedingungen",
      fr: "Conditions d’utilisation",
      es: "Términos del servicio",
    },
    updatedAt: {
      en: "Last updated: March 26, 2026",
      de: "Zuletzt aktualisiert: 26. März 2026",
      fr: "Dernière mise à jour : 26 mars 2026",
      es: "Última actualización: 26 de marzo de 2026",
    },
    intro: {
      en: "These terms govern your use of the PetQuirky storefront, checkout, and account features.",
      de: "Diese Bedingungen regeln die Nutzung des PetQuirky-Shops, des Checkouts und der Kontofunktionen.",
      fr: "Ces conditions régissent l’utilisation de la boutique PetQuirky, du paiement et du compte client.",
      es: "Estos términos regulan el uso de la tienda PetQuirky, el pago y las funciones de cuenta.",
    },
    sections: [
      {
        id: "orders",
        title: {
          en: "Orders and Pricing",
          de: "Bestellungen und Preise",
          fr: "Commandes et prix",
          es: "Pedidos y precios",
        },
        paragraphs: {
          en: ["All prices are shown in EUR. Orders are accepted only after successful payment authorization."],
          de: ["Alle Preise werden in EUR angezeigt. Bestellungen gelten erst nach erfolgreicher Zahlungsautorisierung als angenommen."],
          fr: ["Tous les prix sont affichés en EUR. Les commandes sont acceptées après validation du paiement."],
          es: ["Todos los precios se muestran en EUR. Los pedidos solo se aceptan tras la autorización correcta del pago."],
        },
      },
      {
        id: "accounts",
        title: {
          en: "Accounts and Access",
          de: "Konten und Zugriff",
          fr: "Comptes et accès",
          es: "Cuentas y acceso",
        },
        paragraphs: {
          en: ["You are responsible for maintaining the security of your account and for providing accurate checkout details."],
          de: ["Sie sind für die Sicherheit Ihres Kontos und für korrekte Angaben beim Checkout verantwortlich."],
          fr: ["Vous êtes responsable de la sécurité de votre compte et de l’exactitude des informations fournies."],
          es: ["Eres responsable de la seguridad de tu cuenta y de la exactitud de los datos facilitados."],
        },
      },
    ],
  },
  returns: {
    title: {
      en: "Shipping and Returns",
      de: "Versand und Rückgabe",
      fr: "Livraison et retours",
      es: "Envíos y devoluciones",
    },
    updatedAt: {
      en: "Last updated: March 26, 2026",
      de: "Zuletzt aktualisiert: 26. März 2026",
      fr: "Dernière mise à jour : 26 mars 2026",
      es: "Última actualización: 26 de marzo de 2026",
    },
    intro: {
      en: "PetQuirky ships across Europe and applies a strict 14-day returns window.",
      de: "PetQuirky versendet europaweit und gilt mit einem strikten 14-Tage-Rückgaberecht.",
      fr: "PetQuirky expédie en Europe et applique une fenêtre de retour stricte de 14 jours.",
      es: "PetQuirky envía por Europa y aplica un plazo estricto de devolución de 14 días.",
    },
    sections: [
      {
        id: "shipping",
        title: {
          en: "Shipping",
          de: "Versand",
          fr: "Livraison",
          es: "Envíos",
        },
        paragraphs: {
          en: ["Orders over 50 € qualify for free shipping. Standard delivery estimates are 5 to 10 business days."],
          de: ["Bestellungen über 50 € erhalten kostenlosen Versand. Die Standardlieferzeit beträgt 5 bis 10 Werktage."],
          fr: ["Les commandes de plus de 50 € bénéficient de la livraison gratuite. Le délai standard est de 5 à 10 jours ouvrés."],
          es: ["Los pedidos superiores a 50 € tienen envío gratuito. La entrega estándar tarda entre 5 y 10 días laborables."],
        },
      },
      {
        id: "returns",
        title: {
          en: "14-Day Returns",
          de: "14-Tage-Rückgabe",
          fr: "Retours sous 14 jours",
          es: "Devoluciones en 14 días",
        },
        paragraphs: {
          en: ["You may request a return within 14 days of delivery. Items must be unused and returned in original condition."],
          de: ["Eine Rückgabe kann innerhalb von 14 Tagen nach Zustellung angefragt werden. Artikel müssen unbenutzt und im Originalzustand sein."],
          fr: ["Vous pouvez demander un retour dans les 14 jours suivant la livraison. Les articles doivent être inutilisés et dans leur état d’origine."],
          es: ["Puedes solicitar una devolución dentro de los 14 días posteriores a la entrega. Los artículos deben estar sin usar y en su estado original."],
        },
      },
    ],
  },
};
