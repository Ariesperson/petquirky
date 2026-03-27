import type {
  CheckoutAddress,
  CheckoutItemPayload,
  CheckoutOrderPayload,
  CompletedCheckoutOrder,
} from "@/types/checkout";

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

export function serializeOrderHistoryEntry(input: {
  id: string;
  status: string;
  total: number;
  payerEmail?: string;
  shippingAddress: CheckoutAddress;
}): CompletedCheckoutOrder {
  return {
    id: input.id,
    status: input.status,
    total: input.total,
    currency: "EUR",
    createdAt: new Date().toISOString(),
    payerEmail: input.payerEmail,
    shippingAddress: input.shippingAddress,
  };
}
