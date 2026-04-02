/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const requestPasswordResetMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an auth unavailable message when Supabase auth is not configured", async () => {
    useAuthMock.mockReturnValue({
      configured: false,
      requestPasswordReset: requestPasswordResetMock,
    });

    const { ForgotPasswordForm } = await import("@/components/auth/ForgotPasswordForm");

    render(
      <ForgotPasswordForm
        locale="en"
        labels={{
          title: "Forgot password",
          help: "We will send a reset link.",
          email: "Email",
          submit: "Send reset link",
          backToLogin: "Back to login",
          invalidEmail: "Please enter a valid email address.",
          resetSent: "Check your inbox for the reset link.",
          authUnavailable: "Auth is unavailable.",
        }}
      />
    );

    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(requestPasswordResetMock).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("Auth is unavailable.")).toBeTruthy();
    });
  });

  it("submits a valid email with the locale reset redirect", async () => {
    requestPasswordResetMock.mockResolvedValue({ error: null });
    useAuthMock.mockReturnValue({
      configured: true,
      requestPasswordReset: requestPasswordResetMock,
    });

    const { ForgotPasswordForm } = await import("@/components/auth/ForgotPasswordForm");

    render(
      <ForgotPasswordForm
        locale="en"
        labels={{
          title: "Forgot password",
          help: "We will send a reset link.",
          email: "Email",
          submit: "Send reset link",
          backToLogin: "Back to login",
          invalidEmail: "Please enter a valid email address.",
          resetSent: "Check your inbox for the reset link.",
          authUnavailable: "Auth is unavailable.",
        }}
      />
    );

    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Send reset link" }));

    await waitFor(() => {
      expect(requestPasswordResetMock).toHaveBeenCalledWith({
        email: "ada@example.com",
        redirectTo: "http://localhost:3000/en/auth/confirm?next=/en/auth/reset-password",
      });
    });
    expect(screen.getByText("Check your inbox for the reset link.")).toBeTruthy();
  });
});
