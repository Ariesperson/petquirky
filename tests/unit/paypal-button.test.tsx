/** @vitest-environment jsdom */

import { act, render, screen, waitFor } from "@testing-library/react";

const pushMock = vi.fn();
const payPalButtonsMock = vi.fn();
let paypalButtonProps:
  | {
      createOrder?: () => Promise<string>;
      onApprove?: (data: { orderID: string }) => Promise<void>;
      onError?: () => void;
    }
  | null = null;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@paypal/react-paypal-js", () => ({
  PayPalButtons: (props: typeof paypalButtonProps) => {
    paypalButtonProps = props;
    payPalButtonsMock(props);
    return <div data-testid="paypal-buttons" />;
  },
  PayPalScriptProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("PayPalButton", () => {
  const envSnapshot = { ...process.env };
  const fetchSnapshot = global.fetch;

  const orderPayload = {
    locale: "en" as const,
    currency: "EUR" as const,
    items: [],
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

  const labels = {
    paypal: "Pay with PayPal",
    card: "Pay with Debit or Credit Card",
    secure: "Your payment is processed securely through PayPal",
    unavailable: "PayPal is currently unavailable",
    error: "We could not start your PayPal payment. Please try again.",
    processing: "Complete shipping details before continuing to payment.",
    loginRequired: "Sign in to sync your orders across devices.",
    login: "Log In",
  };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...envSnapshot };
    delete process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    global.fetch = fetchSnapshot;
    paypalButtonProps = null;
    vi.clearAllMocks();
  });

  afterAll(() => {
    process.env = envSnapshot;
    global.fetch = fetchSnapshot;
  });

  it("shows the unavailable state when the public PayPal client id is missing", async () => {
    const { PayPalButton } = await import("@/components/checkout/PayPalButton");

    render(
      <PayPalButton
        locale="en"
        disabled
        loginHref="/en/auth/login"
        orderPayload={orderPayload}
        labels={labels}
      />
    );

    expect(
      screen.getByRole("button", { name: "PayPal is currently unavailable" })
    ).toHaveProperty("disabled", true);
    expect(
      screen.getByText("Complete shipping details before continuing to payment.")
    ).toBeTruthy();
  });

  it("shows a login link when payment is blocked for signed-out users", async () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = "demo-client-id";

    const { PayPalButton } = await import("@/components/checkout/PayPalButton");

    render(
      <PayPalButton
        locale="en"
        disabled
        loginHref="/en/auth/login"
        orderPayload={orderPayload}
        labels={labels}
      />
    );

    expect(
      screen.getByRole("link", {
        name: "Sign in to sync your orders across devices. Log In",
      }).getAttribute("href")
    ).toBe("/en/auth/login");
  });

  it("shows the inline error when createOrder fails", async () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = "demo-client-id";
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "PayPal create-order failed." }),
    } as Response);

    const { PayPalButton } = await import("@/components/checkout/PayPalButton");

    render(
      <PayPalButton
        locale="en"
        orderPayload={orderPayload}
        labels={labels}
      />
    );

    await expect(screen.findByTestId("paypal-buttons")).resolves.toBeTruthy();
    await expect(payPalButtonsMock).toHaveBeenCalled();

    await act(async () => {
      await expect(paypalButtonProps?.createOrder?.()).rejects.toThrow(
        "PayPal create-order failed."
      );
    });

    expect(screen.getByText(labels.card)).toBeTruthy();
  });

  it("shows the inline error when capture-order fails after approval", async () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = "demo-client-id";
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "PayPal capture failed." }),
    } as Response);

    const { PayPalButton } = await import("@/components/checkout/PayPalButton");

    render(
      <PayPalButton
        locale="en"
        orderPayload={orderPayload}
        labels={labels}
      />
    );

    await act(async () => {
      await paypalButtonProps?.onApprove?.({ orderID: "ORDER-123" });
    });

    await waitFor(() => {
      expect(screen.getByText("PayPal capture failed.")).toBeTruthy();
    });
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("redirects to success even when capture succeeds with warnings", async () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = "demo-client-id";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "CAPTURE-123",
        status: "COMPLETED",
        payerEmail: "payer@example.com",
        warnings: ["confirmation-email-failed:resend-not-configured"],
      }),
    } as Response);

    const { PayPalButton } = await import("@/components/checkout/PayPalButton");

    render(<PayPalButton locale="en" orderPayload={orderPayload} labels={labels} />);

    await act(async () => {
      await paypalButtonProps?.onApprove?.({ orderID: "ORDER-123" });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1);
    });
    expect(pushMock.mock.calls[0]?.[0]).toContain("/en/checkout/success?");
    expect(pushMock.mock.calls[0]?.[0]).toContain("orderId=CAPTURE-123");
    expect(pushMock.mock.calls[0]?.[0]).toContain("warnings=");
  });

  it("shows the generic inline error when PayPal triggers onError", async () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = "demo-client-id";

    const { PayPalButton } = await import("@/components/checkout/PayPalButton");

    render(
      <PayPalButton
        locale="en"
        orderPayload={orderPayload}
        labels={labels}
      />
    );

    act(() => {
      paypalButtonProps?.onError?.();
    });

    expect(screen.getByText(labels.error)).toBeTruthy();
  });
});
