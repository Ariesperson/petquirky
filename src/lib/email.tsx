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

const customerCopy = {
  en: {
    eyebrow: "Order Confirmed",
    greeting: "Thank you for your order!",
    intro: "We've received your order and will handle it as an individual seller.",
    total: "Total",
    email: "Email Address",
    items: "Order Items",
    shipping: "Shipping Address",
    placedOn: "Placed On",
    itemCount: "items",
    status: "Completed",
    eta: "Estimated delivery is usually 5-10 business days after order processing.",
    returns: "You may request a return within 14 days after delivery.",
    payment: "Payment was processed by PayPal. PetQuirky does not store your PayPal login or card details.",
    seller: "PetQuirky is operated by an individual seller, not a company. Support replies usually arrive within 1-2 business days.",
    supportLead: "Questions?",
    supportTail: "Reply to this email or contact us at",
  },
  de: {
    eyebrow: "Bestellung bestätigt",
    greeting: "Vielen Dank für Ihre Bestellung!",
    intro: "Wir haben Ihre Bestellung erhalten und bearbeiten sie als einzelner Verkäufer.",
    total: "Gesamt",
    email: "E-Mail-Adresse",
    items: "Bestellte Artikel",
    shipping: "Lieferadresse",
    placedOn: "Bestellt am",
    itemCount: "Artikel",
    status: "Abgeschlossen",
    eta: "Die voraussichtliche Lieferung beträgt normalerweise 5-10 Werktage nach der Bestellbearbeitung.",
    returns: "Eine Rückgabe kann innerhalb von 14 Tagen nach Lieferung angefragt werden.",
    payment: "Die Zahlung wurde über PayPal verarbeitet. PetQuirky speichert keine PayPal-Zugangsdaten oder Kartendaten.",
    seller: "PetQuirky wird von einem einzelnen Verkäufer betrieben, nicht von einem Unternehmen. Support-Antworten erfolgen normalerweise innerhalb von 1-2 Werktagen.",
    supportLead: "Fragen?",
    supportTail: "Antworten Sie auf diese E-Mail oder schreiben Sie uns an",
  },
  fr: {
    eyebrow: "Commande confirmée",
    greeting: "Merci pour votre commande !",
    intro: "Nous avons bien reçu votre commande et elle sera traitée par un vendeur individuel.",
    total: "Total",
    email: "Adresse e-mail",
    items: "Articles commandés",
    shipping: "Adresse de livraison",
    placedOn: "Passée le",
    itemCount: "articles",
    status: "Terminée",
    eta: "La livraison estimée est généralement de 5 à 10 jours ouvrés après le traitement de la commande.",
    returns: "Vous pouvez demander un retour sous 14 jours après la livraison.",
    payment: "Le paiement a été traité par PayPal. PetQuirky ne stocke pas vos identifiants PayPal ni vos données de carte.",
    seller: "PetQuirky est exploité par un vendeur individuel, et non par une société. Les réponses du support arrivent généralement sous 1 à 2 jours ouvrés.",
    supportLead: "Une question ?",
    supportTail: "Répondez à cet e-mail ou contactez-nous à",
  },
  es: {
    eyebrow: "Pedido confirmado",
    greeting: "¡Gracias por tu pedido!",
    intro: "Hemos recibido tu pedido y será gestionado por un vendedor individual.",
    total: "Total",
    email: "Correo electrónico",
    items: "Artículos del pedido",
    shipping: "Dirección de envío",
    placedOn: "Realizado el",
    itemCount: "artículos",
    status: "Completado",
    eta: "La entrega estimada suele ser de 5-10 días laborables después de procesar el pedido.",
    returns: "Puedes solicitar una devolución dentro de 14 días tras la entrega.",
    payment: "El pago se ha procesado por PayPal. PetQuirky no almacena tus datos de acceso a PayPal ni los datos de tu tarjeta.",
    seller: "PetQuirky está operado por un vendedor individual, no por una empresa. Las respuestas de soporte suelen llegar en 1-2 días laborables.",
    supportLead: "¿Preguntas?",
    supportTail: "Responde a este correo o escríbenos a",
  },
} as const;

