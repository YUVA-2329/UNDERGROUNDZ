// Supabase Edge Function: telegram-notify
// Securely dispatches automated Telegram notifications using existing Telegram Bot HTTP API
// Secrets (TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID) are securely stored in Supabase secrets.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface NotificationPayload {
  event:
    | "NEW_USER_REGISTRATION"
    | "SUCCESSFUL_LOGIN"
    | "SECURITY_ALERT"
    | "NEW_ORDER"
    | "SYSTEM_ALERT"
    | "SYSTEM_ERROR"
    | string;
  chat_id?: string | number;
  title?: string;
  timestamp?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    callsign?: string;
    authProvider?: string;
  };
  order?: {
    orderId: string;
    amount: number;
    currency: string;
    itemCount: number;
    customerName: string;
    customerEmail: string;
    city?: string;
    isDemo?: boolean;
    paymentMethod?: string;
  };
  security?: {
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    action: string;
    details: string;
    ipOrOrigin?: string;
  };
  alert?: {
    level: "INFO" | "WARNING" | "ALERT" | "CRITICAL";
    message: string;
    metadata?: Record<string, unknown>;
  };
  error?: {
    message: string;
    context?: string;
    stack?: string;
  };
  customFields?: Record<string, unknown>;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatTelegramMessage(payload: NotificationPayload): string {
  const timestamp = payload.timestamp || new Date().toISOString();
  const timeStr = new Date(timestamp).toLocaleString("en-US", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "medium",
  }) + " UTC";

  let body = "";

  switch (payload.event) {
    case "NEW_USER_REGISTRATION": {
      const email = escapeHtml(payload.user?.email || "Unknown Email");
      const name = escapeHtml(payload.user?.name || payload.user?.callsign || "New Member");
      const id = escapeHtml(payload.user?.id || "N/A");
      const provider = escapeHtml(payload.user?.authProvider || "Email / OAuth");

      body = [
        `👤 <b>NEW RIDER REGISTRATION</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Callsign / Name:</b> ${name}`,
        `<b>Email:</b> <code>${email}</code>`,
        `<b>Auth Method:</b> ${provider}`,
        `<b>User ID:</b> <code>${id}</code>`,
        `<b>Timestamp:</b> ${timeStr}`,
        `<b>Platform:</b> Undergroundz Motorcycle Gear Node`,
      ].join("\n");
      break;
    }

    case "SUCCESSFUL_LOGIN": {
      const email = escapeHtml(payload.user?.email || "Anonymous Rider");
      const id = escapeHtml(payload.user?.id || "N/A");
      const provider = escapeHtml(payload.user?.authProvider || "Password / Google OAuth");

      body = [
        `🔐 <b>SUCCESSFUL RIDER SIGN-IN</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Account:</b> <code>${email}</code>`,
        `<b>Auth Method:</b> ${provider}`,
        `<b>User ID:</b> <code>${id}</code>`,
        `<b>Timestamp:</b> ${timeStr}`,
        `<b>Status:</b> Session Verified & Validated`,
      ].join("\n");
      break;
    }

    case "SECURITY_ALERT": {
      const severity = payload.security?.severity || "MEDIUM";
      const icon = severity === "CRITICAL" ? "🚨" : severity === "HIGH" ? "⚠️" : "🛡️";
      const action = escapeHtml(payload.security?.action || "Security Event Triggered");
      const details = escapeHtml(payload.security?.details || "No further details provided");
      const origin = escapeHtml(payload.security?.ipOrOrigin || "Cloud Edge");

      body = [
        `${icon} <b>SECURITY ALERT // ${severity}</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Action:</b> ${action}`,
        `<b>Details:</b> <code>${details}</code>`,
        `<b>Origin:</b> ${origin}`,
        `<b>Timestamp:</b> ${timeStr}`,
        `<b>Action Required:</b> Immediate Admin Review If Unrecognized`,
      ].join("\n");
      break;
    }

    case "NEW_ORDER": {
      const orderId = escapeHtml(payload.order?.orderId || "N/A");
      const amt = payload.order?.amount ? `${payload.order.currency || "₹"}${payload.order.amount.toLocaleString("en-IN")}` : "₹0";
      const customer = escapeHtml(payload.order?.customerName || "Customer");
      const email = escapeHtml(payload.order?.customerEmail || "N/A");
      const items = payload.order?.itemCount || 1;
      const city = escapeHtml(payload.order?.city || "Direct Shipping");
      const mode = payload.order?.isDemo ? "🧪 DEMO SANDBOX" : "💳 PRODUCTION LIVE";

      body = [
        `📦 <b>NEW TRANSACTION // ORDER CONFIRMED</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Order ID:</b> <code>${orderId}</code>`,
        `<b>Amount:</b> <b>${amt}</b>`,
        `<b>Items:</b> ${items} gear units`,
        `<b>Customer:</b> ${customer}`,
        `<b>Email:</b> <code>${email}</code>`,
        `<b>Destination:</b> ${city}`,
        `<b>Gateway Mode:</b> ${mode}`,
        `<b>Timestamp:</b> ${timeStr}`,
      ].join("\n");
      break;
    }

    case "PAYMENT_SUCCESS": {
      const orderId = escapeHtml(payload.order?.orderId || String(payload.customFields?.orderId || "N/A"));
      const paymentId = escapeHtml(String(payload.customFields?.paymentId || "N/A"));
      const amt = payload.order?.amount
        ? `${payload.order.currency || "₹"}${payload.order.amount.toLocaleString("en-IN")}`
        : payload.customFields?.amount
        ? `${payload.customFields?.currency || "₹"}${Number(payload.customFields?.amount).toLocaleString("en-IN")}`
        : "₹0";
      const customer = escapeHtml(payload.order?.customerName || String(payload.customFields?.customerName || "Verified Rider"));
      const method = escapeHtml(String(payload.customFields?.paymentMethod || "UPI / Razorpay / Card"));
      const mode = payload.order?.isDemo || payload.customFields?.isDemo ? "🧪 DEMO SANDBOX CLEARED" : "✅ PRODUCTION SETTLED";

      body = [
        `💳 <b>PAYMENT CONFIRMED // SUCCESSFUL</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Order ID:</b> <code>${orderId}</code>`,
        `<b>Payment ID:</b> <code>${paymentId}</code>`,
        `<b>Amount Paid:</b> <b>${amt}</b>`,
        `<b>Customer:</b> ${customer}`,
        `<b>Method / Gateway:</b> ${method}`,
        `<b>Verification:</b> ${mode}`,
        `<b>Timestamp:</b> ${timeStr}`,
      ].join("\n");
      break;
    }

    case "RIDER_REGISTRATION": {
      const callsign = escapeHtml(String(payload.customFields?.callsign || payload.user?.callsign || "RIDER_UNKNOWN"));
      const name = escapeHtml(payload.user?.name || String(payload.customFields?.name || "Rider Member"));
      const email = escapeHtml(payload.user?.email || String(payload.customFields?.email || "N/A"));
      const sector = escapeHtml(String(payload.customFields?.sector || "GLOBAL_GRID"));
      const phone = escapeHtml(String(payload.customFields?.phone || "N/A"));
      const gearTagged = escapeHtml(String(payload.customFields?.gearTagged || "Undergroundz Technical Apparel"));

      body = [
        `🏍️ <b>RIDER REGISTRATION COMPLETED</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Rider Callsign:</b> <b>${callsign}</b>`,
        `<b>Full Name:</b> ${name}`,
        `<b>Sector / Location:</b> ${sector}`,
        `<b>Contact Phone:</b> <code>${phone}</code>`,
        `<b>Account Email:</b> <code>${email}</code>`,
        `<b>Gear Unit / Spec:</b> ${gearTagged}`,
        `<b>Clearance:</b> Verified Rider Tier 0 (Active)`,
        `<b>Timestamp:</b> ${timeStr}`,
      ].join("\n");
      break;
    }

    case "ORDER_STATUS_CHANGED": {
      const orderId = escapeHtml(payload.order?.orderId || String(payload.customFields?.orderId || "N/A"));
      const oldStatus = escapeHtml(String(payload.customFields?.oldStatus || "PENDING"));
      const newStatus = escapeHtml(String(payload.customFields?.newStatus || "CONFIRMED"));
      const customer = escapeHtml(payload.order?.customerName || String(payload.customFields?.customerName || "Customer"));
      const tracking = escapeHtml(String(payload.customFields?.trackingNumber || "Assigned by Logistics"));

      body = [
        `📦 <b>ORDER STATUS UPDATE</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Order ID:</b> <code>${orderId}</code>`,
        `<b>Previous Status:</b> ${oldStatus}`,
        `<b>New Status:</b> <b>${newStatus}</b>`,
        `<b>Customer:</b> ${customer}`,
        `<b>Tracking / Logistics:</b> ${tracking}`,
        `<b>Timestamp:</b> ${timeStr}`,
      ].join("\n");
      break;
    }

    case "NEW_REVIEW": {
      const product = escapeHtml(String(payload.customFields?.productName || "Product Review"));
      const rating = Number(payload.customFields?.rating || 5);
      const stars = "★".repeat(Math.min(5, Math.max(1, rating))) + "☆".repeat(Math.max(0, 5 - rating));
      const author = escapeHtml(String(payload.customFields?.author || payload.user?.name || "Verified Rider"));
      const verified = payload.customFields?.verifiedPurchase !== false ? "✅ VERIFIED PURCHASE" : "COMMUNITY MEMBER";
      const reviewText = escapeHtml(String(payload.customFields?.reviewText || "No feedback text provided."));

      body = [
        `⭐ <b>NEW PRODUCT REVIEW SUBMITTED</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Product:</b> <b>${product}</b>`,
        `<b>Rating:</b> ${stars} (${rating}/5)`,
        `<b>Reviewer:</b> ${author}`,
        `<b>Status:</b> ${verified}`,
        `<b>Feedback:</b> <i>"${reviewText.slice(0, 300)}"</i>`,
        `<b>Timestamp:</b> ${timeStr}`,
      ].join("\n");
      break;
    }

    case "SYSTEM_ALERT": {
      const level = payload.alert?.level || "INFO";
      const icon = level === "CRITICAL" ? "🔴" : level === "ALERT" ? "🟠" : level === "WARNING" ? "🟡" : "ℹ️";
      const msg = escapeHtml(payload.alert?.message || "System broadcast");

      body = [
        `${icon} <b>SYSTEM ALERT [${level}]</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Notice:</b> ${msg}`,
        `<b>Timestamp:</b> ${timeStr}`,
      ].join("\n");
      break;
    }

    case "SYSTEM_ERROR": {
      const errMessage = escapeHtml(payload.error?.message || "Unknown runtime exception");
      const context = escapeHtml(payload.error?.context || "General Core");
      const stack = payload.error?.stack ? escapeHtml(payload.error.stack.slice(0, 400)) : "";

      body = [
        `💥 <b>ADMIN ATTENTION: SYSTEM ERROR</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Context:</b> ${context}`,
        `<b>Error:</b> <code>${errMessage}</code>`,
        stack ? `<b>Stack Trace:</b>\n<pre>${stack}</pre>` : "",
        `<b>Timestamp:</b> ${timeStr}`,
        `<b>System Flag:</b> Requires Administrative Audit`,
      ].filter(Boolean).join("\n");
      break;
    }

    default: {
      const title = escapeHtml(payload.title || payload.event);
      body = [
        `⚡ <b>UNDERGROUNDZ DISPATCH: ${title}</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Payload:</b> <code>${escapeHtml(JSON.stringify(payload.customFields || payload, null, 2).slice(0, 500))}</code>`,
        `<b>Timestamp:</b> ${timeStr}`,
      ].join("\n");
      break;
    }
  }

  return body;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const defaultChatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!botToken) {
      console.error("[telegram-notify] TELEGRAM_BOT_TOKEN is not configured in Supabase secrets.");
      return new Response(
        JSON.stringify({
          error: "TELEGRAM_BOT_TOKEN is not set in Supabase secrets.",
          hint: "Set secret via: supabase secrets set TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=...",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: NotificationPayload = await req.json();

    const targetChatId = payload.chat_id || defaultChatId;
    if (!targetChatId) {
      console.error("[telegram-notify] TELEGRAM_CHAT_ID is missing from payload and Supabase secrets.");
      return new Response(
        JSON.stringify({
          error: "TELEGRAM_CHAT_ID is not configured in Supabase secrets or request payload.",
          hint: "Set secret via: supabase secrets set TELEGRAM_CHAT_ID=...",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messageText = formatTelegramMessage(payload);

    // Call Telegram Bot HTTP API
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: messageText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const telegramData = await response.json();

    if (!response.ok || !telegramData.ok) {
      console.error("[telegram-notify] Telegram API Error:", telegramData);
      return new Response(
        JSON.stringify({
          success: false,
          error: telegramData.description || "Telegram API request failed.",
          telegram_error_code: telegramData.error_code,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        event: payload.event,
        message_id: telegramData.result?.message_id,
        chat_id: targetChatId,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[telegram-notify] Edge Function Exception:", errorMsg);
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
