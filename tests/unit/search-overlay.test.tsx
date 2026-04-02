/** @vitest-environment jsdom */

import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

const searchProductsMock = vi.fn();

vi.mock("@/lib/search", () => ({
  searchProducts: (...args: unknown[]) => searchProductsMock(...args),
}));

describe("SearchOverlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the empty state when no products match", async () => {
    searchProductsMock.mockReturnValue([]);
    const onClose = vi.fn();
    const { SearchOverlay } = await import("@/components/layout/SearchOverlay");

    render(
      <SearchOverlay
        locale="en"
        onClose={onClose}
        labels={{
          title: "Search PetQuirky",
          placeholder: "Search products...",
          empty: "No matching products yet. Try another keyword.",
          close: "Close menu",
        }}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search products..."), {
      target: { value: "unknown" },
    });
    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    expect(screen.getByText("No matching products yet. Try another keyword.")).toBeTruthy();
  });

  it("closes when the user presses Escape", async () => {
    searchProductsMock.mockReturnValue([]);
    const onClose = vi.fn();
    const { SearchOverlay } = await import("@/components/layout/SearchOverlay");

    render(
      <SearchOverlay
        locale="en"
        onClose={onClose}
        labels={{
          title: "Search PetQuirky",
          placeholder: "Search products...",
          empty: "No matching products yet. Try another keyword.",
          close: "Close menu",
        }}
      />
    );

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes after the user clicks a search result", async () => {
    searchProductsMock.mockReturnValue([
      {
        id: "cat-bowl",
        slug: "cat-bowl",
        image: "/images/cat-bowl.jpg",
        name: "Cat Bowl",
        description: "Dishwasher safe bowl",
        price: "18,00 €",
      },
    ]);
    const onClose = vi.fn();
    const { SearchOverlay } = await import("@/components/layout/SearchOverlay");

    render(
      <SearchOverlay
        locale="en"
        onClose={onClose}
        labels={{
          title: "Search PetQuirky",
          placeholder: "Search products...",
          empty: "No matching products yet. Try another keyword.",
          close: "Close menu",
        }}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search products..."), {
      target: { value: "cat" },
    });
    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    fireEvent.click(screen.getByRole("link", { name: /Cat Bowl/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
