import React from 'react';
import { HoverBorderGradient } from './ui/hover-border-gradient';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#131313] brutalist-border p-6 md:p-8 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-[#3a3a3a] pb-4">
          <div>
            <span className="font-mono-tech text-[10px] text-[#8e9192] uppercase block">DIMENSIONAL METRICS</span>
            <h3 className="font-display text-xl uppercase font-bold text-white">SYSTEM SIZE SPECIFICATION</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-[#8e9192] cursor-pointer">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <p className="font-body text-xs text-[#c4c7c8] mb-6">
          UNDERGROUNDZ garments are engineered with aggressive, structural silhouettes. For layerable high-velocity riding, select your standard size. For form-fitting aerodynamic profile, consider sizing down.
        </p>

        <div className="space-y-6 font-mono-tech text-xs">
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-sm border-l-2 border-white pl-2">UPPER TORSO / SHELLS & HOODIES (CM)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-[#3a3a3a]">
                <thead className="bg-[#1b1b1b] text-white">
                  <tr>
                    <th className="p-2 border border-[#3a3a3a]">SIZE</th>
                    <th className="p-2 border border-[#3a3a3a]">CHEST</th>
                    <th className="p-2 border border-[#3a3a3a]">SHOULDER</th>
                    <th className="p-2 border border-[#3a3a3a]">SLEEVE</th>
                    <th className="p-2 border border-[#3a3a3a]">LENGTH</th>
                  </tr>
                </thead>
                <tbody className="text-[#c4c7c8]">
                  <tr><td className="p-2 border border-[#3a3a3a] text-white font-bold">S</td><td className="p-2 border border-[#3a3a3a]">104 - 108</td><td className="p-2 border border-[#3a3a3a]">48</td><td className="p-2 border border-[#3a3a3a]">64</td><td className="p-2 border border-[#3a3a3a]">68</td></tr>
                  <tr><td className="p-2 border border-[#3a3a3a] text-white font-bold">M</td><td className="p-2 border border-[#3a3a3a]">108 - 114</td><td className="p-2 border border-[#3a3a3a]">50</td><td className="p-2 border border-[#3a3a3a]">66</td><td className="p-2 border border-[#3a3a3a]">70</td></tr>
                  <tr><td className="p-2 border border-[#3a3a3a] text-white font-bold">L</td><td className="p-2 border border-[#3a3a3a]">114 - 120</td><td className="p-2 border border-[#3a3a3a]">52</td><td className="p-2 border border-[#3a3a3a]">68</td><td className="p-2 border border-[#3a3a3a]">72</td></tr>
                  <tr><td className="p-2 border border-[#3a3a3a] text-white font-bold">XL</td><td className="p-2 border border-[#3a3a3a]">120 - 126</td><td className="p-2 border border-[#3a3a3a]">54</td><td className="p-2 border border-[#3a3a3a]">70</td><td className="p-2 border border-[#3a3a3a]">74</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-sm border-l-2 border-white pl-2">LOWER BODY / CARGO UNITS (CM)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-[#3a3a3a]">
                <thead className="bg-[#1b1b1b] text-white">
                  <tr>
                    <th className="p-2 border border-[#3a3a3a]">SIZE</th>
                    <th className="p-2 border border-[#3a3a3a]">WAIST</th>
                    <th className="p-2 border border-[#3a3a3a]">HIPS</th>
                    <th className="p-2 border border-[#3a3a3a]">INSEAM</th>
                  </tr>
                </thead>
                <tbody className="text-[#c4c7c8]">
                  <tr><td className="p-2 border border-[#3a3a3a] text-white font-bold">S</td><td className="p-2 border border-[#3a3a3a]">76 - 80</td><td className="p-2 border border-[#3a3a3a]">98</td><td className="p-2 border border-[#3a3a3a]">78</td></tr>
                  <tr><td className="p-2 border border-[#3a3a3a] text-white font-bold">M</td><td className="p-2 border border-[#3a3a3a]">80 - 86</td><td className="p-2 border border-[#3a3a3a]">104</td><td className="p-2 border border-[#3a3a3a]">80</td></tr>
                  <tr><td className="p-2 border border-[#3a3a3a] text-white font-bold">L</td><td className="p-2 border border-[#3a3a3a]">86 - 92</td><td className="p-2 border border-[#3a3a3a]">110</td><td className="p-2 border border-[#3a3a3a]">82</td></tr>
                  <tr><td className="p-2 border border-[#3a3a3a] text-white font-bold">XL</td><td className="p-2 border border-[#3a3a3a]">92 - 98</td><td className="p-2 border border-[#3a3a3a]">116</td><td className="p-2 border border-[#3a3a3a]">84</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <HoverBorderGradient
          as="button"
          containerClassName="w-full mt-6 rounded-none"
          className="w-full py-3 bg-white text-black font-display font-bold uppercase text-xs hover:bg-[#c6c6c7] transition-colors"
          onClick={onClose}
        >
          CLOSE DIMENSIONAL GUIDE
        </HoverBorderGradient>
      </div>
    </div>
  );
};
