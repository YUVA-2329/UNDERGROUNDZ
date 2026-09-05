import React, { useState } from 'react';
import { Star, CheckCircle, ShieldCheck, Camera, Sparkles, Plus, X, Loader2 } from 'lucide-react';
import { ProductReview } from '../types';

interface PeopleWearingProps {
  reviews: ProductReview[];
  productName: string;
  productId?: string;
  onAddReview?: (review: ProductReview) => Promise<void> | void;
}

export const PeopleWearingUndergroundz: React.FC<PeopleWearingProps> = ({
  reviews,
  productName,
  productId = '',
  onAddReview,
}) => {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [sizeWorn, setSizeWorn] = useState('M');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // STRICT CONSTRAINT: Maximum 5 reviews per product. Never display more than 5.
  const displayedReviews = (reviews || []).slice(0, 5);

  const averageRating = (
    displayedReviews.length > 0
      ? displayedReviews.reduce((acc, r) => acc + r.rating, 0) / displayedReviews.length
      : 5.0
  ).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewText.trim()) return;

    setSubmitting(true);
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: productId || 'product',
      userName: reviewerName.toUpperCase(),
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      rating,
      reviewDate: 'Today',
      reviewText,
      verifiedPurchase: true,
      sizeWorn,
      colorWorn: 'NIGHT REFLECTION',
      isDemo: false,
    };

    if (onAddReview) {
      await onAddReview(newReview);
    }
    setSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsAddingReview(false);
      setReviewerName('');
      setReviewText('');
    }, 1500);
  };

  return (
    <section id="people-wearing-undergroundz" className="mt-16 pt-12 border-t border-[#222]">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#1c1c22] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#9e1b24] rounded-full"></span>
            <span className="font-body text-[11px] tracking-wider text-[#8e8e98] uppercase font-semibold">
              COMMUNITY OUTFIT LOGS // VERIFIED RIDERS
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight text-white uppercase font-bold">
            PEOPLE WEARING UNDERGROUNDZ
          </h2>
          <p className="text-xs text-[#8e8e98] font-body mt-1">
            Real styling field notes and feedback from owners of {productName}.
          </p>
        </div>

        {/* Rating summary & Demo Notice */}
        <div className="flex flex-col md:items-end gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center text-white">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-white text-white"
                />
              ))}
            </div>
            <span className="font-body text-sm font-bold text-white">{averageRating} / 5.0</span>
            <span className="font-body text-xs text-[#8e8e98]">
              ({displayedReviews.length} Verified Entries)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingReview(!isAddingReview)}
              className="px-3 py-1 bg-white hover:bg-[#ccc] text-black font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            >
              {isAddingReview ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              <span>{isAddingReview ? 'CLOSE FORM' : 'LOG GEAR REVIEW'}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[10px] font-body text-[#9c9ca8] bg-[#16161c] px-2 py-1 border border-[#262632] uppercase tracking-wider font-semibold">
              <Sparkles className="w-3 h-3 text-white" />
              <span>SUPABASE VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      {isAddingReview && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-5 bg-[#0f0f13] border border-[#262632] max-w-xl flex flex-col gap-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#202026]">
            <span className="font-mono text-xs font-bold uppercase text-white tracking-wider">
              NEW FIELD REVIEW // SUPABASE POSTGRES
            </span>
            {submitSuccess && (
              <span className="text-[10px] font-mono text-[#00ff88]">
                SAVED TO SUPABASE
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#888] mb-1">
                Your Callsign / Name
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. CYBER_NOMAD"
                className="w-full h-8 px-2 bg-[#08080a] border border-[#333] text-xs text-white focus:outline-none focus:border-[#ff3300]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#888] mb-1">
                Size Worn
              </label>
              <select
                value={sizeWorn}
                onChange={(e) => setSizeWorn(e.target.value)}
                className="w-full h-8 px-2 bg-[#08080a] border border-[#333] text-xs text-white focus:outline-none focus:border-[#ff3300]"
              >
                <option value="S">S - SMALL</option>
                <option value="M">M - MEDIUM</option>
                <option value="L">L - LARGE</option>
                <option value="XL">XL - OVERSIZED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#888] mb-1">
              Rating (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating
                        ? 'fill-white text-white'
                        : 'text-[#444]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#888] mb-1">
              Field Review Notes
            </label>
            <textarea
              required
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Detail build quality, weatherproofing, and fit..."
              className="w-full p-2 bg-[#08080a] border border-[#333] text-xs text-white focus:outline-none focus:border-[#ff3300]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-9 bg-[#ff3300] hover:bg-[#cc2900] text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : null}
            <span>SUBMIT REVIEW TO SUPABASE</span>
          </button>
        </form>
      )}

      {/* Grid of Reviews: Clean, brutalist fashion cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            id={`review-card-${review.id}`}
            className="flex flex-col bg-[#0f0f13] border border-[#202026] p-4 transition-all duration-200 hover:border-[#3a3a44]"
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
                    <span className="font-body text-xs font-semibold text-white tracking-wide">
                      {review.userName}
                    </span>
                    {review.verifiedPurchase && (
                      <span className="flex items-center text-white text-[9px] font-body" title="Verified Purchase">
                        <CheckCircle className="w-3 h-3 inline mr-0.5" />
                      </span>
                    )}
                  </div>
                  <span className="font-body text-[10px] text-[#8e8e98]">
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
                        ? 'text-white fill-white'
                        : 'text-[#333]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Optional Customer Styling Photo */}
            {review.stylingImage && (
              <div className="relative w-full aspect-4/3 mb-3 bg-[#000] border border-[#1a1a20] overflow-hidden group">
                <img
                  src={review.stylingImage}
                  alt={`${review.userName} wearing ${productName}`}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 border border-[#262632] font-body text-[9px] tracking-wider text-[#aaa] flex items-center gap-1 uppercase font-medium">
                  <Camera className="w-2.5 h-2.5 text-[#9e1b24]" />
                  <span>ON BODY LOOK</span>
                </div>
              </div>
            )}

            {/* Review Quote Body (Rule 4: simple modern neutral sans-serif, high readability, good line-height) */}
            <p className="font-body text-xs text-[#b0b0ba] leading-relaxed mb-3 flex-1">
              "{review.reviewText}"
            </p>

            {/* Footnote with Size & Color metadata */}
            <div className="pt-2.5 mt-auto border-t border-[#1a1a22] flex items-center justify-between text-[10px] font-body text-[#8e8e98]">
              <span>
                SIZE: <strong className="text-[#aaa]">{review.sizeWorn || 'M'}</strong> | COLOR: <strong className="text-[#aaa]">{review.colorWorn || 'NIGHT REFLECTION'}</strong>
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
