import React from 'react';
import { ViewType, CartItem } from '../types';
import { User as UserIcon, Package, ShoppingBag, Menu } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface NavigationHeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  onSelectCategory?: (category: string) => void;
  onOpenAccount?: () => void;
  user?: User | null;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  setCurrentView,
  cart,
  setIsCartOpen,
  setIsMenuOpen,
  onSelectCategory,
  onOpenAccount,
  user,
}) => {
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-16 h-16 bg-[#09090b]/90 backdrop-blur-md border-b border-[#222] transition-colors">
      <div className="flex items-center gap-4">
        <button
          id="btn-header-menu"
          onClick={() => setIsMenuOpen(true)}
          className="text-white hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer p-1"
          title="Open System Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          id="btn-header-logo"
          onClick={() => setCurrentView('home')}
          className="font-display text-xl md:text-2xl tracking-tighter uppercase text-white font-extrabold cursor-pointer hover:opacity-90"
        >
          <img src="/logo.png" alt="UNDERGROUNDZ" className="h-6 md:h-8" />
        </button>
      </div>

      <div className="hidden md:flex gap-8 items-center">
        <nav className="flex gap-8 items-center">
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('VOID');
              setCurrentView('collection');
            }}
            className={`font-body text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              currentView === 'collection' ? 'text-white font-semibold underline underline-offset-8' : 'text-[#8e8e98] hover:text-white font-medium'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setCurrentView('community')}
            className={`font-body text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              currentView === 'community' ? 'text-white font-semibold underline underline-offset-8' : 'text-[#8e8e98] hover:text-white font-medium'
            }`}
          >
            Community
          </button>
          <button
            onClick={() => setCurrentView('my-orders')}
            className={`font-body text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'my-orders' ? 'text-white font-semibold underline underline-offset-8' : 'text-[#8e8e98] hover:text-white font-medium'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>
        </nav>

        {/* Identity & Account Button */}
        <button
          id="btn-header-account"
          onClick={onOpenAccount}
          className="flex items-center gap-2 text-white hover:opacity-80 p-1 transition-opacity cursor-pointer"
          title={user ? `Account: ${user.email}` : 'Sign In / Account'}
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-6 h-6 rounded-none border border-white/40 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-6 h-6 border border-[#333] bg-[#141418] flex items-center justify-center text-[10px] font-body font-semibold text-white">
              {user ? (user.email || 'U')[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
            </div>
          )}
          <span className="font-body text-xs font-semibold tracking-wider text-[#b8b8c2] hidden lg:inline uppercase">
            {user ? 'ACCOUNT' : 'SIGN IN'}
          </span>
        </button>

        {/* Cart Trigger */}
        <button
          id="btn-header-cart"
          onClick={() => setIsCartOpen(true)}
          className="relative text-white hover:opacity-70 transition-opacity cursor-pointer p-1"
          title="View Gear Inventory"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#9e1b24] text-white font-body text-[10px] font-bold w-4 h-4 rounded-none flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </button>
      </div>

      <div className="md:hidden flex items-center gap-3">
        <button
          id="btn-header-account-mobile"
          onClick={onOpenAccount}
          className="text-white hover:opacity-70 p-1"
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-5 h-5 object-cover border border-[#444]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <UserIcon className="w-5 h-5" />
          )}
        </button>

        <button
          id="btn-header-cart-mobile"
          onClick={() => setIsCartOpen(true)}
          className="relative text-white cursor-pointer p-1"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#9e1b24] text-white font-body text-[10px] font-bold w-4 h-4 rounded-none flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
