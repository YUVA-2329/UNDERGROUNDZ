import React, { useState, useEffect } from 'react';
import { ViewType, ProductItem } from '../types';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import { RiderManifestoBanner } from '../components/RiderManifestoBanner';

interface SystemIndexPageProps {
  setCurrentView: (view: ViewType) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectCategory: (category: string) => void;
  products: ProductItem[];
}

const SUPERBIKE_SILVER_VISUALS = [
  {
    id: '01',
    src: '/superbike_silver_1.jpg',
    model: 'APEX STEALTH // 1000RR',
    spec: '998CC • 218 HP • 14,500 RPM',
    telemetry: 'GEAR: 6 // SPEED: 298 KM/H',
    coordinates: 'LAT: 45.6200° N / LNG: 9.2811° E',
    alt: 'Matte black and dark silver aerodynamic superbike with aggressive dual headlights on dark asphalt',
  },
  {
    id: '02',
    src: '/superbike_silver_2.jpg',
    model: 'CHRONO TARMAC // INTERCEPTOR',
    spec: 'TITANIUM MONOCOQUE • OHLINS TTX',
    telemetry: 'LEAN: 54° // TRACTION: LVL 1',
    coordinates: 'LAT: 36.5785° N / LNG: 121.9018° W',
    alt: 'High-speed superbike carving alpine curves on open tarmac highway with dark silver finish',
  },
  {
    id: '03',
    src: '/superbike_silver_3.jpg',
    model: 'VELOCITY MONOCHROME // APEX',
    spec: 'BREMBO MONOBLOC • CARBON COMPOSITE',
    telemetry: 'THROTTLE: 100% // QUICKSHIFTER ACTIVE',
    coordinates: 'LAT: 44.3411° N / LNG: 11.7139° E',
    alt: 'Rider carving corner on high performance superbike with sleek metallic silver and black armor',
  },
];

