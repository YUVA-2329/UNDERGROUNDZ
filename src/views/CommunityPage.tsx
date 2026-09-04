import React, { useState } from 'react';
import { CommunityPost, FieldReport } from '../types';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';

interface CommunityPageProps {
  posts: CommunityPost[];
  onAddPost: (post: CommunityPost) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ posts, onAddPost }) => {
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
      <header className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-[#444748] pb-8">
        <div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-none tracking-tighter mb-4 font-extrabold text-white">
            COMMUNITY /<br />THE BROTHERHOOD
          </h1>
          <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#8e9192]">
            System_Index: Global_Rider_Network
          </p>
        </div>

        <div className="mt-8 md:mt-0 flex flex-col items-end">
          <span className="font-mono-tech text-xs text-white mb-2 font-bold">ACTIVE_NODES: 12,482</span>
          <div className="h-px w-36 bg-white"></div>
        </div>
      </header>

      {/* Masonry / Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          if (post.type === 'verified_member' && post.image) {
            return (
              <div
                key={post.id}
                className="relative group overflow-hidden border border-[#3a3a3a] bg-[#0e0e0e] min-h-[460px] flex flex-col justify-end"
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-80 group-hover:scale-105 transition-transform duration-700"
                  src={post.image}
                  alt={post.author}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent opacity-80"></div>
                <div className="relative z-10 p-8 w-full">
                  <span className="font-mono-tech text-xs bg-white text-black font-bold px-3 py-1 mb-4 inline-block">
                    {post.role}
                  </span>
                  <h3 className="font-display text-xl text-white font-bold mb-1">{post.author}</h3>
                  <p className="font-mono-tech text-xs text-[#c4c7c8]">{post.location}</p>
                </div>
              </div>
            );
          }

          if (post.type === 'quote' || post.type === 'review') {
            return (
              <div
                key={post.id}
                className="p-8 border border-[#3a3a3a] flex flex-col justify-between bg-[#1b1b1b] min-h-[260px] relative"
              >
                <div>
                  <span className="material-symbols-outlined text-white mb-4 text-3xl">format_quote</span>
                  <p className="font-mono-tech text-xs uppercase tracking-wider text-white leading-relaxed">
                    {post.quote}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#3a3a3a] flex justify-between items-center font-mono-tech text-[10px] text-[#8e9192]">
                  <span>— {post.author}</span>
                  <span>{post.location}</span>
                </div>
              </div>
            );
          }

          if (post.type === 'velocity' && post.image) {
            return (
              <div key={post.id} className="relative overflow-hidden group border border-[#3a3a3a] min-h-[420px] bg-[#1f1f1f]">
                <img
                  className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-100 transition-all duration-500"
                  src={post.image}
                  alt={post.title}
                />
                <div className="absolute bottom-4 left-4 font-mono-tech text-xs text-white bg-[#131313]/90 px-3 py-1.5 border border-[#3a3a3a]">
                  {post.title}
                </div>
              </div>
            );
          }

          // Default photo
          return (
            <div key={post.id} className="relative overflow-hidden group border border-[#3a3a3a] min-h-[320px] bg-[#1f1f1f]">
              {post.image ? (
                <img
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 transition-all duration-500"
                  src={post.image}
                  alt={post.author}
                />
              ) : (
                <div className="p-8 flex flex-col justify-center h-full bg-[#1b1b1b]">
                  <p className="font-mono-tech text-xs text-white uppercase">{post.quote}</p>
                </div>
              )}
              <div className="absolute top-4 right-4 h-6 w-6 border-t border-r border-white"></div>
            </div>
          );
        })}
      </div>

      {/* Join Community CTA */}
      <section className="mt-28 border-t border-b border-[#444748] py-20 flex flex-col items-center text-center">
        <h2 className="font-display text-3xl sm:text-5xl mb-6 tracking-tighter uppercase font-bold text-white">
          ESTABLISH_CONNECTION
        </h2>
        <p className="font-body text-base text-[#8e9192] max-w-2xl mb-10">
          Submit your field documentation. Selected riders are archived in the System Index and granted access to Prototype Drop Tier 0.
        </p>
        <HoverBorderGradient
          as="button"
          containerClassName="rounded-none active:scale-95 transition-all"
          className="px-12 py-5 bg-white text-black font-mono-tech text-xs uppercase tracking-[0.3em] font-bold hover:bg-[#c6c6c7] transition-colors"
          onClick={() => setIsSubmitOpen(true)}
        >
          UPLOAD_LOG_001
        </HoverBorderGradient>
      </section>

      {/* Submission Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#131313] brutalist-border p-6 md:p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6 border-b border-[#3a3a3a] pb-4">
              <div>
                <span className="font-mono-tech text-[10px] text-[#8e9192] uppercase block">FIELD REPORT TRANSMISSION</span>
                <h3 className="font-display text-lg uppercase font-bold text-white">SUBMIT RIDER LOG</h3>
              </div>
              <button onClick={() => setIsSubmitOpen(false)} className="text-white hover:text-[#8e9192] cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center bg-[#1b1b1b] border border-[#3a3a3a]">
                <span className="material-symbols-outlined text-4xl text-emerald-400 mb-2">check</span>
                <p className="font-mono-tech text-xs text-white uppercase">FIELD LOG TRANSMITTED & INDEXED</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 font-mono-tech text-xs">
                <div>
                  <label className="block text-[#8e9192] uppercase mb-1">RIDER CALLSIGN *</label>
                  <input
                    type="text"
                    required
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="E.G. KYLE_082"
                    className="w-full bg-[#1b1b1b] border border-[#3a3a3a] px-3 py-3 text-white focus:outline-none focus:border-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[#8e9192] uppercase mb-1">SECTOR / LOCATION</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="E.G. BERLIN_SECTOR_04"
                    className="w-full bg-[#1b1b1b] border border-[#3a3a3a] px-3 py-3 text-white focus:outline-none focus:border-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[#8e9192] uppercase mb-1">GEAR UNIT IN USE</label>
                  <select
                    value={gearUsed}
                    onChange={(e) => setGearUsed(e.target.value)}
                    className="w-full bg-[#1b1b1b] border border-[#3a3a3a] px-3 py-3 text-white focus:outline-none focus:border-white uppercase"
                  >
                    <option value="V-01 TECHNICAL SHELL">V-01 TECHNICAL SHELL</option>
                    <option value="THE VOID HOODIE">THE VOID HOODIE</option>
                    <option value="THE CORE T-SHIRT">THE CORE T-SHIRT</option>
                    <option value="THE TECH SHIRT">THE TECH SHIRT</option>
                    <option value="THE BRUTALIST SWEATER">THE BRUTALIST SWEATER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8e9192] uppercase mb-1">FIELD LOG REPORT *</label>
                  <textarea
                    required
                    rows={4}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="ENTER YOUR OBSERVATIONS, WEATHER CONDITIONS, MATERIAL DEDUCTIONS..."
                    className="w-full bg-[#1b1b1b] border border-[#3a3a3a] px-3 py-3 text-white focus:outline-none focus:border-white uppercase"
                  />
                </div>

                <HoverBorderGradient
                  as="button"
                  type="submit"
                  containerClassName="w-full rounded-none"
                  className="w-full py-4 bg-white text-black font-display font-bold uppercase hover:bg-[#c6c6c7] transition-colors"
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
