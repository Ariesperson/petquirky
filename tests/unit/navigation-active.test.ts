import { isNavItemActive } from "@/lib/utils";

describe("isNavItemActive", () => {
  it("keeps the home tab inactive on nested routes", () => {
    expect(isNavItemActive("/en/products", "/en")).toBe(false);
  });

  it("marks the exact home route as active", () => {
    expect(isNavItemActive("/en", "/en")).toBe(true);
  });

  it("keeps section tabs active for their nested routes", () => {
    expect(isNavItemActive("/en/products/cat-bowl", "/en/products")).toBe(true);
  });
});
