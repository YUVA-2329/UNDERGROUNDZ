import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Order } from '../types';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder')
);

const ORDERS_STORAGE_KEY = 'undergroundz_customer_orders';

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    });
  } catch (err) {
    console.error('[Undergroundz] Supabase client initialization error:', err);
  }
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface OAuthRedirectInfo {
  redirectUrl: string;
  isAiStudioDev: boolean;
  isIframe: boolean;
  environmentType: 'localhost' | 'ai_studio_dev' | 'ai_studio_shared' | 'production';
  warning?: string;
}

/**
 * Determine the safe OAuth redirect URL and detect current environment constraints.
 */
export function getOAuthRedirectInfo(): OAuthRedirectInfo {
  if (typeof window === 'undefined') {
    return {
      redirectUrl: '',
      isAiStudioDev: false,
      isIframe: false,
      environmentType: 'production',
    };
  }

  const hostname = window.location.hostname;
  const isIframe = window.self !== window.top;
  const isAiStudioDev = hostname.startsWith('ais-dev-') && hostname.endsWith('.run.app');
  const isAiStudioShared = hostname.startsWith('ais-pre-') && hostname.endsWith('.run.app');
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  let environmentType: OAuthRedirectInfo['environmentType'] = 'production';
  if (isLocalhost) {
    environmentType = 'localhost';
  } else if (isAiStudioDev) {
    environmentType = 'ai_studio_dev';
  } else if (isAiStudioShared) {
    environmentType = 'ai_studio_shared';
  }

  // 1. Localhost development
  if (isLocalhost) {
    return {
      redirectUrl: `${window.location.origin}/`,
      isAiStudioDev: false,
      isIframe,
      environmentType,
    };
  }

  // 2. Private AI Studio Cloud Run dev URL
  if (isAiStudioDev) {
    // Note: Cloud Run IAM blocks direct unauthenticated redirects back to ais-dev-*.run.app with HTTP 403.
    // The shared app URL (ais-pre-*) is the public Cloud Run ingress endpoint.
    const sharedOrigin = window.location.origin.replace('ais-dev-', 'ais-pre-');
    return {
      redirectUrl: `${sharedOrigin}/`,
      isAiStudioDev: true,
      isIframe,
      environmentType,
      warning:
        'Cloud Run IAM blocks direct unauthenticated redirects to ais-dev-*.run.app (403 Forbidden). Popup flow or Email/Password is recommended.',
    };
  }

  // 3. Shared preview or Production domain
  return {
    redirectUrl: `${window.location.origin}/`,
    isAiStudioDev: false,
    isIframe,
    environmentType,
  };
}

/**
 * Sign in with Google OAuth using Supabase.
 * Prefers popup flow with skipBrowserRedirect to avoid iframe X-Frame-Options blocking.
 */
export async function signInWithGoogle(options?: {
  returnView?: string;
  skipPopup?: boolean;
}): Promise<{
  error: Error | null;
  url?: string;
  popupBlocked?: boolean;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      error: new Error(
        'Supabase is not configured. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.'
      ),
    };
  }

  if (options?.returnView && typeof window !== 'undefined') {
    sessionStorage.setItem('undergroundz_auth_return_view', options.returnView);
  }

  const { redirectUrl } = getOAuthRedirectInfo();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { error };
    }

    if (!data?.url) {
      return { error: new Error('Failed to obtain Google OAuth authorization URL from Supabase.') };
    }

    if (options?.skipPopup) {
      return { error: null, url: data.url, popupBlocked: false };
    }

    // Open popup window centered
    if (typeof window !== 'undefined') {
      const width = 540;
      const height = 660;
      const left = Math.max(0, (window.screen.width - width) / 2);
      const top = Math.max(0, (window.screen.height - height) / 2);

      const popup = window.open(
        data.url,
        'undergroundz_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,scrollbars=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        return {
          error: null,
          url: data.url,
          popupBlocked: true,
        };
      }

      return { error: null, url: data.url, popupBlocked: false };
    }

    return { error: null, url: data.url };
  } catch (err: any) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(
  email: string,
  password: string,
  returnView?: string
): Promise<{ data: any; error: Error | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error(
        'Supabase is not configured. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.'
      ),
    };
  }

  if (returnView && typeof window !== 'undefined') {
    sessionStorage.setItem('undergroundz_auth_return_view', returnView);
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { data: null, error };
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('undergroundz-auth-change'));
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string,
  returnView?: string
): Promise<{ data: any; error: Error | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error(
        'Supabase is not configured. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.'
      ),
    };
  }

  if (returnView && typeof window !== 'undefined') {
    sessionStorage.setItem('undergroundz_auth_return_view', returnView);
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName?.trim() || '',
          name: fullName?.trim() || '',
        },
      },
    });

    if (error) {
      return { data: null, error };
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('undergroundz-auth-change'));
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Sign out of the current session
 */
