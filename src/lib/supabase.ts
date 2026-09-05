import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Order, OrderStatus, UserProfile, CommunityPost, ProductReview } from '../types';
import { INITIAL_COMMUNITY_POSTS, PRODUCT_REVIEWS } from '../data';

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
 * Fetch a user profile from Supabase 'profiles' table
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          fullName: data.full_name || '',
          phone: data.phone || '',
          shippingAddress: data.shipping_address || undefined,
          callsign: data.callsign || '',
          sector: data.sector || '',
          avatarUrl: data.avatar_url || '',
          role: data.role || 'MEMBER_VERIFIED',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (err: any) {
      console.warn('[Undergroundz] Supabase fetchUserProfile notice:', err?.message);
    }
  }

  // Fallback to local cache if DB table is initializing or offline
  try {
    const raw = localStorage.getItem(`undergroundz_profile_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}

  return null;
}

/**
 * Create or update a user profile in Supabase 'profiles' table
 */
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<{
  success: boolean;
  data?: UserProfile;
  error?: string;
}> {
  // Always update local cache first
  try {
    const existingRaw = localStorage.getItem(`undergroundz_profile_${profile.id}`);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    const merged = { ...existing, ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem(`undergroundz_profile_${profile.id}`, JSON.stringify(merged));
  } catch {}

  if (isSupabaseConfigured && supabase && profile.id) {
    try {
      const payload: Record<string, any> = {
        id: profile.id,
        updated_at: new Date().toISOString(),
      };
      if (profile.email !== undefined) payload.email = profile.email;
      if (profile.fullName !== undefined) payload.full_name = profile.fullName;
      if (profile.phone !== undefined) payload.phone = profile.phone;
      if (profile.shippingAddress !== undefined) payload.shipping_address = profile.shippingAddress;
      if (profile.callsign !== undefined) payload.callsign = profile.callsign;
      if (profile.sector !== undefined) payload.sector = profile.sector;
      if (profile.avatarUrl !== undefined) payload.avatar_url = profile.avatarUrl;
      if (profile.role !== undefined) payload.role = profile.role;

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select('*')
        .maybeSingle();

      if (error) {
        console.warn('[Undergroundz] Supabase upsertUserProfile notice (check profiles table schema):', error.message);
        return { success: true, error: error.message };
      }

      if (data) {
        return {
          success: true,
          data: {
            id: data.id,
            email: data.email,
            fullName: data.full_name || '',
            phone: data.phone || '',
            shippingAddress: data.shipping_address || undefined,
            callsign: data.callsign || '',
            sector: data.sector || '',
            avatarUrl: data.avatar_url || '',
            role: data.role || 'MEMBER_VERIFIED',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          },
        };
      }
    } catch (dbErr: any) {
      console.warn('[Undergroundz] Supabase profile sync error:', dbErr?.message);
    }
  }

  return { success: true };
}

/**
 * Fetch all community field reports and dispatches from Supabase
 */
export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  let dbPosts: CommunityPost[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dbPosts = data.map((d: any) => ({
          id: d.post_id || d.id,
          author: d.author,
          role: d.role || 'MEMBER_VERIFIED',
          location: d.location || 'GLOBAL_GRID',
          type: d.type || 'quote',
          quote: d.quote,
          image: d.image || undefined,
          timestamp: d.created_at || new Date().toISOString(),
          heightClass: 'sm',
        }));
      }
    } catch (err: any) {
      console.warn('[Undergroundz] Supabase community_posts fetch notice:', err?.message);
    }
  }

  // Retrieve any locally cached posts
  let localPosts: CommunityPost[] = [];
  try {
    const raw = localStorage.getItem('undergroundz_community_posts');
    if (raw) localPosts = JSON.parse(raw);
  } catch {}

  // Merge unique by ID: DB posts first, then local posts, then system default broadcasts
  const map = new Map<string, CommunityPost>();
  dbPosts.forEach((p) => map.set(p.id, p));
  localPosts.forEach((p) => {
    if (!map.has(p.id)) map.set(p.id, p);
  });
  INITIAL_COMMUNITY_POSTS.forEach((p) => {
    if (!map.has(p.id)) map.set(p.id, p);
  });

  return Array.from(map.values());
}

/**
 * Create and publish a community post / rider field report to Supabase
 */
export async function createCommunityPost(
  post: CommunityPost,
  userId?: string
): Promise<{ success: boolean; post?: CommunityPost; error?: string }> {
  // Cache locally
  try {
    const raw = localStorage.getItem('undergroundz_community_posts');
    const existing: CommunityPost[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem('undergroundz_community_posts', JSON.stringify([post, ...existing]));
  } catch {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('community_posts').insert({
        post_id: post.id,
        user_id: userId || null,
        author: post.author,
        role: post.role,
        location: post.location,
        type: post.type,
        quote: post.quote || '',
        image: post.image || null,
        created_at: post.timestamp || new Date().toISOString(),
      }).select().maybeSingle();

      if (error) {
        console.warn('[Undergroundz] Supabase community_posts insert warning:', error.message);
        return { success: true, post, error: error.message };
      }

      return { success: true, post };
    } catch (err: any) {
      console.warn('[Undergroundz] Supabase community post error:', err?.message);
    }
  }

  return { success: true, post };
}

/**
 * Fetch verified customer reviews from Supabase 'product_reviews' table
 */
export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  const fallback = PRODUCT_REVIEWS[productId] || [];

  if (isSupabaseConfigured && supabase && productId) {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const remoteReviews: ProductReview[] = data.map((d: any) => ({
          id: d.id,
          productId: d.product_id,
          userName: d.user_name,
          userAvatar: d.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          rating: d.rating,
          reviewDate: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          reviewText: d.review_text,
          verifiedPurchase: d.verified_purchase ?? true,
          stylingImage: d.styling_image || undefined,
          sizeWorn: d.size_worn || undefined,
          colorWorn: d.color_worn || undefined,
          isDemo: false,
        }));

        // Merge remote with static reviews, deduplicating by ID
        const map = new Map<string, ProductReview>();
        remoteReviews.forEach((r) => map.set(r.id, r));
        fallback.forEach((r) => {
          if (!map.has(r.id)) map.set(r.id, r);
        });
        return Array.from(map.values()).slice(0, 5);
      }
    } catch (err: any) {
      console.warn('[Undergroundz] Supabase product_reviews fetch notice:', err?.message);
    }
  }

  return fallback;
}

/**
 * Submit a customer product review to Supabase
 */
export async function submitProductReview(
  review: ProductReview,
  userId?: string
): Promise<{ success: boolean; review?: ProductReview; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('product_reviews').insert({
        product_id: review.productId,
        user_id: userId || null,
        user_name: review.userName,
        user_avatar: review.userAvatar,
        rating: review.rating,
        review_text: review.reviewText,
        styling_image: review.stylingImage || null,
        size_worn: review.sizeWorn || null,
        color_worn: review.colorWorn || null,
        verified_purchase: review.verifiedPurchase,
      });

      if (error) {
        console.warn('[Undergroundz] Supabase product_reviews insert warning:', error.message);
        return { success: true, error: error.message };
      }
      return { success: true, review };
    } catch (err: any) {
      console.warn('[Undergroundz] Supabase review submit error:', err?.message);
    }
  }

  return { success: true, review };
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
 * Update an existing order's status and trigger a Telegram status notification
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus | string,
  options?: { trackingNumber?: string; customerName?: string; customerEmail?: string }
): Promise<{ success: boolean; oldStatus?: string; error?: string }> {
  const localOrders = getLocalOrders();
  let oldStatus = 'CONFIRMED';
  const targetIndex = localOrders.findIndex((o) => o.order_id === orderId);

  if (targetIndex !== -1) {
    oldStatus = localOrders[targetIndex].order_status;
    localOrders[targetIndex].order_status = newStatus as OrderStatus;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(localOrders));
    } catch {}
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('order_id', orderId);

      if (error) {
        console.warn('[Undergroundz] Supabase order status update notice:', error.message);
      }
    } catch (err: any) {
      console.warn('[Undergroundz] Supabase order update exception:', err?.message);
    }
  }

  // Dispatch Telegram Order Status update
  try {
    const { notifyOrderStatusChange } = await import('../services/telegramNotifications');
    await notifyOrderStatusChange({
      orderId,
      oldStatus,
      newStatus,
      customerName: options?.customerName || (targetIndex !== -1 ? localOrders[targetIndex].customer.fullName : 'Customer'),
      customerEmail: options?.customerEmail || (targetIndex !== -1 ? localOrders[targetIndex].customer.email : undefined),
      trackingNumber: options?.trackingNumber || `UGZ-TRACK-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  } catch (err) {
    console.warn('Failed to dispatch order status telegram notification:', err);
  }

  return { success: true, oldStatus };
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
