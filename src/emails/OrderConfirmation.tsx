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
    intro: "We have received your PetQuirky order and started preparing it.",
    items: "Items",
    shipping: "Shipping address",
    total: "Total",
    eta: "Estimated dispatch and delivery: 5-10 business days.",
    support: "Questions? Reach us at hello@petquirky.com.",
  },
  de: {
    greeting: "Vielen Dank für Ihre Bestellung",
    intro: "Wir haben Ihre PetQuirky-Bestellung erhalten und bereiten sie vor.",
    items: "Artikel",
    shipping: "Lieferadresse",
    total: "Gesamt",
    eta: "Voraussichtlicher Versand und Lieferung: 5-10 Werktage.",
    support: "Fragen? Schreiben Sie uns an hello@petquirky.com.",
  },
  fr: {
    greeting: "Merci pour votre commande",
    intro: "Nous avons bien reçu votre commande PetQuirky et commençons sa préparation.",
    items: "Articles",
    shipping: "Adresse de livraison",
    total: "Total",
    eta: "Expédition et livraison estimées : 5 à 10 jours ouvrés.",
    support: "Une question ? Écrivez-nous à hello@petquirky.com.",
  },
  es: {
    greeting: "Gracias por tu pedido",
    intro: "Hemos recibido tu pedido de PetQuirky y ya estamos preparándolo.",
    items: "Artículos",
    shipping: "Dirección de envío",
    total: "Total",
    eta: "Envío y entrega estimados: 5-10 días laborables.",
    support: "¿Preguntas? Escríbenos a hello@petquirky.com.",
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
