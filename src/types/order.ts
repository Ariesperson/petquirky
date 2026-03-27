export type OrderStatus = "pending" | "paid" | "shipped" | "completed";

export type Order = {
  id: string;
  status: OrderStatus;
  total: number;
  currency: "EUR";
  createdAt: string;
};
