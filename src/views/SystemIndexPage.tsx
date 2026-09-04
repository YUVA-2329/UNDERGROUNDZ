import React from 'react';
import { ViewType, ProductItem } from '../types';

interface SystemIndexPageProps {
  setCurrentView: (view: ViewType) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectCategory: (category: string) => void;
  products: ProductItem[];
}

export const SystemIndexPage: React.FC<SystemIndexPageProps> = ({
  setCurrentView,
  onSelectProduct,
  onSelectCategory,
  products,
}) => {
  const craftProduct = products.find((p) => p.id === 'the-void-hoodie') || products[0];

  return (
    <main className="pt-16 pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img
            alt="Cinematic hero shot of a modern brutalist fashion context."
            className="w-full h-full object-cover grayscale contrast-125 brightness-75 transition-transform duration-1000 scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiEFnJjq6AcPHLDvq6kSBB1MVrnCaWE521__ytN23LCzJJdMPp10-thSlUVwc6YDLd26Pc7hjRHRRm34Zkf38Jxi5AGAV4qH_JdRXaaxDRNISiodtnWrb-aLN_ZCgeSzOvbqZ_IqVHxxAD9bBhS94HXk7xXTKNeVfasLFFRWV2Y_Yax-bWjsfJLMrBHsKUgCGL3FXz2OVoAUG2OfE4GtWF0ib06muQDT_B0VEPHBFJFmeiuBuHiwPCsA"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 px-5 md:px-16 pb-24 md:pb-32 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-10 lg:col-span-8">
            <p className="font-mono-tech text-xs text-white mb-4 tracking-[0.2em] uppercase">
              SYSTEM_INDEX / 01
            </p>
            <div className="mb-8">
              <img src="/logo.png" alt="UNDERGROUNDZ" className="w-full max-w-2xl lg:max-w-4xl mb-4 object-contain object-left" />
              <h1 className="font-display text-[42px] sm:text-[64px] md:text-[80px] leading-none text-white uppercase tracking-tighter font-extrabold">
                THE ROAD NEVER ENDS
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <button
                onClick={() => {
                  onSelectCategory('HOODIES');
                  setCurrentView('collection');
                }}
                className="px-10 py-4 bg-white text-black font-display font-bold text-sm uppercase tracking-wider hover:bg-[#c6c6c7] active:scale-95 transition-all cursor-pointer"
              >
                Explore Collection
              </button>
              <div className="hidden md:block h-12 w-[1px] bg-[#444748]"></div>
              <p className="max-w-xs font-body text-sm text-[#c4c7c8]">
                Engineered for the silence of concrete landscapes. Technical rigor meets urban atmospheric precision.
              </p>
            </div>
          </div>
        </div>

        {/* Vertical coordinates marker */}
        <div className="absolute right-12 bottom-12 hidden lg:block z-10">
          <div className="flex flex-col items-end gap-1 font-mono-tech text-xs text-[#8e9192]">
            <span>LAT: 40.7128° N</span>
            <span>LNG: 74.0060° W</span>
            <div className="w-32 h-[1px] bg-[#444748] mt-2"></div>
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
