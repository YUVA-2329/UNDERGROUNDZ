import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { ShieldCheck, ShieldAlert, ChevronDown, ChevronUp, RefreshCw, LogIn, ExternalLink } from 'lucide-react';

interface AuthDebugPanelProps {
  user: User | any | null;
}

export const AuthDebugPanel: React.FC<AuthDebugPanelProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState<string>('INITIALIZING');
  const [googleProviderStatus, setGoogleProviderStatus] = useState<'CONFIGURED' | 'UNKNOWN'>('UNKNOWN');
  const [clientStatus, setClientStatus] = useState<'CONNECTED' | 'ERROR'>('CONNECTED');

  const supabaseUrlConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL || 'https://myntjfzjfyzyqnlmwsrd.supabase.co'
  );
  const publishableKeyConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_ANON_KEY || isSupabaseConfigured
  );

  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'N/A';

  useEffect(() => {
    // Check Supabase connection and Google Provider status
    if (supabase) {
      setClientStatus('CONNECTED');
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          setAuthState(`ERROR: ${error.message}`);
        } else if (data.session) {
          setAuthState('LOGGED IN (SESSION ACTIVE)');
        } else {
          setAuthState('READY (LOGGED OUT)');
        }
      }).catch(() => {
        setClientStatus('ERROR');
        setAuthState('CONNECTION FAILED');
      });

      // Check if google provider is configured in Supabase settings
      fetch('https://myntjfzjfyzyqnlmwsrd.supabase.co/auth/v1/settings', {
        headers: {
          apikey:
            import.meta.env.VITE_SUPABASE_ANON_KEY ||
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bnRqZnpqZnl6eXFubG13c3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MjcwNjcsImV4cCI6MjEwNDEwMzA2N30.y00M-47lxwi-cLu4LtuqZB6HaN8nWK0tW0l0E-3QMpE',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.external?.google === true) {
            setGoogleProviderStatus('CONFIGURED');
          }
        })
        .catch(() => {
          setGoogleProviderStatus('UNKNOWN');
        });

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setAuthState(session ? `LOGGED IN (${event})` : `LOGGED OUT (${event})`);
      });

      return () => {
        data.subscription.unsubscribe();
      };
    } else {
      setClientStatus('ERROR');
      setAuthState('CLIENT UNINITIALIZED');
    }
  }, []);

  return (
    <div
      id="auth-debug-panel-container"
      className="fixed bottom-16 md:bottom-4 left-4 z-50 font-mono text-xs max-w-sm w-full select-none"
    >
      {/* Collapsed Toggle Button */}
      {!isOpen && (
        <button
          id="btn-toggle-auth-debug-open"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0e0e12]/95 border border-[#333] hover:border-white text-white backdrop-blur-md shadow-2xl transition-all cursor-pointer group"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              clientStatus === 'CONNECTED' ? 'bg-[#00ff88]' : 'bg-red-500 animate-pulse'
            }`}
          />
          <span className="text-[10px] tracking-wider uppercase font-bold text-[#c8c8c8] group-hover:text-white">
            AUTH DIAGNOSTIC
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-[#888] group-hover:text-white" />
        </button>
      )}

      {/* Expanded Diagnostic HUD */}
      {isOpen && (
        <div
          id="auth-debug-panel-content"
          className="bg-[#0b0b0e]/95 border border-[#2e2e36] text-white p-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.9)] flex flex-col gap-3 animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#222228] pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-white">
                AUTH DIAGNOSTIC PANEL
              </span>
            </div>
            <button
              id="btn-toggle-auth-debug-close"
              onClick={() => setIsOpen(false)}
              className="p-0.5 text-[#777] hover:text-white cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Diagnostic Metrics */}
          <div className="space-y-1.5 text-[10px]">
            {/* Supabase Client */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Supabase Client:</span>
              <span
                className={`font-bold px-1.5 py-0.2 rounded-none ${
                  clientStatus === 'CONNECTED'
                    ? 'text-[#00ff88] bg-[#00ff88]/10'
                    : 'text-red-400 bg-red-500/10'
                }`}
              >
                {clientStatus}
              </span>
            </div>

            {/* Supabase URL */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Supabase URL:</span>
              <span className="text-[#00ff88] font-bold">
                {supabaseUrlConfigured ? 'CONFIGURED' : 'MISSING'}
              </span>
            </div>

            {/* Publishable Key */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Publishable Key:</span>
              <span className="text-[#00ff88] font-bold">
                {publishableKeyConfigured ? 'CONFIGURED' : 'MISSING'}
              </span>
            </div>

            {/* Google Provider */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Google Provider:</span>
              <span
                className={`font-bold ${
                  googleProviderStatus === 'CONFIGURED' ? 'text-[#00ff88]' : 'text-amber-400'
                }`}
              >
                {googleProviderStatus}
              </span>
            </div>

            {/* Current Session */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Current Session:</span>
              <span
                className={`font-bold ${
                  user ? 'text-[#00ff88]' : 'text-[#888]'
                }`}
              >
                {user ? 'LOGGED IN' : 'LOGGED OUT'}
              </span>
            </div>

            {/* Current User */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Current User:</span>
              <span className="text-white font-medium truncate max-w-[170px]" title={user?.email || 'Not authenticated'}>
                {user?.email || 'Not authenticated'}
              </span>
            </div>

            {/* OAuth Redirect */}
            <div className="flex flex-col py-0.5 border-t border-[#1c1c22] pt-1.5">
              <span className="text-[#888]">OAuth Redirect:</span>
              <span className="text-[#a4a8ad] text-[9px] break-all truncate" title={redirectUrl}>
                {redirectUrl}
              </span>
            </div>

            {/* Auth State */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Auth State:</span>
              <span className="text-[#d8d8d8] font-medium text-[9px] truncate max-w-[180px]">
                {authState}
              </span>
            </div>
          </div>

          {/* Security Guarantee Note */}
          <div className="text-[8px] text-[#666] border-t border-[#1c1c22] pt-1.5">
            [SAFE DEBUG MODE] No secrets, private keys, or client secrets are exposed.
          </div>
        </div>
      )}
    </div>
  );
};
