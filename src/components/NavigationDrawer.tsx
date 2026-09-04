import React from 'react';
import { ViewType } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  onSelectCategory: (category: string) => void;
  onOpenAccount?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  setCurrentView,
  onSelectCategory,
  onOpenAccount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in">
      <aside className="flex flex-col h-full py-10 px-8 bg-[#131313] w-full max-w-sm left-0 border-r border-[#444748] shadow-2xl relative">
        <div className="mb-10 flex justify-between items-center border-b border-[#3a3a3a] pb-6">
          <div className="flex flex-col">
            <span className="font-mono-tech text-xs text-white uppercase tracking-widest">SYSTEM_INDEX / NAV</span>
            <span className="font-mono-tech text-[10px] text-[#8e9192]">SYS_STATUS: ONLINE</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#8e9192] transition-colors p-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto hide-scrollbar flex-1 pb-4">
          <button
            onClick={() => {
              setCurrentView('home');
              onClose();
            }}
            className={`text-left font-display text-2xl uppercase py-3 px-4 border-l-2 transition-all ${
              currentView === 'home'
                ? 'border-white text-white bg-[#1f1f1f]'
                : 'border-transparent text-[#8e9192] hover:text-white hover:border-[#3a3a3a]'
            }`}
          >
            01 / System Index
          </button>

          <button
            onClick={() => {
              setCurrentView('collection');
              onClose();
            }}
            className={`text-left font-display text-2xl uppercase py-3 px-4 border-l-2 transition-all ${
              currentView === 'collection'
                ? 'border-white text-white bg-[#1f1f1f]'
                : 'border-transparent text-[#8e9192] hover:text-white hover:border-[#3a3a3a]'
            }`}
          >
            02 / Collections
          </button>

          <div className="pl-6 flex flex-col gap-2 py-2 font-mono-tech text-xs text-[#8e9192]">
            <button
              onClick={() => {
                onSelectCategory('ALL');
                setCurrentView('collection');
                onClose();
              }}
              className="text-left hover:text-white transition-colors py-1 flex items-center justify-between"
            >
              <span>— ALL 4 COLLECTIONS</span>
              <span className="text-[10px] text-white bg-[#2a2a2a] px-1.5 py-0.5">[4]</span>
            </button>
            {['HOODIES', 'TEES', 'SHIRTS', 'KNITS'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setCurrentView('collection');
                  onClose();
                }}
                className="text-left hover:text-white transition-colors py-0.5"
              >
                — COLLECTION / {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentView('community');
              onClose();
            }}
            className={`text-left font-display text-2xl uppercase py-3 px-4 border-l-2 transition-all ${
              currentView === 'community'
                ? 'border-white text-white bg-[#1f1f1f]'
                : 'border-transparent text-[#8e9192] hover:text-white hover:border-[#3a3a3a]'
            }`}
          >
            03 / Community Archive
          </button>

          <button
            onClick={() => {
              setCurrentView('my-orders');
              onClose();
            }}
            className={`text-left font-display text-2xl uppercase py-3 px-4 border-l-2 transition-all ${
              currentView === 'my-orders'
                ? 'border-white text-white bg-[#1f1f1f]'
                : 'border-transparent text-[#8e9192] hover:text-white hover:border-[#3a3a3a]'
            }`}
          >
            04 / My Orders & Shipments
          </button>

          {onOpenAccount && (
            <button
              onClick={() => {
                onClose();
                onOpenAccount();
              }}
              className="text-left font-display text-2xl uppercase py-3 px-4 border-l-2 border-transparent text-[#8e9192] hover:text-white hover:border-[#3a3a3a] transition-all"
            >
              05 / Rider Identity (Auth)
            </button>
          )}
        </div>

        <div className="mt-auto pt-8 border-t border-[#3a3a3a] font-mono-tech text-[10px] text-[#8e9192] flex flex-col gap-2">
          <div className="flex justify-between">
            <span>TERMINAL ENCRYPTION</span>
            <span>256-BIT AES</span>
          </div>
          <div className="flex justify-between">
            <span>NODES CONNECTED</span>
            <span>12,482</span>
          </div>
          <p className="mt-2 text-[#444748]">UNDERGROUNDZ GLOBAL SYNDICATE © 2026</p>
        </div>
      </aside>
    </div>
  );
};