export const SystemIndexPage: React.FC<SystemIndexPageProps> = ({
  setCurrentView,
  onSelectProduct,
  onSelectCategory,
  products,
}) => {
  const craftProduct = products.find((p) => p.id === 'the-void-hoodie') || products[0];
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-change every 3 seconds with smooth cross-fade
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SUPERBIKE_SILVER_VISUALS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <main className="pt-16 pb-20 md:pb-0 bg-[#0c0c0e]">
      {/* Hero Section with 4K Black & Dark Silver Superbike Fading Visuals */}
      <section
        className="relative h-screen min-h-[720px] w-full overflow-hidden flex flex-col justify-end select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Visuals Layer (Cross-Fade 3s Carousel) */}
        <div className="absolute inset-0 z-0 bg-[#070708] overflow-hidden">
          {SUPERBIKE_SILVER_VISUALS.map((visual, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                key={visual.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={visual.src}
                  alt={visual.alt}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center filter grayscale contrast-125 brightness-85 transition-transform duration-[4000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Clean Dark Silver & Obsidian Brutalist Overlays */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/60 to-black/45 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/20 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-radial-at-c from-transparent via-transparent to-black/70 pointer-events-none" />
          
          {/* Clean Brushed Silver Accent Line at Top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] z-30 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-30 px-5 md:px-16 pb-24 md:pb-28 max-w-5xl">
          <div>
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="UNDERGROUNDZ"
                className="w-full max-w-2xl lg:max-w-3xl mb-3 object-contain object-left filter contrast-125 brightness-110 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <HoverBorderGradient
                containerClassName="rounded-none shadow-lg active:scale-95 transition-all duration-300"
                as="button"
                className="px-8 py-3.5 bg-white text-black font-body font-semibold text-xs uppercase tracking-wider hover:bg-[#d8d8d8] transition-colors"
                onClick={() => {
                  onSelectCategory('HOODIES');
                  setCurrentView('collection');
                }}
              >
                Explore Collection
              </HoverBorderGradient>

              <HoverBorderGradient
                containerClassName="rounded-none active:scale-95 transition-all duration-300"
                as="button"
                className="px-8 py-3.5 bg-[#0a0a0e]/90 text-[#e2e4e8] font-body font-semibold text-xs uppercase tracking-wider hover:text-white transition-colors"
                onClick={() => setCurrentView('community')}
              >
                Rider Community
              </HoverBorderGradient>

              <div className="hidden lg:block h-8 w-[1px] bg-white/20"></div>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Coordinates Marker */}
        <div className="absolute right-6 bottom-4 hidden xl:block z-20 pointer-events-none">
          <div className="flex items-center gap-3 font-body text-[11px] text-[#8e9192] uppercase font-medium tracking-wider">
            <span>CHASSIS TELEMETRY: ACTIVE</span>
            <span>•</span>
            <span>CARBON SPEC: MONOCHROME</span>
            <span>•</span>
            <span className="text-white">TITANIUM GRADE</span>
          </div>
        </div>
      </section>

      {/* CORE COLLECTIONS Section (Bento Style) */}
      <section className="py-24 px-5 md:px-16 bg-[#0e0e11]">
        <div className="flex justify-between items-end mb-16 border-b border-[#2a2a34] pb-6">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight font-bold text-white">
            CORE COLLECTIONS
          </h2>
          <span className="font-body text-xs font-semibold text-[#8e9192] uppercase tracking-wider">[ 03 CATEGORIES ]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-[#2a2a34]">
          {/* HOODIES */}
          <button
            onClick={() => {
              onSelectCategory('HOODIES');
              setCurrentView('collection');
            }}
            className="text-left group relative col-span-12 md:col-span-4 h-[480px] border-b md:border-b-0 md:border-r border-[#2a2a34] overflow-hidden cursor-pointer bg-[#0c0c0e]"
          >
            <div className="absolute inset-0 bg-[#0c0c0e] transition-colors group-hover:bg-[#16161c]">
              <img src="/hoodie.png" alt="The Void Hoodie" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
            </div>
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="font-body text-xs font-semibold text-[#8e9192] tracking-wider">SERIES 001</span>
                  <span className="inline-flex items-center gap-1.5 font-body text-[10px] text-[#e0a855] font-bold uppercase tracking-wider bg-[#1a1608] border border-[#e0a855]/40 px-2 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-[#e0a855] animate-pulse" />
                    OPENING OFFER • ₹1,200
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#8e9192] group-hover:text-white transition-colors">
                  add
                </span>
              </div>
              <div>
                <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-tight mb-2 font-bold group-hover:translate-x-1.5 transition-transform text-white">
                  THE REFLECTION HOODIE
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#b0b0ba] opacity-0 group-hover:opacity-100 transition-opacity">
                  Engineered for night riders. High-intensity retro-reflective threading woven into heavyweight cotton fleece.
                </p>
              </div>
            </div>
          </button>

          {/* TEES */}
          <button
            onClick={() => {
              onSelectCategory('TEES');
              setCurrentView('collection');
            }}
            className="text-left group relative col-span-12 md:col-span-4 h-[480px] border-b md:border-b-0 md:border-r border-[#2a2a34] overflow-hidden cursor-pointer bg-[#0c0c0e]"
          >
            <div className="absolute inset-0 bg-[#0c0c0e] transition-colors group-hover:bg-[#16161c]">
              <img src="/tshirt.png" alt="The Core T-Shirt" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
            </div>
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div className="flex justify-between">
                <span className="font-body text-xs font-semibold text-[#8e9192] tracking-wider">SERIES 002</span>
                <span className="material-symbols-outlined text-[#8e9192] group-hover:text-white transition-colors">
                  add
                </span>
              </div>
              <div>
                <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-tight mb-2 font-bold group-hover:translate-x-1.5 transition-transform text-white">
                  THE CORE T-SHIRT
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#b0b0ba] opacity-0 group-hover:opacity-100 transition-opacity">
                  Oversized heavyweight jersey knit with reinforced stress points.
                </p>
              </div>
            </div>
          </button>

          {/* SHIRTS */}
          <button
            onClick={() => {
              onSelectCategory('SHIRTS');
              setCurrentView('collection');
            }}
            className="text-left group relative col-span-12 md:col-span-4 h-[480px] overflow-hidden cursor-pointer bg-[#0c0c0e]"
          >
            <div className="absolute inset-0 bg-[#0c0c0e] transition-colors group-hover:bg-[#16161c]">
              <img src="/shirt.png" alt="The Tech Shirt" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
            </div>
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div className="flex justify-between">
                <span className="font-body text-xs font-semibold text-[#8e9192] tracking-wider">SERIES 003</span>
                <span className="material-symbols-outlined text-[#8e9192] group-hover:text-white transition-colors">
                  add
                </span>
              </div>
              <div>
                <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-tight mb-2 font-bold group-hover:translate-x-1.5 transition-transform text-white">
                  THE TECH SHIRT
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#b0b0ba] opacity-0 group-hover:opacity-100 transition-opacity">
                  Sleek utilitarian overshirt built with abrasion-resistant technical ripstop.
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-[#0a0a0c] flex flex-col items-center justify-center text-center px-5 border-t border-b border-[#202026]">
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight mb-8 font-bold text-[#8e9192]/30">
          LEGACY OF THE VOID
        </h2>
        <div className="relative group">
          <HoverBorderGradient
            containerClassName="rounded-none"
            as="button"
            className="px-10 py-4 bg-[#111115] text-white font-body font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black"
            onClick={() => setCurrentView('community')}
          >
            ENTER THE ARCHIVE
          </HoverBorderGradient>
          <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-white/40 pointer-events-none"></div>
          <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-white/40 pointer-events-none"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-5 md:px-16 bg-[#0e0e12]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="col-span-12 md:col-span-4">
            <img src="/logo.png" alt="UNDERGROUNDZ" className="h-7 mb-4 object-contain block" />
            <p className="font-body text-xs text-[#9c9ca8] max-w-xs leading-relaxed">
              Industrial brutalism in garment form. Distributed through verified rider channels only.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h5 className="font-body text-xs font-semibold text-white uppercase tracking-wider mb-4">SYSTEM</h5>
            <ul className="space-y-2.5 font-body text-xs text-[#8e8e98]">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">Logistics</button></li>
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">Protocols</button></li>
              <li><button onClick={() => setCurrentView('community')} className="hover:text-white transition-colors">Dispatch</button></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h5 className="font-body text-xs font-semibold text-white uppercase tracking-wider mb-4">CONNECT</h5>
            <ul className="space-y-2.5 font-body text-xs text-[#8e8e98]">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">Terminal</button></li>
              <li><button onClick={() => setCurrentView('community')} className="hover:text-white transition-colors">Encrypted</button></li>
              <li><button onClick={() => setCurrentView('community')} className="hover:text-white transition-colors">Signals</button></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col md:items-end">
            <h5 className="font-body text-xs font-semibold text-white uppercase tracking-wider mb-2">STATUS: ONLINE</h5>
            <p className="font-body text-xs text-[#8e8e98] text-right">© 2026 UNDERGROUNDZ GLOBAL SYNDICATE</p>
            <p className="font-body text-[11px] text-[#636370] text-right mt-1">256-BIT ENCRYPTION ACTIVE</p>
          </div>
        </div>
      </footer>
    </main>
  );
};
