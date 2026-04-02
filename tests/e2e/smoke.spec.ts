import { expect, test } from "@playwright/test";

const locales = ["en", "de", "fr", "es"] as const;

test.describe("localized storefront smoke", () => {
  for (const locale of locales) {
    test(`loads the ${locale} home page`, async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(page.locator(`[data-locale="${locale}"]`)).toBeVisible();
    });
  }

  test("loads product listing and detail routes", async ({ page }) => {
    await page.goto("/en/products");
    await expect(page.locator('[data-locale="en"]')).toBeVisible();
    await expect(page.getByText("Ceramic Sculpted Slow Feeder")).toBeVisible();

    await page.goto("/en/products/ceramic-sculpted-slow-feeder");
    await expect(
      page.getByRole("heading", { name: "Ceramic Sculpted Slow Feeder" })
    ).toBeVisible();
  });

  test("loads checkout shell", async ({ page }) => {
    await page.goto("/en/checkout");

    await expect(page.locator('[data-locale="en"]')).toBeVisible();
    await expect(page).toHaveURL(/\/en\/checkout$/);
  });

  test("search overlay returns matching products", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page.getByRole("heading", { name: "Search PetQuirky" })).toBeVisible();
    await page.getByPlaceholder("Search products...").fill("fountain");
    await page.waitForTimeout(400);

    await expect(page.getByText("FlowSmart Zen Fountain")).toBeVisible();
  });

  test("opens cookie settings and persists preferences", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      window.dispatchEvent(new Event("petquirky:open-cookie-settings"));
    });
    await expect(page.getByRole("heading", { name: "Cookie Preferences" })).toBeVisible();

    await page.locator('input[type="checkbox"]').nth(1).setChecked(true, { force: true });
    await page.locator('input[type="checkbox"]').nth(2).setChecked(true, { force: true });
    await page.getByRole("button", { name: "Save Preferences" }).click();

    const storedValue = await page.evaluate(() =>
      window.localStorage.getItem("petquirky-gdpr")
    );
    expect(storedValue).toContain('"analytics":true');
    expect(storedValue).toContain('"marketing":true');

    await page.reload();
    await page.getByRole("button", { name: "Cookie Settings" }).click();
    await expect(page.locator('input[type="checkbox"]').nth(1)).toBeChecked();
    await expect(page.locator('input[type="checkbox"]').nth(2)).toBeChecked();
  });

  test("restores cart state from localStorage and opens the cart drawer", async ({ page }) => {
    await page.goto("/en/products/ceramic-sculpted-slow-feeder");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "petquirky-cart",
        JSON.stringify([{ productId: "prod_ceramic_slow_feeder", quantity: 1 }])
      );
    });
    await page.reload();

    await expect(page.getByRole("button", { name: "Cart", exact: true })).toContainText("1");
    await page.getByRole("button", { name: "Cart", exact: true }).click();

    const cartDrawer = page.locator("aside");
    await expect(
      cartDrawer.getByRole("heading", { name: /Your Cart \(1\)/ })
    ).toBeVisible();
    await expect(
      cartDrawer.getByRole("heading", { name: "Ceramic Sculpted Slow Feeder" })
    ).toBeVisible();
  });

  test("restores cart state on the cart page", async ({ page }) => {
    await page.goto("/en/cart");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "petquirky-cart",
        JSON.stringify([{ productId: "prod_ceramic_slow_feeder", quantity: 2 }])
      );
    });
    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Your Cart" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Ceramic Sculpted Slow Feeder" })
    ).toBeVisible();
    await expect(
      page.locator("article").getByText("68.00 €", { exact: true })
    ).toBeVisible();
  });

  test("updates cart quantities, totals, and free shipping state", async ({ page }) => {
    await page.goto("/en/cart");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "petquirky-cart",
        JSON.stringify([{ productId: "prod_ceramic_slow_feeder", quantity: 1 }])
      );
    });
    await page.reload();

    const article = page.locator("article").first();
    const controls = article.getByRole("button");

    await expect(page.getByText("16.00 € away from free shipping!")).toBeVisible();
    await controls.nth(2).click();

    await expect(page.getByText("✓ You've qualified for free shipping!")).toBeVisible();
    await expect(article.getByText("68.00 €", { exact: true })).toBeVisible();
    await expect(page.getByText("FREE", { exact: true })).toBeVisible();
    await expect(page.getByText("68.00 €", { exact: true }).last()).toBeVisible();
  });

  test("removes items from the cart page", async ({ page }) => {
    await page.goto("/en/cart");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "petquirky-cart",
        JSON.stringify([{ productId: "prod_ceramic_slow_feeder", quantity: 1 }])
      );
    });
    await page.reload();

    await page.getByRole("button", { name: "Remove" }).click();

    const emptyState = page.locator("section").filter({ hasText: "Your cart is empty" });
    await expect(emptyState.getByText("Your cart is empty")).toBeVisible();
    await expect(emptyState.getByRole("link", { name: "Continue Shopping" })).toBeVisible();
  });

  test("keeps the login page email-password only", async ({ page }) => {
    await page.goto("/en/auth/login");

    await expect(
      page.getByRole("heading", { name: "Welcome Back" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /apple/i })).toHaveCount(0);
  });

  test("validates the register page before submission", async ({ page }) => {
    await page.goto("/en/auth/register");

    await expect(
      page.getByRole("heading", { name: "Create Your Account" })
    ).toBeVisible();
    await page.getByLabel("Full Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Password", { exact: true }).fill("12345678");
    await page.getByLabel("Confirm Password", { exact: true }).fill("12345678");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(
      page.getByText("Please complete all fields and confirm the terms.")
    ).toBeVisible();
    await expect(page).toHaveURL(/\/en\/auth\/register$/);
  });

  test("shows auth unavailable on forgot-password when Supabase is not configured", async ({
    page,
  }) => {
    await page.goto("/en/auth/forgot-password");

    await expect(
      page.getByRole("heading", { name: "Forgot password?" })
    ).toBeVisible();
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByRole("button", { name: "Send Reset Link" }).click();

    await expect(
      page.getByText("Supabase auth is not configured yet.")
    ).toBeVisible();
  });

  test("validates mismatched passwords on the reset-password page", async ({ page }) => {
    await page.goto("/en/auth/reset-password");

    await expect(
      page.getByRole("heading", { name: "Reset Password" })
    ).toBeVisible();
    await page.getByPlaceholder("Password", { exact: true }).fill("12345678");
    await page.getByPlaceholder("Confirm Password", { exact: true }).fill("87654321");
    await page.getByRole("button", { name: "Update Password" }).click();

    await expect(
      page.getByText("Please complete all fields and confirm the terms.")
    ).toBeVisible();
    await expect(page).toHaveURL(/\/en\/auth\/reset-password$/);
  });

  test("loads blog detail and returns policy pages", async ({ page }) => {
    await page.goto("/en/blog/best-uvb-lights-for-leopard-geckos-2026");
    await expect(
      page.getByRole("heading", { name: "Best UVB Lights for Leopard Geckos in 2026" })
    ).toBeVisible();

    await page.goto("/en/policies/returns");
    await expect(
      page.getByRole("heading", { name: "Shipping and Returns" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "14-Day Returns" })
    ).toBeVisible();
  });

  test("moves checkout from shipping to review with a completed address", async ({ page }) => {
    await page.goto("/en/checkout");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "petquirky-cart",
        JSON.stringify([{ productId: "prod_ceramic_slow_feeder", quantity: 1 }])
      );
    });
    await page.reload();

    await page.locator("label", { hasText: "Full Name" }).locator("input").fill("Ada Lovelace");
    await page
      .locator("label", { hasText: "Email Address" })
      .locator("input")
      .fill("ada@example.com");
    await page
      .locator("label", { hasText: "Street Address" })
      .locator("input")
      .fill("1 Rue de Test");
    await page.locator("label", { hasText: "City" }).locator("input").fill("Paris");
    await page.locator("label", { hasText: "Postal Code" }).locator("input").fill("75001");
    await page.getByRole("button", { name: "Continue to Review" }).click();

    await expect(page).toHaveURL(/step=review/);
    await expect(page.getByRole("heading", { name: "Review Your Order" })).toBeVisible();
    await expect(page.getByText("Ada Lovelace")).toBeVisible();
    await expect(page.getByText("1 Rue de Test")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Order Summary" })).toBeVisible();
  });

  test("shows the PayPal unavailable state on checkout review when no client id is configured", async ({
    page,
  }) => {
    await page.goto("/en/checkout");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "petquirky-cart",
        JSON.stringify([{ productId: "prod_ceramic_slow_feeder", quantity: 1 }])
      );
    });
    await page.reload();

    await page.locator("label", { hasText: "Full Name" }).locator("input").fill("Ada Lovelace");
    await page
      .locator("label", { hasText: "Email Address" })
      .locator("input")
      .fill("ada@example.com");
    await page
      .locator("label", { hasText: "Street Address" })
      .locator("input")
      .fill("1 Rue de Test");
    await page.locator("label", { hasText: "City" }).locator("input").fill("Paris");
    await page.locator("label", { hasText: "Postal Code" }).locator("input").fill("75001");
    await page.getByRole("button", { name: "Continue to Review" }).click();

    await expect(
      page.getByRole("button", { name: "PayPal is currently unavailable" })
    ).toBeDisabled();
    await expect(
      page.getByText("Your payment is processed securely through PayPal")
    ).toBeVisible();
  });

  test("writes order history on success and shows it on the account page", async ({ page }) => {
    const shipping = JSON.stringify({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      address: "1 Rue de Test",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    });

    await page.goto(
      `/en/checkout/success?orderId=ORDER-123&status=COMPLETED&total=68.00&email=ada%40example.com&shipping=${encodeURIComponent(
        shipping
      )}`
    );

    await expect(page.getByRole("heading", { name: "Thank you for your order!" })).toBeVisible();
    await expect(page.getByText("ORDER-123")).toBeVisible();
    await expect(page.getByText("We've sent a confirmation to your email.")).toBeVisible();
    await expect(page.getByText("Create an account to track your order in real time.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Create Account" })).toHaveAttribute(
      "href",
      "/en/auth/register"
    );
    await expect(page.getByRole("link", { name: "Continue Shopping" })).toHaveAttribute(
      "href",
      "/en"
    );

    const storedOrders = await page.evaluate(() => window.localStorage.getItem("petquirky-orders"));
    expect(storedOrders).toContain("ORDER-123");
    const storedCart = await page.evaluate(() => window.localStorage.getItem("petquirky-cart"));
    expect(storedCart).toBe("[]");

    await page.goto("/en/account");
    await expect(page.getByRole("heading", { name: "Your Orders" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/en/account/orders/ORDER-123"
    );
    await expect(page.getByText("68.00 €")).toBeVisible();
  });

  test("shows stored order details on the account order page", async ({ page }) => {
    await page.goto("/en/account/orders/ORDER-123");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "petquirky-orders",
        JSON.stringify([
          {
            id: "ORDER-123",
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
          },
        ])
      );
    });
    await page.reload();

    await expect(page.getByRole("heading", { name: /Order ORDER-123/ })).toBeVisible();
    await expect(page.getByText("68.00 €")).toBeVisible();
    await expect(page.getByText("ada@example.com")).toBeVisible();
    await expect(page.getByText("Ada Lovelace")).toBeVisible();
    await expect(page.getByText("1 Rue de Test")).toBeVisible();
  });

  test("shows an empty state for a missing account order", async ({ page }) => {
    await page.goto("/en/account/orders/MISSING-ORDER");

    await expect(page.getByRole("heading", { name: "Order not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Orders" })).toBeVisible();
  });
});
