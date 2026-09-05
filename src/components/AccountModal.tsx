import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User as UserIcon,
  LogOut,
  Package,
  Shield,
  ExternalLink,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getOAuthRedirectInfo,
  fetchUserProfile,
  upsertUserProfile,
} from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { ViewType } from '../types';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { notifyNewUserRegistration, notifyRiderRegistration } from '../services/telegramNotifications';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  setCurrentView: (view: ViewType) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  setCurrentView,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [popupBlockedUrl, setPopupBlockedUrl] = useState<string | null>(null);

  // Profile data state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCallsign, setProfileCallsign] = useState('');
  const [profileSector, setProfileSector] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // Load profile when user logs in or modal opens
  React.useEffect(() => {
    if (user?.id && isOpen) {
      fetchUserProfile(user.id).then((profile) => {
        if (profile) {
          setProfileName(profile.fullName || user.user_metadata?.full_name || '');
          setProfilePhone(profile.phone || '');
          setProfileCallsign(profile.callsign || '');
          setProfileSector(profile.sector || '');
          setProfileAddress(profile.shippingAddress?.address || '');
        } else {
          setProfileName(user.user_metadata?.full_name || user.user_metadata?.name || '');
        }
      });
    }
  }, [user, isOpen]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileSaving(true);
    try {
      await upsertUserProfile({
        id: user.id,
        email: user.email,
        fullName: profileName,
        phone: profilePhone,
        callsign: profileCallsign,
        sector: profileSector,
        shippingAddress: {
          fullName: profileName,
          email: user.email || '',
          phone: profilePhone,
          address: profileAddress,
          city: profileSector || 'Berlin',
          state: '',
          pincode: '',
          country: 'India',
        },
      });

      // Dispatch Rider Registration Telegram notification
      notifyRiderRegistration({
        userId: user.id,
        callsign: profileCallsign || user.user_metadata?.callsign || profileName || 'VERIFIED_RIDER',
        name: profileName || user.user_metadata?.full_name || 'Rider Member',
        email: user.email || '',
        sector: profileSector || 'GLOBAL_GRID',
        phone: profilePhone,
        source: 'Account Profile Dossier',
      }).catch(() => {});

      setProfileSavedSuccess(true);
      setTimeout(() => setProfileSavedSuccess(false), 3000);
      setIsEditingProfile(false);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const oauthInfo = getOAuthRedirectInfo();

  const isCheckoutReturn =
    typeof window !== 'undefined' &&
    sessionStorage.getItem('undergroundz_auth_return_view') === 'checkout';

  const clearAuthForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setAuthError(null);
    setSuccessMessage(null);
    setPopupBlockedUrl(null);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    setPopupBlockedUrl(null);

    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('undergroundz_explicit_login_flag', Date.now().toString());
      }
      const savedReturn =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('undergroundz_auth_return_view') || undefined
          : undefined;
      const result = await signInWithGoogle({ returnView: savedReturn });
      if (result.error) {
        setAuthError(result.error.message);
      } else if (result.popupBlocked && result.url) {
        setPopupBlockedUrl(result.url);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google OAuth failed to initialize.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInNewWindow = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setAuthError('Email and password are required.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const savedReturn =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('undergroundz_auth_return_view') || undefined
          : undefined;

      if (authMode === 'signin') {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('undergroundz_explicit_login_flag', Date.now().toString());
        }
        const { error } = await signInWithEmail(email, password, savedReturn);
        if (error) {
          setAuthError(error.message);
        } else {
          setSuccessMessage('AUTHENTICATION SUCCESSFUL // ACCESS GRANTED');
          setTimeout(() => {
            onClose();
            clearAuthForm();
            if (savedReturn) {
              sessionStorage.removeItem('undergroundz_auth_return_view');
              setCurrentView(savedReturn as ViewType);
            }
          }, 600);
        }
      } else {
        const { data, error } = await signUpWithEmail(email, password, fullName, savedReturn);
        if (error) {
          setAuthError(error.message);
        } else {
          // Notify via Telegram
          notifyNewUserRegistration({
            id: data?.user?.id,
            email: email.trim(),
            name: fullName?.trim() || 'New Member',
            authProvider: 'Email/Password',
          }).catch(() => {});

          if (data?.session) {
            setSuccessMessage('ACCOUNT CREATED // LOGGED IN');
            setTimeout(() => {
              onClose();
              clearAuthForm();
              if (savedReturn) {
                sessionStorage.removeItem('undergroundz_auth_return_view');
                setCurrentView(savedReturn as ViewType);
              }
            }, 600);
          } else {
            setSuccessMessage(
              'Account created. If email verification is enabled, please verify your email before logging in.'
            );
          }
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      onClose();
      clearAuthForm();
    } catch (e: any) {
      setAuthError(e?.message || 'Sign out failed.');
    } finally {
      setLoading(false);
    }
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="account-modal-content"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0c0c0e] border border-[#26262b] p-6 text-white shadow-2xl relative my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#202024]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#9e1b24]"></span>
                <span className="font-body text-xs font-bold uppercase tracking-wider text-white">
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
                    <h3 className="font-body text-sm font-semibold text-white truncate">
                      {user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email?.split('@')[0].toUpperCase() ||
                        'Undergroundz Member'}
                    </h3>
                    <p className="font-body text-xs text-[#8e8e98] truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-body text-[9px] font-semibold text-white bg-[#9e1b24] px-2 py-0.5 uppercase tracking-wider">
                        VERIFIED RIDER
                      </span>
                      <span className="font-mono text-[9px] text-[#777] border border-[#26262e] px-1.5 py-0.5 uppercase">
                        {user.app_metadata?.provider || 'EMAIL'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#666] bg-[#111114] p-2.5 border border-[#1f1f24] break-all flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span>SUPABASE USER ID:</span>
                    <span className="text-[#00ff88] text-[9px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
                      SUPABASE POSTGRES ACTIVE
                    </span>
                  </div>
                  <span className="text-[#aaa]">{user.id}</span>
                </div>

                {/* Profile Details & Editing */}
                <div className="border border-[#222] bg-[#111114] p-3.5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase text-white tracking-wider">
                      RIDER PROFILE & ADDRESS
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="text-[10px] font-mono text-[#ff3300] hover:text-white underline cursor-pointer uppercase"
                    >
                      {isEditingProfile ? 'CANCEL' : 'EDIT PROFILE'}
                    </button>
                  </div>

                  {profileSavedSuccess && (
                    <div className="p-2 bg-[#0d1e13] border border-[#00ff88]/40 text-[#77ffaa] text-[10px] font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" />
                      Profile synchronized to Supabase PostgreSQL.
                    </div>
                  )}

                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-2.5">
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-[#888] mb-0.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full h-8 px-2.5 bg-[#09090b] border border-[#333] text-xs text-white focus:outline-none focus:border-[#ff3300]"
                          placeholder="Your Full Name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-[#888] mb-0.5">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="w-full h-8 px-2.5 bg-[#09090b] border border-[#333] text-xs text-white focus:outline-none focus:border-[#ff3300]"
                            placeholder="+91 / Mobile"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-[#888] mb-0.5">
                            Callsign
                          </label>
                          <input
                            type="text"
                            value={profileCallsign}
                            onChange={(e) => setProfileCallsign(e.target.value)}
                            className="w-full h-8 px-2.5 bg-[#09090b] border border-[#333] text-xs text-white focus:outline-none focus:border-[#ff3300]"
                            placeholder="e.g. PHANTOM_9"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-[#888] mb-0.5">
                          Delivery Sector / City
                        </label>
                        <input
                          type="text"
                          value={profileSector}
                          onChange={(e) => setProfileSector(e.target.value)}
                          className="w-full h-8 px-2.5 bg-[#09090b] border border-[#333] text-xs text-white focus:outline-none focus:border-[#ff3300]"
                          placeholder="City / District"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-[#888] mb-0.5">
                          Shipping Address
                        </label>
                        <input
                          type="text"
                          value={profileAddress}
                          onChange={(e) => setProfileAddress(e.target.value)}
                          className="w-full h-8 px-2.5 bg-[#09090b] border border-[#333] text-xs text-white focus:outline-none focus:border-[#ff3300]"
                          placeholder="Street Address, Apt / Suite"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="mt-1 w-full h-8 bg-[#ff3300] hover:bg-[#cc2900] text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {profileSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : null}
                        SAVE PROFILE TO SUPABASE
                      </button>
                    </form>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-[9px] text-[#666] block">CALLSIGN:</span>
                        <span className="text-[#ccc]">{profileCallsign || 'RIDER_DEFAULT'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#666] block">PHONE:</span>
                        <span className="text-[#ccc]">{profilePhone || 'Not set'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-[#666] block">SAVED ADDRESS:</span>
                        <span className="text-[#ccc] truncate block">
                          {profileAddress ? `${profileAddress}${profileSector ? `, ${profileSector}` : ''}` : 'No shipping address recorded yet'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <HoverBorderGradient
                    id="btn-account-my-orders"
                    as="button"
                    containerClassName="w-full rounded-none"
                    className="w-full h-12 bg-white text-black font-body font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#d8d8d8] transition-colors"
                    onClick={handleViewOrders}
                  >
                    <Package className="w-4 h-4" />
                    <span>MY ORDERS & TRACKING</span>
                  </HoverBorderGradient>

                  <HoverBorderGradient
                    id="btn-account-sign-out"
                    as="button"
                    containerClassName="w-full rounded-none"
                    className="w-full h-11 bg-[#111114] text-[#888] hover:text-[#e05555] font-body text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors font-medium"
                    onClick={handleSignOut}
                    highlightColor="radial-gradient(75% 181.15% at 50% 50%, #9e1b24 0%, rgba(255, 255, 255, 0) 100%)"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#9e1b24]" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span>SIGN OUT</span>
                  </HoverBorderGradient>
                </div>
              </div>
            ) : (
              /* Unauthenticated View */
              <div className="flex flex-col gap-4">
                {/* Checkout Intent Notice */}
                {isCheckoutReturn && (
                  <div className="p-3 bg-[#111116] border border-[#00ff88]/40 text-white text-xs flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#00ff88] shrink-0 animate-pulse" />
                    <div>
                      <span className="font-bold text-[11px] uppercase tracking-wider block text-white">
                        SIGN IN TO COMPLETE PURCHASE
                      </span>
                      <span className="text-[10px] text-[#aaa] block">
                        Your profile name and email will automatically auto-fill at checkout.
                      </span>
                    </div>
                  </div>
                )}

                {/* AI Studio Iframe Notice / New Window Link */}
                {oauthInfo.isIframe && (
                  <div className="p-3 bg-[#131318] border border-[#2b2b35] text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="font-bold text-white block mb-0.5 text-[11px] uppercase tracking-wide">
                          Embedded Preview Environment
                        </span>
                        <p className="text-[11px] text-[#8e8e98] leading-relaxed">
                          For Google OAuth in AI Studio, sign in via a new window or use email sign-in below.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenInNewWindow}
                        className="px-2.5 py-1 bg-[#1e1e24] hover:bg-[#2a2a34] text-white border border-[#3e3e4a] text-[10px] font-mono uppercase flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                        title="Open in new window to authenticate"
                      >
                        <span>NEW TAB</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {authError && (
                  <div className="p-3 bg-[#1e1012] border border-[#9e1b24] text-xs text-[#ff9999] flex items-start justify-between gap-2 animate-in fade-in duration-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#ff5555] shrink-0 mt-0.5" />
                      <span className="font-mono text-[11px] leading-snug">{authError}</span>
                    </div>
                    <button
                      onClick={() => setAuthError(null)}
                      className="text-[#ff9999] hover:text-white p-0.5 transition-colors cursor-pointer"
                      title="Dismiss error"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <div className="p-3 bg-[#0d1e13] border border-[#00ff88]/40 text-xs text-[#77ffaa] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0" />
                    <span className="font-mono text-[11px]">{successMessage}</span>
                  </div>
                )}

                {/* Popup Blocked Notification */}
                {popupBlockedUrl && (
                  <div className="p-3 bg-[#181611] border border-[#ffd700]/40 text-xs text-[#ffd700] flex flex-col gap-2">
                    <span className="font-mono text-[11px]">
                      Popup was blocked by your browser. Click below to continue:
                    </span>
                    <a
                      href={popupBlockedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#ffd700] text-black font-bold text-center font-mono text-xs uppercase"
                    >
                      OPEN GOOGLE SIGN IN WINDOW ↗
                    </a>
                  </div>
                )}

                {/* Google OAuth Button */}
                <HoverBorderGradient
                  id="btn-modal-google-signin"
                  as="button"
                  containerClassName="w-full rounded-none"
                  className="h-11 w-full bg-white hover:bg-[#d8d8d8] text-black font-body font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
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
                  )}
                  <span>CONTINUE WITH GOOGLE</span>
                </HoverBorderGradient>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-[1px] bg-[#222]"></div>
                  <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider">
                    OR USE EMAIL ACCESS
                  </span>
                  <div className="flex-1 h-[1px] bg-[#222]"></div>
                </div>

                {/* Auth Mode Toggle Tabs */}
                <div className="grid grid-cols-2 gap-1 bg-[#131316] p-1 border border-[#222]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError(null);
                    }}
                    className={`py-1.5 text-[11px] font-body font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-white text-black'
                        : 'text-[#888] hover:text-white'
                    }`}
                  >
                    SIGN IN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError(null);
                    }}
                    className={`py-1.5 text-[11px] font-body font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white text-black'
                        : 'text-[#888] hover:text-white'
                    }`}
                  >
                    CREATE ACCOUNT
                  </button>
                </div>

                {/* Email / Password Form */}
                <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-[#888] mb-1">
                        Full Name / Call-Sign
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Rider Call-Sign"
                        className="w-full h-10 bg-[#131316] border border-[#282830] px-3 text-white text-xs placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#888] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rider@undergroundz.com"
                        className="w-full h-10 bg-[#131316] border border-[#282830] px-3 pl-9 text-white text-xs placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                      />
                      <Mail className="w-3.5 h-3.5 text-[#555] absolute left-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#888] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-10 bg-[#131316] border border-[#282830] px-3 pl-9 text-white text-xs placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                      />
                      <Lock className="w-3.5 h-3.5 text-[#555] absolute left-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <HoverBorderGradient
                    as="button"
                    containerClassName="w-full rounded-none mt-1"
                    className="w-full h-11 bg-[#16161b] hover:bg-[#202026] text-white font-body font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#333] transition-colors disabled:opacity-50"
                    disabled={loading}
                    highlightColor="radial-gradient(75% 181.15% at 50% 50%, #9e1b24 0%, rgba(255, 255, 255, 0) 100%)"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <span>
                        {authMode === 'signin' ? 'SIGN IN WITH CREDENTIALS' : 'REGISTER NEW RIDER'}
                      </span>
                    )}
                  </HoverBorderGradient>
                </form>

                <div className="p-2.5 bg-[#101014] border border-[#1d1d22] text-[10px] font-mono text-[#777] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#00ff88]" />
                    <span>Free browsing active. Session persists locally.</span>
                  </div>
                  <span className="text-[#555]">TLS // SHA-256</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

