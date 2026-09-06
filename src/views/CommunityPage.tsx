import React, { useState } from 'react';
import { CommunityPost, FieldReport } from '../types';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import { notifyRiderRegistration } from '../services/telegramNotifications';

interface CommunityPageProps {
  posts: CommunityPost[];
  onAddPost: (post: CommunityPost) => void;
  onViewRiders: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ posts, onAddPost, onViewRiders }) => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [callsign, setCallsign] = useState('');
  const [sector, setSector] = useState('');
  const [gearUsed, setGearUsed] = useState('V-01 TECHNICAL SHELL');
  const [reportText, setReportText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsign || !reportText) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: `${callsign.toUpperCase()} / RIDER`,
      role: 'MEMBER_VERIFIED',
      location: `SECTOR: ${sector.toUpperCase() || 'BERLIN_SECTOR_04'}`,
      type: 'quote',
      quote: `"${reportText}"`,
      heightClass: 'sm',
      timestamp: new Date().toISOString(),
    };

    onAddPost(newPost);
    
    // Dispatch Rider Registration / Field Log to Telegram
    notifyRiderRegistration({
      callsign: callsign.toUpperCase(),
      sector: sector.toUpperCase() || 'BERLIN_SECTOR_04',
      gearTagged: gearUsed,
      source: 'Field Dispatch Transmission',
    }).catch(() => {});

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitOpen(false);
      setCallsign('');
      setSector('');
      setReportText('');
    }, 1800);
  };

  return (
    <main className="pt-24 pb-32 px-5 md:px-16 max-w-[1440px] mx-auto min-h-screen">
      {/* Header Section */}
      <header className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-[#25252e] pb-8">
        <div>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-none tracking-tight mb-4 font-bold text-white uppercase">
            COMMUNITY /<br />THE BROTHERHOOD
          </h1>
          <p className="font-body text-xs uppercase tracking-wider text-[#8e8e98] font-medium">
            System Index: Global Rider Network & Field Dispatch
          </p>
        </div>

        <div className="mt-8 md:mt-0 flex flex-col items-end">
          <span className="font-body text-xs text-white mb-2 font-semibold tracking-wider uppercase">ACTIVE RIDERS: 12,482</span>
          <div className="h-px w-36 bg-white"></div>
        </div>
      </header>

      {/* Primary Actions */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mt-20">
        <HoverBorderGradient
          as="button"
          containerClassName="rounded-none active:scale-95 transition-all w-full md:w-auto"
          className="px-10 py-5 bg-white text-black font-body text-sm uppercase tracking-wider font-semibold hover:bg-[#d8d8d8] transition-colors min-w-[280px]"
          onClick={() => setIsSubmitOpen(true)}
        >
          UPLOAD DISPATCH LOG
        </HoverBorderGradient>

        <HoverBorderGradient
          as="button"
          containerClassName="rounded-none active:scale-95 transition-all w-full md:w-auto"
          className="px-10 py-5 bg-[#101014] text-white border border-[#2a2a34] font-body text-sm uppercase tracking-wider font-semibold hover:bg-[#1a1a20] transition-colors min-w-[280px]"
          onClick={() => onViewRiders()}
        >
          VIEW RIDERS
        </HoverBorderGradient>
      </div>

      {/* Submission Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#101014] border border-[#262632] p-6 md:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6 border-b border-[#22222a] pb-4">
              <div>
                <span className="font-body text-[11px] text-[#8e8e98] uppercase block font-semibold tracking-wider">FIELD REPORT TRANSMISSION</span>
                <h3 className="font-display text-xl uppercase font-bold text-white tracking-tight">SUBMIT RIDER LOG</h3>
              </div>
              <button onClick={() => setIsSubmitOpen(false)} className="text-white hover:text-[#8e8e98] cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center bg-[#16161c] border border-[#262632]">
                <span className="material-symbols-outlined text-4xl text-white mb-2">check</span>
                <p className="font-body text-xs text-white uppercase font-semibold tracking-wider">FIELD LOG TRANSMITTED & INDEXED</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 font-body text-xs">
                <div>
                  <label className="block text-[#8e8e98] uppercase mb-1 font-semibold tracking-wider">RIDER CALLSIGN *</label>
                  <input
                    type="text"
                    required
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="E.G. KYLE_082"
                    className="w-full bg-[#16161c] border border-[#262632] px-3 py-3 text-white focus:outline-none focus:border-white uppercase font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#8e8e98] uppercase mb-1 font-semibold tracking-wider">SECTOR / LOCATION</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="E.G. BERLIN_SECTOR_04"
                    className="w-full bg-[#16161c] border border-[#262632] px-3 py-3 text-white focus:outline-none focus:border-white uppercase font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#8e8e98] uppercase mb-1 font-semibold tracking-wider">GEAR UNIT IN USE</label>
                  <select
                    value={gearUsed}
                    onChange={(e) => setGearUsed(e.target.value)}
                    className="w-full bg-[#16161c] border border-[#262632] px-3 py-3 text-white focus:outline-none focus:border-white uppercase font-medium"
                  >
                    <option value="V-01 TECHNICAL SHELL">V-01 TECHNICAL SHELL</option>
                    <option value="THE REFLECTION HOODIE">THE REFLECTION HOODIE</option>
                    <option value="THE CORE T-SHIRT">THE CORE T-SHIRT</option>
                    <option value="THE TECH SHIRT">THE TECH SHIRT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8e8e98] uppercase mb-1 font-semibold tracking-wider">FIELD LOG REPORT *</label>
                  <textarea
                    required
                    rows={4}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="ENTER YOUR OBSERVATIONS, WEATHER CONDITIONS, MATERIAL DEDUCTIONS..."
                    className="w-full bg-[#16161c] border border-[#262632] px-3 py-3 text-white focus:outline-none focus:border-white uppercase font-medium"
                  />
                </div>

                <HoverBorderGradient
                  as="button"
                  type="submit"
                  containerClassName="w-full rounded-none"
                  className="w-full py-4 bg-white text-black font-body font-semibold text-xs uppercase hover:bg-[#d8d8d8] transition-colors tracking-wider"
                >
                  TRANSMIT FIELD REPORT
                </HoverBorderGradient>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
