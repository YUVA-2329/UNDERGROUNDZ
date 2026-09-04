import React, { useState } from 'react';
import { ProductItem, ViewType } from '../types';

interface ProductDetailPageProps {
  product: ProductItem;
  setCurrentView: (view: ViewType) => void;
  onAddToCart: (product: ProductItem, size: string) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  setCurrentView,
  onAddToCart,
  onOpenSizeGuide,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes[0] || 'M'
  );
  const [visualizerMode, setVisualizerMode] = useState<'standard' | 'wireframe' | 'thermal' | 'xray'>('standard');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="pt-16 pb-20 md:pb-0 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] md:h-screen flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            alt={product.name}
            className="w-full h-full object-cover grayscale brightness-75 contrast-125 transition-all duration-700"
            src={product.image}
          />
          <div className="absolute inset-0 industrial-overlay opacity-80"></div>
        </div>

        <div className="relative z-10 w-full px-5 md:px-16 pb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="font-mono-tech text-[10px] text-white bg-[#1b1b1b] border border-[#3a3a3a] px-3 py-1 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs">person</span>
                MODEL: {product.model} WEARING
              </span>
              <span className="font-mono-tech text-[10px] text-white bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 uppercase tracking-widest font-bold">
                UNDERGROUNDZ: {product.undergroundzBranding}
              </span>
            </div>

            <span className="font-mono-tech text-xs text-[#8e9192] mb-3 block tracking-[0.2em] uppercase">
              SYSTEM_INDEX / {product.code}
            </span>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase leading-none mb-6 font-bold text-white">
              {product.name}
            </h2>
            <p className="font-body text-base md:text-lg text-[#c4c7c8] max-w-lg mb-6">
              {product.description}
            </p>

            {/* Size selection */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-tech text-xs text-[#8e9192] uppercase">SIZE:</span>
              <div className="flex gap-2 font-mono-tech text-xs">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-[#131313]/80 text-white border-[#444748] hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-3">
            <button
              onClick={handleAdd}
              className="w-full md:w-72 h-16 bg-white text-black font-display font-bold text-sm uppercase flex items-center justify-center gap-4 hover:bg-[#c6c6c7] transition-all cursor-pointer active:scale-95"
            >
              <span>{added ? 'ADDED TO GEAR BAY' : 'ADD TO GEAR'}</span>
              <span className="material-symbols-outlined text-lg">
                {added ? 'check' : 'add'}
              </span>
            </button>
            <div className="flex justify-between font-mono-tech text-xs text-[#8e9192]">
              <span>PRICE: {product.currency}{product.price.toFixed(2)}</span>
              <span>AVAILABILITY: IN STOCK</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specification Section */}
      <section className="py-20 px-5 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-[#444748] bg-[#131313]">
        <div className="md:col-span-4 flex flex-col justify-between gap-8">
          <div>
            <h3 className="font-mono-tech text-xs text-[#8e9192] uppercase tracking-widest mb-6 font-bold">
              Material Composition
            </h3>
            <ul className="flex flex-col gap-5 border-l border-[#444748] pl-6">
              <li className="flex flex-col">
                <span className="font-display font-bold text-white uppercase text-sm">Weather-resistant shell</span>
                <span className="text-[#c4c7c8] text-xs font-mono-tech">{product.specs.material}</span>
              </li>
              <li className="flex flex-col">
                <span className="font-display font-bold text-white uppercase text-sm">Industrial Hardware</span>
                <span className="text-[#c4c7c8] text-xs font-mono-tech">{product.specs.hardware}</span>
              </li>
              <li className="flex flex-col">
                <span className="font-display font-bold text-white uppercase text-sm">Hidden Utility</span>
                <span className="text-[#c4c7c8] text-xs font-mono-tech">{product.specs.utility}</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-[#444748]">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#3a3a3a] p-4 text-center bg-[#1b1b1b]">
                <span className="block font-mono-tech text-[10px] text-[#8e9192] mb-1 uppercase">Waterproof</span>
                <span className="font-display text-2xl font-bold text-white">{product.specs.waterproof}</span>
              </div>
              <div className="border border-[#3a3a3a] p-4 text-center bg-[#1b1b1b]">
                <span className="block font-mono-tech text-[10px] text-[#8e9192] mb-1 uppercase">Weight</span>
                <span className="font-display text-2xl font-bold text-white">{product.specs.weight}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Visualizer Container */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="relative w-full aspect-[16/9] min-h-[320px] bg-[#0e0e0e] border border-[#3a3a3a] group overflow-hidden flex flex-col justify-between p-6">
            {/* Mode Canvas Simulation */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
              <img
                src={product.image}
                alt="Visualizer layer"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  visualizerMode === 'wireframe'
                    ? 'invert contrast-200 saturate-0'
                    : visualizerMode === 'thermal'
                    ? 'hue-rotate-180 contrast-200'
                    : visualizerMode === 'xray'
                    ? 'contrast-200 grayscale brightness-150'
                    : 'grayscale contrast-125'
                }`}
              />
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="font-mono-tech text-[10px] text-[#8e9192] uppercase block">CAD / ARCHITECTURAL LAYER</span>
                <span className="font-mono-tech text-xs text-white font-bold uppercase">MODE: {visualizerMode.toUpperCase()}</span>
              </div>
              <span className="font-mono-tech text-[10px] text-emerald-400 bg-[#131313] px-2 py-1 border border-[#3a3a3a]">
                CALIBRATED 100%
              </span>
            </div>

            <div className="relative z-10 text-center my-auto py-8">
              <span className="font-mono-tech text-xs text-white uppercase tracking-wider block mb-2">Technical Visualizer</span>
              <div className="h-[1px] w-16 bg-white mx-auto mb-4"></div>
              <p className="font-mono-tech text-[10px] text-[#8e9192]">
                PTFE MEMBRANE INTEGRITY: OPTIMAL // THERMAL RETENTION: -15C PASS
              </p>
            </div>

            {/* Visualizer Mode Buttons */}
            <div className="relative z-10 flex gap-2 font-mono-tech text-[10px] overflow-x-auto pb-1">
              {(['standard', 'wireframe', 'thermal', 'xray'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setVisualizerMode(mode)}
                  className={`px-3 py-1.5 uppercase border cursor-pointer transition-all ${
                    visualizerMode === mode
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-[#131313] text-[#8e9192] border-[#3a3a3a] hover:text-white'
                  }`}
                >
                  {mode} VIEW
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detail Gallery - Macro Precision */}
      <section className="py-20 border-t border-[#444748] bg-[#1b1b1b]">
        <div className="px-5 md:px-16 mb-10 flex justify-between items-end">
          <h3 className="font-display text-2xl uppercase font-bold text-white tracking-tight">Macro Precision</h3>
          <span className="font-mono-tech text-xs text-[#8e9192] uppercase">
            View All Details / {product.macroImages.length + 1}
          </span>
        </div>

        <div className="flex overflow-x-auto gap-6 px-5 md:px-16 hide-scrollbar pb-4">
          {product.macroImages.map((macro, i) => (
            <div
              key={i}
              className="flex-none w-72 md:w-[420px] aspect-square bg-[#2a2a2a] border border-[#3a3a3a] group overflow-hidden relative"
            >
              <img
                alt={macro.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale brightness-90"
                src={macro.image}
              />
              <div className="absolute bottom-6 left-6 opacity-100 transition-opacity">
                <span className="bg-[#131313]/90 backdrop-blur-sm px-3 py-1.5 font-mono-tech text-[10px] text-white uppercase border border-[#3a3a3a] block mb-1">
                  {macro.title}
                </span>
                <span className="font-mono-tech text-[9px] text-[#8e9192] block">{macro.sub}</span>
              </div>
            </div>
          ))}

          <div className="flex-none w-72 md:w-[420px] aspect-square bg-[#1f1f1f] border border-[#3a3a3a] flex items-center justify-center p-8 text-center">
            <div>
              <span className="material-symbols-outlined text-4xl mb-4 text-[#8e9192]">architecture</span>
              <p className="font-mono-tech text-xs text-[#8e9192] uppercase leading-relaxed mb-4">
                Full blueprint vector schematic access available for verified syndicate members.
              </p>
              <button
                onClick={() => setCurrentView('community')}
                className="px-4 py-2 bg-white text-black font-mono-tech text-[10px] uppercase font-bold hover:bg-[#c6c6c7] cursor-pointer"
              >
                REQUEST ACCESS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description Column */}
      <section className="py-24 px-5 md:px-16 border-t border-[#444748] bg-[#0e0e0e]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="flex-1">
            <h4 className="font-display text-2xl uppercase font-bold text-white mb-6">Concept Narrative</h4>
            <div className="text-[#c4c7c8] font-body text-base space-y-4 leading-relaxed">
              {product.longDescription.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="w-full md:w-80 flex flex-col gap-6">
            <div className="border border-[#3a3a3a] p-6 flex flex-col gap-2 bg-[#131313]">
              <span className="font-mono-tech text-xs text-[#8e9192] uppercase">Location Origin</span>
              <span className="font-display font-bold text-white uppercase">{product.origin}</span>
            </div>

            <div className="border border-[#3a3a3a] p-6 flex flex-col gap-2 bg-[#131313]">
              <span className="font-mono-tech text-xs text-[#8e9192] uppercase">Edition Status</span>
              <span className="font-display font-bold text-white uppercase">{product.editionStatus}</span>
            </div>

            <button
              onClick={onOpenSizeGuide}
              className="w-full h-14 border border-white text-white font-display font-bold text-xs uppercase hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              View Size Guide
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
