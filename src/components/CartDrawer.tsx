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
  const cartCurrency = cart[0]?.product.currency || '₹';

  const handleCheckout = () => {
    onClose();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm transition-opacity">
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-[#101014] border-l border-[#25252e] p-6 md:p-8 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex justify-between items-center border-b border-[#202028] pb-6 mb-6">
            <div>
              <span className="font-body text-[11px] text-[#8e8e98] uppercase block font-semibold tracking-wider">ORDER MANIFEST</span>
              <h2 className="font-display text-2xl md:text-3xl uppercase font-bold text-white tracking-tight">SHOPPING CART</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-[#8e8e98] p-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-5xl text-[#353540] mb-4">shopping_bag</span>
              <p className="font-display text-xl text-white uppercase tracking-tight mb-2 font-bold">YOUR CART IS EMPTY</p>
              <p className="font-body text-xs text-[#8e8e98] max-w-xs leading-relaxed">
                Explore our jackets, hoodies, tees, and riding apparel to build your outfit.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="p-4 border border-[#22222a] bg-[#14141a] flex gap-4 items-center relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover grayscale contrast-125 border border-[#282832]"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-body text-[10px] text-[#8e8e98] uppercase font-semibold">SKU: {item.product.code}</span>
                      <span className="font-body text-xs font-bold text-white">
                        {item.product.currency}{((item.product.price * item.quantity) % 1 === 0 ? (item.product.price * item.quantity).toLocaleString() : (item.product.price * item.quantity).toFixed(2))}
                      </span>
                    </div>
                    <h4 className="font-body text-sm font-semibold uppercase text-white mb-0.5 tracking-tight">
                      {item.product.name}
                    </h4>
                    <p className="font-body text-xs text-[#8e8e98] mb-3">
                      SIZE: {item.size} {item.color ? `| ${item.color}` : ''}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[#2a2a34] bg-[#0c0c0f]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                          className="px-2.5 py-1 text-white hover:bg-[#202028] font-body text-xs cursor-pointer transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 font-body text-xs text-white font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                          className="px-2.5 py-1 text-white hover:bg-[#202028] font-body text-xs cursor-pointer transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id, item.size)}
                        className="text-[#8e8e98] hover:text-red-400 font-body text-[11px] uppercase ml-auto cursor-pointer font-medium tracking-wider transition-colors"
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
          <div className="border-t border-[#202028] pt-6 mt-6">
            <div className="flex justify-between items-center mb-2 font-body text-xs text-[#8e8e98]">
              <span>SHIPPING</span>
              <span className="text-white font-medium">CALCULATED AT CHECKOUT</span>
            </div>
            <div className="flex justify-between items-baseline mb-6">
              <span className="font-body text-xs uppercase text-[#8e8e98] tracking-wider font-semibold">SUBTOTAL</span>
              <span className="font-display text-3xl font-bold text-white tracking-tight">{cartCurrency}{totalPrice % 1 === 0 ? totalPrice.toLocaleString() : totalPrice.toFixed(2)}</span>
            </div>

            <HoverBorderGradient
              id="btn-initiate-checkout-drawer"
              as="button"
              containerClassName="w-full rounded-none"
              className="w-full py-4 bg-white text-black font-body font-semibold text-xs uppercase tracking-wider hover:bg-[#d8d8d8] transition-colors active:scale-98 flex items-center justify-center gap-2"
              onClick={handleCheckout}
            >
              <span>PROCEED TO CHECKOUT</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </HoverBorderGradient>
          </div>
        )}
      </aside>
    </div>
  );
};