type CustomerLocale = keyof typeof customerCopy;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatPlacedDate(locale: string, value: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function sectionLabel(value: string) {
  return `<div style="font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#a36a58;">${escapeHtml(
    value
  )}</div>`;
}

function infoCard(label: string, content: string) {
  return [
    '<td style="padding:0 10px 20px 10px;" valign="top">',
    '<div style="background:#ffffff;border-radius:28px;padding:28px 28px 24px 28px;">',
    sectionLabel(label),
    `<div style="margin-top:18px;font-size:21px;line-height:1.5;font-weight:700;color:#2e2c2c;">${content}</div>`,
    "</div>",
    "</td>",
  ].join("");
}

function buildItemMarkup(
  item: CheckoutOrderPayload["items"][number],
  locale: string,
  compact = false
) {
  const price = formatPrice(item.lineTotal, locale as Parameters<typeof formatPrice>[1]);
  const unitPrice = formatPrice(item.unitPrice, locale as Parameters<typeof formatPrice>[1]);
  const imageMarkup = item.image
    ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(
        item.name
      )}" width="${compact ? 72 : 92}" height="${compact ? 72 : 92}" style="display:block;width:${
        compact ? 72 : 92
      }px;height:${compact ? 72 : 92}px;border-radius:22px;object-fit:cover;background:#f6f3f2;" />`
    : `<div style="width:${compact ? 72 : 92}px;height:${compact ? 72 : 92}px;border-radius:22px;background:#f6f3f2;"></div>`;

  return [
    '<tr>',
    `<td style="padding:${compact ? 16 : 18}px;background:#fcfaf9;border-radius:26px;">`,
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">',
    "<tr>",
    `<td width="${compact ? 88 : 110}" valign="top">${imageMarkup}</td>`,
    '<td valign="top" style="padding-left:18px;">',
    `<div style="font-size:${compact ? 18 : 22}px;line-height:1.45;font-weight:700;color:#2d2b2b;">${escapeHtml(
      item.name
    )}</div>`,
    `<div style="margin-top:8px;font-size:${compact ? 14 : 16}px;line-height:1.5;color:#8d8a8a;">Quantity: ${
      item.quantity
    }<br />${escapeHtml(unitPrice)} each</div>`,
    "</td>",
    `<td align="right" valign="middle" style="font-size:${compact ? 18 : 20}px;font-weight:700;color:#2d2b2b;">${escapeHtml(
      price
    )}</td>`,
    "</tr>",
    "</table>",
    "</td>",
    "</tr>",
  ].join("");
}

