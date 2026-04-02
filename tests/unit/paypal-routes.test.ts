import type { CheckoutOrderPayload } from "@/types/checkout";

const createPayPalOrderMock = vi.fn();
const capturePayPalOrderMock = vi.fn();
const persistOrderFromServerMock = vi.fn();
const serializeCompletedOrderMock = vi.fn();
const sendOrderConfirmationEmailMock = vi.fn();
const sendNewOrderNotificationEmailMock = vi.fn();
const getUserMock = vi.fn();

vi.mock("@/lib/paypal", () => ({
  createPayPalOrder: createPayPalOrderMock,
  capturePayPalOrder: capturePayPalOrderMock,
}));

vi.mock("@/lib/orders-server", () => ({
  persistOrderFromServer: persistOrderFromServerMock,
  serializeCompletedOrder: serializeCompletedOrderMock,
}));

vi.mock("@/lib/email", () => ({
  sendOrderConfirmationEmail: sendOrderConfirmationEmailMock,
  sendNewOrderNotificationEmail: sendNewOrderNotificationEmailMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: vi.fn(async () => ({
    auth: {
      getUser: getUserMock,
    },
  })),
}));

const validOrder: CheckoutOrderPayload = {
  locale: "en",
  currency: "EUR",
  items: [
    {
      productId: "prod_ceramic_slow_feeder",
      name: "Ceramic Sculpted Slow Feeder",
      image: "/images/slow-feeder.jpg",
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

describe("paypal route handlers", () => {
  const envSnapshot = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...envSnapshot };
    getUserMock.mockResolvedValue({
      data: {
        user: {
          id: "user-1",
        },
      },
      error: null,
    });
  });

  afterAll(() => {
    process.env = envSnapshot;
  });

  it("returns 501 when create-order is called without PayPal credentials", async () => {
    delete process.env.PAYPAL_CLIENT_ID;
    delete process.env.PAYPAL_CLIENT_SECRET;

    const { POST } = await import("@/app/api/paypal/create-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/create-order", {
        method: "POST",
        body: JSON.stringify(validOrder),
      })
    );

    expect(response.status).toBe(501);
  });

  it("returns 400 for an invalid create-order payload", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";

    const { POST } = await import("@/app/api/paypal/create-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/create-order", {
        method: "POST",
        body: JSON.stringify({ items: [] }),
      })
    );

    expect(response.status).toBe(400);
  });

  it("returns 401 when create-order is called without an authenticated user", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { POST } = await import("@/app/api/paypal/create-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/create-order", {
        method: "POST",
        body: JSON.stringify(validOrder),
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Please sign in before paying.",
    });
  });

  it("creates an order for a valid create-order payload", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";
    createPayPalOrderMock.mockResolvedValue({
      id: "PAYPAL-ORDER-1",
      status: "CREATED",
    });

    const { POST } = await import("@/app/api/paypal/create-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/create-order", {
        method: "POST",
        body: JSON.stringify(validOrder),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      orderId: "PAYPAL-ORDER-1",
      status: "CREATED",
    });
    expect(createPayPalOrderMock).toHaveBeenCalledWith(validOrder);
  });

  it("returns 400 when capture-order payload is incomplete", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";

    const { POST } = await import("@/app/api/paypal/capture-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/capture-order", {
        method: "POST",
        body: JSON.stringify({ orderId: "PAYPAL-ORDER-1" }),
      })
    );

    expect(response.status).toBe(400);
  });

  it("returns 401 when capture-order is called without an authenticated user", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { POST } = await import("@/app/api/paypal/capture-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/capture-order", {
        method: "POST",
        body: JSON.stringify({
          orderId: "PAYPAL-ORDER-1",
          order: validOrder,
        }),
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Please sign in before paying.",
    });
  });

  it("captures an order and triggers persistence plus email hooks", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";

    capturePayPalOrderMock.mockResolvedValue({
      id: "CAPTURE-1",
      status: "COMPLETED",
      payer: {
        email_address: "payer@example.com",
      },
    });
    serializeCompletedOrderMock.mockReturnValue({
      id: "CAPTURE-1",
      status: "COMPLETED",
      total: validOrder.total,
      currency: "EUR",
      createdAt: "2026-03-27T00:00:00.000Z",
      payerEmail: "payer@example.com",
      shippingAddress: validOrder.shippingAddress,
      items: validOrder.items,
    });
    persistOrderFromServerMock.mockResolvedValue({ ok: true });
    sendOrderConfirmationEmailMock.mockResolvedValue({ ok: true });
    sendNewOrderNotificationEmailMock.mockResolvedValue({ ok: true });

    const { POST } = await import("@/app/api/paypal/capture-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/capture-order", {
        method: "POST",
        body: JSON.stringify({
          orderId: "PAYPAL-ORDER-1",
          order: validOrder,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      id: "CAPTURE-1",
      status: "COMPLETED",
      payerEmail: "payer@example.com",
      warnings: [],
    });
    expect(capturePayPalOrderMock).toHaveBeenCalledWith("PAYPAL-ORDER-1");
    expect(serializeCompletedOrderMock).toHaveBeenCalled();
    expect(persistOrderFromServerMock).toHaveBeenCalled();
    expect(sendOrderConfirmationEmailMock).toHaveBeenCalled();
    expect(sendNewOrderNotificationEmailMock).toHaveBeenCalled();
  });

  it("returns 502 when order persistence fails after PayPal capture", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";

    capturePayPalOrderMock.mockResolvedValue({
      id: "CAPTURE-2",
      status: "COMPLETED",
      payer: {
        email_address: "payer@example.com",
      },
    });
    serializeCompletedOrderMock.mockReturnValue({
      id: "CAPTURE-2",
      status: "COMPLETED",
      total: validOrder.total,
      currency: "EUR",
      createdAt: "2026-03-27T00:00:00.000Z",
      payerEmail: "payer@example.com",
      shippingAddress: validOrder.shippingAddress,
      items: validOrder.items,
    });
    persistOrderFromServerMock.mockResolvedValue({
      ok: false,
      reason: "guest-or-missing-user",
    });
    const { POST } = await import("@/app/api/paypal/capture-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/capture-order", {
        method: "POST",
        body: JSON.stringify({
          orderId: "PAYPAL-ORDER-1",
          order: validOrder,
        }),
      })
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Payment captured, but order persistence failed: guest-or-missing-user.",
    });
    expect(sendOrderConfirmationEmailMock).not.toHaveBeenCalled();
    expect(sendNewOrderNotificationEmailMock).not.toHaveBeenCalled();
  });

  it("still returns success when confirmation email fails after order persistence", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";

    capturePayPalOrderMock.mockResolvedValue({
      id: "CAPTURE-3",
      status: "COMPLETED",
      payer: {
        email_address: "payer@example.com",
      },
    });
    serializeCompletedOrderMock.mockReturnValue({
      id: "CAPTURE-3",
      status: "COMPLETED",
      total: validOrder.total,
      currency: "EUR",
      createdAt: "2026-03-27T00:00:00.000Z",
      payerEmail: "payer@example.com",
      shippingAddress: validOrder.shippingAddress,
      items: validOrder.items,
    });
    persistOrderFromServerMock.mockResolvedValue({ ok: true });
    sendOrderConfirmationEmailMock.mockResolvedValue({ ok: false, reason: "resend-not-configured" });
    sendNewOrderNotificationEmailMock.mockResolvedValue({ ok: true });

    const { POST } = await import("@/app/api/paypal/capture-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/capture-order", {
        method: "POST",
        body: JSON.stringify({
          orderId: "PAYPAL-ORDER-1",
          order: validOrder,
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      id: "CAPTURE-3",
      status: "COMPLETED",
      warnings: ["confirmation-email-failed:resend-not-configured"],
    });
  });

  it("returns 400 when create-order totals are invalid", async () => {
    process.env.PAYPAL_CLIENT_ID = "client";
    process.env.PAYPAL_CLIENT_SECRET = "secret";

    const { POST } = await import("@/app/api/paypal/create-order/route");
    const response = await POST(
      new Request("http://localhost/api/paypal/create-order", {
        method: "POST",
        body: JSON.stringify({
          ...validOrder,
          subtotal: 30,
          total: 36.9,
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Checkout subtotal does not match line items.",
    });
  });
});