export async function signOut(): Promise<{ error: Error | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('undergroundz-auth-change'));
      }
      return { error };
    } catch (err: any) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  }

  return { error: null };
}

/**
 * Get the current user from Supabase session
 */
export async function getCurrentUser(): Promise<User | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        return data.user;
      }
    } catch (e) {
      console.warn('[Undergroundz Auth] Failed to retrieve current user:', e);
    }
  }
  return null;
}

/**
 * Save an order to Supabase and LocalStorage
 */
export async function saveOrder(order: Order): Promise<{ success: boolean; error?: string }> {
  // Always persist locally first so customer can immediately view it
  try {
    const existing = getLocalOrders();
    const updated = [order, ...existing.filter(o => o.order_id !== order.order_id)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save order to local storage:', err);
  }

  // If Supabase is configured, sync to database table 'orders'
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('orders').insert({
        order_id: order.order_id,
        user_id: order.user_id || null,
        items: order.items,
        amount: order.amount,
        currency: order.currency,
        customer_name: order.customer.fullName,
        email: order.customer.email,
        phone: order.customer.phone,
        shipping_address: order.customer,
        payment_gateway_order_id: order.payment_gateway_order_id || null,
        payment_id: order.payment_id || null,
        payment_status: order.payment_status,
        order_status: order.order_status,
        created_at: order.created_at,
      });

      if (error) {
        console.warn('[Undergroundz] Supabase insert warning (check orders table schema):', error.message);
        return { success: true, error: error.message };
      }
    } catch (dbErr: any) {
      console.warn('[Undergroundz] Supabase orders table sync error:', dbErr?.message);
    }
  }

  return { success: true };
}

/**
 * Get all orders for a user
 */
export async function fetchUserOrders(userId?: string, email?: string): Promise<Order[]> {
  const localOrders = getLocalOrders();

  if (isSupabaseConfigured && supabase && (userId || email)) {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      } else if (email) {
        query = query.eq('email', email);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map database records to Order objects
        const remoteOrders: Order[] = data.map((d: any) => ({
          order_id: d.order_id,
          user_id: d.user_id,
          items: d.items,
          amount: Number(d.amount),
          currency: d.currency || '₹',
          customer: typeof d.shipping_address === 'object' ? d.shipping_address : {
            fullName: d.customer_name || '',
            email: d.email || '',
            phone: d.phone || '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
          },
          payment_gateway_order_id: d.payment_gateway_order_id,
          payment_id: d.payment_id,
          payment_status: d.payment_status,
          order_status: d.order_status,
          created_at: d.created_at,
          estimated_delivery: '3-5 Business Days',
        }));

        // Merge with local orders, deduplicating by order_id
        const orderMap = new Map<string, Order>();
        remoteOrders.forEach(o => orderMap.set(o.order_id, o));
        localOrders.forEach(o => {
          if (!orderMap.has(o.order_id)) {
            orderMap.set(o.order_id, o);
          }
        });
        return Array.from(orderMap.values());
      }
    } catch (e) {
      console.warn('Error fetching orders from Supabase:', e);
    }
  }

  // Filter local orders by email or return all for the session
  if (email) {
    return localOrders.filter(o => o.customer.email.toLowerCase() === email.toLowerCase());
  }
  return localOrders;
}

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
