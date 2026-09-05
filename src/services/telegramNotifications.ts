/**
 * Undergroundz Telegram Notification Service
 *
 * Securely routes automated notifications for critical events to your existing Telegram Bot
 * via Supabase Edge Functions (and server gateway fallback).
 *
 * Security & Reliability Guarantees:
 * 1. ZERO client-side token exposure: TELEGRAM_BOT_TOKEN is stored exclusively in Supabase Secrets.
 * 2. Intelligent Deduplication: Prevents repeat dispatches on page refresh, session refresh, or fast re-renders.
 * 3. Extensible Payload Structure: Easily add new events without refactoring the core dispatcher.
 */

import { supabase } from '../lib/supabase';
import { Order } from '../types';

export type TelegramEventType =
  | 'NEW_USER_REGISTRATION'
  | 'SUCCESSFUL_LOGIN'
  | 'NEW_ORDER'
  | 'PAYMENT_SUCCESS'
  | 'RIDER_REGISTRATION'
  | 'ORDER_STATUS_CHANGED'
  | 'NEW_REVIEW'
  | 'SECURITY_ALERT'
  | 'SYSTEM_ALERT'
  | 'SYSTEM_ERROR';

export interface TelegramNotificationPayload {
  event: TelegramEventType | string;
  title?: string;
  timestamp?: string;
  chat_id?: string | number;
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
    status?: string;
  };
  security?: {
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    action: string;
    details: string;
    ipOrOrigin?: string;
  };
  alert?: {
    level: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
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

// In-memory deduplication set to avoid spamming the bot during rapid re-renders
const sentEventSignatures = new Set<string>();

function getDeduplicationKey(payload: TelegramNotificationPayload): string {
  switch (payload.event) {
    case 'SUCCESSFUL_LOGIN':
      return `login-${payload.user?.id || payload.user?.email || 'anon'}-${payload.customFields?.sessionTokenId || 'session'}`;
    case 'NEW_USER_REGISTRATION':
      return `reg-${payload.user?.id || payload.user?.email || 'anon'}`;
    case 'NEW_ORDER':
      return `order-${payload.order?.orderId || payload.customFields?.orderId || 'unknown'}`;
    case 'PAYMENT_SUCCESS':
      return `pay-${payload.order?.orderId || payload.customFields?.orderId || payload.customFields?.paymentId || 'unknown'}`;
    case 'RIDER_REGISTRATION':
      return `rider-${payload.user?.id || payload.customFields?.callsign || 'anon'}`;
    case 'ORDER_STATUS_CHANGED':
      return `status-${payload.order?.orderId || payload.customFields?.orderId || 'unknown'}-${payload.customFields?.newStatus || 'unknown'}`;
    case 'NEW_REVIEW':
      return `review-${payload.customFields?.productId || 'prod'}-${payload.customFields?.author || payload.user?.id || 'anon'}`;
    case 'SECURITY_ALERT':
      return `sec-${payload.security?.action}-${payload.security?.details?.slice(0, 30)}`;
    default:
      return `${payload.event}-${payload.title || ''}-${Math.floor(Date.now() / 60000)}`;
  }
}

function hasAlreadyBeenDispatched(key: string): boolean {
  if (sentEventSignatures.has(key)) return true;

  if (typeof window !== 'undefined' && window.sessionStorage) {
    const sessionKey = `tg_sent_${key}`;
    if (sessionStorage.getItem(sessionKey)) {
      return true;
    }
  }

  return false;
}

function markAsDispatched(key: string): void {
  sentEventSignatures.add(key);

  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const sessionKey = `tg_sent_${key}`;
      sessionStorage.setItem(sessionKey, Date.now().toString());
    } catch {
      // Ignore storage quota warnings
    }
  }
}

/**
 * Core Dispatcher: Invokes Supabase Edge Function with graceful server fallback.
 */
