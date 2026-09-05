import React, { useState, useEffect } from 'react';
import { CartItem, CustomerDetails, Order, ViewType } from '../types';
import {
  getCurrentUser,
  signInWithGoogle,
  isSupabaseConfigured,
} from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { DemoPaymentScreen } from '../components/DemoPaymentScreen';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import {
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ArrowLeft,
  Lock,
  Sparkles,
  Info,
  Package,
} from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  setCurrentView: (view: ViewType) => void;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  setCurrentView,
  onOrderSuccess,
  onClearCart,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment'>('details');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Customer Coordinates
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof CustomerDetails, string>>
  >({});

  // Sync authenticated user details & pre-fill fields
  useEffect(() => {
    async function loadUser() {
      setAuthLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);

      // Check saved customer details in local cache
      let savedLocal: Partial<CustomerDetails> = {};
      try {
        const stored = localStorage.getItem('undergroundz_customer_details');
        if (stored) {
          savedLocal = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to parse saved customer details', e);
      }

      const inferredName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.user_metadata?.user_name ||
        (user?.email ? user.email.split('@')[0].replace(/[._-]/g, ' ') : '');

      setCustomer((prev) => {
        const updated = {
          ...prev,
          fullName: prev.fullName || inferredName || savedLocal.fullName || '',
          email: prev.email || user?.email || savedLocal.email || '',
          phone: prev.phone || user?.user_metadata?.phone || (user as any)?.phone || savedLocal.phone || '',
          address: prev.address || savedLocal.address || '',
          city: prev.city || savedLocal.city || '',
          state: prev.state || savedLocal.state || '',
          pincode: prev.pincode || savedLocal.pincode || '',
          country: prev.country || savedLocal.country || 'India',
        };
        try {
          localStorage.setItem('undergroundz_customer_details', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setAuthLoading(false);
    }

    loadUser();

    const handleAuthChange = () => {
      loadUser();
    };
    window.addEventListener('undergroundz-auth-change', handleAuthChange);
    return () =>
      window.removeEventListener('undergroundz-auth-change', handleAuthChange);
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const currency = '₹';
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem('undergroundz_customer_details', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerDetails, string>> = {};

    if (!customer.fullName.trim()) errors.fullName = 'Full name is required';
    if (!customer.email.trim() || !/^\S+@\S+\.\S+$/.test(customer.email)) {
      errors.email = 'Valid email address is required';
    }
    if (!customer.phone.trim() || customer.phone.length < 8) {
      errors.phone = 'Valid phone number is required';
    }
    if (!customer.address.trim()) errors.address = 'Street address is required';
    if (!customer.city.trim()) errors.city = 'City is required';
    if (!customer.state.trim()) errors.state = 'State / Province is required';
    if (!customer.pincode.trim()) errors.pincode = 'Postal code / Pincode is required';
    if (!customer.country.trim()) errors.country = 'Country is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogleLogin = async () => {
    setPaymentError(null);
    try {
      const { error, popupBlocked, url } = await signInWithGoogle({ returnView: 'checkout' });
      if (error) {
        setPaymentError(error.message);
      } else if (popupBlocked && url) {
        setPaymentError(`Popup blocked. Please allow popups or visit: ${url}`);
      }
    } catch (err: any) {
      setPaymentError(err?.message || 'Authentication error');
    }
  };

  /**
   * Action when clicking "PROCEED TO PAYMENT":
   * Validates customer details and opens the Undergroundz Demo Payment Screen.
   *
   * =========================================================================
   * FUTURE REAL PAYMENT GATEWAY INTEGRATION (e.g. Razorpay):
   * =========================================================================
   * To switch from Demo Payment to live Razorpay:
   * 1. Check if process.env.RAZORPAY_KEY_ID is set.
   * 2. Call POST /api/create-razorpay-order to generate server-verified order.
   * 3. Initialize `new window.Razorpay(options).open()`.
   * 4. Verify HMAC-SHA256 signature on POST /api/verify-razorpay-payment.
   * Both server endpoints remain preserved and ready in server.ts.
   * =========================================================================
   */
  const handleProceedToPayment = () => {
    setPaymentError(null);

    if (!validateForm()) {
      setPaymentError(
        'Please complete all required customer delivery coordinates.'
      );
      return;
    }

    if (cart.length === 0) {
      setPaymentError('Your cart is empty. Add products before proceeding.');
      return;
    }

    // Advance directly to the dedicated Undergroundz Demo Payment Screen
    setCheckoutStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0 && checkoutStep === 'details') {
    return (
      <main className="pt-28 pb-24 min-h-screen bg-[#070708] text-white px-5 md:px-16 flex items-center justify-center font-sans">
        <div className="max-w-md w-full text-center border border-[#222] bg-[#0c0c0e] p-8">
          <Package className="w-12 h-12 text-[#666] mx-auto mb-4" />
          <h2 className="text-xl font-bold font-mono tracking-tight text-white mb-2">
            EMPTY CART MANIFEST
          </h2>
          <p className="text-xs text-[#888] font-mono mb-6">
            Your shopping cart contains no items. Add apparel from our collection to check out.
          </p>
          <button
            onClick={() => setCurrentView('collection')}
            className="w-full h-12 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-[#ccc] cursor-pointer"
          >
            EXPLORE COLLECTION
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-24 min-h-screen bg-[#070708] text-white px-5 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (checkoutStep === 'payment') {
                setCheckoutStep('details');
              } else {
                setCurrentView('collection');
              }
            }}
            className="flex items-center gap-2 text-xs font-mono text-[#888] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {checkoutStep === 'payment'
                ? 'RETURN TO DELIVERY DETAILS'
                : 'BACK TO CATALOG'}
            </span>
          </button>

          <div className="flex items-center gap-2 font-mono text-[10px] text-[#666]">
            <span className={checkoutStep === 'details' ? 'text-white font-bold' : ''}>
              1. DETAILS
            </span>
            <span>&gt;</span>
            <span className={checkoutStep === 'payment' ? 'text-[#00ff88] font-bold' : ''}>
              2. DEMO PAYMENT
            </span>
            <span>&gt;</span>
            <span>3. CONFIRMATION</span>
          </div>
        </div>

        {/* If user is on Step 2: Show DEMO PAYMENT SCREEN */}
        {checkoutStep === 'payment' ? (
          <DemoPaymentScreen
            customer={customer}
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            currentUser={currentUser}
            onPaymentSuccess={(order) => {
              onClearCart();
              onOrderSuccess(order);
            }}
            onCancel={() => setCheckoutStep('details')}
            setCurrentView={setCurrentView}
          />
        ) : (
          /* Step 1: Customer Details & Order Summary Form */
          <div>
            {/* Header */}
            <div className="border-b border-[#22222a] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-[#9e1b24]"></span>
                  <span className="font-body text-[11px] tracking-wider text-[#8e8e98] uppercase font-semibold">
                    UNDERGROUNDZ // DISPATCH PIPELINE
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
                  ORDER CHECKOUT
                </h1>
              </div>

              {/* Identity sync badge */}
              {currentUser ? (
                <div className="flex items-center gap-2 font-body text-xs text-[#aaa] bg-[#111116] px-3.5 py-2 border border-[#22222a]">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
                  <span className="text-white font-medium">SIGNED IN: {currentUser.email}</span>
                  <span className="text-[#888] font-mono text-[10px] hidden sm:inline">• AUTO-FILLED</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <HoverBorderGradient
                    as="button"
                    containerClassName="rounded-none"
                    className="flex items-center gap-2 font-body text-xs text-black bg-white hover:bg-[#d8d8d8] px-4 py-2 uppercase font-semibold transition-colors tracking-wider"
                    onClick={handleGoogleLogin}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SIGN IN WITH GOOGLE (AUTO-FILL)</span>
                  </HoverBorderGradient>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {paymentError && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 flex items-center gap-3 font-body text-xs text-red-200">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Customer and Delivery Coordinates */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="border border-[#1e1e24] bg-[#0c0c0f] p-6 md:p-8">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-6 pb-3 border-b border-[#1c1c22] flex items-center justify-between">
                    <span>1 // SHIPPING DESTINATION</span>
                    <span className="text-[10px] text-[#666] font-normal">
                      * ALL FIELDS REQUIRED
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-[#888] text-[10px] uppercase mb-1">
                        Full Recipient Name
                      </label>
                      <input
                        type="text"
                        value={customer.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Rider Name"
                        className={`w-full h-11 bg-[#131316] border px-3 text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors ${
                          validationErrors.fullName ? 'border-red-500' : 'border-[#26262e]'
                        }`}
                      />
                      {validationErrors.fullName && (
                        <span className="text-red-400 text-[10px] mt-1 block">
                          {validationErrors.fullName}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[#888] text-[10px] uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="rider@undergroundz.com"
                        className={`w-full h-11 bg-[#131316] border px-3 text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors ${
                          validationErrors.email ? 'border-red-500' : 'border-[#26262e]'
                        }`}
                      />
                      {validationErrors.email && (
                        <span className="text-red-400 text-[10px] mt-1 block">
                          {validationErrors.email}
                        </span>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[#888] text-[10px] uppercase mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full h-11 bg-[#131316] border px-3 text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors ${
                          validationErrors.phone ? 'border-red-500' : 'border-[#26262e]'
                        }`}
                      />
                      {validationErrors.phone && (
                        <span className="text-red-400 text-[10px] mt-1 block">
                          {validationErrors.phone}
                        </span>
                      )}
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-[#888] text-[10px] uppercase mb-1">
                        Street Address / Apartment
                      </label>
                      <input
                        type="text"
                        value={customer.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="742 Evergreen Sector, Level 4"
                        className={`w-full h-11 bg-[#131316] border px-3 text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors ${
                          validationErrors.address ? 'border-red-500' : 'border-[#26262e]'
                        }`}
                      />
                      {validationErrors.address && (
                        <span className="text-red-400 text-[10px] mt-1 block">
                          {validationErrors.address}
                        </span>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-[#888] text-[10px] uppercase mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Bengaluru"
                        className={`w-full h-11 bg-[#131316] border px-3 text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors ${
                          validationErrors.city ? 'border-red-500' : 'border-[#26262e]'
                        }`}
                      />
                      {validationErrors.city && (
                        <span className="text-red-400 text-[10px] mt-1 block">
                          {validationErrors.city}
                        </span>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-[#888] text-[10px] uppercase mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        value={customer.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Karnataka"
                        className={`w-full h-11 bg-[#131316] border px-3 text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors ${
                          validationErrors.state ? 'border-red-500' : 'border-[#26262e]'
                        }`}
                      />
                      {validationErrors.state && (
                        <span className="text-red-400 text-[10px] mt-1 block">
                          {validationErrors.state}
                        </span>
                      )}
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-[#888] text-[10px] uppercase mb-1">
                        Postal Code / Pincode
                      </label>
                      <input
                        type="text"
                        value={customer.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="560001"
                        className={`w-full h-11 bg-[#131316] border px-3 text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors ${
                          validationErrors.pincode ? 'border-red-500' : 'border-[#26262e]'
                        }`}
                      />
                      {validationErrors.pincode && (
                        <span className="text-red-400 text-[10px] mt-1 block">
                          {validationErrors.pincode}
                        </span>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-[#888] text-[10px] uppercase mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={customer.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="India"
                        className={`w-full h-11 bg-[#131316] border px-3 text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors ${
                          validationErrors.country ? 'border-red-500' : 'border-[#26262e]'
                        }`}
                      />
                      {validationErrors.country && (
                        <span className="text-red-400 text-[10px] mt-1 block">
                          {validationErrors.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Proceed Button */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="border border-[#22222a] bg-[#111116] p-6 md:p-8">
                  <h3 className="font-body text-xs font-bold uppercase tracking-wider text-white mb-4 pb-3 border-b border-[#202028]">
                    ORDER MANIFEST ({cart.length} ITEM{cart.length > 1 ? 'S' : ''})
                  </h3>

                  {/* Items List */}
                  <div className="flex flex-col gap-3.5 mb-6 max-h-72 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${item.size}-${item.color}-${idx}`}
                        className="flex gap-3 pb-3 border-b border-[#1c1c24]"
                      >
                        <div className="w-12 h-12 bg-[#16161c] border border-[#282832] shrink-0 p-1 flex items-center justify-center">
                          <img
                            src={item.product.image}
                            alt=""
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0 font-body">
                          <h5 className="text-xs font-semibold text-white truncate">
                            {item.product.name}
                          </h5>
                          <p className="text-[10px] text-[#8e8e98]">
                            SIZE: {item.size} | COLOR: {item.color || 'NIGHT REFLECTION'}
                          </p>
                          <p className="text-[10px] text-[#aaa]">
                            QTY: {item.quantity} × {item.product.currency}{item.product.price % 1 === 0 ? item.product.price.toLocaleString() : item.product.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="font-body text-xs font-bold text-white shrink-0">
                          {item.product.currency}{((item.product.price * item.quantity) % 1 === 0 ? (item.product.price * item.quantity).toLocaleString() : (item.product.price * item.quantity).toFixed(2))}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 font-body text-xs text-[#8e8e98] pb-4 mb-4 border-b border-[#202028]">
                    <div className="flex justify-between">
                      <span>SUBTOTAL</span>
                      <span className="text-white font-medium">{currency}{subtotal % 1 === 0 ? subtotal.toLocaleString() : subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SHIPPING</span>
                      <span>
                        {shipping === 0 ? 'COMPLIMENTARY' : `${currency}${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-white font-bold pt-2 border-t border-[#202028] text-sm items-baseline">
                      <span className="text-xs uppercase tracking-wider font-semibold">TOTAL DUE</span>
                      <span className="font-display text-2xl font-bold text-white tracking-tight">
                        {currency}{total % 1 === 0 ? total.toLocaleString() : total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* PROCEED TO PAYMENT BUTTON */}
                  <HoverBorderGradient
                    id="btn-proceed-to-payment"
                    as="button"
                    containerClassName="w-full rounded-none"
                    className="w-full h-13 bg-white hover:bg-[#d8d8d8] text-black font-body font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
                    onClick={handleProceedToPayment}
                  >
                    <span>PROCEED TO PAYMENT ({currency}{total % 1 === 0 ? total.toLocaleString() : total.toFixed(2)})</span>
                  </HoverBorderGradient>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-body text-[#8e8e98]">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>DEMO SIMULATION READY • NO CARD REQUIRED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
