import "server-only";

import { createElement } from "react";
import { Resend } from "resend";

import { OrderConfirmation } from "@/emails/OrderConfirmation";
import { NewOrderNotification } from "@/emails/NewOrderNotification";
import { formatPrice } from "@/lib/products";
import type { CheckoutOrderPayload } from "@/types/checkout";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL ?? "PetQuirky <onboarding@resend.dev>";
}

export function getSellerEmail() {
  return process.env.SELLER_EMAIL ?? "hello@petquirky.com";
}

export async function sendOrderConfirmationEmail(input: {
  orderId: string;
  order: CheckoutOrderPayload;
  payerEmail: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false as const, reason: "resend-not-configured" };
  }

  const result = await resend.emails.send({
    from: getFromEmail(),
    to: input.payerEmail,
    subject: `Your PetQuirky Order #${input.orderId} is Confirmed!`,
    react: createElement(OrderConfirmation, {
      locale: input.order.locale,
      orderId: input.orderId,
      customerName: input.order.shippingAddress.fullName,
      items: input.order.items,
      total: formatPrice(input.order.total, input.order.locale as Parameters<typeof formatPrice>[1]),
      shippingAddress: input.order.shippingAddress,
    }),
  });

  return result.error ? { ok: false as const, reason: result.error.message } : { ok: true as const };
}

export async function sendNewOrderNotificationEmail(input: {
  orderId: string;
  order: CheckoutOrderPayload;
  payerEmail: string;
  paypalOrderId: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false as const, reason: "resend-not-configured" };
  }

  const result = await resend.emails.send({
    from: getFromEmail(),
    to: getSellerEmail(),
    subject: `New Order #${input.orderId} — ${formatPrice(
      input.order.total,
      input.order.locale as Parameters<typeof formatPrice>[1]
    )}`,
    react: createElement(NewOrderNotification, {
      orderId: input.orderId,
      customerName: input.order.shippingAddress.fullName,
      customerEmail: input.payerEmail,
      items: input.order.items,
      total: formatPrice(input.order.total, input.order.locale as Parameters<typeof formatPrice>[1]),
      shippingAddress: input.order.shippingAddress,
      paypalOrderId: input.paypalOrderId,
    }),
  });

  return result.error ? { ok: false as const, reason: result.error.message } : { ok: true as const };
}

export async function sendContactMessageEmail(input: {
  name: string;
  email: string;
  message: string;
  locale?: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false as const, reason: "resend-not-configured" };
  }

  const result = await resend.emails.send({
    from: getFromEmail(),
    to: getSellerEmail(),
    replyTo: input.email,
    subject: `Contact request from ${input.name} <${input.email}>`,
    text: [
      `Locale: ${input.locale ?? "unknown"}`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      "",
      input.message,
    ].join("\n"),
  });

  return result.error ? { ok: false as const, reason: result.error.message } : { ok: true as const };
}

export async function sendNewsletterSignupEmail(input: { email: string; locale?: string; source?: string }) {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false as const, reason: "resend-not-configured" };
  }

  const result = await resend.emails.send({
    from: getFromEmail(),
    to: getSellerEmail(),
    subject: `Newsletter signup: ${input.email}`,
    text: [
      `Email: ${input.email}`,
      `Locale: ${input.locale ?? "unknown"}`,
      `Source: ${input.source ?? "homepage"}`,
    ].join("\n"),
  });

  return result.error ? { ok: false as const, reason: result.error.message } : { ok: true as const };
}
