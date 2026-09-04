import React from 'react';
import { ViewType } from '../types';
import { Home, Search, Layers, Users, Package } from 'lucide-react';

interface BottomNavBarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  onOpenSearch: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentView,
  setCurrentView,
  onOpenSearch,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-16 bg-[#0a0a0c]/95 backdrop-blur-lg border-t border-[#222] md:hidden">
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
          currentView === 'home' ? 'text-white' : 'text-[#777] hover:text-white'
        }`}
        title="Home"
      >
        <Home className="w-5 h-5" />
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center text-[#777] hover:text-white p-2 transition-all cursor-pointer"
        title="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentView('collection')}
        className={`flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
          currentView === 'collection' ? 'text-white' : 'text-[#777] hover:text-white'
        }`}
        title="Collections"
      >
        <Layers className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentView('community')}
        className={`flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
          currentView === 'community' ? 'text-white' : 'text-[#777] hover:text-white'
        }`}
        title="Community"
      >
        <Users className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentView('my-orders')}
        className={`flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
          currentView === 'my-orders' ? 'text-white' : 'text-[#777] hover:text-white'
        }`}
        title="Orders"
      >
        <Package className="w-5 h-5" />
      </button>
    </nav>
  );
};
