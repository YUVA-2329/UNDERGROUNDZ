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
import { SystemIndexPage } from './views/SystemIndexPage';
import { CollectionVoidPage } from './views/CollectionVoidPage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { CommunityPage } from './views/CommunityPage';
import { CheckoutPage } from './views/CheckoutPage';
import { OrderConfirmationPage } from './views/OrderConfirmationPage';
import { MyOrdersPage } from './views/MyOrdersPage';
import { getCurrentUser, supabase, MockUser } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
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
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('undergroundz_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Auth synchronization
  useEffect(() => {
    async function initAuth() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    initAuth();

    const handleAuthEvent = () => {
      initAuth();
    };
    window.addEventListener('undergroundz-auth-change', handleAuthEvent);

    let authSubscription: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
      authSubscription = data.subscription;
    }

    return () => {
      window.removeEventListener('undergroundz-auth-change', handleAuthEvent);
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Cart operations
  const handleAddToCart = (product: ProductItem, size: string, color?: string) => {
    const chosenColor = color || product.availableColors?.[0]?.name || 'VOID BLACK';
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
    const chosenColor = color || product.availableColors?.[0]?.name || 'VOID BLACK';
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size && item.color === chosenColor
      );
      if (existing) {
        return prev;
      }
      return [...prev, { product, quantity: 1, size, color: chosenColor }];
    });
    setCurrentView('checkout');
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

  const handleAddCommunityPost = (post: CommunityPost) => {
    setCommunityPosts((prev) => [post, ...prev]);
  };

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#e2e2e2] font-body relative selection:bg-[#ff3300] selection:text-white">
      {/* Top Header */}
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
      <BottomNavBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Modals & Overlays */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onSelectCategory={setSelectedCategory}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setCurrentView('checkout')}
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
      />
    </div>
  );
}
