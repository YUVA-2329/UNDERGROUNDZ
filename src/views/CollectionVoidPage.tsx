import React, { useState } from 'react';
import { ViewType, ProductItem } from '../types';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';

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
              <span className="font-body text-xs text-[#9c9ca8] mb-2 tracking-widest uppercase block font-semibold">
                SYSTEM CATALOG // 4 EXCLUSIVE COLLECTIONS
              </span>
              <h2 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase mb-3 leading-none font-bold text-white tracking-tight">
                {selectedCategory === 'ALL' ? 'ALL 4 COLLECTIONS' : `COLLECTION / ${selectedCategory}`}
              </h2>
              <p className="font-body text-sm md:text-base text-[#b0b0ba] max-w-xl leading-relaxed">
                Engineered technical apparel engineered for riders and urban operators, stamped with authentic <span className="text-white font-semibold underline decoration-white">UNDERGROUNDZ</span> high-contrast insignia.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1 text-right font-body">
              <span className="text-[11px] text-[#8e9192] uppercase tracking-wider font-medium">UNITS LOADED</span>
              <span className="text-sm font-semibold text-white tracking-wider">[ {filteredProducts.length} / 15 COLLECTIONS ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="px-5 md:px-16 py-5 bg-[#121216] border-y border-[#25252e] sticky top-16 z-40 backdrop-blur-md bg-[#121216]/95">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <span className="font-body text-[11px] font-semibold text-[#8e8e98] uppercase pr-2 whitespace-nowrap tracking-wider">
              CATEGORIES:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 font-body text-xs uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-[#16161b] text-[#8e8e98] border-[#292934] hover:text-white hover:border-[#8e8e98] font-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 font-body text-xs text-[#8e9192]">
            <span>FILTERED: <strong className="text-white font-semibold">{filteredProducts.length} UNITS</strong></span>
            <span>SHOWING MODELS: <strong className="text-white font-semibold">MEN & WOMEN</strong></span>
          </div>
        </div>
      </section>

      {/* Product Index Grid (15 Collections) */}
      <section className="px-5 md:px-16 py-16">
        <div className="flex justify-between items-baseline border-b border-[#25252e] pb-4 mb-12">
          <h3 className="font-body text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#9e1b24] rounded-full"></span>
            CATALOG INDEX [{filteredProducts.length < 10 ? `0${filteredProducts.length}` : filteredProducts.length} UNITS]
          </h3>
          <span className="font-body text-[11px] text-[#8e9192] uppercase tracking-wider">
            UNDERGROUNDZ GUARANTEE: CERTIFIED TECHNICAL GEAR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group relative flex flex-col bg-[#101014] border border-[#22222a] hover:border-white/50 transition-all duration-300"
            >
              {/* Product Image Box */}
              <div
                onClick={() => {
                  onSelectProduct(product);
                  setCurrentView('product');
                }}
                className="aspect-[4/5] bg-[#0c0c0e] overflow-hidden cursor-pointer relative"
              >
                <img
                  src={product.image}
                  alt={`${product.name} worn by ${product.model}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 grayscale contrast-125"
                  referrerPolicy="no-referrer"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {product.openingOffer && (
                    <span className="bg-[#9e1b24] text-white font-body text-[10px] px-2.5 py-1 uppercase font-bold tracking-wider shadow-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      OPENING OFFER
                    </span>
                  )}
                  <span className="bg-[#101014]/90 text-white font-body text-[10px] px-2.5 py-1 border border-[#2a2a34] uppercase font-semibold tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">person</span>
                    MODEL: {product.model} WEARING
                  </span>
                  <span className="bg-black/90 text-[#b0b0ba] font-body text-[9px] px-2 py-0.5 border border-[#2a2a34]">
                    SPECS: {product.specs.waterproof} / {product.specs.weight}
                  </span>
                </div>

                {/* Prominent UNDERGROUNDZ Branding Stamp Badge on Image */}
                <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-sm border border-white/30 px-3 py-1.5 text-right z-10">
                  <span className="font-display font-bold text-sm text-white uppercase tracking-tight block">
                    UNDERGROUNDZ
                  </span>
                  <span className="font-body text-[9px] text-[#9c9ca8] uppercase tracking-wider block font-medium">
                    {product.undergroundzBranding}
                  </span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-5 bg-[#101014]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-body text-[11px] text-[#8e8e98] uppercase font-medium tracking-wider">
                      SERIES // {product.category} — {product.itemNumber}
                    </span>
                    <div className="text-right">
                      <span className="font-body text-base text-white font-bold tracking-tight block">
                        {product.currency}{product.price % 1 === 0 ? product.price.toLocaleString() : product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="font-body text-[11px] text-[#71717a] line-through block">
                          {product.currency}{product.originalPrice % 1 === 0 ? product.originalPrice.toLocaleString() : product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectProduct(product);
                      setCurrentView('product');
                    }}
                    className="font-body text-lg uppercase font-semibold text-white cursor-pointer hover:underline tracking-tight mb-2"
                  >
                    {product.name}
                  </h4>

                  <p className="font-body text-xs text-[#9c9ca8] line-clamp-2 mb-3 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="p-2.5 bg-[#16161b] border border-[#23232c] font-body text-[11px] text-white flex justify-between items-center">
                    <span className="text-[#8e8e98] uppercase">BRAND EMBLEM:</span>
                    <span className="font-semibold text-white uppercase">{product.undergroundzBranding}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <HoverBorderGradient
                    containerClassName="flex-1 rounded-none active:scale-[0.98] transition-transform"
                    as="button"
                    className="w-full bg-white text-black py-3 px-4 font-body font-semibold text-xs uppercase text-center hover:bg-[#d8d8d8] transition-colors tracking-wider"
                    onClick={() => {
                      onSelectProduct(product);
                      setCurrentView('product');
                    }}
                  >
                    EXAMINE SPECS
                  </HoverBorderGradient>
                  <HoverBorderGradient
                    containerClassName="w-12 h-12 rounded-none"
                    as="button"
                    className="w-full h-full bg-[#16161b] hover:bg-[#202028] text-white flex items-center justify-center p-0 transition-colors"
                    onClick={() => handleQuickAdd(product)}
                    title="Quick Add to Bag"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {addedNotice === product.id ? 'check' : 'shopping_bag'}
                    </span>
                  </HoverBorderGradient>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Atmospheric Footer Divider */}
      <section className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-[1px] h-16 bg-[#25252e] mb-6"></div>
        <p className="font-body text-[11px] tracking-widest uppercase text-[#8e8e98] font-medium">
          ALL 15 UNDERGROUNDZ EDITIONS INDEXED & VERIFIED
        </p>
      </section>
    </main>
  );
};
