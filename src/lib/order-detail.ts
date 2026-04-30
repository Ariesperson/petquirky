import { getAllProducts } from "@/lib/products";
import type { Locale } from "@/lib/i18n";
import type {
  CompletedCheckoutOrderWithItems,
  OrderDetailItemView,
  OrderDetailTimelineStep,
  OrderDetailView,
} from "@/types/checkout";

function addBusinessDays(value: string, days: number) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  let remaining = days;
  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }

  return date.toISOString();
}

function normalizeOrderStatus(status: string) {
  return status.trim().toUpperCase();
}

function buildTimeline(status: string, createdAt: string): OrderDetailTimelineStep[] {
  const normalizedStatus = normalizeOrderStatus(status);
  const shipped = normalizedStatus === "SHIPPED";
  const completed = normalizedStatus === "COMPLETED" || shipped;
  const preparing = normalizedStatus === "COMPLETED";

  return [
    {
      key: "placed",
      completed: true,
      current: !completed,
      date: createdAt,
    },
    {
      key: "paid",
      completed: completed,
      current: false,
      date: completed ? createdAt : null,
    },
    {
      key: "preparing",
      completed: preparing || shipped,
      current: preparing,
      date: preparing || shipped ? createdAt : null,
    },
    {
      key: "shipped",
      completed: shipped,
      current: shipped,
      date: shipped ? addBusinessDays(createdAt, 2) : null,
    },
  ];
}

function buildOrderItemViews(
  items: CompletedCheckoutOrderWithItems["items"],
  locale: Locale
): OrderDetailItemView[] {
  const products = getAllProducts();

  return items.map((item) => {
    const matchedProduct = products.find((product) => product.id === item.productId);

    return {
      ...item,
      name: matchedProduct?.name[locale] ?? item.name,
      image: matchedProduct?.images[0] ?? item.image,
      href: matchedProduct ? `/${locale}/products/${matchedProduct.slug}` : null,
    };
  });
}

export function buildOrderDetailView(
  order: CompletedCheckoutOrderWithItems,
  locale: Locale
): OrderDetailView {
  const items = buildOrderItemViews(order.items ?? [], locale);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingAmount = Math.max(Number((order.total - subtotal).toFixed(2)), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const normalizedStatus = normalizeOrderStatus(order.status);

  return {
    ...order,
    items,
    subtotal,
    shippingAmount,
    itemCount,
    email: order.payerEmail ?? order.shippingAddress.email,
    paymentMethod: "paypal",
    paymentState: normalizedStatus === "COMPLETED" || normalizedStatus === "SHIPPED" ? "paid" : "pending",
    estimatedDeliveryStart: addBusinessDays(order.createdAt, 5),
    estimatedDeliveryEnd: addBusinessDays(order.createdAt, 10),
    timeline: buildTimeline(order.status, order.createdAt),
  };
}
