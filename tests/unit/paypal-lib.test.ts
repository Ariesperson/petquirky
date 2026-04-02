vi.mock("server-only", () => ({}));

import { getPayPalCountryCode } from "@/lib/paypal";

describe("paypal helpers", () => {
  it("maps supported checkout countries to PayPal country codes", () => {
    expect(getPayPalCountryCode("France")).toBe("FR");
    expect(getPayPalCountryCode("Germany")).toBe("DE");
    expect(getPayPalCountryCode("Italy")).toBe("IT");
    expect(getPayPalCountryCode("Spain")).toBe("ES");
    expect(getPayPalCountryCode("Netherlands")).toBe("NL");
  });

  it("throws for unsupported countries", () => {
    expect(() => getPayPalCountryCode("Belgium")).toThrow(
      "Unsupported shipping country: Belgium."
    );
  });
});
