import type { CheckoutOrderPayload } from "@/types/checkout";

const sendNewOrderNotificationEmailMock = vi.fn();

vi.mock("@/lib/email", () => ({
  sendNewOrderNotificationEmail: sendNewOrderNotificationEmailMock,
}));

const validOrder: CheckoutOrderPayload = {
  locale: "en",
  currency: "EUR",
  items: [
    {
      productId: "prod_ceramic_slow_feeder",
      name: "Ceramic Sculpted Slow Feeder",
      image: "/images/products/slow-feeder.jpg",
      quantity: 1,
      unitPrice: 34,
      lineTotal: 34,
    },
  ],
  shippingAddress: {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    address: "1 Rue de Test",
    city: "Paris",
    postalCode: "75001",
    country: "France",
  },
  subtotal: 34,
  shipping: 6.9,
  total: 40.9,
};

describe("order notification email route handler", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("@/app/api/email/order-notification/route");

    const response = await POST(
      new Request("http://localhost/api/email/order-notification", {
        method: "POST",
        body: JSON.stringify({
          orderId: "ORDER-123",
          payerEmail: "ada@example.com",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Invalid email payload.",
    });
  });

  it("returns 500 when sending the seller notification fails", async () => {
    sendNewOrderNotificationEmailMock.mockResolvedValue({
      ok: false,
      reason: "resend-not-configured",
    });

    const { POST } = await import("@/app/api/email/order-notification/route");

    const response = await POST(
      new Request("http://localhost/api/email/order-notification", {
        method: "POST",
        body: JSON.stringify({
          orderId: "ORDER-123",
          payerEmail: "ada@example.com",
          paypalOrderId: "PAYPAL-123",
          order: validOrder,
        }),
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      reason: "resend-not-configured",
    });
  });

  it("returns 200 for a valid notification payload", async () => {
    sendNewOrderNotificationEmailMock.mockResolvedValue({ ok: true });

    const { POST } = await import("@/app/api/email/order-notification/route");

    const response = await POST(
      new Request("http://localhost/api/email/order-notification", {
        method: "POST",
        body: JSON.stringify({
          orderId: "ORDER-123",
          payerEmail: "ada@example.com",
          paypalOrderId: "PAYPAL-123",
          order: validOrder,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
    });
    expect(sendNewOrderNotificationEmailMock).toHaveBeenCalledWith({
      orderId: "ORDER-123",
      payerEmail: "ada@example.com",
      paypalOrderId: "PAYPAL-123",
      order: validOrder,
    });
  });
});
