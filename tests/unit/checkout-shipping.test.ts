import {
  buildCheckoutOrderPayload,
  emptyCheckoutAddress,
  hasMeaningfulCheckoutAddressValue,
  isCheckoutAddressComplete,
  readStoredCheckoutAddress,
  serializeOrderHistoryEntry,
  validateCheckoutOrderPayload,
} from "@/lib/checkout";
import { calculateShipping, getFreeShippingThreshold } from "@/lib/shipping";

describe("checkout and shipping rules", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("applies free shipping at 50 EUR and above", () => {
    expect(getFreeShippingThreshold()).toBe(50);
    expect(calculateShipping(49.99)).toBe(6.9);
    expect(calculateShipping(50)).toBe(0);
  });

  it("treats an empty address as incomplete", () => {
    expect(isCheckoutAddressComplete(emptyCheckoutAddress())).toBe(false);
  });

  it("does not treat the default country alone as meaningful checkout input", () => {
    expect(hasMeaningfulCheckoutAddressValue(emptyCheckoutAddress())).toBe(false);
    expect(
      hasMeaningfulCheckoutAddressValue({
        ...emptyCheckoutAddress(),
        fullName: "Ada Lovelace",
      })
    ).toBe(true);
  });

  it("builds checkout payloads in EUR", () => {
    const shippingAddress = {
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      address: "1 Rue de Test",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    };

    expect(isCheckoutAddressComplete(shippingAddress)).toBe(true);

    const payload = buildCheckoutOrderPayload({
      locale: "en",
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
      shippingAddress,
      subtotal: 34,
      shipping: 6.9,
      total: 40.9,
    });

    expect(payload.currency).toBe("EUR");
    expect(payload.shippingAddress.fullName).toBe("Ada Lovelace");
  });

  it("serializes order history entries with EUR currency", () => {
    const order = serializeOrderHistoryEntry({
      id: "ORDER-1",
      status: "COMPLETED",
      total: 89,
      payerEmail: "buyer@example.com",
      shippingAddress: {
        fullName: "Buyer",
        email: "buyer@example.com",
        address: "1 Test Way",
        city: "Paris",
        postalCode: "75001",
        country: "France",
      },
    });

    expect(order.currency).toBe("EUR");
    expect(order.createdAt).toBeTruthy();
  });

  it("reads a stored checkout address from localStorage", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: vi.fn().mockReturnValue(
          JSON.stringify({
            fullName: "Ada Lovelace",
            email: "ada@example.com",
            address: "1 Rue de Test",
            city: "Paris",
            postalCode: "75001",
            country: "France",
          })
        ),
      },
    });

    expect(readStoredCheckoutAddress()).toEqual({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      address: "1 Rue de Test",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    });
  });

  it("validates checkout totals against line items and shipping rules", () => {
    expect(
      validateCheckoutOrderPayload({
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
      })
    ).toEqual({ ok: true });
  });

  it("rejects checkout totals when subtotal is tampered with", () => {
    expect(
      validateCheckoutOrderPayload({
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
        subtotal: 30,
        shipping: 6.9,
        total: 36.9,
      })
    ).toEqual({
      ok: false,
      reason: "Checkout subtotal does not match line items.",
    });
  });
});
