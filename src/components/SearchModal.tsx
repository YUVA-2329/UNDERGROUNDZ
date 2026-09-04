import React, { useState } from 'react';
import { PRODUCTS } from '../data';
import { ProductItem, ViewType } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
  setCurrentView: (view: ViewType) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  setCurrentView,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.code.includes(query)
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-[#131313] brutalist-border p-6 shadow-2xl animate-fade-in relative">
        <div className="flex justify-between items-center mb-6 border-b border-[#3a3a3a] pb-4">
          <span className="font-mono-tech text-xs text-[#8e9192] uppercase">SYSTEM SEARCH // CATALOG & SPECS</span>
          <button onClick={onClose} className="text-white hover:text-[#8e9192] cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH GEAR, SPECS, CATEGORIES (E.G. VOID, SHELL, 20K)..."
            autoFocus
            className="w-full bg-[#1b1b1b] border border-[#3a3a3a] px-4 py-4 text-white font-mono-tech text-xs tracking-wider uppercase focus:outline-none focus:border-white"
          />
          <span className="material-symbols-outlined absolute right-4 top-4 text-[#8e9192]">search</span>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3 hide-scrollbar">
          {filteredProducts.length === 0 ? (
            <p className="font-mono-tech text-xs text-[#8e9192] py-8 text-center uppercase">NO MATCHING TACTICAL UNITS FOUND</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  setCurrentView('product');
                  onClose();
                }}
                className="p-4 bg-[#1f1f1f] border border-[#3a3a3a] hover:border-white transition-colors cursor-pointer flex gap-4 items-center group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover grayscale contrast-125 border border-[#3a3a3a]"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-mono-tech text-[10px] text-[#8e9192]">ID: {product.code} / {product.category}</span>
                    <span className="font-mono-tech text-xs text-white font-bold">{product.currency}{product.price}</span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                    {product.name}
                  </h4>
                  <p className="font-body text-xs text-[#c4c7c8] line-clamp-1">{product.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
