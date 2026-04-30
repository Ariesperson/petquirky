/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
const registerMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks submission when the form is incomplete", async () => {
    useAuthMock.mockReturnValue({
      configured: true,
      register: registerMock,
    });

    const { RegisterForm } = await import("@/components/auth/RegisterForm");

    render(
      <RegisterForm
        locale="en"
        returnTo="/en/account"
        labels={{
          title: "Create account",
          subtitle: "Join PetQuirky",
          fullName: "Full name",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm password",
          passwordHint: "Use at least 8 characters.",
          submit: "Create account",
          alreadyHaveAccount: "Already have an account?",
          login: "Log in",
          privacyPrefix: "I agree to the",
          privacy: "Privacy Policy",
          terms: "Terms of Service",
          missingFields: "Please complete all required fields.",
          passwordTooShort: "Password must be at least 8 characters long.",
          passwordsDoNotMatch: "Passwords do not match.",
          acceptTermsRequired: "Please accept the Privacy Policy and Terms of Service.",
          authUnavailable: "Supabase auth is not configured yet.",
          confirmationSent: "Please confirm your email.",
        }}
      />
    );

    await userEvent.type(screen.getByLabelText("Full name"), "Ada Lovelace");
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(registerMock).not.toHaveBeenCalled();
    expect(screen.getByText("Please complete all required fields.")).toBeTruthy();
  });

  it("shows a specific error when the password is too short", async () => {
    useAuthMock.mockReturnValue({
      configured: true,
      register: registerMock,
    });

    const { RegisterForm } = await import("@/components/auth/RegisterForm");

    render(
      <RegisterForm
        locale="en"
        returnTo="/en/account"
        labels={{
          title: "Create account",
          subtitle: "Join PetQuirky",
          fullName: "Full name",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm password",
          passwordHint: "Use at least 8 characters.",
          submit: "Create account",
          alreadyHaveAccount: "Already have an account?",
          login: "Log in",
          privacyPrefix: "I agree to the",
          privacy: "Privacy Policy",
          terms: "Terms of Service",
          missingFields: "Please complete all required fields.",
          passwordTooShort: "Password must be at least 8 characters long.",
          passwordsDoNotMatch: "Passwords do not match.",
          acceptTermsRequired: "Please accept the Privacy Policy and Terms of Service.",
          authUnavailable: "Supabase auth is not configured yet.",
          confirmationSent: "Please confirm your email.",
        }}
      />
    );

    await userEvent.type(screen.getByLabelText("Full name"), "Ada Lovelace");
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "123456");
    await userEvent.type(screen.getByLabelText("Confirm password"), "123456");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(registerMock).not.toHaveBeenCalled();
    expect(screen.getByText("Password must be at least 8 characters long.")).toBeTruthy();
  });

  it("submits valid data and redirects to account", async () => {
    registerMock.mockResolvedValue({ error: null });
    useAuthMock.mockReturnValue({
      configured: true,
      register: registerMock,
    });

    const { RegisterForm } = await import("@/components/auth/RegisterForm");

    render(
      <RegisterForm
        locale="en"
        returnTo="/en/checkout?step=review"
        labels={{
          title: "Create account",
          subtitle: "Join PetQuirky",
          fullName: "Full name",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm password",
          passwordHint: "Use at least 8 characters.",
          submit: "Create account",
          alreadyHaveAccount: "Already have an account?",
          login: "Log in",
          privacyPrefix: "I agree to the",
          privacy: "Privacy Policy",
          terms: "Terms of Service",
          missingFields: "Please complete all required fields.",
          passwordTooShort: "Password must be at least 8 characters long.",
          passwordsDoNotMatch: "Passwords do not match.",
          acceptTermsRequired: "Please accept the Privacy Policy and Terms of Service.",
          authUnavailable: "Supabase auth is not configured yet.",
          confirmationSent: "Please confirm your email.",
        }}
      />
    );

    await userEvent.type(screen.getByLabelText("Full name"), "Ada Lovelace");
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "12345678");
    await userEvent.type(screen.getByLabelText("Confirm password"), "12345678");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(registerMock).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "12345678",
      fullName: "Ada Lovelace",
      emailRedirectTo:
        "http://localhost:3000/en/auth/confirm?next=%2Fen%2Fcheckout%3Fstep%3Dreview",
    });
    expect(pushMock).toHaveBeenCalledWith("/en/checkout?step=review");
  });
});
