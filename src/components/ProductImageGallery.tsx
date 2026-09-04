import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const VIEW_LABELS = [
  '01 // FRONT ELEVATION',
  '02 // BACK PROFILE',
  '03 // DETAIL & TEXTURE',
  '04 // LIFESTYLE & DRAPE'
];

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fallback if images array is empty
  const galleryImages = images && images.length > 0 ? images : ['/hoodie.png'];
  const activeImage = galleryImages[selectedIndex] || galleryImages[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id="product-gallery-container" className="w-full flex flex-col gap-4">
      {/* Main Image Stage */}
      <div 
        id="product-main-stage" 
        className="relative group w-full bg-[#0a0a0a] border border-[#222] overflow-hidden cursor-zoom-in aspect-3/4 flex items-center justify-center select-none"
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Subtle brutalist grid overlay & index */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#888] bg-[#000]/70 px-2 py-1 border border-[#222]">
          <span className="w-1.5 h-1.5 bg-[#ff3300] inline-block"></span>
          <span>{VIEW_LABELS[selectedIndex] || `VIEW // 0${selectedIndex + 1}`}</span>
        </div>

        <button
          id="btn-open-lightbox"
          aria-label="Enlarge image"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-[#000]/70 text-[#aaa] hover:text-white border border-[#222] hover:border-[#666] transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Carousel arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              id="gallery-prev-btn"
              aria-label="Previous image"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#000]/70 text-[#888] hover:text-white border border-[#222] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="gallery-next-btn"
              aria-label="Next image"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#000]/70 text-[#888] hover:text-white border border-[#222] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Animated Image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={`${productName} view ${selectedIndex + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full h-full object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Bottom branding watermark */}
        <div className="absolute bottom-3 left-4 text-[9px] font-mono tracking-widest text-[#444] pointer-events-none">
          UNDERGROUNDZ // OPTICAL ARCHIVE
        </div>
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div id="gallery-thumbnails-row" className="grid grid-cols-4 gap-2.5">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={`thumb-${idx}`}
                id={`btn-thumbnail-${idx}`}
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-square bg-[#0e0e0e] border transition-all overflow-hidden flex items-center justify-center ${
                  isSelected 
                    ? 'border-white ring-1 ring-white/50' 
                    : 'border-[#222] hover:border-[#555] opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain p-1"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 font-mono text-[8px] text-[#888] bg-[#000]/80 px-1">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            id="gallery-lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar */}
            <div className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-[#222]">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#ff3300]"></span>
                <span className="font-mono text-xs uppercase tracking-widest text-white">
                  {productName} // {VIEW_LABELS[selectedIndex] || `VIEW 0${selectedIndex + 1}`}
                </span>
              </div>
              <button
                id="btn-close-lightbox"
                aria-label="Close enlarged view"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 border border-[#333] hover:border-white text-[#aaa] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage with Navigation */}
            <div 
              className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="btn-lightbox-prev"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/80 border border-[#333] hover:border-white text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.img
                key={activeImage}
                src={activeImage}
                alt={`${productName} fullscreen`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-h-[78vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />

              <button
                id="btn-lightbox-next"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/80 border border-[#333] hover:border-white text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom thumbnail selector */}
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {galleryImages.map((img, idx) => (
                <button
                  key={`lb-thumb-${idx}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-14 h-14 border bg-[#111] overflow-hidden ${
                    idx === selectedIndex ? 'border-white' : 'border-[#333] opacity-50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
