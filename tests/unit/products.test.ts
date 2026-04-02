import {
  filterProducts,
  formatPrice,
  getAllProducts,
  getProductBySlug,
} from "@/lib/products";

describe("product catalog rules", () => {
  it("uses only approved product badges", () => {
    const allowedBadges = new Set(["new", "bestseller", "sale", undefined]);

    getAllProducts().forEach((product) => {
      expect(allowedBadges.has(product.badge)).toBe(true);
    });
  });

  it("filters products by category", () => {
    const feedingProducts = filterProducts("en", { category: "feeding" });

    expect(feedingProducts.length).toBeGreaterThan(0);
    expect(feedingProducts.every((product) => product.category === "feeding")).toBe(true);
  });

  it("filters products by pet type and query", () => {
    const results = filterProducts("en", {
      petType: "dog",
      query: "rope",
    });

    expect(results.map((product) => product.slug)).toContain("eco-knot-durable-tug-toy");
    expect(results.every((product) => product.petType.includes("dog"))).toBe(true);
  });

  it("sorts products by price ascending", () => {
    const results = filterProducts("en", { sort: "price-low-high" });
    const prices = results.map((product) => product.price.amount);

    expect(prices).toEqual([...prices].sort((left, right) => left - right));
  });

  it("formats EU-facing prices with the euro sign after the amount", () => {
    expect(formatPrice(45, "fr")).toBe("45,00 €");
  });

  it("finds product details by slug", () => {
    const product = getProductBySlug("ceramic-sculpted-slow-feeder");

    expect(product?.id).toBe("prod_ceramic_slow_feeder");
  });
});
