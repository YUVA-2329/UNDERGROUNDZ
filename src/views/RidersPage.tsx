import React, { useEffect, useState } from 'react';
import { ViewType, CommunityPost } from '../types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface RidersPageProps {
  setCurrentView: (view: ViewType) => void;
  posts: CommunityPost[];
}

export const RidersPage: React.FC<RidersPageProps> = ({ setCurrentView, posts }) => {
  return (
    <main className="pt-24 pb-32 px-5 md:px-16 max-w-[1440px] mx-auto min-h-screen">
      <header className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-[#25252e] pb-8">
        <div>
          <button 
            onClick={() => setCurrentView('community')}
            className="text-[#8e8e98] hover:text-white font-mono text-xs uppercase tracking-widest mb-6 flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            BACK TO COMMUNITY
          </button>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-none tracking-tight mb-4 font-bold text-white uppercase">
            RIDER DATABASE
          </h1>
          <p className="font-body text-xs uppercase tracking-wider text-[#8e8e98] font-medium">
            System Index: Verified Dispatch Logs
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          if (post.type === 'verified_member' && post.image) {
            return (
              <div
                key={post.id}
                className="relative group overflow-hidden border border-[#23232c] bg-[#0e0e12] min-h-[460px] flex flex-col justify-end"
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-80 group-hover:scale-105 transition-transform duration-700"
                  src={post.image}
                  alt={post.author}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent opacity-85"></div>
                <div className="relative z-10 p-8 w-full">
                  <span className="font-body text-[11px] bg-white text-black font-semibold px-3 py-1 mb-4 inline-block uppercase tracking-wider">
                    {post.role}
                  </span>
                  <h3 className="font-display text-2xl text-white font-bold mb-1 uppercase tracking-tight">{post.author}</h3>
                  <p className="font-body text-xs text-[#9c9ca8]">{post.location}</p>
                </div>
              </div>
            );
          }

          if (post.type === 'quote' || post.type === 'review') {
            return (
              <div
                key={post.id}
                className="p-8 border border-[#23232c] flex flex-col justify-between bg-[#121216] min-h-[260px] relative"
              >
                <div>
                  <span className="material-symbols-outlined text-white mb-4 text-3xl">format_quote</span>
                  <p className="font-body text-sm text-[#d4d4dc] leading-relaxed">
                    {post.quote}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#23232c] flex justify-between items-center font-body text-xs text-[#8e8e98]">
                  <span className="font-semibold text-white">— {post.author}</span>
                  <span>{post.location}</span>
                </div>
              </div>
            );
          }

          if (post.type === 'velocity' && post.image) {
            return (
              <div key={post.id} className="relative overflow-hidden group border border-[#23232c] min-h-[420px] bg-[#121216]">
                <img
                  className="w-full h-full object-cover grayscale opacity-75 group-hover:opacity-100 transition-all duration-500"
                  src={post.image}
                  alt={post.title}
                />
                <div className="absolute bottom-4 left-4 font-body text-xs font-semibold text-white bg-[#101014]/90 px-3 py-1.5 border border-[#2a2a34] uppercase tracking-wider">
                  {post.title}
                </div>
              </div>
            );
          }

          // Default photo
          return (
            <div key={post.id} className="relative overflow-hidden group border border-[#23232c] min-h-[320px] bg-[#121216]">
              {post.image ? (
                <img
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 transition-all duration-500"
                  src={post.image}
                  alt={post.author}
                />
              ) : (
                <div className="p-8 flex flex-col justify-center h-full bg-[#121216]">
                  <p className="font-body text-sm text-white leading-relaxed">{post.quote}</p>
                </div>
              )}
              <div className="absolute top-4 right-4 h-6 w-6 border-t border-r border-white"></div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
