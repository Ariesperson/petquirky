import type {
  CheckoutAddress,
  CheckoutItemPayload,
  CheckoutOrderPayload,
  CompletedCheckoutOrder,
} from "@/types/checkout";
import { calculateShipping } from "@/lib/shipping";

export const CHECKOUT_ADDRESS_STORAGE_KEY = "petquirky-checkout-address";
export const ORDER_HISTORY_STORAGE_KEY = "petquirky-orders";

export function emptyCheckoutAddress(): CheckoutAddress {
  return {
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  };
}

export function hasMeaningfulCheckoutAddressValue(address: CheckoutAddress) {
  return [
    address.fullName,
    address.email,
    address.address,
    address.city,
    address.postalCode,
  ].some((value) => value.trim().length > 0);
}

export function readStoredCheckoutAddress() {
  if (typeof window === "undefined") {
    return null as CheckoutAddress | null;
  }

  const rawValue = window.localStorage.getItem(CHECKOUT_ADDRESS_STORAGE_KEY);
  if (!rawValue) {
    return null as CheckoutAddress | null;
  }

  try {
    const parsed = JSON.parse(rawValue) as CheckoutAddress;
    if (
      typeof parsed.fullName === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.address === "string" &&
      typeof parsed.city === "string" &&
      typeof parsed.postalCode === "string" &&
      typeof parsed.country === "string"
    ) {
      return parsed;
    }
  } catch {}

  return null as CheckoutAddress | null;
}

export function isCheckoutAddressComplete(address: CheckoutAddress) {
  return Object.values(address).every((value) => value.trim().length > 0);
}

export function buildCheckoutOrderPayload(input: {
  locale: string;
  items: CheckoutItemPayload[];
  shippingAddress: CheckoutAddress;
  subtotal: number;
  shipping: number;
  total: number;
}): CheckoutOrderPayload {
  return {
    ...input,
    currency: "EUR",
  };
}

function isCloseToCurrencyAmount(left: number, right: number) {
  return Math.abs(left - right) < 0.01;
}

export function validateCheckoutOrderPayload(order: CheckoutOrderPayload) {
  if (!Array.isArray(order.items) || order.items.length === 0) {
    return { ok: false as const, reason: "Checkout payload must include at least one item." };
  }

  const subtotal = order.items.reduce((sum, item) => {
    if (item.quantity <= 0 || item.unitPrice < 0 || item.lineTotal < 0) {
      return Number.NaN;
    }

    if (!isCloseToCurrencyAmount(item.unitPrice * item.quantity, item.lineTotal)) {
      return Number.NaN;
    }

    return sum + item.lineTotal;
  }, 0);

  if (!Number.isFinite(subtotal)) {
    return { ok: false as const, reason: "Checkout item pricing is invalid." };
  }

  if (!isCloseToCurrencyAmount(subtotal, order.subtotal)) {
    return { ok: false as const, reason: "Checkout subtotal does not match line items." };
  }

  const expectedShipping = calculateShipping(order.subtotal);
  if (!isCloseToCurrencyAmount(expectedShipping, order.shipping)) {
    return { ok: false as const, reason: "Checkout shipping amount is invalid." };
  }

  if (!isCloseToCurrencyAmount(order.subtotal + order.shipping, order.total)) {
    return { ok: false as const, reason: "Checkout total does not match subtotal and shipping." };
  }

  return { ok: true as const };
}

export function serializeOrderHistoryEntry(input: {
  id: string;
  status: string;
  total: number;
  payerEmail?: string;
  shippingAddress: CheckoutAddress;
  createdAt?: string;
  items?: CheckoutItemPayload[];
}): CompletedCheckoutOrder {
  return {
    id: input.id,
    status: input.status,
    total: input.total,
    currency: "EUR",
    createdAt: input.createdAt ?? new Date().toISOString(),
    payerEmail: input.payerEmail,
    shippingAddress: input.shippingAddress,
    items: input.items ?? [],
  };
}
