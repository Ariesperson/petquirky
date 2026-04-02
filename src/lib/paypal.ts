import "server-only";

import type { CheckoutOrderPayload } from "@/types/checkout";

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

function getPayPalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured.");
  }

  return { clientId, clientSecret };
}

async function getAccessToken() {
  const { clientId, clientSecret } = getPayPalCredentials();
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to authorize PayPal request.");
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Missing PayPal access token.");
  }

  return data.access_token;
}

export function getPayPalCountryCode(country: string) {
  const normalized = country.trim().toLowerCase();

  switch (normalized) {
    case "france":
      return "FR";
    case "germany":
      return "DE";
    case "italy":
      return "IT";
    case "spain":
      return "ES";
    case "netherlands":
      return "NL";
    default:
      throw new Error(`Unsupported shipping country: ${country}.`);
  }
}

export async function createPayPalOrder(order: CheckoutOrderPayload) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: order.currency,
            value: order.total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: order.currency,
                value: order.subtotal.toFixed(2),
              },
              shipping: {
                currency_code: order.currency,
                value: order.shipping.toFixed(2),
              },
            },
          },
          items: order.items.map((item) => ({
            name: item.name,
            quantity: String(item.quantity),
            unit_amount: {
              currency_code: order.currency,
              value: item.unitPrice.toFixed(2),
            },
          })),
          shipping: {
            name: {
              full_name: order.shippingAddress.fullName,
            },
            address: {
              address_line_1: order.shippingAddress.address,
              admin_area_2: order.shippingAddress.city,
              postal_code: order.shippingAddress.postalCode,
              country_code: getPayPalCountryCode(order.shippingAddress.country),
            },
          },
        },
      ],
      application_context: {
        brand_name: "PetQuirky",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
        locale: order.locale,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create PayPal order.");
  }

  return (await response.json()) as { id: string; status: string };
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to capture PayPal order.");
  }

  return (await response.json()) as {
    id: string;
    status: string;
    payer?: {
      email_address?: string;
    };
  };
}
