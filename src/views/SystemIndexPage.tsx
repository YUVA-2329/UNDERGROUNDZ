import React, { useState, useEffect } from 'react';
import { ViewType, ProductItem } from '../types';

interface SystemIndexPageProps {
  setCurrentView: (view: ViewType) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectCategory: (category: string) => void;
  products: ProductItem[];
}

const BIKER_SUNSET_VISUALS = [
  {
    id: '01',
    src: '/biker_sunset_1.jpg',
    title: 'GOLDEN HOUR THROTTLE',
    location: 'PACIFIC HIGHWAY // 6:42 PM',
    speed: '124 KM/H',
    coordinates: 'LAT: 36.5785° N / LNG: 121.9018° W',
    alt: 'High speed motorcycle rider accelerating along highway into intense golden sunset',
  },
  {
    id: '02',
    src: '/biker_sunset_2.jpg',
    title: 'TWILIGHT CRIMSON CHASE',
    location: 'DESERT EXPRESSWAY // 7:15 PM',
    speed: '148 KM/H',
    coordinates: 'LAT: 34.0522° N / LNG: 118.2437° W',
    alt: 'Cinematic silhouette of biker riding on endless highway against blazing fiery sunset sky',
  },
  {
    id: '03',
    src: '/biker_sunset_3.jpg',
    title: 'AMBER SKYLINE ODYSSEY',
    location: 'COASTAL PASS // 7:38 PM',
    speed: '110 KM/H',
    coordinates: 'LAT: 37.7749° N / LNG: 122.4194° W',
    alt: 'Motorcycle rider carving road curves under glowing amber dusk sky with sunset light',
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
      setActiveSlide((prev) => (prev + 1) % BIKER_SUNSET_VISUALS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <main className="pt-16 pb-20 md:pb-0">
      {/* Hero Section with 4K Sunset Biker Fading Visuals */}
      <section
        className="relative h-screen min-h-[720px] w-full overflow-hidden flex flex-col justify-end select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Visuals Layer (Cross-Fade 3s Carousel) */}
        <div className="absolute inset-0 z-0 bg-[#070708] overflow-hidden">
          {BIKER_SUNSET_VISUALS.map((visual, index) => {
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
                  className={`w-full h-full object-cover object-center filter brightness-90 contrast-115 transition-transform duration-[4000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Cinematic Sunset Overlays: Dark base for typography + warm amber horizon glow */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#070708] via-[#070708]/50 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/60 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-radial-at-c from-transparent via-transparent to-[#070708]/60 pointer-events-none" />
          
          {/* Subtle fiery ember line at top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] z-30 bg-gradient-to-r from-transparent via-[#ff3300] to-transparent opacity-80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-30 px-5 md:px-16 pb-24 md:pb-28 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-9 lg:col-span-8">
            {/* Live Sunset Rider HUD Status */}
            <div className="flex flex-wrap items-center gap-3 mb-4 font-mono-tech text-xs tracking-[0.2em] uppercase">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/70 backdrop-blur-md border border-[#ff3300]/50 text-white rounded-none">
                <span className="w-2 h-2 rounded-full bg-[#ff3300] animate-pulse" />
                SUNSET RIDING EXP // 4K
              </span>
              <span className="text-[#ff3300] font-bold">
                {BIKER_SUNSET_VISUALS[activeSlide].title}
              </span>
              <span className="text-[#8e9192] hidden sm:inline">
                [{BIKER_SUNSET_VISUALS[activeSlide].location}]
              </span>
            </div>

            <div className="mb-6">
              <img
                src="/logo.png"
                alt="UNDERGROUNDZ"
                className="w-full max-w-2xl lg:max-w-3xl mb-3 object-contain object-left drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
              />
              <h1 className="font-display text-[40px] sm:text-[60px] md:text-[76px] leading-[0.95] text-white uppercase tracking-tighter font-extrabold drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
                CHASING THE SUNSET
              </h1>
              <p className="font-mono-tech text-xs sm:text-sm text-[#ff6633] mt-2 tracking-wider uppercase font-semibold">
                PURE SPEED • CONCRETE HORIZON • UNRESTRICTED FREEDOM
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <button
                onClick={() => {
                  onSelectCategory('HOODIES');
                  setCurrentView('collection');
                }}
                className="px-10 py-4 bg-white text-black font-display font-bold text-sm uppercase tracking-wider hover:bg-[#ff3300] hover:text-white active:scale-95 transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
              >
                Explore Collection
              </button>

              <button
                onClick={() => setCurrentView('community')}
                className="px-8 py-4 border border-white/40 bg-black/40 backdrop-blur-sm text-white font-display font-bold text-sm uppercase tracking-wider hover:border-[#ff3300] hover:text-[#ff3300] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Rider Community
              </button>

              <div className="hidden lg:block h-10 w-[1px] bg-white/20"></div>

              <p className="max-w-xs font-body text-xs sm:text-sm text-[#d4d4d4] leading-relaxed drop-shadow-md">
                Engineered for the thrill of the dusk asphalt. High-spec brutalist streetwear crafted for open roads.
              </p>
            </div>
          </div>

          {/* 3-Slide Interactive HUD Indicator (Changes every 3s) */}
          <div className="col-span-12 md:col-span-3 lg:col-span-4 flex flex-col md:items-end justify-end gap-4">
            {/* Visual Selector Tabs */}
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3.5 flex flex-col gap-2.5 w-full max-w-xs">
              <div className="flex justify-between items-center text-[10px] font-mono-tech text-[#8e9192] uppercase tracking-wider border-b border-white/10 pb-2">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="w-1.5 h-1.5 bg-[#ff3300] rounded-full animate-ping" />
                  VISUALS: 03 SCENES
                </span>
                <span className="text-[#ff3300]">CYCLE: 3.0 SEC</span>
              </div>

              <div className="space-y-2">
                {BIKER_SUNSET_VISUALS.map((item, idx) => {
                  const isCurrent = idx === activeSlide;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-full text-left p-2 transition-all cursor-pointer flex items-center justify-between group ${
                        isCurrent
                          ? 'bg-white/15 border-l-2 border-[#ff3300] text-white'
                          : 'bg-white/5 border-l-2 border-transparent text-[#8e9192] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono-tech text-[10px] ${
                            isCurrent ? 'text-[#ff3300] font-bold' : 'text-[#8e9192]'
                          }`}
                        >
                          {item.id}
                        </span>
                        <span className="font-display text-xs tracking-tight uppercase font-semibold truncate max-w-[150px]">
                          {item.title}
                        </span>
                      </div>

                      {/* Progress Bar inside Active Tab */}
                      {isCurrent ? (
                        <div className="w-12 h-1 bg-white/20 overflow-hidden relative">
                          <div
                            key={activeSlide}
                            className="h-full bg-[#ff3300] animate-[slideProgress_3s_linear_infinite]"
                            style={{
                              animationDuration: '3000ms',
                              animationIterationCount: '1',
                              animationFillMode: 'forwards',
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono-tech opacity-0 group-hover:opacity-100 transition-opacity text-[#8e9192]">
                          VIEW
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Telemetry Footer */}
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-mono-tech text-[#8e9192]">
                <span>{BIKER_SUNSET_VISUALS[activeSlide].coordinates}</span>
                <span className="text-[#ff3300] font-bold">
                  {BIKER_SUNSET_VISUALS[activeSlide].speed}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Glow & Coordinates marker */}
        <div className="absolute right-6 bottom-4 hidden xl:block z-20 pointer-events-none">
          <div className="flex items-center gap-3 font-mono-tech text-[10px] text-[#8e9192]/80 uppercase">
            <span>SUNSET TELEMETRY: SYNCED</span>
            <span>•</span>
            <span>RESOLUTION: 4K UHD</span>
            <span>•</span>
            <span className="text-[#ff3300]">FRAME RATE: 60FPS</span>
          </div>
        </div>
      </section>

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
          <button
            onClick={() => setCurrentView('community')}
            className="px-12 py-5 border border-white text-white font-display font-bold text-sm uppercase transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
          >
            ENTER THE ARCHIVE
          </button>
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white"></div>
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
