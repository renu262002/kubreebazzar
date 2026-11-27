import { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  Lock,
  Truck,
  XCircle,
  RotateCcw,
  ArrowLeft,
  MapPin,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Order, DeliveryStatus } from '../types';
import { apiFetch, buildApiHeaders } from '../utils/apiClient';

const PROGRESSION_STAGES: DeliveryStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

interface OrdersPageProps {
  orderIdParam?: string;
}

export function OrdersPage({ orderIdParam }: OrdersPageProps) {
  const { user, token, authLoading, openAuthModal, navigate } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [singleOrder, setSingleOrder] = useState<Order | null>(null);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = orderIdParam
      ? `Order ${orderIdParam} | KubreeBazzar`
      : 'My Orders & Tracking | KubreeBazzar';
  }, [orderIdParam]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setOrders([]);
      setSingleOrder(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSingleError(null);
    if (orderIdParam) {
      apiFetch(`/api/account/orders/${encodeURIComponent(orderIdParam)}`, {
        headers: buildApiHeaders(token),
      })
        .then(async (res) => {
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Order not found');
          }
          return res.json();
        })
        .then((data: Order) => {
          setSingleOrder(data);
          setOrders([data]);
        })
        .catch((err) => {
          setSingleOrder(null);
          setSingleError(
            err instanceof Error ? err.message : 'Unable to load order'
          );
        })
        .finally(() => setLoading(false));
    } else {
      setSingleOrder(null);
      apiFetch('/api/account/orders', {
        headers: buildApiHeaders(token),
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .finally(() => setLoading(false));
    }
  }, [authLoading, user, token, orderIdParam]);

  if (authLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="h-44 rounded-2xl bg-white border border-[#DCE6F2] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-6 sm:p-8 space-y-4 shadow-xs">
          <Lock className="w-10 h-10 text-[#1D6FD8] mx-auto" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3B78]">
            Sign in to View Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Your order history, shipping status, and courier tracking updates are protected.
            Please log in with your KubreeBazzar account.
          </p>
          <button
            type="button"
            onClick={() =>
              openAuthModal({
                tab: 'login',
                message: 'Please log in to view your orders.',
                pendingAction: {
                  type: 'navigate',
                  path: orderIdParam
                    ? `/account/orders/${encodeURIComponent(orderIdParam)}`
                    : '/account/orders',
                },
              })
            }
            className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white cursor-pointer transition-colors"
          >
            Login / Create Account
          </button>
        </div>
      </div>
    );
  }

  const displayedOrders = orderIdParam
    ? singleOrder
      ? [singleOrder]
      : []
    : orders;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 sm:pb-6 border-b border-[#DCE6F2]">
        <div>
          {orderIdParam && (
            <button
              type="button"
              onClick={() => navigate('/account/orders')}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#1D6FD8] hover:text-[#FF6B1A] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All My Orders</span>
            </button>
          )}
          <p className="text-xs font-bold text-[#FF6B1A] uppercase tracking-[0.2em] mb-1">
            Shipment Updates
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78]">
            {orderIdParam && singleOrder
              ? `Order ${singleOrder.orderNumber}`
              : 'My Orders & Tracking'}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-44 rounded-2xl bg-white border border-[#DCE6F2] animate-pulse"
            />
          ))}
        </div>
      ) : singleError || displayedOrders.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#DCE6F2] p-8 sm:p-12 text-center">
          <Package className="w-10 h-10 text-[#1D6FD8] mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold text-[#0B3B78]">
            {singleError || 'No orders found'}
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            {orderIdParam
              ? 'We could not find that order under your account.'
              : 'You have not placed any orders yet.'}
          </p>
          <button
            type="button"
            onClick={() =>
              navigate(orderIdParam ? '/account/orders' : '/shop')
            }
            className="mt-5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-xs font-bold text-white cursor-pointer"
          >
            {orderIdParam ? 'Back to Orders' : 'Start Shopping'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedOrders.map((order) => {
            const isCancelled = order.deliveryStatus === 'Cancelled';
            const isReturned = order.deliveryStatus === 'Returned';
            const currentStageIdx = PROGRESSION_STAGES.indexOf(order.deliveryStatus);
            const hasCourierInfo = Boolean(
              order.courierName ||
                order.trackingNumber ||
                order.dispatchDate ||
                order.estimatedDeliveryDate ||
                order.trackingNotes
            );

            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-[#DCE6F2] p-4 sm:p-6 space-y-5 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#EEF4FB]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono-tabular text-sm sm:text-base font-bold text-[#0B3B78]">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isCancelled || isReturned
                            ? 'text-rose-600'
                            : order.deliveryStatus === 'Delivered'
                              ? 'text-emerald-700'
                              : 'text-[#FF6B1A]'
                        }`}
                      >
                        {order.deliveryStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN')} ·{' '}
                      {order.paymentMethod === 'razorpay'
                        ? `Razorpay (${order.paymentStatus})`
                        : `Cash on Delivery (${order.paymentStatus})`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:text-right">
                    {!orderIdParam && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/account/orders/${encodeURIComponent(order.id)}`)
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#F0F6FF] hover:bg-[#DCE6F2] text-xs font-bold text-[#0B3B78] cursor-pointer"
                      >
                        View Details
                      </button>
                    )}
                    <div>
                      <span className="text-xs text-[#64748B] block">Total</span>
                      <span className="font-mono-tabular text-lg font-extrabold text-[#0B3B78]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {orderIdParam && order.shippingAddress && (
                  <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] p-3.5 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B3B78]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      <span>Delivery Address</span>
                    </div>
                    <p className="font-semibold text-[#132238]">
                      {order.shippingAddress.fullName} · {order.shippingAddress.phone}
                    </p>
                    <p className="text-[#475569]">
                      {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state} {order.shippingAddress.postalCode},{' '}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                )}

                {/* Order Status Progression / Terminal Banner */}
                {isCancelled || isReturned ? (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-center gap-2.5 text-xs text-rose-800">
                    {isCancelled ? (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-semibold">
                      This order is currently marked as <strong>{order.deliveryStatus}</strong>.
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {PROGRESSION_STAGES.map((stage, idx) => {
                      const reached = idx <= currentStageIdx;
                      return (
                        <div
                          key={stage}
                          className={`p-2.5 rounded-xl border text-xs ${
                            reached
                              ? 'border-[#1D6FD8] bg-[#F0F6FF] text-[#0B3B78]'
                              : 'border-[#DCE6F2] bg-white text-[#94A3B8]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-semibold">
                            {reached ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1D6FD8] shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />
                            )}
                            <span className="truncate">{stage}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Real Courier & Dispatch Tracking Box */}
                {hasCourierInfo && (
                  <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE6F2] p-3.5 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B3B78]">
                      <Truck className="w-4 h-4 text-[#1D6FD8]" />
                      <span>Courier &amp; Shipment Tracking</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#475569]">
                      {order.courierName && (
                        <span>
                          Courier Partner: <strong className="text-[#132238]">{order.courierName}</strong>
                        </span>
                      )}
                      {order.trackingNumber && (
                        <span>
                          Tracking ID:{' '}
                          <strong className="font-mono-tabular text-[#0B3B78]">
                            {order.trackingNumber}
                          </strong>
                        </span>
                      )}
                      {order.dispatchDate && (
                        <span>
                          Dispatched: <strong className="text-[#132238]">{order.dispatchDate}</strong>
                        </span>
                      )}
                      {order.estimatedDeliveryDate && (
                        <span>
                          Est. Delivery:{' '}
                          <strong className="text-[#132238]">{order.estimatedDeliveryDate}</strong>
                        </span>
                      )}
                    </div>
                    {order.trackingNotes && (
                      <p className="text-[#475569] pt-1">{order.trackingNotes}</p>
                    )}
                  </div>
                )}

                {/* Timeline Events */}
                {order.timeline?.length > 0 && (
                  <div className="space-y-1.5 border-t border-[#EEF4FB] pt-3">
                    {order.timeline.map((ev, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 text-xs text-[#475569]">
                        <span>
                          <strong className="text-[#0B3B78]">{ev.status}</strong> · {ev.note}
                        </span>
                        <span className="font-mono-tabular text-[11px] text-[#94A3B8] shrink-0">
                          {new Date(ev.timestamp).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap min-[380px]:flex-nowrap items-center justify-between gap-2 sm:gap-3 text-xs bg-[#F8FAFC] border border-[#DCE6F2] rounded-xl px-3.5 sm:px-4 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-[#132238] font-semibold">
                          {item.name}
                        </span>
                        <span className="text-[#64748B] ml-1.5">
                          ({item.variantName}) × {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono-tabular text-[#0B3B78] font-bold shrink-0">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
