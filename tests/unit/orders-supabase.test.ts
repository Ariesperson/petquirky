const getSupabaseBrowserClientMock = vi.fn();
const isSupabaseConfiguredMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: getSupabaseBrowserClientMock,
}));

vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth")>("@/lib/auth");
  return {
    ...actual,
    isSupabaseConfigured: isSupabaseConfiguredMock,
  };
});

describe("orders supabase integration helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("does not persist when user id or Supabase config is missing", async () => {
    isSupabaseConfiguredMock.mockReturnValue(false);
    const { persistOrderToSupabase } = await import("@/lib/orders");

    await expect(
      persistOrderToSupabase({
        id: "ORDER-1",
        status: "COMPLETED",
        total: 68,
        currency: "EUR",
        createdAt: "2026-03-27T00:00:00.000Z",
        shippingAddress: {
          fullName: "Ada Lovelace",
          email: "ada@example.com",
          address: "1 Rue de Test",
          city: "Paris",
          postalCode: "75001",
          country: "France",
        },
      })
    ).resolves.toEqual({ ok: false, reason: "not-configured" });
  });

  it("persists orders through the browser client when configured", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    isSupabaseConfiguredMock.mockReturnValue(true);
    getSupabaseBrowserClientMock.mockReturnValue({
      from: vi.fn().mockReturnValue({
        upsert,
      }),
    });

    const { persistOrderToSupabase } = await import("@/lib/orders");

    await expect(
      persistOrderToSupabase({
        id: "ORDER-2",
        userId: "user-1",
        status: "COMPLETED",
        total: 68,
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
      })
    ).resolves.toEqual({ ok: true });

    expect(upsert).toHaveBeenCalledTimes(1);
  });

  it("maps Supabase rows back into checkout orders", async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          id: "ORDER-3",
          user_id: "user-1",
          status: "COMPLETED",
          total: 89,
          currency: "EUR",
          created_at: "2026-03-27T00:00:00.000Z",
          payer_email: "ada@example.com",
          shipping_address: {
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
      ],
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });

    isSupabaseConfiguredMock.mockReturnValue(true);
    getSupabaseBrowserClientMock.mockReturnValue({
      from: vi.fn().mockReturnValue({
        select,
      }),
    });

    const { listOrdersFromSupabase } = await import("@/lib/orders");

    await expect(listOrdersFromSupabase("user-1")).resolves.toEqual([
      {
        id: "ORDER-3",
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
    ]);
  });
});
