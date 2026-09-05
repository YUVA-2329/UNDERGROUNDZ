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
        <div className="flex justify-between items-center mb-6 border-b border-[#22222a] pb-4">
          <div>
            <span className="font-body text-[11px] text-[#8e8e98] uppercase block font-semibold tracking-wider">DIMENSIONAL METRICS</span>
            <h3 className="font-display text-2xl uppercase font-bold text-white tracking-tight">SIZE SPECIFICATION GUIDE</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-[#8e8e98] cursor-pointer">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <p className="font-body text-xs text-[#b0b0ba] mb-6 leading-relaxed">
          UNDERGROUNDZ garments are tailored with structured, athletic silhouettes. For layered all-weather riding, select your standard size. For an aerodynamic profile, select one size down.
        </p>

        <div className="space-y-6 font-body text-xs">
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs border-l-2 border-[#9e1b24] pl-2">UPPER TORSO / JACKETS, HOODIES & TEES (CM)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-[#22222a]">
                <thead className="bg-[#16161c] text-white font-semibold">
                  <tr>
                    <th className="p-2.5 border border-[#22222a]">SIZE</th>
                    <th className="p-2.5 border border-[#22222a]">CHEST</th>
                    <th className="p-2.5 border border-[#22222a]">SHOULDER</th>
                    <th className="p-2.5 border border-[#22222a]">SLEEVE</th>
                    <th className="p-2.5 border border-[#22222a]">LENGTH</th>
                  </tr>
                </thead>
                <tbody className="text-[#a8a8b2]">
                  <tr><td className="p-2.5 border border-[#22222a] text-white font-semibold">S</td><td className="p-2.5 border border-[#22222a]">104 - 108</td><td className="p-2.5 border border-[#22222a]">48</td><td className="p-2.5 border border-[#22222a]">64</td><td className="p-2.5 border border-[#22222a]">68</td></tr>
                  <tr><td className="p-2.5 border border-[#22222a] text-white font-semibold">M</td><td className="p-2.5 border border-[#22222a]">108 - 114</td><td className="p-2.5 border border-[#22222a]">50</td><td className="p-2.5 border border-[#22222a]">66</td><td className="p-2.5 border border-[#22222a]">70</td></tr>
                  <tr><td className="p-2.5 border border-[#22222a] text-white font-semibold">L</td><td className="p-2.5 border border-[#22222a]">114 - 120</td><td className="p-2.5 border border-[#22222a]">52</td><td className="p-2.5 border border-[#22222a]">68</td><td className="p-2.5 border border-[#22222a]">72</td></tr>
                  <tr><td className="p-2.5 border border-[#22222a] text-white font-semibold">XL</td><td className="p-2.5 border border-[#22222a]">120 - 126</td><td className="p-2.5 border border-[#22222a]">54</td><td className="p-2.5 border border-[#22222a]">70</td><td className="p-2.5 border border-[#22222a]">74</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs border-l-2 border-[#9e1b24] pl-2">LOWER BODY / CARGO & RIDING PANTS (CM)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-[#22222a]">
                <thead className="bg-[#16161c] text-white font-semibold">
                  <tr>
                    <th className="p-2.5 border border-[#22222a]">SIZE</th>
                    <th className="p-2.5 border border-[#22222a]">WAIST</th>
                    <th className="p-2.5 border border-[#22222a]">HIPS</th>
                    <th className="p-2.5 border border-[#22222a]">INSEAM</th>
                  </tr>
                </thead>
                <tbody className="text-[#a8a8b2]">
                  <tr><td className="p-2.5 border border-[#22222a] text-white font-semibold">S</td><td className="p-2.5 border border-[#22222a]">76 - 80</td><td className="p-2.5 border border-[#22222a]">98</td><td className="p-2.5 border border-[#22222a]">78</td></tr>
                  <tr><td className="p-2.5 border border-[#22222a] text-white font-semibold">M</td><td className="p-2.5 border border-[#22222a]">80 - 86</td><td className="p-2.5 border border-[#22222a]">104</td><td className="p-2.5 border border-[#22222a]">80</td></tr>
                  <tr><td className="p-2.5 border border-[#22222a] text-white font-semibold">L</td><td className="p-2.5 border border-[#22222a]">86 - 92</td><td className="p-2.5 border border-[#22222a]">110</td><td className="p-2.5 border border-[#22222a]">82</td></tr>
                  <tr><td className="p-2.5 border border-[#22222a] text-white font-semibold">XL</td><td className="p-2.5 border border-[#22222a]">92 - 98</td><td className="p-2.5 border border-[#22222a]">116</td><td className="p-2.5 border border-[#22222a]">84</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <HoverBorderGradient
          as="button"
          containerClassName="w-full mt-6 rounded-none"
          className="w-full py-3 bg-white text-black font-body font-semibold uppercase text-xs hover:bg-[#d8d8d8] transition-colors tracking-wider"
          onClick={onClose}
        >
          CLOSE DIMENSIONAL GUIDE
        </HoverBorderGradient>
      </div>
    </div>
  );
};
