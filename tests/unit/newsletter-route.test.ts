const subscribeToNewsletterMock = vi.fn();
const sendNewsletterSignupEmailMock = vi.fn();

vi.mock("@/lib/newsletter", () => ({
  subscribeToNewsletter: (...args: unknown[]) => subscribeToNewsletterMock(...args),
}));

vi.mock("@/lib/email", () => ({
  sendNewsletterSignupEmail: (...args: unknown[]) => sendNewsletterSignupEmailMock(...args),
}));

describe("newsletter route handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when the email is missing", async () => {
    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ locale: "en" }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Missing email address.",
    });
  });

  it("returns 400 for invalid email addresses", async () => {
    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: "invalid-email" }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Invalid email address.",
    });
  });

  it("stores new subscribers and triggers seller notification", async () => {
    subscribeToNewsletterMock.mockResolvedValue({
      ok: true,
      created: true,
      email: "ada@example.com",
    });
    sendNewsletterSignupEmailMock.mockResolvedValue({ ok: true });

    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        body: JSON.stringify({
          email: "ada@example.com",
          locale: "en",
          source: "homepage",
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      created: true,
    });
    expect(subscribeToNewsletterMock).toHaveBeenCalledWith({
      email: "ada@example.com",
      locale: "en",
      source: "homepage",
    });
    expect(sendNewsletterSignupEmailMock).toHaveBeenCalledWith({
      email: "ada@example.com",
      locale: "en",
      source: "homepage",
    });
  });

  it("returns ok for duplicate subscriptions without sending another notification", async () => {
    subscribeToNewsletterMock.mockResolvedValue({
      ok: true,
      created: false,
      email: "ada@example.com",
    });

    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        body: JSON.stringify({
          email: "ada@example.com",
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      created: false,
    });
    expect(sendNewsletterSignupEmailMock).not.toHaveBeenCalled();
  });

  it("returns 502 when the subscription write fails", async () => {
    subscribeToNewsletterMock.mockResolvedValue({
      ok: false,
      reason: "supabase-not-configured",
    });

    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        body: JSON.stringify({
          email: "ada@example.com",
        }),
      })
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "supabase-not-configured",
    });
  });
});
