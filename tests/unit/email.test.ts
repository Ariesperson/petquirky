import type { CheckoutOrderPayload } from "@/types/checkout";

const sendMock = vi.fn();

vi.mock("server-only", () => ({}));

vi.mock("resend", () => ({
  Resend: function Resend() {
    return {
      emails: {
        send: sendMock,
      },
    };
  },
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

describe("email helpers", () => {
  const envSnapshot = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...envSnapshot };
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.SELLER_EMAIL;
  });

  afterAll(() => {
    process.env = envSnapshot;
  });

  it("returns a not-configured result when Resend is unavailable", async () => {
    const { sendOrderConfirmationEmail } = await import("@/lib/email");

    await expect(
      sendOrderConfirmationEmail({
        orderId: "ORDER-123",
        order: validOrder,
        payerEmail: "ada@example.com",
      })
    ).resolves.toEqual({ ok: false, reason: "resend-not-configured" });
  });

  it("sends the customer confirmation email with the expected subject and recipient", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.RESEND_FROM_EMAIL = "PetQuirky <orders@petquirky.com>";
    sendMock.mockResolvedValue({ error: null });

    const { sendOrderConfirmationEmail } = await import("@/lib/email");

    await expect(
      sendOrderConfirmationEmail({
        orderId: "ORDER-123",
        order: validOrder,
        payerEmail: "ada@example.com",
      })
    ).resolves.toEqual({ ok: true });

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "PetQuirky <orders@petquirky.com>",
        to: "ada@example.com",
        subject: "Your PetQuirky Order #ORDER-123 is Confirmed!",
        html: expect.stringContaining("Thank you for your order!"),
        text: expect.stringContaining("Thank you for your order! #ORDER-123"),
      })
    );
  });

  it("sends the seller notification email with the expected subject and recipient", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.SELLER_EMAIL = "seller@petquirky.com";
    sendMock.mockResolvedValue({ error: null });

    const { sendNewOrderNotificationEmail } = await import("@/lib/email");

    await expect(
      sendNewOrderNotificationEmail({
        orderId: "ORDER-123",
        order: validOrder,
        payerEmail: "ada@example.com",
        paypalOrderId: "PAYPAL-123",
      })
    ).resolves.toEqual({ ok: true });

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "PetQuirky <onboarding@resend.dev>",
        to: "seller@petquirky.com",
        subject: "New Order #ORDER-123 — 40.90 €",
        text: expect.stringContaining("New Order #ORDER-123"),
      })
    );
  });

  it("returns the Resend error message when sending fails", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    sendMock.mockResolvedValue({
      error: {
        message: "Resend rejected the request.",
      },
    });

    const { sendNewOrderNotificationEmail } = await import("@/lib/email");

    await expect(
      sendNewOrderNotificationEmail({
        orderId: "ORDER-123",
        order: validOrder,
        payerEmail: "ada@example.com",
        paypalOrderId: "PAYPAL-123",
      })
    ).resolves.toEqual({ ok: false, reason: "Resend rejected the request." });
  });
});
