import React, { useState, useEffect } from 'react';
import { Order, ViewType } from '../types';
import { getCurrentUser, fetchUserOrders, signInWithGoogle, updateOrderStatus } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import {
  Package,
  Calendar,
  Truck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowLeft,
  ShieldAlert,
  Search,
  Sparkles,
} from 'lucide-react';

interface MyOrdersPageProps {
  setCurrentView: (view: ViewType) => void;
  onSelectProductForView?: (productId: string) => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({
  setCurrentView,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    async function loadUserAndOrders() {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const userOrders = await fetchUserOrders(
        currentUser?.id,
        currentUser?.email
      );
      setOrders(userOrders);
      setLoading(false);
    }

    loadUserAndOrders();

    const handleAuthChange = () => {
      loadUserAndOrders();
    };
    window.addEventListener('undergroundz-auth-change', handleAuthChange);
    return () => window.removeEventListener('undergroundz-auth-change', handleAuthChange);
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, order_status: newStatus } : o))
      );
    } catch (err) {
      console.warn('Failed to update status:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'DEMO') {
      return (
        order.is_demo ||
        order.payment_status === 'demo_paid' ||
        order.order_id.includes('DEMO')
      );
    }
    return (
      order.order_status.toLowerCase() === filterStatus.toLowerCase() ||
      order.payment_status.toLowerCase() === filterStatus.toLowerCase()
    );
  });

  return (
    <main className="pt-24 pb-24 min-h-screen bg-[#070708] text-white px-5 md:px-16">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => setCurrentView('collection')}
          className="flex items-center gap-2 text-xs font-mono text-[#888] hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO COLLECTION</span>
        </button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#222] pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#ff3300]"></span>
              <span className="font-mono text-[10px] tracking-widest text-[#888] uppercase">
                ORDER TELEMETRY // DISPATCH ARCHIVE
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              MY ORDERS & SHIPMENTS
            </h1>
          </div>

          {/* User badge */}
          {user && (
            <div className="flex items-center gap-2 font-mono text-xs text-[#aaa] bg-[#111] px-3 py-1.5 border border-[#222]">
              <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
              <span>ACCOUNT: {user.email}</span>
            </div>
          )}
        </div>

        {/* Not Logged In Warning Banner */}
        {!user && !loading && (
          <div className="mb-8 p-4 bg-[#141418] border border-[#2e2e36] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
            <div>
              <strong className="text-white block mb-1">SIGN IN TO SYNC CLOUD ORDERS</strong>
              <span className="text-[#888]">
                Viewing local session history. Sign in with Google to sync cross-device order telemetry.
              </span>
            </div>
            <HoverBorderGradient
              as="button"
              containerClassName="rounded-none shrink-0"
              className="px-4 py-2 bg-white text-black font-bold uppercase hover:bg-[#ccc] transition-colors"
              onClick={() => signInWithGoogle({ returnView: 'my-orders' })}
            >
              SIGN IN WITH GOOGLE
            </HoverBorderGradient>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 font-mono text-xs mb-6 overflow-x-auto pb-1">
          {['ALL', 'DEMO', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 border transition-all uppercase cursor-pointer ${
                filterStatus === status
                  ? 'border-white bg-white text-black font-bold'
                  : 'border-[#222] bg-[#0c0c0e] text-[#888] hover:border-[#555] hover:text-white'
              }`}
            >
              {status === 'DEMO' ? 'DEMO ORDERS' : status}{' '}
              {status === 'ALL'
                ? `(${orders.length})`
                : status === 'DEMO'
                ? `(${orders.filter((o) => o.is_demo || o.payment_status === 'demo_paid' || o.order_id.includes('DEMO')).length})`
                : ''}
            </button>
          ))}
        </div>

        {/* Orders Feed */}
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#777]">
            Retrieving dispatch manifests...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 border border-[#222] bg-[#0c0c0e] p-8">
            <Package className="w-12 h-12 mx-auto text-[#444] mb-4" />
            <h3 className="font-mono text-sm font-bold uppercase text-white mb-2">
              NO ORDERS RECORDED IN THIS SECTOR
            </h3>
            <p className="font-mono text-xs text-[#777] max-w-sm mx-auto mb-6">
              You have no orders matching "{filterStatus}". Browse our collection to initiate your first order.
            </p>
            <HoverBorderGradient
              as="button"
              containerClassName="rounded-none mx-auto"
              className="px-6 py-3 bg-white text-black font-mono font-bold text-xs uppercase hover:bg-[#ccc] transition-colors"
              onClick={() => setCurrentView('collection')}
            >
              EXPLORE COLLECTION
            </HoverBorderGradient>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.order_id;
              const isDemoOrder =
                order.is_demo ||
                order.payment_status === 'demo_paid' ||
                order.order_id.includes('DEMO');

              const formattedDate = new Date(order.created_at).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }
              );

              return (
                <div
                  key={order.order_id}
                  className={`border transition-all ${
                    isDemoOrder
                      ? 'border-[#33333e] bg-[#0a0a0d] hover:border-[#444452]'
                      : 'border-[#1e1e24] bg-[#0c0c0f] hover:border-[#333]'
                  }`}
                >
                  {/* Order Card Summary Row */}
                  <div
                    onClick={() => toggleExpand(order.order_id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#141418] border border-[#2a2a32] flex items-center justify-center shrink-0 text-[#ff3300]">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">
                            {order.order_id}
                          </span>

                          {/* Distinctive Badges */}
                          {isDemoOrder ? (
                            <span className="text-[9px] font-mono px-2 py-0.5 border uppercase bg-[#ffaa00]/10 text-[#ffaa44] border-[#ffaa00]/30 font-bold">
                              DEMO ORDER
                            </span>
                          ) : (
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 border uppercase ${
                                order.order_status === 'Paid' || order.order_status === 'Delivered'
                                  ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30'
                                  : 'bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/30'
                              }`}
                            >
                              {order.order_status}
                            </span>
                          )}

                          <span className="text-[9px] font-mono px-2 py-0.5 border uppercase bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30 font-bold">
                            {order.payment_status === 'demo_paid' ? 'DEMO PAID' : order.payment_status.toUpperCase()}
                          </span>
                        </div>

                        <div className="font-mono text-[10px] text-[#777] mt-0.5">
                          DISPATCH DATE: {formattedDate} • {order.items.length} ITEM{order.items.length > 1 ? 'S' : ''}
                          {order.demo_transaction_id && (
                            <span className="ml-2 text-[#aaa]">
                              • TXN: {order.demo_transaction_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 font-mono text-xs">
                      <div className="text-right">
                        <span className="text-[#888] block text-[10px]">
                          {isDemoOrder ? 'DEMO CHARGE' : 'TOTAL AMOUNT'}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {order.currency || '₹'}{order.amount % 1 === 0 ? order.amount.toLocaleString() : order.amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-[#888] hover:text-white transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Manifest Drawer */}
                  {isExpanded && (
                    <div className="border-t border-[#1a1a20] p-5 md:p-6 bg-[#08080a] font-mono text-xs space-y-6">
                      {/* Honesty Banner if Demo */}
                      {isDemoOrder && (
                        <div className="p-3 bg-[#ffaa00]/10 border border-[#ffaa00]/30 flex items-center gap-2 text-[#ffaa44] text-xs">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <span>
                            DEMO TRANSACTION // NO REAL MONEY WAS CHARGED FOR THIS ORDER
                          </span>
                        </div>
                      )}

                      {/* Purchased Items List */}
                      <div>
                        <h4 className="font-bold text-white uppercase text-[11px] mb-3 pb-2 border-b border-[#1c1c24]">
                          MANIFEST BREAKDOWN
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-[#0e0e12] border border-[#1e1e24] flex items-center gap-3"
                            >
                              <div className="w-12 h-12 bg-black border border-[#222] shrink-0 p-1 flex items-center justify-center">
                                <img
                                  src={item.product.image}
                                  alt=""
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-white truncate block">
                                  {item.product.name}
                                </span>
                                <span className="text-[10px] text-[#888] block">
                                  SIZE: {item.size} | COLOR: {item.color || 'NIGHT REFLECTION'}
                                </span>
                                <span className="text-[10px] text-[#aaa]">
                                  QTY: {item.quantity} × {item.product.currency || '₹'}{item.product.price}
                                </span>
                              </div>
                              <span className="font-bold text-white shrink-0">
                                {item.product.currency || '₹'}{((item.product.price * item.quantity) % 1 === 0 ? (item.product.price * item.quantity).toLocaleString() : (item.product.price * item.quantity).toFixed(2))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Telemetry & Shipping Coordinates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1a1a20]">
                        <div className="p-3 bg-[#0e0e12] border border-[#1e1e24]">
                          <span className="text-[10px] text-[#888] uppercase block mb-1 font-bold">
                            SHIPPING DESTINATION
                          </span>
                          <div className="text-white font-bold">{order.customer.fullName}</div>
                          <div className="text-[#aaa]">{order.customer.address}</div>
                          <div className="text-[#aaa]">
                            {order.customer.city}, {order.customer.state} {order.customer.pincode}
                          </div>
                          <div className="text-[#aaa]">
                            {order.customer.country} • {order.customer.phone}
                          </div>
                        </div>

                        <div className="p-3 bg-[#0e0e12] border border-[#1e1e24] space-y-1.5">
                          <span className="text-[10px] text-[#888] uppercase block mb-1 font-bold">
                            TELEMETRY AUDIT
                          </span>
                          <div className="flex justify-between">
                            <span className="text-[#888]">PAYMENT STATUS:</span>
                            <span className="text-[#00ff88] font-bold uppercase">
                              {order.payment_status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#888]">ORDER STATUS:</span>
                            <span className="text-white font-bold uppercase">
                              {order.order_status}
                            </span>
                          </div>
                          {order.demo_transaction_id && (
                            <div className="flex justify-between">
                              <span className="text-[#888]">DEMO TXN ID:</span>
                              <span className="text-[#00ff88] font-bold">
                                {order.demo_transaction_id}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-[#888]">ESTIMATED DISPATCH:</span>
                            <span className="text-white">
                              {order.estimated_delivery || '3-5 Business Days (Demo)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Status Transition Controller (Dispatches Telegram Alert) */}
                      <div className="pt-4 border-t border-[#1a1a20] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0d0d10] p-3 border border-[#1e1e24]">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[10px] text-[#888] uppercase font-mono font-bold">
                            UPDATE ORDER STATUS:
                          </span>
                          <select
                            value={order.order_status}
                            disabled={updatingOrderId === order.order_id}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                            className="bg-[#18181e] border border-[#33333d] text-white text-xs px-2.5 py-1 font-mono focus:outline-none focus:border-[#ff3300] cursor-pointer"
                          >
                            <option value="Demo Order Confirmed">Demo Order Confirmed</option>
                            <option value="Processing in Depot">Processing in Depot</option>
                            <option value="Dispatched with Courier">Dispatched with Courier</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        {updatingOrderId === order.order_id ? (
                          <span className="text-[10px] text-[#00ff88] font-mono animate-pulse">
                            Broadcasting Telegram notification...
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#666] font-mono">
                            Auto-syncs telemetry to Telegram
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
