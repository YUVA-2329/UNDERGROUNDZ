/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewType, ProductItem, CartItem, CommunityPost, Order } from './types';
import { PRODUCTS, INITIAL_COMMUNITY_POSTS } from './data';
import { NavigationHeader } from './components/NavigationHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AccountModal } from './components/AccountModal';
import { AuthPromptToast } from './components/AuthPromptToast';
import { AuthDebugPanel } from './components/AuthDebugPanel';
import { SystemIndexPage } from './views/SystemIndexPage';
import { CollectionVoidPage } from './views/CollectionVoidPage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { CommunityPage } from './views/CommunityPage';
import { RidersPage } from './views/RidersPage';
import { CheckoutPage } from './views/CheckoutPage';
import { OrderConfirmationPage } from './views/OrderConfirmationPage';
import { MyOrdersPage } from './views/MyOrdersPage';
import { BrandIntroCinematic } from './components/BrandIntroCinematic';
import {
  getCurrentUser,
  supabase,
  fetchCommunityPosts,
  createCommunityPost,
  fetchUserProfile,
  upsertUserProfile,
} from './lib/supabase';
import {
  notifySuccessfulLogin,
  notifyNewUserRegistration,
  notifyNewOrder,
  notifySystemError,
} from './services/telegramNotifications';
import type { User } from '@supabase/supabase-js';

