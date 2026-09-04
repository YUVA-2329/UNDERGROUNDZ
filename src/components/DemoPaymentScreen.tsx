import React, { useState, useEffect, useRef } from 'react';
import { CartItem, CustomerDetails, Order, ViewType } from '../types';
import { saveOrder, MockUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowLeft,
  Lock,
  Sparkles,
  Info,
  Clock,
  RotateCcw,
  Check,
  Package,
  ShoppingBag,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface DemoPaymentScreenProps {
  customer: CustomerDetails;
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currentUser: User | MockUser | null;
  onPaymentSuccess: (order: Order) => void;
  onCancel: () => void;
  setCurrentView: (view: ViewType) => void;
}

const ANIMATION_STEPS = [
  'INITIALIZING DEMO PAYMENT',
  'VALIDATING ORDER',
  'VERIFYING PAYMENT SESSION',
  'CONFIRMING TRANSACTION',
  'UPDATING ORDER',
  'PAYMENT SUCCESSFUL ✓',
];

export const DemoPaymentScreen: React.FC<DemoPaymentScreenProps> = ({
  customer,
  cart,
  subtotal,
  shipping,
  total,
  currentUser,
  onPaymentSuccess,
  onCancel,
  setCurrentView,
}) => {
  const [phase, setPhase] = useState<'ready' | 'animating' | 'success' | 'cancelled' | 'error'>('ready');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [generatedOrder, setGeneratedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate a consistent Demo Session ID for the QR code
  const demoSessionToken = useRef(
    `UGZ-SESS-${Math.floor(100000 + Math.random() * 900000)}`
  ).current;

  // Multi-step processing simulation
  const startDemoSimulation = async () => {
    setPhase('animating');
    setCurrentStepIndex(0);
    setProgressPercent(10);
    setErrorMessage(null);

    // Step 1: Initializing
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStepIndex(1);
    setProgressPercent(28);

    // Step 2: Validating Order
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStepIndex(2);
    setProgressPercent(48);

    // Step 3: Verifying Payment Session
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStepIndex(3);
    setProgressPercent(68);

    // Step 4: Confirming Transaction
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStepIndex(4);
    setProgressPercent(88);

    // Step 5: Updating Order in Database
    const demoTxnId = `DEMO-TXN-UGZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const demoOrderId = `UGZ-DEMO-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      order_id: demoOrderId,
      user_id: currentUser?.id,
      items: [...cart],
      amount: total,
      currency: '$',
      customer,
      payment_gateway_order_id: demoSessionToken,
      payment_id: demoTxnId,
      demo_transaction_id: demoTxnId,
      is_demo: true,
      payment_status: 'demo_paid',
      order_status: 'Demo Order Confirmed',
      created_at: new Date().toISOString(),
      estimated_delivery: '3-5 Business Days (Demo Dispatch)',
    };

    try {
      // Save order into Supabase and local storage
      await saveOrder(newOrder);
    } catch (err: any) {
      console.warn('Demo order save warning:', err);
    }

    await new Promise((r) => setTimeout(r, 500));
    // Step 6: Success
    setCurrentStepIndex(5);
    setProgressPercent(100);

    await new Promise((r) => setTimeout(r, 450));
    setGeneratedOrder(newOrder);
    setPhase('success');
    onPaymentSuccess(newOrder);
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      {/* 1. TOP ANNOUNCEMENT & DEMO HEADER */}
      <div className="mb-6 flex flex-col gap-3">
        {/* Notice Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#ff3300]/10 border border-[#ff3300]/30 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#ff3300]">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-bold tracking-wider uppercase">
              DEMO PAYMENT // SIMULATED ENVIRONMENT
            </span>
          </div>
          <span className="text-[11px] text-[#aaa]">
            Real payments are currently being integrated.
          </span>
        </div>

        {/* Polished Announcement Banner */}
        <div className="p-4 bg-[#0e0e12] border border-[#222228] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#1a1a22] border border-[#2e2e38] flex items-center justify-center shrink-0 text-[#00ff88]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-0.5">
                LIVE PAYMENTS COMING SOON
              </h3>
              <p className="text-xs text-[#999] leading-relaxed">
                Undergroundz is currently working on live payment integration. Until then, experience our complete checkout through Demo Payment.
              </p>
            </div>
          </div>
          <div className="shrink-0 font-mono text-[10px] text-[#ffaa44] bg-[#ffaa44]/10 border border-[#ffaa44]/25 px-2.5 py-1 uppercase tracking-widest self-start md:self-auto">
            NO REAL MONEY CHARGED
          </div>
        </div>
      </div>

      {/* PHASE: CANCELLED */}
      {phase === 'cancelled' && (
        <div className="p-8 border border-[#2e2e36] bg-[#0c0c0e] text-center my-6">
          <AlertTriangle className="w-10 h-10 text-[#ffaa44] mx-auto mb-4" />
          <h2 className="text-xl font-mono font-bold uppercase text-white mb-2">
            DEMO PAYMENT CANCELLED
          </h2>
          <p className="text-xs font-mono text-[#888] max-w-md mx-auto mb-6">
            You cancelled the simulated payment session. Your cart items and delivery details have been preserved intact.
          </p>
          <button
            onClick={() => setPhase('ready')}
            className="px-6 py-3 bg-white hover:bg-[#ddd] text-black font-mono font-bold text-xs uppercase transition-colors cursor-pointer"
          >
            RETURN TO CHECKOUT
          </button>
        </div>
      )}

      {/* PHASE: ERROR */}
      {phase === 'error' && (
        <div className="p-8 border border-red-500/40 bg-red-950/20 text-center my-6">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-mono font-bold uppercase text-white mb-2">
            DEMO SESSION ENCOUNTERED AN ISSUE
          </h2>
          <p className="text-xs font-mono text-red-200 max-w-md mx-auto mb-6">
            {errorMessage || 'Payment session token expired or invalid demo payload.'}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setPhase('ready')}
              className="px-6 py-3 bg-white text-black font-mono font-bold text-xs uppercase"
            >
              RETRY DEMO PAYMENT
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-[#444] text-white font-mono text-xs uppercase"
            >
              RETURN TO CHECKOUT
            </button>
          </div>
        </div>
      )}

      {/* PHASE: ANIMATING (Multi-step processing) */}
      {phase === 'animating' && (
        <div className="p-8 md:p-12 border border-[#222228] bg-[#0c0c0f] text-center my-6">
          <div className="w-12 h-12 bg-[#ff3300]/10 border border-[#ff3300]/30 rounded-full flex items-center justify-center mx-auto mb-5 text-[#ff3300]">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>

          <span className="font-mono text-[10px] text-[#ff3300] tracking-widest uppercase block mb-1">
            DEMO SIMULATION PIPELINE ACTIVE
          </span>
          <h2 className="text-2xl font-black font-mono uppercase text-white mb-6">
            PROCESSING DEMO TRANSACTION
          </h2>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-[#18181c] h-2 border border-[#2c2c34] mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#ff3300] to-[#00ff88] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Steps List */}
          <div className="max-w-sm mx-auto flex flex-col gap-2.5 font-mono text-xs text-left mb-6">
            {ANIMATION_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className={`flex items-center justify-between p-2 border transition-colors ${
                    isCurrent
                      ? 'border-[#ff3300] bg-[#ff3300]/10 text-white'
                      : isDone
                      ? 'border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88]'
                      : 'border-[#1a1a20] text-[#555]'
                  }`}
                >
                  <span className="text-[11px] font-bold tracking-wider">{step}</span>
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-[#00ff88]" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff3300] animate-ping" />
                  ) : (
                    <span className="text-[10px] text-[#444]">PENDING</span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="font-mono text-[10px] text-[#777] uppercase tracking-wider">
            NO REAL MONEY IS CHARGED • SIMULATING SECURE ORDER CONFIRMATION
          </p>
        </div>
      )}

      {/* PHASE: SUCCESS SCREEN */}
      {phase === 'success' && generatedOrder && (
        <div className="border border-[#1e1e24] bg-[#0c0c0f] p-6 md:p-10 my-4 text-white">
          {/* Top Success Banner */}
          <div className="text-center pb-8 border-b border-[#1c1c22] mb-8">
            <div className="w-14 h-14 bg-[#00ff88]/10 border border-[#00ff88]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#00ff88]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="font-mono text-[11px] text-[#00ff88] tracking-widest uppercase font-bold block mb-1">
              ✓ PAYMENT SUCCESSFUL
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-tight text-white mb-2">
              DEMO TRANSACTION COMPLETED
            </h2>
            <p className="text-xs font-mono text-[#888] max-w-lg mx-auto leading-relaxed">
              Your demo order transmission has been confirmed and logged into the Supabase database.
            </p>

            {/* Crucial honesty callout */}
            <div className="inline-block mt-4 px-4 py-1.5 bg-[#ffaa00]/10 border border-[#ffaa00]/40 font-mono text-xs text-[#ffaa44] font-bold uppercase tracking-wider">
              NO REAL MONEY WAS CHARGED.
            </div>
          </div>

          {/* Order & Demo Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-mono text-xs">
            {/* Left: Identifiers */}
            <div className="p-4 bg-[#121216] border border-[#22222a] space-y-2.5">
              <div className="flex justify-between border-b border-[#1c1c24] pb-2">
                <span className="text-[#888]">ORDER ID:</span>
                <span className="text-white font-bold tracking-wider">
                  {generatedOrder.order_id}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1c1c24] pb-2">
                <span className="text-[#888]">DEMO TRANSACTION ID:</span>
                <span className="text-[#00ff88] font-bold tracking-wider">
                  {generatedOrder.demo_transaction_id}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1c1c24] pb-2">
                <span className="text-[#888]">PAYMENT STATUS:</span>
                <span className="text-[#00ff88] font-bold uppercase bg-[#00ff88]/10 px-2 py-0.5 border border-[#00ff88]/20">
                  {generatedOrder.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">ORDER STATUS:</span>
                <span className="text-white font-bold">
                  {generatedOrder.order_status}
                </span>
              </div>
            </div>

            {/* Right: Recipient and Amount */}
            <div className="p-4 bg-[#121216] border border-[#22222a] space-y-2.5">
              <div className="flex justify-between border-b border-[#1c1c24] pb-2">
                <span className="text-[#888]">RECIPIENT:</span>
                <span className="text-white font-bold truncate">
                  {customer.fullName}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1c1c24] pb-2">
                <span className="text-[#888]">DISPATCH EMAIL:</span>
                <span className="text-white truncate">
                  {customer.email}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1c1c24] pb-2">
                <span className="text-[#888]">SIMULATED GATEWAY:</span>
                <span className="text-[#888]">UNDERGROUNDZ DEMO GATEWAY</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white">
                <span>TOTAL DEMO CHARGE:</span>
                <span className="text-[#00ff88] font-mono">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Purchased Products Manifest */}
          <div className="mb-8 border border-[#1e1e24] p-4 bg-[#0a0a0c]">
            <h4 className="font-mono text-xs font-bold text-white uppercase mb-3 pb-2 border-b border-[#1c1c22]">
              ORDERED PRODUCTS ({cart.length})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt=""
                      className="w-10 h-10 object-contain bg-black border border-[#222] p-1"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-white font-bold block">{item.product.name}</span>
                      <span className="text-[10px] text-[#888]">
                        SIZE: {item.size} | COLOR: {item.color || 'VOID BLACK'} | QTY: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="text-white font-bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="btn-demo-view-order"
              onClick={() => setCurrentView('order-confirmation')}
              className="flex-1 h-12 bg-white hover:bg-[#ddd] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>VIEW ORDER CONFIRMATION</span>
            </button>

            <button
              id="btn-demo-my-orders"
              onClick={() => setCurrentView('my-orders')}
              className="flex-1 h-12 border border-[#333] hover:border-white text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>MY ORDERS ARCHIVE</span>
            </button>

            <button
              id="btn-demo-continue-shopping"
              onClick={() => setCurrentView('collection')}
              className="flex-1 h-12 border border-[#333] hover:border-[#666] text-[#aaa] hover:text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>CONTINUE SHOPPING</span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE: READY (Primary Demo Payment Screen) */}
      {phase === 'ready' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: SCAN & PAY — DEMO Area */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="border border-[#222228] bg-[#0c0c0e] p-6 md:p-8 flex flex-col items-center text-center relative">
              {/* Header */}
              <div className="w-full flex items-center justify-between pb-4 mb-6 border-b border-[#1a1a20]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#ff3300]"></span>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                    UNDERGROUNDZ // DEMO PAYMENT GATEWAY
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 border border-[#00ff88]/20">
                  SANDBOX PROTOCOL
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-mono font-black uppercase text-white tracking-tight mb-1">
                SCAN & PAY — DEMO
              </h3>
              <p className="font-mono text-xs text-[#888] mb-6">
                Representing simulated payment session token: <span className="text-white">{demoSessionToken}</span>
              </p>

              {/* Stylized Visual DEMO QR Box */}
              <div className="relative p-5 bg-white border-2 border-white shadow-2xl mb-4 group select-none">
                {/* SVG Visual Stylized QR Code with "DEMO QR" Stamp */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white relative flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                    {/* Corner Position Detection Squares */}
                    <rect x="5" y="5" width="26" height="26" fill="black" />
                    <rect x="9" y="9" width="18" height="18" fill="white" />
                    <rect x="13" y="13" width="10" height="10" fill="black" />

                    <rect x="69" y="5" width="26" height="26" fill="black" />
                    <rect x="73" y="9" width="18" height="18" fill="white" />
                    <rect x="77" y="13" width="10" height="10" fill="black" />

                    <rect x="5" y="69" width="26" height="26" fill="black" />
                    <rect x="9" y="73" width="18" height="18" fill="white" />
                    <rect x="13" y="77" width="10" height="10" fill="black" />

                    {/* Matrix Mock Pattern Elements */}
                    <rect x="36" y="8" width="6" height="6" fill="black" />
                    <rect x="46" y="8" width="6" height="6" fill="black" />
                    <rect x="56" y="8" width="6" height="6" fill="black" />
                    <rect x="36" y="18" width="6" height="6" fill="black" />
                    <rect x="56" y="18" width="6" height="6" fill="black" />
                    <rect x="46" y="28" width="6" height="6" fill="black" />

                    <rect x="8" y="36" width="6" height="6" fill="black" />
                    <rect x="18" y="46" width="6" height="6" fill="black" />
                    <rect x="28" y="36" width="6" height="6" fill="black" />
                    <rect x="8" y="56" width="6" height="6" fill="black" />

                    <rect x="70" y="36" width="6" height="6" fill="black" />
                    <rect x="80" y="46" width="6" height="6" fill="black" />
                    <rect x="90" y="36" width="6" height="6" fill="black" />
                    <rect x="70" y="56" width="6" height="6" fill="black" />

                    <rect x="36" y="70" width="6" height="6" fill="black" />
                    <rect x="46" y="80" width="6" height="6" fill="black" />
                    <rect x="56" y="70" width="6" height="6" fill="black" />
                    <rect x="66" y="80" width="6" height="6" fill="black" />
                    <rect x="76" y="70" width="6" height="6" fill="black" />
                    <rect x="86" y="80" width="6" height="6" fill="black" />
                  </svg>

                  {/* Centered Brutalist Demo Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-[#ff3300] text-white px-3 py-1 font-mono font-black text-xs uppercase tracking-widest shadow-md border border-white">
                      DEMO QR
                    </div>
                  </div>
                </div>

                {/* Subtext under QR */}
                <div className="mt-2 text-center">
                  <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider block">
                    Scan simulation
                  </span>
                </div>
              </div>

              {/* Clear notice under QR */}
              <p className="font-mono text-xs text-[#aaa] mb-6">
                Demo payment only — no money will be transferred.
              </p>

              {/* Main Action Buttons */}
              <div className="w-full flex flex-col gap-3">
                <button
                  id="btn-simulate-demo-payment"
                  onClick={startDemoSimulation}
                  className="w-full h-14 bg-[#00ff88] hover:bg-[#00e57a] text-black font-mono font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] shadow-lg"
                >
                  <Zap className="w-4 h-4" />
                  <span>SIMULATE PAYMENT (${total.toFixed(2)})</span>
                </button>

                <button
                  id="btn-cancel-demo-payment"
                  onClick={onCancel}
                  className="w-full h-11 border border-[#333] hover:border-red-500 text-[#888] hover:text-red-400 font-mono text-xs uppercase transition-colors cursor-pointer"
                >
                  CANCEL PAYMENT & RETURN TO CHECKOUT
                </button>
              </div>

              {/* Rider Security Aesthetic note */}
              <div className="mt-6 pt-4 border-t border-[#1a1a20] w-full flex items-center justify-center gap-2 text-[10px] font-mono text-[#666]">
                <Lock className="w-3 h-3 text-[#00ff88]" />
                <span>UNDERGROUNDZ DEMO HARNESS // END-TO-END SIMULATED STATE</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Customer Coordinates */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Order Summary */}
            <div className="border border-[#222228] bg-[#0c0c0e] p-6">
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4 pb-3 border-b border-[#1c1c22]">
                ORDER SUMMARY // {cart.length} ITEM{cart.length > 1 ? 'S' : ''}
              </h3>

              {/* Items */}
              <div className="space-y-3.5 mb-6 max-h-56 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.size}-${item.color}-${idx}`}
                    className="flex gap-3 pb-3 border-b border-[#18181c]"
                  >
                    <div className="w-12 h-12 bg-[#111] border border-[#222] shrink-0 p-1 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt=""
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 font-mono">
                      <h5 className="text-xs font-bold text-white truncate">
                        {item.product.name}
                      </h5>
                      <p className="text-[10px] text-[#888]">
                        SIZE: {item.size} | COLOR: {item.color || 'VOID BLACK'}
                      </p>
                      <p className="text-[10px] text-[#aaa]">
                        QTY: {item.quantity} × ${item.product.price}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-white shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 font-mono text-xs text-[#888] pb-4 mb-4 border-b border-[#1c1c22]">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING</span>
                  <span>{shipping === 0 ? 'FREE // ARCHIVE PASS' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-2 border-t border-[#1c1c22] text-sm">
                  <span>TOTAL</span>
                  <span className="font-mono text-lg text-[#00ff88]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer Coordinates */}
              <div className="font-mono text-[11px] text-[#888] space-y-1">
                <span className="text-[10px] uppercase text-[#666] block font-bold mb-1">
                  DISPATCH TO:
                </span>
                <div className="text-white font-bold">{customer.fullName}</div>
                <div>{customer.address}</div>
                <div>
                  {customer.city}, {customer.state} {customer.pincode}
                </div>
                <div>{customer.country} • {customer.phone}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