function buildEmailShell(input: {
  title: string;
  preheader: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  orderId: string;
  status: string;
  body: string;
  footer?: string;
}) {
  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<title>${escapeHtml(input.title)}</title>`,
    "</head>",
    '<body style="margin:0;padding:0;background:#fcf9f8;font-family:Arial,Helvetica,sans-serif;color:#2f2d2d;">',
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(
      input.preheader
    )}</div>`,
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fcf9f8;">',
    "<tr>",
    '<td align="center" style="padding:32px 16px 48px 16px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:760px;">',
    "<tr>",
    '<td style="padding:0 16px 18px 16px;font-size:38px;line-height:1;font-weight:800;color:#de5b2f;">PetQuirky</td>',
    "</tr>",
    "<tr>",
    '<td style="background:linear-gradient(180deg,#ffffff 0%,#faf7f6 100%);border-radius:40px;padding:32px 28px 28px 28px;box-shadow:0 24px 64px rgba(165,54,13,0.10);">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">',
    "<tr>",
    '<td align="center">',
    '<div style="width:112px;height:112px;border-radius:999px;background:rgba(27,165,124,0.10);margin:0 auto;display:flex;align-items:center;justify-content:center;">',
    '<div style="width:72px;height:72px;border-radius:999px;background:#ffffff;border:6px solid rgba(27,165,124,0.14);display:flex;align-items:center;justify-content:center;font-size:38px;color:#1f9f73;">&#10003;</div>',
    "</div>",
    `<div style="margin-top:24px;font-size:12px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#d66a41;">${escapeHtml(
      input.heroEyebrow
    )}</div>`,
    `<h1 style="margin:18px 0 0 0;font-size:54px;line-height:1.02;font-weight:800;color:#de5b2f;">${escapeHtml(
      input.heroTitle
    )}</h1>`,
    `<p style="margin:20px auto 0 auto;max-width:560px;font-size:18px;line-height:1.7;color:#8a8686;">${escapeHtml(
      input.heroDescription
    )}</p>`,
    "</td>",
    "</tr>",
    "<tr>",
    '<td style="padding-top:28px;">',
    '<div style="background:#fff0ea;border-radius:34px;padding:28px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">',
    "<tr>",
    '<td valign="top" style="padding-right:16px;">',
    sectionLabel("Order Number"),
    `<div style="margin-top:18px;font-size:24px;line-height:1.35;font-weight:700;color:#2f2c2c;">${escapeHtml(
      input.orderId
    )}</div>`,
    "</td>",
    '<td align="right" valign="top">',
    `<div style="display:inline-block;background:#f7d9ce;border-radius:999px;padding:14px 26px;font-size:13px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#de5b2f;">${escapeHtml(
      input.status
    )}</div>`,
    "</td>",
    "</tr>",
    "</table>",
    input.body,
    "</div>",
    "</td>",
    "</tr>",
    input.footer
      ? `<tr><td style="padding-top:22px;font-size:14px;line-height:1.8;color:#8f8a8a;">${input.footer}</td></tr>`
      : "",
    "</table>",
    "</td>",
    "</tr>",
    "</table>",
    "</td>",
    "</tr>",
    "</table>",
    "</body>",
    "</html>",
  ].join("");
}

function buildCustomerOrderHtml(input: {
  locale: string;
  orderId: string;
  createdAt: string;
  payerEmail: string;
  customerName: string;
  items: CheckoutOrderPayload["items"];
  total: string;
  shippingAddress: CheckoutOrderPayload["shippingAddress"];
}) {
  const copy =
    customerCopy[input.locale as CustomerLocale] ?? customerCopy.en;
  const itemCount = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemsMarkup = input.items.map((item) => buildItemMarkup(item, input.locale)).join("");
  const body = [
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">',
    "<tr>",
    infoCard(copy.total, `<span style="font-size:22px;color:#de5b2f;">${escapeHtml(input.total)}</span>`),
    infoCard(copy.email, escapeHtml(input.payerEmail)),
    "</tr>",
    "<tr>",
    '<td style="padding:0 10px 20px 10px;" valign="top">',
    '<div style="background:#ffffff;border-radius:28px;padding:28px 28px 24px 28px;">',
    `<div style="font-size:16px;font-weight:700;color:#2f2d2d;">${escapeHtml(copy.items)}</div>`,
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">',
    itemsMarkup,
    "</table>",
    "</div>",
    "</td>",
    '<td style="padding:0 10px 20px 10px;" valign="top">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">',
    "<tr>",
    infoCard(
      copy.shipping,
      [
        escapeHtml(input.shippingAddress.fullName),
        escapeHtml(input.shippingAddress.address),
        `${escapeHtml(input.shippingAddress.city)}, ${escapeHtml(input.shippingAddress.postalCode)}`,
        escapeHtml(input.shippingAddress.country),
      ].join("<br />")
    ),
    "</tr>",
    "<tr>",
    infoCard(
      copy.placedOn,
      `${escapeHtml(formatPlacedDate(input.locale, input.createdAt))}<div style="margin-top:10px;font-size:16px;font-weight:500;color:#9a9696;">${itemCount} ${escapeHtml(
        copy.itemCount
      )}</div>`
    ),
    "</tr>",
    "</table>",
    "</td>",
    "</tr>",
    "</table>",
  ].join("");

  return buildEmailShell({
    title: `PetQuirky Order #${input.orderId}`,
    preheader: `${copy.greeting} ${input.orderId}`,
    heroEyebrow: copy.eyebrow,
    heroTitle: copy.greeting,
    heroDescription: copy.intro,
    orderId: input.orderId,
    status: copy.status,
    body,
    footer: `${escapeHtml(copy.payment)}<br />${escapeHtml(copy.eta)}<br />${escapeHtml(
      copy.returns
    )}<br />${escapeHtml(copy.seller)}<br />${escapeHtml(copy.supportLead)} ${escapeHtml(
      copy.supportTail
    )} <a href="mailto:${escapeHtml(
      getSellerEmail()
    )}" style="color:#de5b2f;text-decoration:none;font-weight:700;">${escapeHtml(
      getSellerEmail()
    )}</a>.`,
  });
}

