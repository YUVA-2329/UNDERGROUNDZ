import React, { useState } from 'react';
import { ViewType, CartItem } from '../types';

interface NavigationHeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  onSelectCategory?: (category: string) => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  setCurrentView,
  cart,
  setIsCartOpen,
  setIsMenuOpen,
  onSelectCategory
}) => {
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-16 h-16 bg-[#131313]/85 backdrop-blur-md border-b border-[#444748] transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="material-symbols-outlined text-white hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer"
          title="Open System Menu"
        >
          menu
        </button>
        <button
          onClick={() => setCurrentView('home')}
          className="font-display text-xl md:text-2xl tracking-tighter uppercase text-white font-extrabold cursor-pointer hover:opacity-90"
        >
          <img src="/logo.png" alt="UNDERGROUNDZ" className="h-6 md:h-8" />
        </button>
      </div>

      <div className="hidden md:flex gap-8 items-center">
        <nav className="flex gap-8">
          <button
            onClick={() => {
              if (onSelectCategory) onSelectCategory('VOID');
              setCurrentView('collection');
            }}
            className={`font-mono-tech text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              currentView === 'collection' ? 'text-white font-bold underline underline-offset-4' : 'text-[#8e9192] hover:text-white'
            }`}
          >
            New Drops
          </button>
          <button
            onClick={() => {
              setCurrentView('collection');
            }}
            className={`font-mono-tech text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              currentView === 'collection' ? 'text-white' : 'text-[#8e9192] hover:text-white'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => setCurrentView('community')}
            className={`font-mono-tech text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              currentView === 'community' ? 'text-white font-bold underline underline-offset-4' : 'text-[#8e9192] hover:text-white'
            }`}
          >
            Community
          </button>

        </nav>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative material-symbols-outlined text-white hover:opacity-70 transition-opacity cursor-pointer p-1"
          title="View Gear Inventory"
        >
          shopping_bag
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-black font-mono-tech text-[10px] font-bold w-4 h-4 rounded-none flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </button>
      </div>

      <div className="md:hidden flex items-center gap-3">

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative material-symbols-outlined text-white cursor-pointer p-1"
        >
          shopping_bag
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-black font-mono-tech text-[10px] font-bold w-4 h-4 rounded-none flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