export async function dispatchTelegramNotification(
  payload: TelegramNotificationPayload,
  options?: { bypassDeduplication?: boolean }
): Promise<{ success: boolean; message?: string; error?: string }> {
  const dedupeKey = getDeduplicationKey(payload);

  if (!options?.bypassDeduplication && hasAlreadyBeenDispatched(dedupeKey)) {
    console.info(`[Telegram Notification] Event ${payload.event} skipped (deduplicated).`);
    return { success: true, message: 'Skipped duplicate notification.' };
  }

  const enrichedPayload: TelegramNotificationPayload = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
  };

  // 1. Primary Route: Backend Server Gateway Relay (/api/telegram-notify)
  try {
    const res = await fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedPayload),
    });

    const resData = await res.json();
    if (res.ok && resData.success) {
      markAsDispatched(dedupeKey);
      return {
        success: true,
        message: `Dispatched to Telegram Bot (${resData.channel || 'server-gateway'})`,
      };
    }

    // If server reports credentials missing, try edge function
    if (!resData.success && res.status !== 503) {
      // If Telegram API specifically returned an error (e.g., chat not found), return it
      return {
        success: false,
        error: resData.error || `Server gateway error: HTTP ${res.status}`,
      };
    }
  } catch {
    // Network or server offline; proceed to Edge Function fallback
  }

  // 2. Secondary Route: Supabase Edge Function (`supabase.functions.invoke('telegram-notify')`)
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('telegram-notify', {
        body: enrichedPayload,
      });

      if (!error && data?.success) {
        markAsDispatched(dedupeKey);
        return {
          success: true,
          message: `Dispatched via Supabase Edge Function (msg_id: ${data.message_id})`,
        };
      }

      if (error) {
        return {
          success: false,
          error: error.message || 'Supabase Edge Function error',
        };
      }
    } catch (edgeErr: any) {
      return {
        success: false,
        error: edgeErr?.message || 'Supabase Edge Function invocation failed',
      };
    }
  }

  return {
    success: false,
    error: 'Telegram Bot Token not configured or service unreachable.',
  };
}

// =========================================================================
// 1. New User Registration
// =========================================================================
export async function notifyNewUserRegistration(user: {
  id?: string;
  email?: string;
  name?: string;
  callsign?: string;
  authProvider?: string;
}): Promise<void> {
  await dispatchTelegramNotification({
    event: 'NEW_USER_REGISTRATION',
    title: 'New Rider Registered',
    user,
  });
}

// =========================================================================
// 2. Successful Login
// =========================================================================
export async function notifySuccessfulLogin(user: {
  id?: string;
  email?: string;
  callsign?: string;
  authProvider?: string;
}): Promise<void> {
  // Strict rule: only authentic logins are dispatched; deduplicated per session
  await dispatchTelegramNotification({
    event: 'SUCCESSFUL_LOGIN',
    title: 'Rider Signed In',
    user,
  });
}

// =========================================================================
// 3. New Orders / Transactions
// =========================================================================
export async function notifyNewOrder(order: Order): Promise<void> {
  await dispatchTelegramNotification({
    event: 'NEW_ORDER',
    title: `New Order: ${order.order_id}`,
    order: {
      orderId: order.order_id,
      amount: order.amount,
      currency: order.currency || '₹',
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      customerName: order.customer.fullName,
      customerEmail: order.customer.email,
      city: order.customer.city,
      isDemo: order.is_demo,
      paymentMethod: order.payment_status,
      status: order.order_status,
    },
    customFields: {
      orderId: order.order_id,
      itemsSummary: order.items.map((i) => `${i.quantity}x ${i.product.name} (${i.size})`).join(', '),
      status: order.order_status,
    },
  });
}

// =========================================================================
// 4. Payment Success
// =========================================================================
export async function notifyPaymentSuccess(payment: {
  orderId: string;
  paymentId: string;
  amount: number;
  currency?: string;
  customerName?: string;
  paymentMethod?: string;
  isDemo?: boolean;
}): Promise<void> {
  await dispatchTelegramNotification({
    event: 'PAYMENT_SUCCESS',
    title: `Payment Confirmed: ${payment.orderId}`,
    order: {
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency || '₹',
      itemCount: 1,
      customerName: payment.customerName || 'Verified Rider',
      customerEmail: '',
      isDemo: payment.isDemo,
      paymentMethod: payment.paymentMethod || 'Confirmed',
    },
    customFields: {
      orderId: payment.orderId,
      paymentId: payment.paymentId,
      amount: payment.amount,
      currency: payment.currency || '₹',
      customerName: payment.customerName,
      paymentMethod: payment.paymentMethod || 'UPI / Razorpay',
      isDemo: payment.isDemo,
    },
  });
}