function buildSellerNotificationHtml(input: {
  orderId: string;
  paypalOrderId: string;
  createdAt: string;
  payerEmail: string;
  customerName: string;
  items: CheckoutOrderPayload["items"];
  total: string;
  shippingAddress: CheckoutOrderPayload["shippingAddress"];
  locale: string;
}) {
  const itemCount = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemsMarkup = input.items
    .map((item) => buildItemMarkup(item, input.locale, true))
    .join("");
  const body = [
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">',
    "<tr>",
    infoCard("Total", `<span style="font-size:22px;color:#de5b2f;">${escapeHtml(input.total)}</span>`),
    infoCard("Customer Email", escapeHtml(input.payerEmail)),
    "</tr>",
    "<tr>",
    infoCard("PayPal Transaction", escapeHtml(input.paypalOrderId)),
    infoCard("Placed On", escapeHtml(formatPlacedDate(input.locale, input.createdAt))),
    "</tr>",
    "<tr>",
    '<td style="padding:0 10px 20px 10px;" valign="top">',
    '<div style="background:#ffffff;border-radius:28px;padding:28px 28px 24px 28px;">',
    '<div style="font-size:16px;font-weight:700;color:#2f2d2d;">Order Items</div>',
    `<div style="margin-top:8px;font-size:14px;line-height:1.6;color:#8e8a8a;">${itemCount} item${itemCount > 1 ? "s" : ""} in this order</div>`,
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">',
    itemsMarkup,
    "</table>",
    "</div>",
    "</td>",
    '<td style="padding:0 10px 20px 10px;" valign="top">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">',
    "<tr>",
    infoCard(
      "Shipping Address",
      [
        escapeHtml(input.customerName),
        escapeHtml(input.shippingAddress.address),
        `${escapeHtml(input.shippingAddress.city)}, ${escapeHtml(input.shippingAddress.postalCode)}`,
        escapeHtml(input.shippingAddress.country),
      ].join("<br />")
    ),
    "</tr>",
    "<tr>",
    infoCard("Customer", escapeHtml(input.customerName)),
    "</tr>",
    "</table>",
    "</td>",
    "</tr>",
    "</table>",
  ].join("");

  return buildEmailShell({
    title: `New Order #${input.orderId}`,
    preheader: `New PetQuirky order ${input.orderId} for ${input.total}`,
    heroEyebrow: "New Order Received",
    heroTitle: `New Order #${input.orderId}`,
    heroDescription: "A new checkout has been completed. Here are the payment, customer, and fulfillment details.",
    orderId: input.orderId,
    status: "Completed",
    body,
    footer:
      'This is an internal PetQuirky notification. Reply to the customer only if you need to clarify shipping or fulfillment details.',
  });
}

