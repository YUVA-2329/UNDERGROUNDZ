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
              {/* Dynamic 5s Fade In/Fade Out Rider Manifesto in High-Impact Syne Font */}
              <RiderManifestoBanner variant="hero" className="mb-4" />
              <p className="font-mono-tech text-xs sm:text-sm text-[#a4a8ad] mt-2.5 tracking-[0.15em] uppercase font-semibold flex items-center gap-2">
                <span>MATTE CARBON</span>
                <span>•</span>
                <span>DARK TITANIUM</span>
                <span>•</span>
                <span>AERODYNAMIC RIGOR</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <HoverBorderGradient
                containerClassName="rounded-none shadow-[0_4px_24px_rgba(255,255,255,0.15)] active:scale-95 transition-all duration-300"
                as="button"
                className="px-10 py-4 bg-white text-black font-display font-bold text-sm uppercase tracking-wider hover:bg-[#d8d8d8] transition-colors"
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
                className="px-8 py-4 bg-[#0a0a0e]/90 text-[#e2e4e8] font-display font-bold text-sm uppercase tracking-wider hover:text-white transition-colors"
                onClick={() => setCurrentView('community')}
              >
                Rider Community
              </HoverBorderGradient>

              <div className="hidden lg:block h-10 w-[1px] bg-white/20"></div>

              <p className="max-w-xs font-body text-xs sm:text-sm text-[#a8adb3] leading-relaxed drop-shadow-md">
                Technical brutalist apparel engineered with aerodynamic precision for high-displacement machines.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Coordinates Marker */}
        <div className="absolute right-6 bottom-4 hidden xl:block z-20 pointer-events-none">
          <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#8e9192]/80 uppercase">
            <span>CHASSIS TELEMETRY: REAL-TIME</span>
            <span>•</span>
            <span>CARBON SPEC: MONOCHROME</span>
            <span>•</span>
            <span className="text-white">4K TITANIUM GRADE</span>
          </div>
        </div>
      </section>

      {/* RIDER MANIFESTO TRANSMISSION BANNER (3s Fade In/Fade Out Broadcast) */}
      <RiderManifestoBanner variant="banner" />

      {/* CORE COLLECTIONS Section (Bento Style) */}
      <section className="py-24 px-5 md:px-16 bg-[#131313]">
        <div className="flex justify-between items-end mb-16 border-b border-[#444748] pb-8">
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tighter font-bold">
            CORE COLLECTIONS
          </h2>
          <span className="font-mono-tech text-xs text-[#8e9192] uppercase">[ 03 CATEGORIES ]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-[#444748]">
          {/* HOODIES */}
          <button
            onClick={() => {
              onSelectCategory('HOODIES');
              setCurrentView('collection');
            }}
            className="text-left group relative col-span-12 md:col-span-4 h-[480px] border-b md:border-b-0 md:border-r border-[#444748] overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-[#0e0e0e] transition-colors group-hover:bg-[#2a2a2a]">
              <img src="/hoodie.png" alt="The Void Hoodie" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
            </div>
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div className="flex justify-between">
                <span className="font-mono-tech text-xs text-[#8e9192]">ID: 001</span>
                <span className="material-symbols-outlined text-[#8e9192] group-hover:text-white transition-colors">
                  add
                </span>
              </div>
              <div>
                <h3 className="font-display text-4xl uppercase tracking-tighter mb-4 font-bold group-hover:translate-x-2 transition-transform">
                  THE VOID HOODIE
                </h3>
                <p className="font-body text-sm text-[#c4c7c8] opacity-0 group-hover:opacity-100 transition-opacity">
                  A premium black streetwear hoodie featuring a bold UNDERGROUNDZ logo.
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
            className="text-left group relative col-span-12 md:col-span-4 h-[480px] border-b md:border-b-0 md:border-r border-[#444748] overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-[#1b1b1b] transition-colors group-hover:bg-[#2a2a2a]">
              <img src="/tshirt.png" alt="The Core T-Shirt" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
            </div>
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div className="flex justify-between">
                <span className="font-mono-tech text-xs text-[#8e9192]">ID: 002</span>
                <span className="material-symbols-outlined text-[#8e9192] group-hover:text-white transition-colors">
                  add
                </span>
              </div>
              <div>
                <h3 className="font-display text-4xl uppercase tracking-tighter mb-4 font-bold group-hover:translate-x-2 transition-transform">
                  THE CORE T-SHIRT
                </h3>
                <p className="font-body text-sm text-[#c4c7c8] opacity-0 group-hover:opacity-100 transition-opacity">
                  Premium oversized black streetwear t-shirt with minimalist details.
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
            className="text-left group relative col-span-12 md:col-span-4 h-[480px] overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-[#131313] transition-colors group-hover:bg-[#2a2a2a]">
              <img src="/shirt.png" alt="The Tech Shirt" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
            </div>
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div className="flex justify-between">
                <span className="font-mono-tech text-xs text-[#8e9192]">ID: 003</span>
                <span className="material-symbols-outlined text-[#8e9192] group-hover:text-white transition-colors">
                  add
                </span>
              </div>
              <div>
                <h3 className="font-display text-4xl uppercase tracking-tighter mb-4 font-bold group-hover:translate-x-2 transition-transform">
                  THE TECH SHIRT
                </h3>
                <p className="font-body text-sm text-[#c4c7c8] opacity-0 group-hover:opacity-100 transition-opacity">
                  Sleek utilitarian black overshirt with technical fabrics.
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-32 bg-[#0e0e0e] flex flex-col items-center justify-center text-center px-5 border-t border-b border-[#444748]">
        <h2 className="font-display text-4xl sm:text-6xl md:text-8xl uppercase tracking-tighter mb-12 font-extrabold text-[#8e9192]/30">
          LEGACY OF THE VOID
        </h2>
        <div className="relative group">
          <HoverBorderGradient
            containerClassName="rounded-none duration-1000"
            as="button"
            className="px-12 py-5 bg-[#0a0a0e] text-white font-display font-bold text-sm uppercase transition-all duration-300 hover:text-white"
            onClick={() => setCurrentView('community')}
          >
            ENTER THE ARCHIVE
          </HoverBorderGradient>
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white pointer-events-none"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white pointer-events-none"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-5 md:px-16 bg-[#131313]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="col-span-12 md:col-span-4">
            <img src="/logo.png" alt="UNDERGROUNDZ" className="h-8 mb-4 object-contain block" />
            <p className="font-body text-sm text-[#c4c7c8] max-w-xs">
              Industrial brutalism in garment form. Distributed through secret channels only.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h5 className="font-mono-tech text-xs text-white uppercase mb-4">SYSTEM</h5>
            <ul className="space-y-2 font-mono-tech text-[11px] text-[#8e9192] uppercase">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white">Logistics</button></li>
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white">Protocols</button></li>
              <li><button onClick={() => setCurrentView('community')} className="hover:text-white">Manifesto</button></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h5 className="font-mono-tech text-xs text-white uppercase mb-4">CONNECT</h5>
            <ul className="space-y-2 font-mono-tech text-[11px] text-[#8e9192] uppercase">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white">Terminal</button></li>
              <li><button onClick={() => setCurrentView('community')} className="hover:text-white">Encrypted</button></li>
              <li><button onClick={() => setCurrentView('community')} className="hover:text-white">Signals</button></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col md:items-end">
            <h5 className="font-mono-tech text-xs text-white uppercase mb-2">STATUS: ONLINE</h5>
            <p className="font-mono-tech text-[10px] text-[#8e9192] text-right">© 2026 UNDERGROUNDZ GLOBAL SYNDICATE</p>
            <p className="font-mono-tech text-[10px] text-[#8e9192] text-right mt-1">ENCRYPTED AT 256-BIT AES</p>
          </div>
        </div>
      </footer>
    </main>
  );
};
