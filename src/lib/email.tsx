import "server-only";

import { Resend } from "resend";

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
  return process.env.SELLER_EMAIL ?? "969939390@qq.com";
}

const orderConfirmationCopy = {
  en: {
    greeting: "Thank you for your order",
    intro: "We have received your PetQuirky order and started preparing it.",
    items: "Items",
    shipping: "Shipping address",
    total: "Total",
    eta: "Estimated dispatch and delivery: 5-10 business days.",
    support: "Questions? Reach us at 969939390@qq.com.",
  },
  de: {
    greeting: "Vielen Dank für Ihre Bestellung",
    intro: "Wir haben Ihre PetQuirky-Bestellung erhalten und bereiten sie vor.",
    items: "Artikel",
    shipping: "Lieferadresse",
    total: "Gesamt",
    eta: "Voraussichtlicher Versand und Lieferung: 5-10 Werktage.",
    support: "Fragen? Schreiben Sie uns an 969939390@qq.com.",
  },
  fr: {
    greeting: "Merci pour votre commande",
    intro: "Nous avons bien reçu votre commande PetQuirky et commençons sa préparation.",
    items: "Articles",
    shipping: "Adresse de livraison",
    total: "Total",
    eta: "Expédition et livraison estimées : 5 à 10 jours ouvrés.",
    support: "Une question ? Écrivez-nous à 969939390@qq.com.",
  },
  es: {
    greeting: "Gracias por tu pedido",
    intro: "Hemos recibido tu pedido de PetQuirky y ya estamos preparándolo.",
    items: "Artículos",
    shipping: "Dirección de envío",
    total: "Total",
    eta: "Envío y entrega estimados: 5-10 días laborables.",
    support: "¿Preguntas? Escríbenos a 969939390@qq.com.",
  },
} as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildOrderConfirmationHtml(input: {
  locale: string;
  orderId: string;
  customerName: string;
  items: CheckoutOrderPayload["items"];
  total: string;
  shippingAddress: CheckoutOrderPayload["shippingAddress"];
}) {
  const t =
    orderConfirmationCopy[input.locale as keyof typeof orderConfirmationCopy] ??
    orderConfirmationCopy.en;

  const itemsMarkup = input.items
    .map(
      (item) =>
        `<li>${escapeHtml(item.name)} x ${item.quantity} - ${item.lineTotal.toFixed(2)} €</li>`
    )
    .join("");

  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<body style=\"font-family:Arial,sans-serif;color:#1b1c1c;padding:24px;line-height:1.6;\">",
    `<h1 style="color:#a5360d;">${escapeHtml(t.greeting)} #${escapeHtml(input.orderId)}</h1>`,
    `<p>${escapeHtml(input.customerName)},</p>`,
    `<p>${escapeHtml(t.intro)}</p>`,
    `<h2 style="margin-top:24px;">${escapeHtml(t.items)}</h2>`,
    `<ul>${itemsMarkup}</ul>`,
    `<h2 style="margin-top:24px;">${escapeHtml(t.shipping)}</h2>`,
    `<p>${escapeHtml(input.shippingAddress.fullName)}</p>`,
    `<p>${escapeHtml(input.shippingAddress.address)}</p>`,
    `<p>${escapeHtml(input.shippingAddress.city)}, ${escapeHtml(input.shippingAddress.postalCode)}</p>`,
    `<p>${escapeHtml(input.shippingAddress.country)}</p>`,
    `<h2 style="margin-top:24px;">${escapeHtml(t.total)}</h2>`,
    `<p>${escapeHtml(input.total)}</p>`,
    `<p style="margin-top:24px;">${escapeHtml(t.eta)}</p>`,
    `<p>${escapeHtml(t.support)}</p>`,
    "</body>",
    "</html>",
  ].join("");
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

  try {
    const total = formatPrice(
      input.order.total,
      input.order.locale as Parameters<typeof formatPrice>[1]
    );
    const html = buildOrderConfirmationHtml({
      locale: input.order.locale,
      orderId: input.orderId,
      customerName: input.order.shippingAddress.fullName,
      items: input.order.items,
      total,
      shippingAddress: input.order.shippingAddress,
    });
    const text = [
      `Thank you for your order #${input.orderId}`,
      "",
      `Customer: ${input.order.shippingAddress.fullName}`,
      `Total: ${total}`,
      "",
      "Items:",
      ...input.order.items.map(
        (item) => `- ${item.name} x ${item.quantity} - ${item.lineTotal.toFixed(2)} €`
      ),
      "",
      "Shipping address:",
      input.order.shippingAddress.fullName,
      input.order.shippingAddress.address,
      `${input.order.shippingAddress.city}, ${input.order.shippingAddress.postalCode}`,
      input.order.shippingAddress.country,
    ].join("\n");

    const result = await resend.emails.send({
      from: getFromEmail(),
      to: input.payerEmail,
      subject: `Your PetQuirky Order #${input.orderId} is Confirmed!`,
      html,
      text,
    });

    return result.error
      ? { ok: false as const, reason: result.error.message }
      : { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      reason: error instanceof Error ? error.message : "confirmation-email-failed",
    };
  }
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

  try {
    const result = await resend.emails.send({
      from: getFromEmail(),
      to: getSellerEmail(),
      subject: `New Order #${input.orderId} — ${formatPrice(
        input.order.total,
        input.order.locale as Parameters<typeof formatPrice>[1]
      )}`,
      text: [
        `New Order #${input.orderId}`,
        `PayPal transaction: ${input.paypalOrderId}`,
        `Customer: ${input.order.shippingAddress.fullName}`,
        `Customer email: ${input.payerEmail}`,
        `Total: ${formatPrice(input.order.total, input.order.locale as Parameters<typeof formatPrice>[1])}`,
        "",
        "Items:",
        ...input.order.items.map(
          (item) => `- ${item.name} x ${item.quantity} - ${item.lineTotal.toFixed(2)} €`
        ),
        "",
        "Shipping address:",
        input.order.shippingAddress.fullName,
        input.order.shippingAddress.address,
        `${input.order.shippingAddress.city}, ${input.order.shippingAddress.postalCode}`,
        input.order.shippingAddress.country,
      ].join("\n"),
    });

    return result.error
      ? { ok: false as const, reason: result.error.message }
      : { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      reason: error instanceof Error ? error.message : "seller-notification-failed",
    };
  }
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