// =========================================================================
// 5. Rider Registration
// =========================================================================
export async function notifyRiderRegistration(rider: {
  userId?: string;
  callsign: string;
  name?: string;
  email?: string;
  sector?: string;
  phone?: string;
  gearTagged?: string;
  source?: string;
}): Promise<void> {
  await dispatchTelegramNotification({
    event: 'RIDER_REGISTRATION',
    title: `Rider Registration: ${rider.callsign}`,
    user: {
      id: rider.userId,
      email: rider.email,
      name: rider.name,
      callsign: rider.callsign,
    },
    customFields: {
      callsign: rider.callsign,
      name: rider.name || 'Rider Member',
      email: rider.email,
      sector: rider.sector || 'GLOBAL_GRID',
      phone: rider.phone,
      gearTagged: rider.gearTagged || 'Undergroundz Technical Apparel',
      source: rider.source || 'Rider Dossier',
    },
  });
}

// =========================================================================
// 6. Order Status Meaningful Change
// =========================================================================
export async function notifyOrderStatusChange(statusUpdate: {
  orderId: string;
  oldStatus?: string;
  newStatus: string;
  customerName?: string;
  customerEmail?: string;
  trackingNumber?: string;
}): Promise<void> {
  await dispatchTelegramNotification({
    event: 'ORDER_STATUS_CHANGED',
    title: `Order Status: ${statusUpdate.orderId} -> ${statusUpdate.newStatus}`,
    customFields: {
      orderId: statusUpdate.orderId,
      oldStatus: statusUpdate.oldStatus || 'CONFIRMED',
      newStatus: statusUpdate.newStatus,
      customerName: statusUpdate.customerName || 'Customer',
      trackingNumber: statusUpdate.trackingNumber || 'UGZ-LOGISTICS-AIR',
    },
  });
}

// =========================================================================
// 7. Verified Product Review
// =========================================================================
export async function notifyProductReview(review: {
  productName: string;
  productId?: string;
  rating: number;
  reviewText: string;
  author?: string;
  userName?: string;
  verifiedPurchase?: boolean;
  sizeWorn?: string;
  colorWorn?: string;
}): Promise<void> {
  const reviewerName = review.author || review.userName || 'Verified Customer';
  await dispatchTelegramNotification({
    event: 'NEW_REVIEW',
    title: `Review on ${review.productName}`,
    customFields: {
      productName: review.productName,
      productId: review.productId,
      rating: review.rating,
      reviewText: review.reviewText,
      author: reviewerName,
      userName: reviewerName,
      verifiedPurchase: review.verifiedPurchase !== false,
      sizeWorn: review.sizeWorn,
      colorWorn: review.colorWorn,
    },
  });
}

// =========================================================================
// 8. Important Security Events
// =========================================================================
export async function notifySecurityAlert(
  action: string,
  details: string,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH',
  ipOrOrigin?: string
): Promise<void> {
  await dispatchTelegramNotification({
    event: 'SECURITY_ALERT',
    title: `Security Alert: ${action}`,
    security: {
      action,
      details,
      severity,
      ipOrOrigin: ipOrOrigin || (typeof window !== 'undefined' ? window.location.origin : 'Edge'),
    },
  });
}

// =========================================================================
// 5. Important Admin / System Alerts
// =========================================================================
export async function notifySystemAlert(
  title: string,
  message: string,
  level: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL' = 'WARNING',
  metadata?: Record<string, unknown>
): Promise<void> {
  await dispatchTelegramNotification({
    event: 'SYSTEM_ALERT',
    title,
    alert: {
      message,
      level,
      metadata,
    },
  });
}

// =========================================================================
// 6. System Errors Requiring Administrator Attention
// =========================================================================
export async function notifySystemError(
  error: Error | string,
  context: string = 'App Core'
): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  await dispatchTelegramNotification({
    event: 'SYSTEM_ERROR',
    title: `System Exception in ${context}`,
    error: {
      message,
      context,
      stack,
    },
  });
}

// =========================================================================
// Test Ping utility for Diagnostic verification
// =========================================================================
export async function sendTelegramTestPing(): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  return await dispatchTelegramNotification(
    {
      event: 'SYSTEM_ALERT',
      title: 'Undergroundz Telegram Test Ping',
      alert: {
        level: 'INFO',
        message: 'Telegram Notification Service is active and operational from Undergroundz.',
        metadata: {
          timestamp: new Date().toISOString(),
          environment: typeof window !== 'undefined' ? window.location.hostname : 'Server',
        },
      },
    },
    { bypassDeduplication: true }
  );
}
