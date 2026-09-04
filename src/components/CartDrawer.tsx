import React, { useState } from 'react';
import { CartItem } from '../types';
import { HoverBorderGradient } from './ui/hover-border-gradient';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  onProceedToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onClose();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm transition-opacity">
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-[#131313] border-l border-[#444748] p-6 md:p-8 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex justify-between items-center border-b border-[#3a3a3a] pb-6 mb-6">
            <div>
              <span className="font-mono-tech text-xs text-[#8e9192] uppercase block">GEAR INVENTORY</span>
              <h2 className="font-display text-2xl uppercase font-bold text-white tracking-tighter">TACTICAL DEPLOYMENT</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-[#8e9192] p-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl text-[#444748] mb-4">inventory_2</span>
              <p className="font-mono-tech text-sm text-[#8e9192] uppercase tracking-wider mb-2">GEAR BAY EMPTY</p>
              <p className="font-body text-xs text-[#c4c7c8] max-w-xs">Select items from the HOODIES, TEES, or SHIRTS collections to prepare for deployment.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="p-4 brutalist-border bg-[#1b1b1b] flex gap-4 items-center relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover grayscale contrast-125 border border-[#3a3a3a]"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-mono-tech text-[10px] text-[#8e9192]">ID: {item.product.code}</span>
                      <span className="font-mono-tech text-xs text-white">
                        {item.product.currency}{item.product.price * item.quantity}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold uppercase text-white mb-1">
                      {item.product.name}
                    </h4>
                    <p className="font-mono-tech text-[10px] text-[#8e9192] mb-3">
                      SIZE: {item.size} {item.color ? `| COLOR: ${item.color}` : ''}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[#3a3a3a] bg-[#131313]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                          className="px-2 py-0.5 text-white hover:bg-[#2a2a2a] font-mono-tech text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 font-mono-tech text-xs text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                          className="px-2 py-0.5 text-white hover:bg-[#2a2a2a] font-mono-tech text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id, item.size)}
                        className="text-[#8e9192] hover:text-red-400 font-mono-tech text-[10px] uppercase ml-auto cursor-pointer"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[#3a3a3a] pt-6 mt-6">
            <div className="flex justify-between items-center mb-2 font-mono-tech text-xs text-[#8e9192]">
              <span>SHIPPING PROTOCOL</span>
              <span>EXPRESS SECURE</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono-tech text-sm uppercase text-white font-bold">TOTAL GEAR VALUE</span>
              <span className="font-display text-2xl font-extrabold text-white">${totalPrice.toFixed(2)}</span>
            </div>

            <HoverBorderGradient
              id="btn-initiate-checkout-drawer"
              as="button"
              containerClassName="w-full rounded-none"
              className="w-full py-5 bg-white text-black font-display font-bold text-sm uppercase tracking-wider hover:bg-[#c6c6c7] transition-colors active:scale-98 flex items-center justify-center gap-2"
              onClick={handleCheckout}
            >
              <span>PROCEED TO ENCRYPTED CHECKOUT</span>
              <span className="material-symbols-outlined text-lg">lock</span>
            </HoverBorderGradient>
          </div>
        )}
      </aside>
    </div>
  );
};