export default function App() {
  // Determine initial view:
  // 1. Auth return callback takes priority (no intro during auth redirects)
  // 2. Play intro ONLY ONCE per tab on first visit; after n refreshes it will NOT play a second time
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check if returning from OAuth redirect / authentication
        const savedView = sessionStorage.getItem('undergroundz_auth_return_view');
        if (savedView) {
          sessionStorage.removeItem('undergroundz_auth_return_view');
          return savedView as ViewType;
        }
        return 'home';
      } catch {
        return 'home';
      }
    }
    return 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS[0]);
  
  // Persistent Cart across reloads and Google Auth redirects
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('undergroundz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [user, setUser] = useState<User | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'signup'>('signin');

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('undergroundz_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Load community posts from Supabase
  useEffect(() => {
    fetchCommunityPosts().then((posts) => {
      if (posts && posts.length > 0) {
        setCommunityPosts(posts);
      }
    });
  }, []);

  // Sync user profile to Supabase on authentication
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id).then((profile) => {
        if (!profile) {
          upsertUserProfile({
            id: user.id,
            email: user.email || '',
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
            avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
            role: 'MEMBER_VERIFIED',
          });
          // Dispatch Telegram notification for newly registered rider
          notifyNewUserRegistration({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'New Rider Member',
            authProvider: user.app_metadata?.provider || 'Supabase Auth',
          });
        }
      });
    }
  }, [user]);

  // Auth synchronization & Session Lifecycle Handler
  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;

    async function initSessionAndCallbacks() {
      // 1. Check if this window was opened as a popup callback
      if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const hash = window.location.hash;

        if (code && supabase) {
          try {
            await supabase.auth.exchangeCodeForSession(code);
            window.opener.postMessage({ type: 'UNDERGROUNDZ_AUTH_SUCCESS' }, '*');
            setTimeout(() => window.close(), 300);
            return;
          } catch (e) {
            console.error('[Undergroundz Auth] Popup code exchange failed:', e);
          }
        } else if (hash.includes('access_token') || hash.includes('refresh_token')) {
          window.opener.postMessage({ type: 'UNDERGROUNDZ_AUTH_SUCCESS' }, '*');
          setTimeout(() => window.close(), 300);
          return;
        }
      }

      // 2. PKCE code callback handling in primary window
      if (typeof window !== 'undefined' && supabase) {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        if (code) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && data?.session) {
              setUser(data.session.user);
              // Clean up 'code' param from address bar without page reload
              url.searchParams.delete('code');
              window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);

              // Restore view if saved
              const savedView = sessionStorage.getItem('undergroundz_auth_return_view');
              if (savedView) {
                sessionStorage.removeItem('undergroundz_auth_return_view');
                setCurrentView(savedView as ViewType);
              }
            }
          } catch (err) {
            console.error('[Undergroundz Auth] PKCE exchange error:', err);
          }
        }
      }

      // 3. Initial session retrieval
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (!error && data?.session?.user) {
            setUser(data.session.user);
          } else {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    initSessionAndCallbacks();

    // 4. Supabase onAuthStateChange Lifecycle
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.info(`[Undergroundz Auth] Lifecycle Event: ${event}`);

        switch (event) {
          case 'INITIAL_SESSION':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            setUser(session?.user || null);
            break;

          case 'SIGNED_IN': {
            setUser(session?.user || null);
            setIsAccountOpen(false);
            
            // Strict check: only dispatch when genuinely initiated by user (explicit login action)
            // Strictly avoids triggering on: page refresh, session refresh, existing session, or failed login
            const explicitLoginFlag = typeof window !== 'undefined' ? sessionStorage.getItem('undergroundz_explicit_login_flag') : null;
            const isRecentLogin = explicitLoginFlag ? (Date.now() - Number(explicitLoginFlag) < 120000) : false;
            const alreadyNotified = typeof window !== 'undefined' && sessionStorage.getItem('undergroundz_active_session_notified') === session?.user?.id;

            if (session?.user && isRecentLogin && !alreadyNotified) {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('undergroundz_explicit_login_flag');
                sessionStorage.setItem('undergroundz_active_session_notified', session.user.id);
              }
              notifySuccessfulLogin({
                id: session.user.id,
                email: session.user.email,
                callsign:
                  session.user.user_metadata?.full_name ||
                  session.user.user_metadata?.name ||
                  'Verified Rider',
                authProvider: session.user.app_metadata?.provider || 'Supabase Auth',
              }).catch(() => {});
            }

            // Restore return view
            if (typeof window !== 'undefined') {
              const savedView = sessionStorage.getItem('undergroundz_auth_return_view');
              if (savedView) {
                sessionStorage.removeItem('undergroundz_auth_return_view');
                setCurrentView(savedView as ViewType);
              }
            }
            break;
          }

          case 'SIGNED_OUT':
            setUser(null);
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('undergroundz_active_session_notified');
              sessionStorage.removeItem('undergroundz_explicit_login_flag');
            }
            break;

          default:
            setUser(session?.user || null);
            break;
        }
      });
      authSubscription = data.subscription;
    }

    // 5. Popup message handler (when popup completes auth and signals main window)
    const handlePopupMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UNDERGROUNDZ_AUTH_SUCCESS' && supabase) {
        supabase.auth.getSession().then(({ data }) => {
          if (data?.session?.user) {
            setUser(data.session.user);
            setIsAccountOpen(false);
            const savedView = sessionStorage.getItem('undergroundz_auth_return_view');
            if (savedView) {
              sessionStorage.removeItem('undergroundz_auth_return_view');
              setCurrentView(savedView as ViewType);
            }
          }
        });
      }
    };
    window.addEventListener('message', handlePopupMessage);

    // 6. Custom local auth change event listener
    const handleLocalAuthEvent = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    window.addEventListener('undergroundz-auth-change', handleLocalAuthEvent);

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      window.removeEventListener('message', handlePopupMessage);
      window.removeEventListener('undergroundz-auth-change', handleLocalAuthEvent);
    };
  }, []);

  // Cart operations
  const handleAddToCart = (product: ProductItem, size: string, color?: string) => {
    const chosenColor = color || product.availableColors?.[0]?.name || 'NIGHT REFLECTION';
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size && item.color === chosenColor
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size && item.color === chosenColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, size, color: chosenColor }];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: ProductItem, size: string, color?: string) => {
    const chosenColor = color || product.availableColors?.[0]?.name || 'NIGHT REFLECTION';
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size && item.color === chosenColor
      );
      if (existing) {
        return prev;
      }
      return [...prev, { product, quantity: 1, size, color: chosenColor }];
    });
    if (!user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('undergroundz_auth_return_view', 'checkout');
      }
      setIsAccountOpen(true);
    } else {
      setCurrentView('checkout');
    }
  };

  const handleUpdateQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('undergroundz_cart');
    } catch {}
  };

  const handleAddCommunityPost = async (post: CommunityPost) => {
    setCommunityPosts((prev) => [post, ...prev]);
    await createCommunityPost(post, user?.id);
  };

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    notifyNewOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#e2e2e2] font-body relative selection:bg-[#ff3300] selection:text-white">
      {/* Cinematic Brand Intro removed per instructions */}

      {/* Top Header */}
      {currentView !== 'intro' && (
        <NavigationHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
          cart={cart}
          setIsCartOpen={setIsCartOpen}
          setIsMenuOpen={setIsMenuOpen}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenAccount={() => setIsAccountOpen(true)}
          user={user}
        />
      )}

      {/* Main View Router */}
      {currentView === 'home' && (
        <SystemIndexPage
          setCurrentView={setCurrentView}
          onSelectProduct={setSelectedProduct}
          onSelectCategory={setSelectedCategory}
          products={PRODUCTS}
        />
      )}

      {currentView === 'collection' && (
        <CollectionVoidPage
          setCurrentView={setCurrentView}
          onSelectProduct={setSelectedProduct}
          onAddToCart={handleAddToCart}
          products={PRODUCTS}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {currentView === 'product' && (
        <ProductDetailPage
          product={selectedProduct}
          setCurrentView={setCurrentView}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />
      )}

      {currentView === 'community' && (
        <CommunityPage
          posts={communityPosts}
          onAddPost={handleAddCommunityPost}
          onViewRiders={() => setCurrentView('riders')}
          user={user}
          onOpenAccount={() => setIsAccountOpen(true)}
        />
      )}

      {currentView === 'riders' && (
        <RidersPage
          setCurrentView={setCurrentView}
          posts={communityPosts}
        />
      )}

      {currentView === 'checkout' && (
        <CheckoutPage
          cart={cart}
          setCurrentView={setCurrentView}
          onOrderSuccess={handleOrderSuccess}
          onClearCart={handleClearCart}
        />
      )}

      {currentView === 'order-confirmation' && (
        <OrderConfirmationPage
          order={completedOrder}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'my-orders' && (
        <MyOrdersPage
          setCurrentView={setCurrentView}
        />
      )}

      {/* Mobile Navigation Bar */}
      {currentView !== 'intro' && (
        <BottomNavBar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {/* Modals & Overlays */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onSelectCategory={setSelectedCategory}
        onOpenAccount={() => setIsAccountOpen(true)}
        user={user}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          if (!user) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('undergroundz_auth_return_view', 'checkout');
            }
            setIsAccountOpen(true);
          } else {
            setCurrentView('checkout');
          }
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={setSelectedProduct}
        setCurrentView={setCurrentView}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        setCurrentView={setCurrentView}
        initialAuthMode={authModalInitialMode}
      />

      <AuthPromptToast 
        user={user} 
        onSignIn={() => {
          setAuthModalInitialMode('signin');
          setIsAccountOpen(true);
        }} 
        onSignUp={() => {
          setAuthModalInitialMode('signup');
          setIsAccountOpen(true);
        }}
      />

      {/* Development Auth Diagnostic Panel */}
      {currentView !== 'intro' && <AuthDebugPanel user={user} />}
    </div>
  );
}
