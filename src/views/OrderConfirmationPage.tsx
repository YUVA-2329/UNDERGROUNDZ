import React from 'react';
import { Order, ViewType } from '../types';
import { CheckCircle, Package, ArrowRight, Truck, Calendar, MapPin, Mail, ShieldAlert, Sparkles } from 'lucide-react';

interface OrderConfirmationPageProps {
  order: Order | null;
  setCurrentView: (view: ViewType) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  setCurrentView,
}) => {
  if (!order) {
    return (
      <main className="pt-28 pb-24 min-h-screen bg-[#070708] text-white px-5 md:px-16 flex items-center justify-center">
        <div className="max-w-md w-full text-center border border-[#222] bg-[#0c0c0e] p-8">
          <h2 className="text-xl font-bold font-mono tracking-tight text-white mb-2">
            NO ACTIVE TRANSMISSION
          </h2>
          <p className="text-xs text-[#888] font-mono mb-6">
            We could not locate active order confirmation details.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="w-full h-12 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-[#ccc] cursor-pointer"
          >
            RETURN TO BASE
          </button>
        </div>
      </main>
    );
  }

  const isDemoOrder =
    order.is_demo ||
    order.payment_status === 'demo_paid' ||
    order.order_id.includes('DEMO');

  return (
    <main className="pt-24 pb-24 min-h-screen bg-[#070708] text-white px-5 md:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Success Hero Badge */}
        <div className="border border-[#1e1e24] bg-[#0c0c0f] p-8 md:p-12 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff88]"></div>

          <div className="w-16 h-16 bg-[#00ff88]/10 border border-[#00ff88]/40 rounded-full flex items-center justify-center mx-auto mb-5 text-[#00ff88]">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="font-mono text-[11px] tracking-widest text-[#00ff88] uppercase block mb-1 font-bold">
            ✓ PAYMENT SUCCESSFUL // {isDemoOrder ? 'DEMO TRANSACTION COMPLETED' : 'TELEMETRY VERIFIED'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-3">
            {isDemoOrder ? 'DEMO ORDER CONFIRMED' : 'TRANSMISSION RECEIVED'}
          </h1>
          <p className="text-xs md:text-sm text-[#888] font-mono max-w-lg mx-auto mb-4 leading-relaxed">
            Your Undergroundz technical apparel dispatch has been recorded. Confirmation logged for{' '}
            <strong className="text-white">{order.customer.email}</strong>.
          </p>

          {isDemoOrder && (
            <div className="inline-flex items-center gap-2 bg-[#ffaa00]/10 border border-[#ffaa00]/40 px-4 py-1.5 font-mono text-xs text-[#ffaa44] font-bold uppercase tracking-wider mb-5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>NO REAL MONEY WAS CHARGED • DEMO ENVIRONMENT</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 bg-[#141418] border border-[#26262c] px-4 py-2 font-mono text-xs text-white">
              <span className="text-[#888]">ORDER NO:</span>
              <span className="font-bold text-[#ff3300] tracking-wider">{order.order_id}</span>
            </div>

            {order.demo_transaction_id && (
              <div className="inline-flex items-center gap-2 bg-[#141418] border border-[#26262c] px-4 py-2 font-mono text-xs text-white">
                <span className="text-[#888]">DEMO TXN:</span>
                <span className="font-bold text-[#00ff88] tracking-wider">
                  {order.demo_transaction_id}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Order Details & Items Breakdown */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="border border-[#1e1e22] bg-[#0c0c0e] p-6">
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4 pb-3 border-b border-[#1a1a1c] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#ff3300]" />
                <span>GEAR MANIFEST ({order.items.length} ITEM{order.items.length > 1 ? 'S' : ''})</span>
              </h3>

              <div className="flex flex-col gap-4 divide-y divide-[#18181a]">
                {order.items.map((item, index) => (
                  <div key={index} className="pt-3 first:pt-0 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-[#111] border border-[#222] shrink-0 p-1 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt=""
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 font-mono">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-[#888]">
                        SIZE: <strong className="text-[#ccc]">{item.size}</strong> | COLOR: <strong className="text-[#ccc]">{item.color || 'VOID BLACK'}</strong>
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

              {/* Total Row */}
              <div className="mt-6 pt-4 border-t border-[#1a1a1c] flex justify-between font-mono text-sm">
                <span className="text-[#888]">
                  {isDemoOrder ? 'DEMO SIMULATED CHARGE' : 'TOTAL PAID (INC. TAXES)'}
                </span>
                <span className="font-bold text-[#00ff88]">
                  ${order.amount.toFixed(2)} {order.currency}
                </span>
              </div>
            </div>

            {/* Delivery Tracking & Schedule */}
            <div className="border border-[#1e1e22] bg-[#0c0c0e] p-6 font-mono">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-3 border-b border-[#1a1a1c] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00ff88]" />
                <span>DISPATCH STATUS // {isDemoOrder ? 'DEMO QUEUE' : 'PROCESSING'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#131316] border border-[#222]">
                  <span className="text-[10px] text-[#888] block uppercase mb-1">PAYMENT STATUS</span>
                  <span className="font-bold text-[#00ff88] uppercase">{order.payment_status}</span>
                </div>
                <div className="p-3 bg-[#131316] border border-[#222]">
                  <span className="text-[10px] text-[#888] block uppercase mb-1">ORDER STATUS</span>
                  <span className="font-bold text-white uppercase">{order.order_status}</span>
                </div>
                <div className="p-3 bg-[#131316] border border-[#222]">
                  <span className="text-[10px] text-[#888] block uppercase mb-1">ESTIMATED ARRIVAL</span>
                  <span className="font-bold text-white">{order.estimated_delivery || '3-5 Business Days (Demo)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Coordinates & Actions */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="border border-[#1e1e22] bg-[#0c0c0e] p-6 font-mono text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider mb-4 pb-3 border-b border-[#1a1a1c]">
                COORDINATES
              </h3>

              <div className="flex flex-col gap-3 text-[#aaa]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#888] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{order.customer.fullName}</strong>
                    <span>{order.customer.address}</span>
                    <br />
                    <span>
                      {order.customer.city}, {order.customer.state} {order.customer.pincode}
                    </span>
                    <br />
                    <span>{order.customer.country}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#18181a]">
                  <Mail className="w-4 h-4 text-[#888] shrink-0" />
                  <span className="truncate">{order.customer.email}</span>
                </div>

                <div className="text-[10px] text-[#666] pt-2 border-t border-[#18181a]">
                  GATEWAY REF: {order.demo_transaction_id || order.payment_id || order.payment_gateway_order_id || 'N/A'}
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col gap-3">
              <button
                id="btn-view-my-orders"
                onClick={() => setCurrentView('my-orders')}
                className="w-full h-12 bg-white hover:bg-[#ccc] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>VIEW MY ORDERS ARCHIVE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-continue-shopping"
                onClick={() => setCurrentView('collection')}
                className="w-full h-12 border border-[#333] hover:border-white text-[#aaa] hover:text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                CONTINUE BROWSING CATALOG
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
