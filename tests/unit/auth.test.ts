import { mapSupabaseUser, isStrongEnoughPassword, isSupabaseConfigured, isValidEmail } from "@/lib/auth";

describe("auth helpers", () => {
  const envSnapshot = { ...process.env };

  beforeEach(() => {
    process.env = { ...envSnapshot };
  });

  afterAll(() => {
    process.env = envSnapshot;
  });

  it("validates email format", () => {
    expect(isValidEmail("hello@petquirky.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
  });

  it("requires passwords to be at least 8 characters", () => {
    expect(isStrongEnoughPassword("1234567")).toBe(false);
    expect(isStrongEnoughPassword("12345678")).toBe(true);
  });

  it("detects whether public Supabase env vars are configured", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(isSupabaseConfigured()).toBe(false);

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://demo.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("maps a Supabase user and falls back to the email prefix for full name", () => {
    expect(
      mapSupabaseUser({
        id: "user-1",
        email: "alex@example.com",
        user_metadata: {},
      } as never)
    ).toMatchObject({
      id: "user-1",
      email: "alex@example.com",
      fullName: "alex",
    });
  });

  it("uses full_name metadata when available", () => {
    expect(
      mapSupabaseUser({
        id: "user-2",
        email: "sam@example.com",
        user_metadata: {
          full_name: "Sam Rivera",
        },
      } as never)
    ).toMatchObject({
      fullName: "Sam Rivera",
    });
  });

  it("maps shipping address metadata when available", () => {
    expect(
      mapSupabaseUser({
        id: "user-3",
        email: "sam@example.com",
        user_metadata: {
          full_name: "Sam Rivera",
          shipping_address: {
            fullName: "Sam Rivera",
            email: "sam@example.com",
            address: "1 Rue de Test",
            city: "Paris",
            postalCode: "75001",
            country: "France",
          },
        },
      } as never)
    ).toMatchObject({
      shippingAddress: {
        fullName: "Sam Rivera",
        email: "sam@example.com",
        address: "1 Rue de Test",
        city: "Paris",
        postalCode: "75001",
        country: "France",
      },
    });
  });
});
