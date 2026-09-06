import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AuthPromptToastProps {
  user: User | null;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const AuthPromptToast: React.FC<AuthPromptToastProps> = ({ user, onSignIn, onSignUp }) => {
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // If the user is authenticated, we don't need to do anything
    if (user) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      if (hasTriggeredRef.current || user) return;

      const pricingSection = document.getElementById('pricing-section');
      if (pricingSection) {
        const rect = pricingSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Trigger if the pricing section is within a certain distance from the viewport
        if (rect.top <= windowHeight + 200 && rect.bottom >= -200) {
          hasTriggeredRef.current = true;
          
          // Delay to make it feel premium
          setTimeout(() => {
            setIsVisible(true);
            
            // Auto dismiss after 10 seconds
            setTimeout(() => {
              setIsVisible(false);
            }, 10000);
          }, 300);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case they load directly near the pricing section
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500 max-w-sm w-[calc(100vw-48px)]">
      <div className="relative bg-[#0d0d10]/95 backdrop-blur-xl border border-[#2a2a34] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] rounded-xl p-5 overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none" />
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-[#666] hover:text-white transition-colors p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pr-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-[#8e9192] font-mono tracking-wider font-bold uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              Undergroundz
            </span>
          </div>
          
          <h4 className="font-display text-lg text-white font-bold leading-tight mb-2">
            Sign in for a better experience.
          </h4>
          <p className="font-body text-xs text-[#8e9192] mb-5">
            Log in to access your secure profile and personalize your session.
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setIsVisible(false);
                onSignIn();
              }}
              className="w-full bg-white text-black font-body text-xs font-bold uppercase tracking-wider py-2.5 transition-colors hover:bg-neutral-200 rounded"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                onSignUp();
              }}
              className="w-full bg-[#18181e] text-white border border-[#33333d] font-body text-xs font-bold uppercase tracking-wider py-2.5 transition-colors hover:bg-[#202026] hover:text-white rounded"
            >
              New User? Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
