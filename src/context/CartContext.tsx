"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { calculateShipping } from "@/lib/shipping";
import { getAllProducts, type ProductListingItem } from "@/lib/products";
import type { CartEntry } from "@/types/cart";

const STORAGE_KEY = "petquirky-cart";

type CartLineItem = {
  product: ProductListingItem;
  quantity: number;
  lineTotal: number;
};

type CartContextValue = {
  hydrated: boolean;
  items: CartEntry[];
  lineItems: CartLineItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  isDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCartEntries(): CartEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as CartEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>(() => readCartEntries());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const allProducts = useMemo(() => getAllProducts(), []);

  const lineItems = useMemo(() => {
    return items
      .map((entry) => {
        const product = allProducts.find((candidate) => candidate.id === entry.productId);
        if (!product) {
          return null;
        }

        return {
          product,
          quantity: entry.quantity,
          lineTotal: product.price.amount * entry.quantity,
        };
      })
      .filter((entry): entry is CartLineItem => entry !== null);
  }, [allProducts, items]);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [lineItems]
  );
  const shipping = useMemo(() => calculateShipping(subtotal), [subtotal]);
  const total = subtotal + shipping;
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      hydrated,
      items,
      lineItems,
      itemCount,
      subtotal,
      shipping,
      total,
      isDrawerOpen,
      openCart: () => setIsDrawerOpen(true),
      closeCart: () => setIsDrawerOpen(false),
      addItem: (productId, quantity = 1) => {
        setItems((current) => {
          const existing = current.find((item) => item.productId === productId);
          if (existing) {
            return current.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }

          return [...current, { productId, quantity }];
        });
        setIsDrawerOpen(true);
      },
      updateQuantity: (productId, quantity) => {
        setItems((current) =>
          current
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (productId) => {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      clearCart: () => {
        setItems([]);
      },
    }),
    [hydrated, items, itemCount, lineItems, shipping, subtotal, total, isDrawerOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }

  return context;
}
