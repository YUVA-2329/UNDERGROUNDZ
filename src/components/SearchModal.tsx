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
      <div className="w-full max-w-2xl bg-[#101014] border border-[#25252e] p-6 shadow-2xl animate-fade-in relative">
        <div className="flex justify-between items-center mb-6 border-b border-[#202028] pb-4">
          <span className="font-body text-[11px] text-[#8e8e98] uppercase font-semibold tracking-wider">SEARCH THE ARCHIVE // CATALOG & SPECS</span>
          <button onClick={onClose} className="text-white hover:text-[#8e8e98] cursor-pointer transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH PRODUCTS, MATERIALS, CATEGORIES (HOODIE, JACKET, TEE)..."
            autoFocus
            className="w-full bg-[#16161c] border border-[#282832] px-4 py-3.5 text-white font-body text-xs tracking-wider uppercase focus:outline-none focus:border-white transition-colors"
          />
          <span className="material-symbols-outlined absolute right-4 top-3.5 text-[#8e8e98]">search</span>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3 hide-scrollbar">
          {filteredProducts.length === 0 ? (
            <p className="font-body text-xs text-[#8e8e98] py-8 text-center uppercase tracking-wider">NO MATCHING PRODUCTS FOUND</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  setCurrentView('product');
                  onClose();
                }}
                className="p-3.5 bg-[#14141a] border border-[#22222a] hover:border-white transition-colors cursor-pointer flex gap-4 items-center group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover grayscale contrast-125 border border-[#282832]"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-body text-[10px] text-[#8e8e98] uppercase font-semibold">SKU: {product.code} / {product.category}</span>
                    <span className="font-body text-xs text-white font-bold">{product.currency}{product.price}</span>
                  </div>
                  <h4 className="font-body text-sm font-semibold text-white group-hover:translate-x-1 transition-transform tracking-tight">
                    {product.name}
                  </h4>
                  <p className="font-body text-xs text-[#a0a0aa] line-clamp-1">{product.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