function buildCustomerOrderText(input: {
  locale: string;
  orderId: string;
  createdAt: string;
  payerEmail: string;
  customerName: string;
  items: CheckoutOrderPayload["items"];
  total: string;
  shippingAddress: CheckoutOrderPayload["shippingAddress"];
}) {
  const copy =
    customerCopy[input.locale as CustomerLocale] ?? customerCopy.en;

  return [
    `${copy.greeting} #${input.orderId}`,
    "",
    `${copy.total}: ${input.total}`,
    `${copy.email}: ${input.payerEmail}`,
    `${copy.placedOn}: ${formatPlacedDate(input.locale, input.createdAt)}`,
    "",
    `${copy.items}:`,
    ...input.items.map(
      (item) => `- ${item.name} x ${item.quantity} - ${item.lineTotal.toFixed(2)} €`
    ),
    "",
    `${copy.shipping}:`,
    input.shippingAddress.fullName,
    input.shippingAddress.address,
    `${input.shippingAddress.city}, ${input.shippingAddress.postalCode}`,
    input.shippingAddress.country,
    "",
    copy.payment,
    copy.eta,
    copy.returns,
    copy.seller,
    `${copy.supportLead} ${copy.supportTail} ${getSellerEmail()}`,
  ].join("\n");
}

function buildSellerNotificationText(input: {
  orderId: string;
  paypalOrderId: string;
  createdAt: string;
  payerEmail: string;
  customerName: string;
  items: CheckoutOrderPayload["items"];
  total: string;
  shippingAddress: CheckoutOrderPayload["shippingAddress"];
  locale: string;
}) {
  return [
    `New Order #${input.orderId}`,
    `PayPal transaction: ${input.paypalOrderId}`,
    `Placed on: ${formatPlacedDate(input.locale, input.createdAt)}`,
    `Customer: ${input.customerName}`,
    `Customer email: ${input.payerEmail}`,
    `Total: ${input.total}`,
    "",
    "Items:",
    ...input.items.map(
      (item) => `- ${item.name} x ${item.quantity} - ${item.lineTotal.toFixed(2)} €`
    ),
    "",
    "Shipping address:",
    input.shippingAddress.fullName,
    input.shippingAddress.address,
    `${input.shippingAddress.city}, ${input.shippingAddress.postalCode}`,
    input.shippingAddress.country,
  ].join("\n");
}

export async function sendOrderConfirmationEmail(input: {
  orderId: string;
  order: CheckoutOrderPayload;
  payerEmail: string;
  createdAt?: string;
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
    const createdAt = input.createdAt ?? new Date().toISOString();
    const html = buildCustomerOrderHtml({
      locale: input.order.locale,
      orderId: input.orderId,
      createdAt,
      payerEmail: input.payerEmail,
      customerName: input.order.shippingAddress.fullName,
      items: input.order.items,
      total,
      shippingAddress: input.order.shippingAddress,
    });
    const text = buildCustomerOrderText({
      locale: input.order.locale,
      orderId: input.orderId,
      createdAt,
      payerEmail: input.payerEmail,
      customerName: input.order.shippingAddress.fullName,
      items: input.order.items,
      total,
      shippingAddress: input.order.shippingAddress,
    });

    const result = await resend.emails.send({
      from: getFromEmail(),
      to: input.payerEmail,
      subject: `Your PetQuirky Order #${input.orderId} is Confirmed`,
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
  createdAt?: string;
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
    const createdAt = input.createdAt ?? new Date().toISOString();
    const html = buildSellerNotificationHtml({
      orderId: input.orderId,
      paypalOrderId: input.paypalOrderId,
      createdAt,
      payerEmail: input.payerEmail,
      customerName: input.order.shippingAddress.fullName,
      items: input.order.items,
      total,
      shippingAddress: input.order.shippingAddress,
      locale: input.order.locale,
    });
    const text = buildSellerNotificationText({
      orderId: input.orderId,
      paypalOrderId: input.paypalOrderId,
      createdAt,
      payerEmail: input.payerEmail,
      customerName: input.order.shippingAddress.fullName,
      items: input.order.items,
      total,
      shippingAddress: input.order.shippingAddress,
      locale: input.order.locale,
    });

    const result = await resend.emails.send({
      from: getFromEmail(),
      to: getSellerEmail(),
      subject: `New Order #${input.orderId} — ${total}`,
      html,
      text,
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

export async function sendNewsletterSignupEmail(input: {
  email: string;
  locale?: string;
  source?: string;
}) {
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
