import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Order } from '../types';

const DEFAULT_SUPABASE_URL = 'https://myntjfzjfyzyqnlmwsrd.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bnRqZnpqZnl6eXFubG13c3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MjcwNjcsImV4cCI6MjEwNDEwMzA2N30.y00M-47lxwi-cLu4LtuqZB6HaN8nWK0tW0l0E-3QMpE';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder')
);

// Fallback user state for testing when Supabase env variables are not yet provided
const MOCK_USER_STORAGE_KEY = 'undergroundz_mock_auth_user';
const ORDERS_STORAGE_KEY = 'undergroundz_customer_orders';

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[Undergroundz] Supabase client initialization error:', err);
  }
}

export interface AuthState {
  user: User | MockUser | null;
  isAuthenticated: boolean;
  isMock: boolean;
}

export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
  };
}

/**
 * Sign in with Google OAuth via Supabase
 */
export async function signInWithGoogle(): Promise<{ error: Error | null; url?: string }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  }

  // Fallback / Demo mode when Supabase credentials are pending
  console.info('[Undergroundz] Supabase credentials not set. Using test Google user session for evaluation.');
  const mockUser: MockUser = {
    id: `usr_demo_${Date.now()}`,
    email: 'rider.alex@undergroundz.com',
    user_metadata: {
      full_name: 'Alex Vance',
      name: 'Alex Vance',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  };
  localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
  window.dispatchEvent(new Event('undergroundz-auth-change'));
  return { error: null };
}

/**
 * Sign out of current session
 */
export async function signOut(): Promise<{ error: Error | null }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  localStorage.removeItem(MOCK_USER_STORAGE_KEY);
  window.dispatchEvent(new Event('undergroundz-auth-change'));
  return { error: null };
}

/**
 * Get the current user (either from Supabase or test session)
 */
export async function getCurrentUser(): Promise<User | MockUser | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        return data.user;
      }
    } catch (e) {
      console.warn('Failed to fetch user from Supabase:', e);
    }
  }

  const stored = localStorage.getItem(MOCK_USER_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
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
          currency: d.currency || '$',
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
