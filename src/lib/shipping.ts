import shippingRules from "@/data/shipping.json";

export type ShippingZone = (typeof shippingRules.zones)[number];

export function getFreeShippingThreshold() {
  return shippingRules.freeShippingThreshold;
}

export function calculateShipping(subtotal: number) {
  if (subtotal >= shippingRules.freeShippingThreshold) {
    return 0;
  }

  const standardZone =
    shippingRules.zones.find((zone) => zone.id === "eu-standard") ??
    shippingRules.zones[0];

  return standardZone?.rate ?? 0;
}
