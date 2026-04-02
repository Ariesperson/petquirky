import {
  readStoredOrders,
  writeStoredOrders,
} from "@/lib/orders";

describe("order history storage helpers", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an empty list when no stored orders exist", () => {
    expect(readStoredOrders()).toEqual([]);
  });

  it("returns an empty list when stored orders are invalid", () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue("{invalid");

    expect(readStoredOrders()).toEqual([]);
  });

  it("writes at most 12 recent orders to localStorage", () => {
    const orders = Array.from({ length: 15 }, (_, index) => ({
      id: `ORDER-${index + 1}`,
      status: "COMPLETED",
      total: 10 + index,
      currency: "EUR" as const,
      createdAt: `2026-03-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
      shippingAddress: {
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        address: "1 Rue de Test",
        city: "Paris",
        postalCode: "75001",
        country: "France",
      },
    }));

    writeStoredOrders(orders);

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    const payload = vi.mocked(window.localStorage.setItem).mock.calls[0]?.[1];
    expect(JSON.parse(payload ?? "[]")).toHaveLength(12);
  });
});
