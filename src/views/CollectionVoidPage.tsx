import React, { useState } from 'react';
import { ViewType, ProductItem } from '../types';

interface CollectionVoidPageProps {
  setCurrentView: (view: ViewType) => void;
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem, size: string) => void;
  products: ProductItem[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CollectionVoidPage: React.FC<CollectionVoidPageProps> = ({
  setCurrentView,
  onSelectProduct,
  onAddToCart,
  products,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories = ['ALL', 'HOODIES', 'TEES', 'SHIRTS', 'KNITS'];

  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleQuickAdd = (product: ProductItem) => {
    onAddToCart(product, product.availableSizes[0] || 'M');
    setAddedNotice(product.id);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  return (
    <main className="pt-16 pb-24 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[65vh] md:h-[75vh] overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img
            alt="Male and Female riders in technical UNDERGROUNDZ apparel"
            className="w-full h-full object-cover grayscale contrast-125 brightness-75 transition-transform duration-1000 scale-105"
            src="/collections_hero.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-transparent"></div>
          <div className="vignette-overlay absolute inset-0"></div>
        </div>

        <div className="relative z-10 px-5 md:px-16 mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-2xl">
              <span className="font-mono-tech text-xs text-white mb-2 tracking-[0.25em] uppercase block">
                SYSTEM CATALOG // 4 EXCLUSIVE COLLECTIONS
              </span>
              <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase mb-4 leading-none font-extrabold text-white">
                {selectedCategory === 'ALL' ? 'ALL 4 COLLECTIONS' : `COLLECTION / ${selectedCategory}`}
              </h2>
              <p className="font-body text-sm md:text-base text-[#c4c7c8] max-w-xl">
                Every piece features an athletic man or woman wearing engineered technical apparel, stamped with authentic <span className="text-white font-bold underline decoration-white">UNDERGROUNDZ</span> high-contrast chest and back branding.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1 text-right font-mono-tech">
              <span className="text-[10px] text-[#8e9192] uppercase">UNITS LOADED</span>
              <span className="text-sm font-bold text-white">[ {filteredProducts.length} / 15 COLLECTIONS ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="px-5 md:px-16 py-6 bg-[#1b1b1b] border-y border-[#444748] sticky top-16 z-40 backdrop-blur-md bg-[#1b1b1b]/95">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <span className="font-mono-tech text-[10px] text-[#8e9192] uppercase pr-2 whitespace-nowrap">
              CATEGORIES:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 font-mono-tech text-xs uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-[#131313] text-[#8e9192] border-[#3a3a3a] hover:text-white hover:border-[#8e9192]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 font-mono-tech text-xs text-[#8e9192]">
            <span>FILTERED: <strong className="text-white">{filteredProducts.length} UNITS</strong></span>
            <span>SHOWING MODELS: <strong className="text-white">MEN & WOMEN</strong></span>
          </div>
        </div>
      </section>

      {/* Product Index Grid (15 Collections) */}
      <section className="px-5 md:px-16 py-16">
        <div className="flex justify-between items-baseline border-b border-[#444748] pb-4 mb-12">
          <h3 className="font-mono-tech text-xs uppercase tracking-widest text-white font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            CATALOG INDEX [{filteredProducts.length < 10 ? `0${filteredProducts.length}` : filteredProducts.length} UNITS]
          </h3>
          <span className="font-mono-tech text-[10px] text-[#8e9192] uppercase">
            UNDERGROUNDZ GUARANTEE: BRANDED APPAREL & MODEL PHOTOS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group relative flex flex-col bg-[#181818] border border-[#3a3a3a] hover:border-white transition-all duration-300"
            >
              {/* Product Image Box */}
              <div
                onClick={() => {
                  onSelectProduct(product);
                  setCurrentView('product');
                }}
                className="aspect-[4/5] bg-[#0e0e0e] overflow-hidden cursor-pointer relative"
              >
                <img
                  src={product.image}
                  alt={`${product.name} worn by ${product.model}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 grayscale contrast-125"
                  referrerPolicy="no-referrer"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  <span className="bg-[#131313]/90 text-white font-mono-tech text-[10px] px-2.5 py-1 border border-[#3a3a3a] uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">person</span>
                    MODEL: {product.model} WEARING
                  </span>
                  <span className="bg-black/90 text-emerald-400 font-mono-tech text-[9px] px-2 py-0.5 border border-[#3a3a3a]">
                    SPECS: {product.specs.waterproof} / {product.specs.weight}
                  </span>
                </div>

                {/* Prominent UNDERGROUNDZ Branding Stamp Badge on Image */}
                <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-sm border border-white/40 px-3 py-1.5 text-right z-10">
                  <span className="font-display font-extrabold text-xs text-white uppercase tracking-tighter block">
                    UNDERGROUNDZ
                  </span>
                  <span className="font-mono-tech text-[8px] text-[#c4c7c8] uppercase block">
                    {product.undergroundzBranding}
                  </span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-6 bg-[#131313]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono-tech text-[10px] text-[#8e9192] uppercase">
                      COLLECTION // {product.category} — {product.itemNumber}
                    </span>
                    <span className="font-mono-tech text-base text-white font-extrabold">
                      {product.currency}{product.price.toFixed(2)}
                    </span>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectProduct(product);
                      setCurrentView('product');
                    }}
                    className="font-display text-xl uppercase font-bold text-white cursor-pointer hover:underline tracking-tight mb-2"
                  >
                    {product.name}
                  </h4>

                  <p className="font-body text-xs text-[#c4c7c8] line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="p-2.5 bg-[#1b1b1b] border border-[#3a3a3a] font-mono-tech text-[10px] text-white flex justify-between items-center">
                    <span className="text-[#8e9192] uppercase">BRAND EMBLEM:</span>
                    <span className="font-bold text-white uppercase">{product.undergroundzBranding}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => {
                      onSelectProduct(product);
                      setCurrentView('product');
                    }}
                    className="flex-1 bg-white text-black py-3 px-4 font-display font-bold text-xs uppercase text-center active:scale-[0.98] transition-transform hover:bg-[#c6c6c7] cursor-pointer"
                  >
                    EXAMINE SPECS
                  </button>
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="w-12 h-12 border border-[#444748] bg-[#1b1b1b] flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer relative"
                    title="Add to Gear Bay"
                  >
                    <span className="material-symbols-outlined">
                      {addedNotice === product.id ? 'check' : 'add'}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Atmospheric Footer Divider */}
      <section className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-[1px] h-20 bg-[#444748] mb-6"></div>
        <p className="font-mono-tech text-[10px] tracking-[0.4em] uppercase text-[#8e9192]">
          ALL 15 UNDERGROUNDZ COLLECTIONS INDEXED & VERIFIED
        </p>
      </section>
    </main>
  );
};
