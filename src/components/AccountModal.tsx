import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User as UserIcon, LogOut, Package, Shield, ExternalLink } from 'lucide-react';
import { signInWithGoogle, signOut, MockUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { ViewType } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | MockUser | null;
  setCurrentView: (view: ViewType) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  setCurrentView,
}) => {
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleViewOrders = () => {
    onClose();
    setCurrentView('my-orders');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="account-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            id="account-modal-content"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0c0c0e] border border-[#26262b] p-6 text-white shadow-2xl relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#202024]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#ff3300]"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                  UNDERGROUNDZ // IDENTITY
                </span>
              </div>
              <button
                id="btn-close-account-modal"
                onClick={onClose}
                className="p-1 text-[#888] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {user ? (
              /* Authenticated View */
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3.5 p-4 bg-[#141418] border border-[#222]">
                  <div className="w-12 h-12 bg-[#202026] border border-[#3a3a44] flex items-center justify-center shrink-0 overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-[#888]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-mono text-sm font-bold text-white truncate">
                      {user.user_metadata?.full_name || user.user_metadata?.name || 'Undergroundz Member'}
                    </h3>
                    <p className="font-mono text-xs text-[#777] truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 font-mono text-[9px] text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.5 border border-[#00ff88]/20">
                      VERIFIED RIDER
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    id="btn-account-my-orders"
                    onClick={handleViewOrders}
                    className="w-full h-12 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#ccc] transition-colors cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>MY ORDERS & TRACKING</span>
                  </button>

                  <button
                    id="btn-account-sign-out"
                    onClick={handleSignOut}
                    className="w-full h-11 border border-[#333] hover:border-red-500 text-[#888] hover:text-red-400 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>SIGN OUT</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Unauthenticated View */
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs text-[#aaa] leading-relaxed">
                  Sign in with Google using Supabase Authentication. Your cart will be preserved, and past orders will automatically sync to your personal profile.
                </p>

                <button
                  id="btn-modal-google-signin"
                  onClick={handleGoogleSignIn}
                  className="h-12 w-full bg-white hover:bg-[#e0e0e0] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                </button>

                <div className="p-3 bg-[#131316] border border-[#202026] text-[10px] font-mono text-[#777] flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span>Free browsing is active. Login is only required at checkout.</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
