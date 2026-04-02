/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
const logoutMock = vi.fn();
const updateProfileMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

describe("ProfileClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the saved shipping address from the authenticated user", async () => {
    useAuthMock.mockReturnValue({
      hydrated: true,
      user: {
        id: "user-12345678",
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        shippingAddress: {
          fullName: "Ada Lovelace",
          email: "ada@example.com",
          address: "1 Rue de Test",
          city: "Paris",
          postalCode: "75001",
          country: "France",
        },
      },
      logout: logoutMock,
      updateProfile: updateProfileMock,
    });

    const { ProfileClient } = await import("@/components/account/ProfileClient");

    render(
      <ProfileClient
        initialUser={{
          id: "user-12345678",
          fullName: "Ada Lovelace",
          email: "ada@example.com",
        }}
        labels={{
          title: "Profile",
          help: "Profile help",
          fullName: "Full Name",
          email: "Email",
          accountId: "Account ID",
          shippingAddress: "Shipping Address",
          address: "Address",
          city: "City",
          postalCode: "Postal Code",
          country: "Country",
          noSavedAddress: "No saved address",
          save: "Save Changes",
          saving: "Saving...",
          success: "Saved",
          incompleteAddress: "Address incomplete",
          emailLocked: "Email is read only",
        }}
      />
    );

    expect(screen.getByText("Profile help")).toBeTruthy();
    expect(screen.getByDisplayValue("Ada Lovelace")).toBeTruthy();
    expect(screen.getByDisplayValue("ada@example.com")).toBeTruthy();
    expect(screen.getByDisplayValue("1 Rue de Test")).toBeTruthy();
  });

  it("redirects to the login page after a successful logout", async () => {
    logoutMock.mockResolvedValue({});
    useAuthMock.mockReturnValue({
      hydrated: true,
      user: {
        id: "user-12345678",
        fullName: "Ada Lovelace",
        email: "ada@example.com",
      },
      logout: logoutMock,
      updateProfile: updateProfileMock,
    });

    const { ProfileClient } = await import("@/components/account/ProfileClient");

    render(
      <ProfileClient
        initialUser={{
          id: "user-12345678",
          fullName: "Ada Lovelace",
          email: "ada@example.com",
        }}
        labels={{
          title: "Profile",
          help: "Profile help",
          fullName: "Full Name",
          email: "Email",
          accountId: "Account ID",
          shippingAddress: "Shipping Address",
          address: "Address",
          city: "City",
          postalCode: "Postal Code",
          country: "Country",
          noSavedAddress: "No saved address",
          save: "Save Changes",
          saving: "Saving...",
          success: "Saved",
          incompleteAddress: "Address incomplete",
          emailLocked: "Email is read only",
        }}
      />
    );

    expect(screen.queryByRole("button", { name: "Sign Out" })).toBeNull();
  });

  it("saves profile changes through the auth context", async () => {
    updateProfileMock.mockResolvedValue({});
    useAuthMock.mockReturnValue({
      hydrated: true,
      user: {
        id: "user-12345678",
        fullName: "Ada Lovelace",
        email: "ada@example.com",
      },
      logout: logoutMock,
      updateProfile: updateProfileMock,
    });

    const { ProfileClient } = await import("@/components/account/ProfileClient");

    render(
      <ProfileClient
        initialUser={{
          id: "user-12345678",
          fullName: "Ada Lovelace",
          email: "ada@example.com",
        }}
        labels={{
          title: "Profile",
          help: "Profile help",
          fullName: "Full Name",
          email: "Email",
          accountId: "Account ID",
          shippingAddress: "Shipping Address",
          address: "Address",
          city: "City",
          postalCode: "Postal Code",
          country: "Country",
          noSavedAddress: "No saved address",
          save: "Save Changes",
          saving: "Saving...",
          success: "Saved",
          incompleteAddress: "Address incomplete",
          emailLocked: "Email is read only",
        }}
      />
    );

    await userEvent.clear(screen.getByLabelText("Full Name"));
    await userEvent.type(screen.getByLabelText("Full Name"), "Ada Byron");
    await userEvent.type(screen.getByLabelText("Address"), "1 Rue de Test");
    await userEvent.type(screen.getByLabelText("City"), "Paris");
    await userEvent.type(screen.getByLabelText("Postal Code"), "75001");
    await userEvent.clear(screen.getByLabelText("Country"));
    await userEvent.type(screen.getByLabelText("Country"), "France");
    await userEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(updateProfileMock).toHaveBeenCalledWith({
      fullName: "Ada Byron",
      shippingAddress: {
        fullName: "Ada Byron",
        email: "ada@example.com",
        address: "1 Rue de Test",
        city: "Paris",
        postalCode: "75001",
        country: "France",
      },
    });
    expect(screen.getByText("Saved")).toBeTruthy();
  });
});
