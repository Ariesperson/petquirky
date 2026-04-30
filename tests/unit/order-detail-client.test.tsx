/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";

describe("OrderDetailClient", () => {
  const labels = {
    orderNumber: "Order",
    reviewTitle: "Order review",
    emptyTitle: "Order not found",
    emptyDescription: "Missing order",
    backToOrders: "Back to Orders",
    continueShopping: "Continue shopping",
    orderJourney: "Order journey",
    timelinePlaced: "Order placed",
    timelinePaid: "Payment confirmed",
    timelinePreparing: "Preparing shipment",
    timelineShipped: "Shipped",
    total: "Total",
    subtotal: "Subtotal",
    shipping: "Shipping",
    pricingSummary: "Pricing summary",
    email: "Email",
    customer: "Customer",
    placedOn: "Placed on",
    shippingAddress: "Shipping Address",
    orderItems: "Order Items",
    itemsInOrder: "Items in your order",
    quantity: "Quantity",
    unitPrice: "Unit price",
    paymentSummary: "Payment summary",
    paymentMethod: "Payment method",
    paymentStatus: "Payment status",
    paymentMethodPaypal: "PayPal",
    paymentStatusPaid: "Paid",
    paymentStatusPending: "Pending",
    statusCompleted: "Completed",
    statusProcessing: "Processing",
    statusShipped: "Shipped",
    deliveryWindow: "Delivery window",
    needHelpTitle: "Need help?",
    needHelpBody: "Estimated delivery: 5-10 business days.",
    contactSupport: "Contact support",
    shippingReturns: "Shipping and returns",
    privacyPolicy: "Privacy policy",
    termsOfService: "Terms of service",
    itemCountLabel: "items",
    freeShipping: "Free",
    itemsFallback: "Order item details are unavailable.",
  };

  it("renders line items in the order detail view", async () => {
    const { OrderDetailClient } = await import("@/components/account/OrderDetailClient");
    const { buildOrderDetailView } = await import("@/lib/order-detail");

    render(
      <OrderDetailClient
        locale="en"
        order={buildOrderDetailView(
          {
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
          },
          "en"
        )}
        supportEmail="support@petquirky.com"
        labels={labels}
      />
    );

    expect(screen.getByText("Ceramic Sculpted Slow Feeder")).toBeTruthy();
    expect(screen.getByText("Quantity: 2")).toBeTruthy();
    expect(screen.getAllByText("89.00 €").length).toBeGreaterThanOrEqual(2);
  });

  it("renders the empty state when no order is provided", async () => {
    const { OrderDetailClient } = await import("@/components/account/OrderDetailClient");

    render(
      <OrderDetailClient
        locale="en"
        order={null}
        supportEmail="support@petquirky.com"
        labels={labels}
      />
    );

    expect(screen.getByText("Order not found")).toBeTruthy();
    expect(screen.getByText("Missing order")).toBeTruthy();
  });
});
