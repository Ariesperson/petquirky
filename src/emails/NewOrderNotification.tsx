import type { CheckoutItemPayload } from "@/types/checkout";

type NewOrderNotificationProps = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: CheckoutItemPayload[];
  total: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paypalOrderId: string;
};

export function NewOrderNotification({
  orderId,
  customerName,
  customerEmail,
  items,
  total,
  shippingAddress,
  paypalOrderId,
}: NewOrderNotificationProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1b1c1c", padding: "24px" }}>
      <h1 style={{ color: "#a5360d" }}>New Order #{orderId}</h1>
      <p>
        Customer: {customerName} ({customerEmail})
      </p>
      <p>PayPal transaction: {paypalOrderId}</p>

      <h2 style={{ marginTop: "24px" }}>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.productId}>
            {item.name} x {item.quantity} - {item.lineTotal.toFixed(2)} €
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: "24px" }}>Shipping address</h2>
      <p>{shippingAddress.fullName}</p>
      <p>{shippingAddress.address}</p>
      <p>
        {shippingAddress.city}, {shippingAddress.postalCode}
      </p>
      <p>{shippingAddress.country}</p>

      <h2 style={{ marginTop: "24px" }}>Total</h2>
      <p>{total}</p>
    </div>
  );
}
