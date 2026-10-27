import type { CheckoutItemPayload } from "@/types/checkout";

type OrderConfirmationProps = {
  locale: string;
  orderId: string;
  customerName: string;
  items: CheckoutItemPayload[];
  total: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
};

const copy = {
  en: {
    greeting: "Thank you for your order",
    intro: "We have received your PetQuirky order and will handle it as an individual seller.",
    items: "Items",
    shipping: "Shipping address",
    total: "Total",
    eta: "Estimated delivery is usually 5-10 business days after order processing.",
    support: "Questions? Reply to this email or contact PetQuirky support.",
  },
  de: {
    greeting: "Vielen Dank für Ihre Bestellung",
    intro: "Wir haben Ihre PetQuirky-Bestellung erhalten und bearbeiten sie als einzelner Verkäufer.",
    items: "Artikel",
    shipping: "Lieferadresse",
    total: "Gesamt",
    eta: "Die voraussichtliche Lieferung beträgt normalerweise 5-10 Werktage nach der Bestellbearbeitung.",
    support: "Fragen? Antworten Sie auf diese E-Mail oder kontaktieren Sie den PetQuirky-Support.",
  },
  fr: {
    greeting: "Merci pour votre commande",
    intro: "Nous avons bien reçu votre commande PetQuirky et elle sera traitée par un vendeur individuel.",
    items: "Articles",
    shipping: "Adresse de livraison",
    total: "Total",
    eta: "La livraison estimée est généralement de 5 à 10 jours ouvrés après le traitement de la commande.",
    support: "Une question ? Répondez à cet e-mail ou contactez le support PetQuirky.",
  },
  es: {
    greeting: "Gracias por tu pedido",
    intro: "Hemos recibido tu pedido de PetQuirky y será gestionado por un vendedor individual.",
    items: "Artículos",
    shipping: "Dirección de envío",
    total: "Total",
    eta: "La entrega estimada suele ser de 5-10 días laborables después de procesar el pedido.",
    support: "¿Preguntas? Responde a este correo o contacta con el soporte de PetQuirky.",
  },
} as const;

export function OrderConfirmation({
  locale,
  orderId,
  customerName,
  items,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  const t = copy[(locale as keyof typeof copy) ?? "en"] ?? copy.en;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1b1c1c", padding: "24px" }}>
      <h1 style={{ color: "#a5360d" }}>
        {t.greeting} #{orderId}
      </h1>
      <p>{customerName},</p>
      <p>{t.intro}</p>

      <h2 style={{ marginTop: "24px" }}>{t.items}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            {item.name} x {item.quantity} - {item.lineTotal.toFixed(2)} €
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: "24px" }}>{t.shipping}</h2>
      <p>{shippingAddress.fullName}</p>
      <p>{shippingAddress.address}</p>
      <p>
        {shippingAddress.city}, {shippingAddress.postalCode}
      </p>
      <p>{shippingAddress.country}</p>

      <h2 style={{ marginTop: "24px" }}>{t.total}</h2>
      <p>{total}</p>

      <p style={{ marginTop: "24px" }}>{t.eta}</p>
      <p>{t.support}</p>
    </div>
  );
}
