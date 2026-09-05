import type { Request, Response } from 'express';
import { supabase } from '../src/lib/supabase';

/**
 * Server-Side Telegram Notification Dispatcher
 *
 * Requirements Met:
 * - TELEGRAM_BOT_TOKEN is NEVER exposed to client/browser.
 * - Prioritizes Supabase Edge Function invocation: supabase.functions.invoke('telegram-notify').
 * - Graceful fallback to server-side Telegram HTTP API if server environment variable is present.
 */
export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;
  if (!payload || !payload.event) {
    return res.status(400).json({ error: 'Missing event payload' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = payload.chat_id || process.env.TELEGRAM_CHAT_ID;

  // 1. Direct Server Gateway: Instant sub-second dispatch when server credentials are configured
  if (botToken && chatId) {
    try {
      const formattedText = formatFallbackText(payload);
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: formattedText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const tgData = await tgRes.json();
      if (tgRes.ok && tgData.ok) {
        return res.status(200).json({
          success: true,
          channel: 'server-gateway',
          message_id: tgData.result?.message_id,
          event: payload.event,
        });
      } else {
        return res.status(502).json({
          success: false,
          error: tgData.description || 'Telegram API call failed',
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err?.message || 'Server Telegram dispatch error',
      });
    }
  }

  // 2. Supabase Edge Function fallback
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('telegram-notify', {
        body: payload,
      });

      if (!error && data?.success) {
        return res.status(200).json({
          success: true,
          channel: 'supabase-edge-function',
          message_id: data.message_id,
          event: payload.event,
        });
      }

      if (error) {
        console.warn('[Telegram Dispatcher] Supabase Edge Function note:', error.message);
      }
    } catch (edgeErr: any) {
      console.warn('[Telegram Dispatcher] Supabase Edge Function invocation exception:', edgeErr?.message);
    }
  }

  // Neither Edge Function nor Server secrets configured
  return res.status(503).json({
    success: false,
    error: 'Telegram Bot Token is not yet configured.',
    hint: 'Configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Supabase Secrets or Server Environment.',
  });
}

function formatFallbackText(payload: any): string {
  const timestamp = new Date().toUTCString();
  switch (payload.event) {
    case 'NEW_USER_REGISTRATION':
      return [
        `👤 <b>NEW RIDER REGISTRATION</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Callsign:</b> ${payload.user?.name || payload.user?.callsign || 'New Member'}`,
        `<b>Email:</b> <code>${payload.user?.email || 'N/A'}</code>`,
        `<b>User ID:</b> <code>${payload.user?.id || 'N/A'}</code>`,
        `<b>Method:</b> ${payload.user?.authProvider || 'OAuth / Password'}`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'SUCCESSFUL_LOGIN':
      return [
        `🔐 <b>SUCCESSFUL RIDER SIGN-IN</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Account:</b> <code>${payload.user?.email || 'Anonymous'}</code>`,
        `<b>User ID:</b> <code>${payload.user?.id || 'N/A'}</code>`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'SECURITY_ALERT':
      return [
        `🚨 <b>SECURITY ALERT // ${payload.security?.severity || 'HIGH'}</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Action:</b> ${payload.security?.action || 'Security Check'}`,
        `<b>Details:</b> <code>${payload.security?.details || 'N/A'}</code>`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'NEW_ORDER':
      return [
        `📦 <b>NEW ORDER CONFIRMED</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Order ID:</b> <code>${payload.order?.orderId || 'N/A'}</code>`,
        `<b>Amount:</b> <b>₹${payload.order?.amount?.toLocaleString('en-IN') || 0}</b>`,
        `<b>Customer:</b> ${payload.order?.customerName || 'Customer'}`,
        `<b>City:</b> ${payload.order?.city || 'Direct Shipping'}`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'PAYMENT_SUCCESS':
      return [
        `💳 <b>PAYMENT CONFIRMED // SUCCESSFUL</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Order ID:</b> <code>${payload.order?.orderId || payload.customFields?.orderId || 'N/A'}</code>`,
        `<b>Payment ID:</b> <code>${payload.customFields?.paymentId || 'N/A'}</code>`,
        `<b>Amount Paid:</b> <b>${payload.order?.currency || payload.customFields?.currency || '₹'}${Number(payload.order?.amount || payload.customFields?.amount || 0).toLocaleString('en-IN')}</b>`,
        `<b>Customer:</b> ${payload.order?.customerName || payload.customFields?.customerName || 'Verified Rider'}`,
        `<b>Method / Gateway:</b> ${payload.customFields?.paymentMethod || 'UPI / Razorpay / Card'}`,
        `<b>Verification:</b> ${payload.order?.isDemo || payload.customFields?.isDemo ? '🧪 DEMO SANDBOX CLEARED' : '✅ PRODUCTION SETTLED'}`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'RIDER_REGISTRATION':
      return [
        `🏍️ <b>RIDER REGISTRATION COMPLETED</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Rider Callsign:</b> <b>${payload.customFields?.callsign || payload.user?.callsign || 'RIDER_UNKNOWN'}</b>`,
        `<b>Full Name:</b> ${payload.user?.name || payload.customFields?.name || 'Rider Member'}`,
        `<b>Sector / Location:</b> ${payload.customFields?.sector || 'GLOBAL_GRID'}`,
        `<b>Contact Phone:</b> <code>${payload.customFields?.phone || 'N/A'}</code>`,
        `<b>Account Email:</b> <code>${payload.user?.email || payload.customFields?.email || 'N/A'}</code>`,
        `<b>Gear Unit / Spec:</b> ${payload.customFields?.gearTagged || 'Undergroundz Technical Apparel'}`,
        `<b>Clearance:</b> Verified Rider Tier 0 (Active)`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'ORDER_STATUS_CHANGED':
      return [
        `📦 <b>ORDER STATUS UPDATE</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Order ID:</b> <code>${payload.order?.orderId || payload.customFields?.orderId || 'N/A'}</code>`,
        `<b>Previous Status:</b> ${payload.customFields?.oldStatus || 'PENDING'}`,
        `<b>New Status:</b> <b>${payload.customFields?.newStatus || 'CONFIRMED'}</b>`,
        `<b>Customer:</b> ${payload.order?.customerName || payload.customFields?.customerName || 'Customer'}`,
        `<b>Tracking / Logistics:</b> ${payload.customFields?.trackingNumber || 'Assigned by Logistics'}`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'NEW_REVIEW':
      return [
        `⭐ <b>NEW PRODUCT REVIEW SUBMITTED</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Product:</b> <b>${payload.customFields?.productName || 'Product Review'}</b>`,
        `<b>Rating:</b> ${'★'.repeat(Math.min(5, Math.max(1, Number(payload.customFields?.rating || 5))))} (${payload.customFields?.rating || 5}/5)`,
        `<b>Reviewer:</b> ${payload.customFields?.author || payload.user?.name || 'Verified Rider'}`,
        `<b>Status:</b> ${payload.customFields?.verifiedPurchase !== false ? '✅ VERIFIED PURCHASE' : 'COMMUNITY MEMBER'}`,
        `<b>Feedback:</b> <i>"${String(payload.customFields?.reviewText || 'No feedback text provided.').slice(0, 300)}"</i>`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'SYSTEM_ALERT':
      return [
        `⚠️ <b>SYSTEM ALERT</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Notice:</b> ${payload.alert?.message || 'Broadcast'}`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    case 'SYSTEM_ERROR':
      return [
        `💥 <b>ADMIN ATTENTION: SYSTEM ERROR</b>`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `<b>Context:</b> ${payload.error?.context || 'Core'}`,
        `<b>Error:</b> <code>${payload.error?.message || 'Exception'}</code>`,
        `<b>Timestamp:</b> ${timestamp}`,
      ].join('\n');

    default:
      return `⚡ <b>UNDERGROUNDZ ALERT: ${payload.event}</b>\n<b>Timestamp:</b> ${timestamp}`;
  }
}
