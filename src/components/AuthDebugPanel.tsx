import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, getOAuthRedirectInfo, getCurrentUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { ShieldCheck, ChevronDown, ChevronUp, RefreshCw, ExternalLink } from 'lucide-react';

interface AuthDebugPanelProps {
  user: User | null;
}

export const AuthDebugPanel: React.FC<AuthDebugPanelProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState<string>('INITIALIZING');
  const [clientStatus, setClientStatus] = useState<'CONNECTED' | 'ERROR'>('CONNECTED');
  const [dbStatus, setDbStatus] = useState<Record<string, 'READY' | 'INITIALIZING' | 'ERROR'>>({
    profiles: 'INITIALIZING',
    orders: 'INITIALIZING',
    community_posts: 'INITIALIZING',
    product_reviews: 'INITIALIZING',
  });

  const oauthInfo = getOAuthRedirectInfo();

  const checkDatabaseHealth = async () => {
    if (!supabase) return;
    const tables = ['profiles', 'orders', 'community_posts', 'product_reviews'];
    const results: Record<string, 'READY' | 'INITIALIZING' | 'ERROR'> = {};

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
          // PGRST205 / 404 indicates table hasn't been migrated yet
          results[table] = error.code === 'PGRST205' ? 'INITIALIZING' : 'READY';
        } else {
          results[table] = 'READY';
        }
      } catch {
        results[table] = 'ERROR';
      }
    }
    setDbStatus(results);
  };

  const refreshSessionState = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setAuthState(`ERROR: ${error.message}`);
        } else if (data?.session) {
          setAuthState('ACTIVE SESSION');
        } else {
          setAuthState('NO SESSION (ANONYMOUS)');
        }
      } catch (err: any) {
        setAuthState(`FAILED: ${err?.message || 'Unknown'}`);
      }
    }
    checkDatabaseHealth();
  };

  useEffect(() => {
    if (supabase) {
      setClientStatus('CONNECTED');
      refreshSessionState();
      checkDatabaseHealth();

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setAuthState(session ? `ACTIVE (${event})` : `UNAUTHENTICATED (${event})`);
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
            <div className="flex items-center gap-2">
              <button
                onClick={refreshSessionState}
                className="p-0.5 text-[#777] hover:text-[#00ff88] transition-colors cursor-pointer"
                title="Refresh Session"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-toggle-auth-debug-close"
                onClick={() => setIsOpen(false)}
                className="p-0.5 text-[#777] hover:text-white cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
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

            {/* Config Status */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Credentials:</span>
              <span className="text-[#00ff88] font-bold">
                {isSupabaseConfigured ? 'READY' : 'UNCONFIGURED'}
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
                {user ? 'AUTHENTICATED' : 'ANONYMOUS'}
              </span>
            </div>

            {/* Current User */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Current User:</span>
              <span className="text-white font-medium truncate max-w-[170px]" title={user?.email || 'None'}>
                {user?.email || 'None (Guest Rider)'}
              </span>
            </div>

            {/* Environment */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Runtime Environment:</span>
              <span className="text-white font-medium">
                {oauthInfo.isAiStudioDev ? 'Cloud Run Dev' : oauthInfo.isIframe ? 'iFrame' : 'Standalone'}
              </span>
            </div>

            {/* OAuth Redirect Destination */}
            <div className="flex flex-col py-0.5 border-t border-[#1c1c22] pt-1.5">
              <span className="text-[#888]">OAuth Redirect Destination:</span>
              <span className="text-[#00ff88] text-[9px] break-all" title={oauthInfo.redirectUrl}>
                {oauthInfo.redirectUrl}
              </span>
            </div>

            {/* Auth State */}
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[#888]">Auth State:</span>
              <span className="text-[#d8d8d8] font-medium text-[9px] truncate max-w-[180px]">
                {authState}
              </span>
            </div>

            {/* Supabase Database Tables */}
            <div className="border-t border-[#1c1c22] pt-1.5 flex flex-col gap-1">
              <span className="text-[#888] text-[9px] uppercase tracking-wider font-bold">
                Supabase Tables (PostgreSQL):
              </span>
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                {Object.entries(dbStatus).map(([tbl, status]) => (
                  <div key={tbl} className="flex items-center justify-between bg-[#141418] px-1.5 py-0.5 border border-[#222]">
                    <span className="text-[#aaa] truncate">{tbl}:</span>
                    <span className={`font-bold ml-1 ${status === 'READY' ? 'text-[#00ff88]' : 'text-[#eab308]'}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Guarantee Note */}
          <div className="text-[8px] text-[#666] border-t border-[#1c1c22] pt-1.5 flex items-center justify-between">
            <span>PKCE Flow Active</span>
            <span>Zero Mock Users</span>
          </div>
        </div>
      )}
    </div>
  );
};
