import { buildOrderDetailView } from "@/lib/order-detail";
import type { CompletedCheckoutOrderWithItems } from "@/types/checkout";

describe("buildOrderDetailView", () => {
  it("derives pricing, item count, and product links from an order", () => {
    const order: CompletedCheckoutOrderWithItems = {
      id: "ORDER-123",
      status: "COMPLETED",
      total: 51.9,
      currency: "EUR",
      createdAt: "2026-04-08T10:00:00.000Z",
      payerEmail: "ada@example.com",
      shippingAddress: {
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        address: "123 Rue de la Paix",
        city: "Paris",
        postalCode: "75002",
        country: "France",
      },
      items: [
        {
          productId: "prod_pebble_weave_basket",
          name: "Legacy name",
          image: "/fallback.jpg",
          quantity: 1,
          unitPrice: 45,
          lineTotal: 45,
        },
      ],
    };

    const detail = buildOrderDetailView(order, "en");

    expect(detail.subtotal).toBe(45);
    expect(detail.shippingAmount).toBe(6.9);
    expect(detail.itemCount).toBe(1);
    expect(detail.paymentState).toBe("paid");
    expect(detail.items[0]?.name).toBe("The Pebble Weave Basket");
    expect(detail.items[0]?.href).toBe("/en/products/pebble-weave-basket");
    expect(detail.timeline.find((step) => step.key === "preparing")?.current).toBe(true);
  });

  it("keeps legacy items renderable when the product no longer exists", () => {
    const order: CompletedCheckoutOrderWithItems = {
      id: "ORDER-404",
      status: "PROCESSING",
      total: 20,
      currency: "EUR",
      createdAt: "2026-04-08T10:00:00.000Z",
      shippingAddress: {
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        address: "123 Rue de la Paix",
        city: "Paris",
        postalCode: "75002",
        country: "France",
      },
      items: [
        {
          productId: "retired-product",
          name: "Archived Toy",
          image: "/archived.jpg",
          quantity: 2,
          unitPrice: 10,
          lineTotal: 20,
        },
      ],
    };

    const detail = buildOrderDetailView(order, "en");

    expect(detail.items[0]?.name).toBe("Archived Toy");
    expect(detail.items[0]?.href).toBeNull();
    expect(detail.timeline.find((step) => step.key === "placed")?.current).toBe(true);
  });
});
