import React from 'react';
import { ViewType } from '../types';

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
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-[#131313] dark:bg-[#0e0e0e] border-t border-[#444748] md:hidden">
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center justify-center pt-2 transition-all duration-200 cursor-pointer ${
          currentView === 'home'
            ? 'text-white border-t-2 border-white -mt-[2px]'
            : 'text-[#8e9192] hover:text-white'
        }`}
      >
        <span className="material-symbols-outlined">home_max</span>
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center text-[#8e9192] hover:text-white pt-2 transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined">search</span>
      </button>

      <button
        onClick={() => setCurrentView('collection')}
        className={`flex flex-col items-center justify-center pt-2 transition-all duration-200 cursor-pointer ${
          currentView === 'collection'
            ? 'text-white border-t-2 border-white -mt-[2px]'
            : 'text-[#8e9192] hover:text-white'
        }`}
      >
        <span className="material-symbols-outlined">layers</span>
      </button>

      <button
        onClick={() => setCurrentView('community')}
        className={`flex flex-col items-center justify-center pt-2 transition-all duration-200 cursor-pointer ${
          currentView === 'community'
            ? 'text-white border-t-2 border-white -mt-[2px]'
            : 'text-[#8e9192] hover:text-white'
        }`}
      >
        <span className="material-symbols-outlined">person</span>
      </button>
    </nav>
  );
};
