/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewType, ProductItem, CartItem, CommunityPost } from './types';
import { PRODUCTS, INITIAL_COMMUNITY_POSTS } from './data';
import { NavigationHeader } from './components/NavigationHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SystemIndexPage } from './views/SystemIndexPage';
import { CollectionVoidPage } from './views/CollectionVoidPage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { CommunityPage } from './views/CommunityPage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (product: ProductItem, size: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, size }];
    });
    setIsCartOpen(true);
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
  };

  const handleAddCommunityPost = (post: CommunityPost) => {
    setCommunityPosts((prev) => [post, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-body relative">
      {/* Top Header */}
      <NavigationHeader
        currentView={currentView}
        setCurrentView={setCurrentView}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        setIsMenuOpen={setIsMenuOpen}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
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
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />
      )}

      {currentView === 'community' && (
        <CommunityPage
          posts={communityPosts}
          onAddPost={handleAddCommunityPost}
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
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
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
    </div>
  );
}
