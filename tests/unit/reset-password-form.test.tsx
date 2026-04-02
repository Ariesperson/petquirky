/** @vitest-environment jsdom */

import { act, fireEvent, render, screen } from "@testing-library/react";

const pushMock = vi.fn();
const updatePasswordMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a validation error when the passwords do not match", async () => {
    useAuthMock.mockReturnValue({
      configured: true,
      updatePassword: updatePasswordMock,
    });

    const { ResetPasswordForm } = await import("@/components/auth/ResetPasswordForm");

    render(
      <ResetPasswordForm
        locale="en"
        labels={{
          title: "Reset password",
          help: "Choose a new password.",
          password: "New password",
          confirmPassword: "Confirm password",
          submit: "Update password",
          backToLogin: "Back to login",
          invalidPassword: "Passwords must match and meet the minimum length.",
          updated: "Your password has been updated.",
          authUnavailable: "Auth is unavailable.",
        }}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "87654321" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update password" }));

    expect(updatePasswordMock).not.toHaveBeenCalled();
    expect(
      screen.getByText("Passwords must match and meet the minimum length.")
    ).toBeTruthy();
  });

  it("updates the password and redirects back to login", async () => {
    const setTimeoutSpy = vi
      .spyOn(window, "setTimeout")
      .mockImplementation((handler) => {
        if (typeof handler === "function") {
          handler();
        }
        return 0 as ReturnType<typeof window.setTimeout>;
      });
    updatePasswordMock.mockResolvedValue({ error: null });
    useAuthMock.mockReturnValue({
      configured: true,
      updatePassword: updatePasswordMock,
    });

    const { ResetPasswordForm } = await import("@/components/auth/ResetPasswordForm");

    render(
      <ResetPasswordForm
        locale="en"
        labels={{
          title: "Reset password",
          help: "Choose a new password.",
          password: "New password",
          confirmPassword: "Confirm password",
          submit: "Update password",
          backToLogin: "Back to login",
          invalidPassword: "Passwords must match and meet the minimum length.",
          updated: "Your password has been updated.",
          authUnavailable: "Auth is unavailable.",
        }}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "12345678" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Update password" }));
      await Promise.resolve();
    });

    expect(updatePasswordMock).toHaveBeenCalledWith("12345678");
    expect(screen.getByText("Your password has been updated.")).toBeTruthy();
    expect(pushMock).toHaveBeenCalledWith("/en/auth/login");
    setTimeoutSpy.mockRestore();
  });
});
