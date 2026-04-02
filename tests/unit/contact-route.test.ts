const sendContactMessageEmailMock = vi.fn();

vi.mock("@/lib/email", () => ({
  sendContactMessageEmail: sendContactMessageEmailMock,
}));

describe("contact route handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({ email: "hello@example.com" }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Missing required fields.",
    });
  });

  it("returns 400 for invalid JSON bodies", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        body: "{not-json",
      })
    );

    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid email addresses", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "invalid-email",
          message: "I need help with my order.",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "Invalid email address.",
    });
  });

  it("returns ok for a valid contact submission", async () => {
    sendContactMessageEmailMock.mockResolvedValue({ ok: true });
    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "hello@example.com",
          message: "I need help with my order.",
          locale: "en",
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
    });
    expect(sendContactMessageEmailMock).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "hello@example.com",
      message: "I need help with my order.",
      locale: "en",
    });
  });

  it("returns 502 when email delivery fails", async () => {
    sendContactMessageEmailMock.mockResolvedValue({
      ok: false,
      reason: "resend-not-configured",
    });
    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "hello@example.com",
          message: "I need help with my order.",
        }),
      })
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      reason: "resend-not-configured",
    });
  });
});
