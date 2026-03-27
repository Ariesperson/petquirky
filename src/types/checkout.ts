export type CheckoutAddress = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export type CheckoutItemPayload = {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CheckoutOrderPayload = {
  locale: string;
  items: CheckoutItemPayload[];
  shippingAddress: CheckoutAddress;
  subtotal: number;
  shipping: number;
  total: number;
  currency: "EUR";
};

export type CompletedCheckoutOrder = {
  id: string;
  status: string;
  total: number;
  currency: "EUR";
  createdAt: string;
  payerEmail?: string;
  shippingAddress: CheckoutAddress;
};

export type CompletedCheckoutOrderWithItems = CompletedCheckoutOrder & {
  items: CheckoutItemPayload[];
};
