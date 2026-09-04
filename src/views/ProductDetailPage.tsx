import React, { useState } from 'react';
import { ProductItem, ViewType } from '../types';
import { PRODUCT_REVIEWS } from '../data';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { PeopleWearingUndergroundz } from '../components/PeopleWearingUndergroundz';
import { Star, Shield, Zap, Check, AlertCircle, ShoppingBag } from 'lucide-react';

interface ProductDetailPageProps {
  product: ProductItem;
  setCurrentView: (view: ViewType) => void;
  onAddToCart: (product: ProductItem, size: string, color?: string) => void;
  onBuyNow?: (product: ProductItem, size: string, color?: string) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  setCurrentView,
  onAddToCart,
  onBuyNow,
  onOpenSizeGuide,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes[0] || 'M'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors?.[0]?.name || 'VOID BLACK'
  );
  const [visualizerMode, setVisualizerMode] = useState<
    'standard' | 'wireframe' | 'thermal' | 'xray'
  >('standard');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const reviews = PRODUCT_REVIEWS[product.id] || [];

  const handleAdd = () => {
    if (!selectedSize) {
      setValidationError('Please select a size to proceed.');
      return;
    }
    setValidationError(null);
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNowClick = () => {
    if (!selectedSize) {
      setValidationError('Please select a size to proceed.');
      return;
    }
    setValidationError(null);
    if (onBuyNow) {
      onBuyNow(product, selectedSize, selectedColor);
    } else {
      onAddToCart(product, selectedSize, selectedColor);
      setCurrentView('checkout');
    }
  };

  const scrollToReviews = () => {
    const el = document.getElementById('people-wearing-undergroundz');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const discountAmount = product.originalPrice
    ? product.originalPrice - product.price
    : 0;
  const discountPercent = product.originalPrice
    ? Math.round((discountAmount / product.originalPrice) * 100)
    : 0;

  return (
    <main className="pt-20 pb-24 min-h-screen bg-[#070708] text-white">
      {/* Top Product Showcase & Purchasing Section */}
      <section className="px-5 md:px-16 max-w-7xl mx-auto">
        {/* Breadcrumb telemetry */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#777] mb-6 tracking-widest uppercase">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            INDEX
          </button>
          <span>/</span>
          <button
            onClick={() => setCurrentView('collection')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-white font-bold">{product.code}</span>
        </div>

        {/* 2-Column Responsive Layout: Left Image Gallery, Right Product Purchasing Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Multi-image Gallery with Thumbnails & Zoom */}
          <div className="lg:col-span-7">
            <ProductImageGallery
              images={product.images && product.images.length > 0 ? product.images : [product.image]}
              productName={product.name}
            />
          </div>

          {/* Right Column: Purchasing Studio, Validation & Specs */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-mono text-[10px] text-white bg-[#1b1b1b] border border-[#333] px-2.5 py-0.5 uppercase tracking-widest font-bold">
                  MODEL: {product.model}
                </span>
                <span className="font-mono text-[10px] text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 px-2.5 py-0.5 uppercase tracking-widest font-bold">
                  {product.undergroundzBranding}
                </span>
                {product.inStock && (
                  <span className="font-mono text-[10px] text-[#ffaa44] bg-[#ffaa44]/10 border border-[#ffaa44]/30 px-2.5 py-0.5 uppercase tracking-widest">
                    {product.stockCount} UNITS REMAINING
                  </span>
                )}
              </div>

              {/* Title & Code */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2 leading-none">
                {product.name}
              </h1>

              {/* Rating jump link */}
              <button
                onClick={scrollToReviews}
                className="flex items-center gap-2 mb-6 group cursor-pointer"
              >
                <div className="flex items-center text-[#ff3300]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#ff3300] text-[#ff3300]"
                    />
                  ))}
                </div>
                <span className="font-mono text-xs text-[#aaa] group-hover:text-white transition-colors">
                  {product.ratingSummary || 4.9} ({product.reviewsCount || reviews.length} Community Reviews)
                </span>
              </button>

              {/* Pricing & Discount */}
              <div className="p-4 bg-[#0d0d0f] border border-[#222] mb-6 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-black text-white">
                      {product.currency}
                      {product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="font-mono text-base text-[#666] line-through">
                        {product.currency}
                        {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {discountPercent > 0 && (
                    <span className="font-mono text-[10px] text-[#00ff88] tracking-widest uppercase block mt-1">
                      SAVE {product.currency}{discountAmount} ({discountPercent}% ARCHIVE DISCOUNT)
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-mono text-[10px] text-[#888] block uppercase">STATUS</span>
                  <span className="font-mono text-xs text-[#00ff88] font-bold">READY TO SHIP</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#bbb] leading-relaxed mb-6 font-sans">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-mono text-xs text-[#888] uppercase tracking-wider">
                      COLORWAY: <strong className="text-white">{selectedColor}</strong>
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {product.availableColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => {
                          setSelectedColor(color.name);
                          setValidationError(null);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 border font-mono text-xs transition-all cursor-pointer ${
                          selectedColor === color.name
                            ? 'border-white bg-[#1a1a1c] text-white shadow-sm'
                            : 'border-[#262626] bg-[#0c0c0d] text-[#888] hover:border-[#555]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40 inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector with Size Guide Link */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="font-mono text-xs text-[#888] uppercase tracking-wider">
                    SIZE: <strong className="text-white">{selectedSize || 'SELECT SIZE'}</strong>
                  </span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="font-mono text-xs text-[#aaa] underline hover:text-white transition-colors cursor-pointer"
                  >
                    SIZE GUIDE
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setValidationError(null);
                      }}
                      className={`h-11 border transition-all cursor-pointer font-bold ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'bg-[#121214] text-[#ccc] border-[#2e2e32] hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Validation Alert */}
              {validationError && (
                <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Action Buttons: ADD TO CART & BUY NOW */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  id="btn-add-to-cart"
                  onClick={handleAdd}
                  className="flex-1 h-14 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#e0e0e0] active:scale-[0.99] transition-all cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO CART</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-buy-now"
                  onClick={handleBuyNowClick}
                  className="flex-1 h-14 bg-[#ff3300] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#e02e00] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Assurance bullets */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1e1e20] text-[10px] font-mono text-[#888]">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span>OFFICIAL UNDERGROUNDZ PRODUCT</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
                  <span>DISPATCH WITHIN 24 HOURS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specification Section (Original Preserved) */}
      <section className="mt-20 py-16 px-5 md:px-16 border-t border-[#222] bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 flex flex-col justify-between gap-8">
            <div>
              <h3 className="font-mono text-xs text-[#8e9192] uppercase tracking-widest mb-6 font-bold">
                MATERIAL COMPOSITION & TELEMETRY
              </h3>
              <ul className="flex flex-col gap-4 border-l border-[#2e2e32] pl-6 font-mono text-xs">
                <li className="flex flex-col">
                  <span className="text-white font-bold uppercase">FABRIC SPECIFICATION</span>
                  <span className="text-[#a0a0a4] text-[11px]">{product.materialInfo || product.specs.material}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-white font-bold uppercase">HARDWARE SYSTEM</span>
                  <span className="text-[#a0a0a4] text-[11px]">{product.specs.hardware}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-white font-bold uppercase">FUNCTIONAL UTILITY</span>
                  <span className="text-[#a0a0a4] text-[11px]">{product.specs.utility}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-white font-bold uppercase">THERMAL RATING</span>
                  <span className="text-[#a0a0a4] text-[11px]">{product.specs.thermal}</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#222]">
              <div className="border border-[#222] p-3 text-center bg-[#131316]">
                <span className="block font-mono text-[9px] text-[#8e9192] uppercase">WATERPROOF</span>
                <span className="font-mono text-lg font-bold text-white">{product.specs.waterproof}</span>
              </div>
              <div className="border border-[#222] p-3 text-center bg-[#131316]">
                <span className="block font-mono text-[9px] text-[#8e9192] uppercase">WEIGHT</span>
                <span className="font-mono text-lg font-bold text-white">{product.specs.weight}</span>
              </div>
            </div>
          </div>

          {/* Interactive Technical Visualizer */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <div className="relative w-full aspect-16/9 min-h-[300px] bg-[#000] border border-[#222] group overflow-hidden flex flex-col justify-between p-6">
              <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                <img
                  src={product.image}
                  alt="Visualizer layer"
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    visualizerMode === 'wireframe'
                      ? 'invert contrast-200 saturate-0'
                      : visualizerMode === 'thermal'
                      ? 'hue-rotate-180 contrast-200'
                      : visualizerMode === 'xray'
                      ? 'contrast-200 grayscale brightness-150'
                      : 'grayscale contrast-125'
                  }`}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] text-[#888] uppercase block">
                    CAD / ARCHITECTURAL LAYER
                  </span>
                  <span className="font-mono text-xs text-white font-bold uppercase">
                    MODE: {visualizerMode.toUpperCase()}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#00ff88] bg-[#111] px-2 py-1 border border-[#333]">
                  CALIBRATED 100%
                </span>
              </div>

              <div className="relative z-10 text-center my-auto py-6">
                <span className="font-mono text-xs text-white uppercase tracking-wider block mb-2">
                  Technical Visualizer // {product.code}
                </span>
                <div className="h-px w-16 bg-[#ff3300] mx-auto mb-3"></div>
                <p className="font-mono text-[10px] text-[#888]">
                  TEXTURE MEMBRANE: OPTIMAL // UNDERGROUNDZ LABORATORY VALIDATED
                </p>
              </div>

              <div className="relative z-10 flex gap-2 font-mono text-[10px] overflow-x-auto pb-1">
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
        </div>
      </section>

      {/* "People Wearing Undergroundz" Review Section (Max 5 authentic reviews with photos) */}
      <div className="max-w-7xl mx-auto px-5 md:px-16">
        <PeopleWearingUndergroundz
          reviews={reviews}
          productName={product.name}
        />
      </div>

      {/* Concept Narrative Section */}
      <section className="mt-20 py-16 px-5 md:px-16 border-t border-[#222] bg-[#070708]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-4">
              Concept Narrative
            </h4>
            <div className="text-[#a8a8ae] font-sans text-sm space-y-4 leading-relaxed">
              {product.longDescription.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="w-full md:w-72 flex flex-col gap-4">
            <div className="border border-[#222] p-4 flex flex-col gap-1 bg-[#0e0e10]">
              <span className="font-mono text-[10px] text-[#888] uppercase">Origin Node</span>
              <span className="font-mono text-sm font-bold text-white uppercase">{product.origin}</span>
            </div>

            <div className="border border-[#222] p-4 flex flex-col gap-1 bg-[#0e0e10]">
              <span className="font-mono text-[10px] text-[#888] uppercase">Edition Status</span>
              <span className="font-mono text-sm font-bold text-white uppercase">{product.editionStatus}</span>
            </div>

            <button
              onClick={onOpenSizeGuide}
              className="w-full h-12 border border-[#444] hover:border-white text-white font-mono text-xs uppercase transition-all cursor-pointer"
            >
              VIEW SIZE GUIDE
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
