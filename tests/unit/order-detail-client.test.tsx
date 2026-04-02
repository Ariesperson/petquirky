/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";

describe("OrderDetailClient", () => {
  it("renders line items in the order detail view", async () => {
    const { OrderDetailClient } = await import("@/components/account/OrderDetailClient");

    render(
      <OrderDetailClient
        locale="en"
        order={{
          id: "ORDER-1",
          status: "COMPLETED",
          total: 89,
          currency: "EUR",
          createdAt: "2026-03-27T00:00:00.000Z",
          payerEmail: "ada@example.com",
          shippingAddress: {
            fullName: "Ada Lovelace",
            email: "ada@example.com",
            address: "1 Rue de Test",
            city: "Paris",
            postalCode: "75001",
            country: "France",
          },
          items: [
            {
              productId: "prod-1",
              name: "Ceramic Sculpted Slow Feeder",
              image: "/images/slow-feeder.jpg",
              quantity: 2,
              unitPrice: 44.5,
              lineTotal: 89,
            },
          ],
        }}
        labels={{
          orderNumber: "Order",
          emptyTitle: "Order not found",
          emptyDescription: "Missing order",
          backToOrders: "Back to Orders",
          status: "Processing",
          total: "Total",
          email: "Email",
          placedOn: "Placed on",
          shippingAddress: "Shipping Address",
          orderItems: "Order Items",
          quantity: "Quantity",
        }}
      />
    );

    expect(screen.getByText("Ceramic Sculpted Slow Feeder")).toBeTruthy();
    expect(screen.getByText("Quantity: 2")).toBeTruthy();
    expect(screen.getAllByText("89.00 €")).toHaveLength(2);
  });

  it("renders the empty state when no order is provided", async () => {
    const { OrderDetailClient } = await import("@/components/account/OrderDetailClient");

    render(
      <OrderDetailClient
        locale="en"
        order={null}
        labels={{
          orderNumber: "Order",
          emptyTitle: "Order not found",
          emptyDescription: "Missing order",
          backToOrders: "Back to Orders",
          status: "Processing",
          total: "Total",
          email: "Email",
          placedOn: "Placed on",
          shippingAddress: "Shipping Address",
          orderItems: "Order Items",
          quantity: "Quantity",
        }}
      />
    );

    expect(screen.getByText("Order not found")).toBeTruthy();
    expect(screen.getByText("Missing order")).toBeTruthy();
  });
});
