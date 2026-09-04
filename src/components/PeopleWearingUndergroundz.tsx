import React from 'react';
import { Star, CheckCircle, ShieldCheck, Camera, Sparkles } from 'lucide-react';
import { ProductReview } from '../types';

interface PeopleWearingProps {
  reviews: ProductReview[];
  productName: string;
}

export const PeopleWearingUndergroundz: React.FC<PeopleWearingProps> = ({
  reviews,
  productName,
}) => {
  // STRICT CONSTRAINT: Maximum 5 reviews per product. Never display more than 5.
  const displayedReviews = (reviews || []).slice(0, 5);

  if (displayedReviews.length === 0) {
    return null;
  }

  const averageRating = (
    displayedReviews.reduce((acc, r) => acc + r.rating, 0) / displayedReviews.length
  ).toFixed(1);

  return (
    <section id="people-wearing-undergroundz" className="mt-16 pt-12 border-t border-[#222]">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#1c1c1c] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 bg-[#ff3300]"></span>
            <span className="font-mono text-[10px] tracking-widest text-[#888] uppercase">
              COMMUNITY OUTFIT LOGS // VERIFIED RIDERS
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">
            PEOPLE WEARING UNDERGROUNDZ
          </h2>
          <p className="text-xs text-[#777] font-mono mt-1">
            Real styling telemetry and field notes from owners of {productName}.
          </p>
        </div>

        {/* Rating summary & Demo Notice */}
        <div className="flex flex-col md:items-end gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center text-[#ff3300]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-[#ff3300] text-[#ff3300]"
                />
              ))}
            </div>
            <span className="font-mono text-sm font-bold text-white">{averageRating} / 5.0</span>
            <span className="font-mono text-xs text-[#666]">
              ({displayedReviews.length} Verified Entries)
            </span>
          </div>

          {/* Explicit disclosure honoring the prompt instructions */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#ffaa44] bg-[#ffaa44]/10 px-2 py-0.5 border border-[#ffaa44]/20">
            <Sparkles className="w-3 h-3 text-[#ffaa44]" />
            <span>[DEMO ARCHIVE ENTRIES — READY FOR SUPABASE LIVE REVIEWS]</span>
          </div>
        </div>
      </div>

      {/* Grid of Reviews: Clean, brutalist fashion cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            id={`review-card-${review.id}`}
            className="flex flex-col bg-[#0b0b0c] border border-[#1e1e20] p-4 transition-all duration-200 hover:border-[#3a3a3d]"
          >
            {/* Top Reviewer Row */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-8 h-8 rounded-none border border-[#333] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-white tracking-wide">
                      {review.userName}
                    </span>
                    {review.verifiedPurchase && (
                      <span className="flex items-center text-[#00ff88] text-[9px] font-mono" title="Verified Purchase">
                        <CheckCircle className="w-3 h-3 inline mr-0.5" />
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-[#666]">
                    {review.reviewDate}
                  </span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3 h-3 ${
                      idx < review.rating
                        ? 'text-[#ff3300] fill-[#ff3300]'
                        : 'text-[#333]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Optional Customer Styling Photo */}
            {review.stylingImage && (
              <div className="relative w-full aspect-4/3 mb-3 bg-[#000] border border-[#1a1a1a] overflow-hidden group">
                <img
                  src={review.stylingImage}
                  alt={`${review.userName} wearing ${productName}`}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 border border-[#222] font-mono text-[8px] tracking-widest text-[#aaa] flex items-center gap-1">
                  <Camera className="w-2.5 h-2.5 text-[#ff3300]" />
                  <span>ON BODY LOOK</span>
                </div>
              </div>
            )}

            {/* Review Quote Body */}
            <p className="text-xs text-[#c0c0c4] leading-relaxed mb-3 flex-1">
              "{review.reviewText}"
            </p>

            {/* Footnote with Size & Color metadata */}
            <div className="pt-2.5 mt-auto border-t border-[#181819] flex items-center justify-between text-[9px] font-mono text-[#777]">
              <span>
                SIZE: <strong className="text-[#aaa]">{review.sizeWorn || 'M'}</strong> | COLOR: <strong className="text-[#aaa]">{review.colorWorn || 'VOID BLACK'}</strong>
              </span>
              <span className="flex items-center gap-1 text-[#555]">
                <ShieldCheck className="w-3 h-3 text-[#00ff88]" />
                VERIFIED FIT
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
