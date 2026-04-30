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
      en: "PetQuirky is operated by an individual seller and collects only the information needed to serve customers, fulfill orders, and keep the store secure.",
      de: "PetQuirky wird von einem einzelnen Verkäufer betrieben und erhebt nur die Daten, die für Service, Bestellabwicklung und Sicherheit erforderlich sind.",
      fr: "PetQuirky est exploité par un vendeur individuel et ne collecte que les informations nécessaires au service, aux commandes et à la sécurité du site.",
      es: "PetQuirky está operado por un vendedor individual y solo recopila la información necesaria para atender pedidos, dar soporte y proteger la tienda.",
    },
    sections: [
      {
        id: "controller",
        title: {
          en: "Who Operates PetQuirky",
          de: "Wer PetQuirky betreibt",
          fr: "Qui exploite PetQuirky",
          es: "Quién opera PetQuirky",
        },
        paragraphs: {
          en: [
            "PetQuirky is operated by an individual seller, not a company. For privacy, order, or support questions, contact us through the support email shown on the contact page.",
          ],
          de: [
            "PetQuirky wird von einem einzelnen Verkäufer betrieben, nicht von einem Unternehmen. Bei Fragen zu Datenschutz, Bestellungen oder Support nutzen Sie bitte die auf der Kontaktseite angegebene Support-E-Mail.",
          ],
          fr: [
            "PetQuirky est exploité par un vendeur individuel, et non par une société. Pour toute question liée à la confidentialité, aux commandes ou au support, contactez-nous via l’e-mail indiqué sur la page de contact.",
          ],
          es: [
            "PetQuirky está operado por un vendedor individual, no por una empresa. Para preguntas sobre privacidad, pedidos o soporte, contáctanos mediante el correo indicado en la página de contacto.",
          ],
        },
      },
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
        id: "providers",
        title: {
          en: "Service Providers",
          de: "Dienstleister",
          fr: "Prestataires de service",
          es: "Proveedores de servicio",
        },
        paragraphs: {
          en: [
            "We use trusted service providers to run the store, including PayPal for payment processing, Supabase for accounts and order records, Resend for email delivery, and Vercel for hosting.",
            "PetQuirky does not store your PayPal login details or full card details.",
          ],
          de: [
            "Wir nutzen vertrauenswürdige Dienstleister für den Shopbetrieb, darunter PayPal für Zahlungen, Supabase für Konten und Bestelldaten, Resend für E-Mail-Zustellung und Vercel für Hosting.",
            "PetQuirky speichert keine PayPal-Zugangsdaten oder vollständigen Kartendaten.",
          ],
          fr: [
            "Nous utilisons des prestataires de confiance pour exploiter la boutique, notamment PayPal pour les paiements, Supabase pour les comptes et commandes, Resend pour l’envoi d’e-mails et Vercel pour l’hébergement.",
            "PetQuirky ne stocke pas vos identifiants PayPal ni les données complètes de votre carte.",
          ],
          es: [
            "Usamos proveedores de confianza para operar la tienda, incluidos PayPal para procesar pagos, Supabase para cuentas y pedidos, Resend para enviar correos y Vercel para el alojamiento.",
            "PetQuirky no almacena tus datos de acceso a PayPal ni los datos completos de tu tarjeta.",
          ],
        },
      },
      {
        id: "retention",
        title: {
          en: "Retention",
          de: "Speicherdauer",
          fr: "Durée de conservation",
          es: "Conservación",
        },
        paragraphs: {
          en: [
            "We keep order, support, and account records only for as long as needed to provide the service, handle returns or disputes, and meet legal or tax obligations.",
          ],
          de: [
            "Wir speichern Bestell-, Support- und Kontodaten nur so lange, wie es für Service, Rückgaben, Streitfälle sowie rechtliche oder steuerliche Pflichten erforderlich ist.",
          ],
          fr: [
            "Nous conservons les données de commande, de support et de compte uniquement le temps nécessaire au service, aux retours ou litiges, et aux obligations légales ou fiscales.",
          ],
          es: [
            "Conservamos los datos de pedidos, soporte y cuenta solo durante el tiempo necesario para prestar el servicio, gestionar devoluciones o disputas y cumplir obligaciones legales o fiscales.",
          ],
        },
      },
      {
        id: "cookies",
        title: {
          en: "Cookies",
          de: "Cookies",
          fr: "Cookies",
          es: "Cookies",
        },
        paragraphs: {
          en: [
            "Necessary cookies and local storage keep language selection, cart, checkout, account, and security features working. Optional analytics or marketing cookies are used only if you choose to allow them.",
          ],
          de: [
            "Notwendige Cookies und lokaler Speicher halten Spracheinstellung, Warenkorb, Checkout, Konto und Sicherheitsfunktionen funktionsfähig. Optionale Analyse- oder Marketing-Cookies werden nur verwendet, wenn Sie diese zulassen.",
          ],
          fr: [
            "Les cookies nécessaires et le stockage local permettent le fonctionnement de la langue, du panier, du paiement, du compte et de la sécurité. Les cookies optionnels d’analyse ou de marketing ne sont utilisés que si vous les autorisez.",
          ],
          es: [
            "Las cookies necesarias y el almacenamiento local mantienen funcionando el idioma, carrito, pago, cuenta y seguridad. Las cookies opcionales de analítica o marketing solo se usan si decides permitirlas.",
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
      {
        id: "transfers",
        title: {
          en: "International Transfers",
          de: "Internationale Übermittlungen",
          fr: "Transferts internationaux",
          es: "Transferencias internacionales",
        },
        paragraphs: {
          en: [
            "Some service providers may process data outside your country. Where required, we rely on appropriate safeguards provided by those services.",
          ],
          de: [
            "Einige Dienstleister können Daten außerhalb Ihres Landes verarbeiten. Soweit erforderlich, stützen wir uns auf geeignete Schutzmaßnahmen dieser Dienste.",
          ],
          fr: [
            "Certains prestataires peuvent traiter des données hors de votre pays. Lorsque nécessaire, nous nous appuyons sur les garanties appropriées fournies par ces services.",
          ],
          es: [
            "Algunos proveedores pueden procesar datos fuera de tu país. Cuando sea necesario, nos basamos en las garantías adecuadas ofrecidas por esos servicios.",
          ],
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
      en: "These terms govern your use of the PetQuirky storefront, checkout, and account features. PetQuirky is operated by an individual seller, not a company.",
      de: "Diese Bedingungen regeln die Nutzung des PetQuirky-Shops, des Checkouts und der Kontofunktionen. PetQuirky wird von einem einzelnen Verkäufer betrieben, nicht von einem Unternehmen.",
      fr: "Ces conditions régissent l’utilisation de la boutique PetQuirky, du paiement et du compte client. PetQuirky est exploité par un vendeur individuel, et non par une société.",
      es: "Estos términos regulan el uso de la tienda PetQuirky, el pago y las funciones de cuenta. PetQuirky está operado por un vendedor individual, no por una empresa.",
    },
    sections: [
      {
        id: "seller",
        title: {
          en: "Seller Identity",
          de: "Verkäuferidentität",
          fr: "Identité du vendeur",
          es: "Identidad del vendedor",
        },
        paragraphs: {
          en: [
            "PetQuirky is an independent store operated by an individual seller. Customer support is available through the support email shown on the contact page, with a typical reply time of 1 to 2 business days.",
          ],
          de: [
            "PetQuirky ist ein unabhängiger Shop, der von einem einzelnen Verkäufer betrieben wird. Der Kundensupport ist über die Support-E-Mail auf der Kontaktseite erreichbar; die übliche Antwortzeit beträgt 1 bis 2 Werktage.",
          ],
          fr: [
            "PetQuirky est une boutique indépendante exploitée par un vendeur individuel. Le support client est disponible via l’e-mail indiqué sur la page de contact, avec un délai habituel de 1 à 2 jours ouvrés.",
          ],
          es: [
            "PetQuirky es una tienda independiente operada por un vendedor individual. El soporte está disponible mediante el correo indicado en la página de contacto, con un tiempo habitual de respuesta de 1 a 2 días laborables.",
          ],
        },
      },
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
        id: "payment",
        title: {
          en: "Payment",
          de: "Zahlung",
          fr: "Paiement",
          es: "Pago",
        },
        paragraphs: {
          en: [
            "Payment is processed securely by PayPal. PetQuirky does not store your PayPal login or card details.",
          ],
          de: [
            "Die Zahlung wird sicher über PayPal verarbeitet. PetQuirky speichert keine PayPal-Zugangsdaten oder Kartendaten.",
          ],
          fr: [
            "Le paiement est traité en toute sécurité par PayPal. PetQuirky ne stocke pas vos identifiants PayPal ni vos données de carte.",
          ],
          es: [
            "El pago se procesa de forma segura por PayPal. PetQuirky no almacena tus datos de acceso a PayPal ni los datos de tu tarjeta.",
          ],
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
      {
        id: "taxes",
        title: {
          en: "Taxes and Import Charges",
          de: "Steuern und Importgebühren",
          fr: "Taxes et frais d’importation",
          es: "Impuestos y cargos de importación",
        },
        paragraphs: {
          en: [
            "Taxes, duties, or import charges may apply depending on the destination and shipping route. Checkout wording and pricing should be reviewed before accepting live orders.",
          ],
          de: [
            "Je nach Zielort und Versandweg können Steuern, Zölle oder Importgebühren anfallen. Checkout-Texte und Preise sollten vor echten Bestellungen geprüft werden.",
          ],
          fr: [
            "Des taxes, droits ou frais d’importation peuvent s’appliquer selon la destination et le mode d’expédition. Les textes et prix du paiement doivent être vérifiés avant d’accepter des commandes réelles.",
          ],
          es: [
            "Pueden aplicarse impuestos, aranceles o cargos de importación según el destino y la ruta de envío. Los textos y precios del pago deben revisarse antes de aceptar pedidos reales.",
          ],
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
      en: "PetQuirky ships to supported European destinations and allows return requests within 14 days after delivery.",
      de: "PetQuirky versendet an unterstützte Ziele in Europa und ermöglicht Rückgabeanfragen innerhalb von 14 Tagen nach Lieferung.",
      fr: "PetQuirky expédie vers les destinations européennes prises en charge et permet les demandes de retour sous 14 jours après la livraison.",
      es: "PetQuirky envía a destinos europeos admitidos y permite solicitar devoluciones dentro de 14 días tras la entrega.",
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
          en: ["Orders over 50 € qualify for free shipping where available. Estimated delivery is usually 5 to 10 business days after order processing, but timing may vary by destination, carrier availability, holidays, or customs checks."],
          de: ["Bestellungen über 50 € erhalten kostenlosen Versand, sofern verfügbar. Die voraussichtliche Lieferung beträgt normalerweise 5 bis 10 Werktage nach der Bestellbearbeitung, kann aber je nach Zielort, Verfügbarkeit des Versanddienstleisters, Feiertagen oder Zollprüfungen abweichen."],
          fr: ["Les commandes de plus de 50 € bénéficient de la livraison gratuite lorsque disponible. La livraison estimée est généralement de 5 à 10 jours ouvrés après le traitement de la commande, mais peut varier selon la destination, le transporteur, les jours fériés ou les contrôles douaniers."],
          es: ["Los pedidos superiores a 50 € tienen envío gratuito cuando esté disponible. La entrega estimada suele ser de 5 a 10 días laborables después de procesar el pedido, pero puede variar según el destino, el transportista, festivos o controles aduaneros."],
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
          en: ["You may request a return within 14 days after delivery. Items should be unused, clean, and returned in their original condition. Please contact us before sending anything back so we can confirm the return address and next steps."],
          de: ["Eine Rückgabe kann innerhalb von 14 Tagen nach Lieferung angefragt werden. Artikel sollten unbenutzt, sauber und im Originalzustand zurückgesendet werden. Bitte kontaktieren Sie uns vor der Rücksendung, damit wir Rücksendeadresse und nächste Schritte bestätigen können."],
          fr: ["Vous pouvez demander un retour sous 14 jours après la livraison. Les articles doivent être inutilisés, propres et retournés dans leur état d’origine. Contactez-nous avant tout envoi afin que nous confirmions l’adresse de retour et les prochaines étapes."],
          es: ["Puedes solicitar una devolución dentro de 14 días tras la entrega. Los artículos deben estar sin usar, limpios y en su estado original. Contáctanos antes de enviar cualquier producto para confirmar la dirección de devolución y los siguientes pasos."],
        },
      },
      {
        id: "refunds",
        title: {
          en: "Refunds",
          de: "Erstattungen",
          fr: "Remboursements",
          es: "Reembolsos",
        },
        paragraphs: {
          en: ["Refunds are issued to the original payment method after the returned item has been received and checked. Original shipping fees and return shipping costs may not be refundable unless the item arrived damaged, defective, or incorrect."],
          de: ["Erstattungen erfolgen über die ursprüngliche Zahlungsmethode, nachdem der zurückgesendete Artikel eingegangen und geprüft wurde. Ursprüngliche Versandkosten und Rücksendekosten sind möglicherweise nicht erstattungsfähig, außer der Artikel kam beschädigt, fehlerhaft oder falsch an."],
          fr: ["Les remboursements sont effectués sur le moyen de paiement d’origine après réception et vérification de l’article retourné. Les frais de livraison initiaux et les frais de retour peuvent ne pas être remboursables, sauf si l’article est arrivé endommagé, défectueux ou incorrect."],
          es: ["Los reembolsos se emiten al método de pago original después de recibir y revisar el artículo devuelto. Los gastos de envío originales y los costes de devolución pueden no ser reembolsables salvo que el artículo haya llegado dañado, defectuoso o incorrecto."],
        },
      },
      {
        id: "problems",
        title: {
          en: "Damaged or Incorrect Items",
          de: "Beschädigte oder falsche Artikel",
          fr: "Articles endommagés ou incorrects",
          es: "Artículos dañados o incorrectos",
        },
        paragraphs: {
          en: ["If an item arrives damaged, defective, or incorrect, contact us with your order number and clear photos of the item and packaging so we can review the next step."],
          de: ["Wenn ein Artikel beschädigt, fehlerhaft oder falsch ankommt, kontaktieren Sie uns bitte mit Bestellnummer und klaren Fotos von Artikel und Verpackung, damit wir die nächsten Schritte prüfen können."],
          fr: ["Si un article arrive endommagé, défectueux ou incorrect, contactez-nous avec votre numéro de commande et des photos claires de l’article et de l’emballage afin que nous puissions examiner la suite."],
          es: ["Si un artículo llega dañado, defectuoso o incorrecto, contáctanos con tu número de pedido y fotos claras del producto y del embalaje para revisar el siguiente paso."],
        },
      },
    ],
  },
};
