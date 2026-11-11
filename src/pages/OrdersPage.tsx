import { useState, useEffect } from 'react';
import { Package, CheckCircle2, Clock, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Order, DeliveryStatus } from '../types';

const STAGES: DeliveryStatus[] = [
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export function OrdersPage() {
  const { user, token, navigate } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestEmail, setGuestEmail] = useState('');

  const fetchOrders = async (emailQuery?: string) => {
    setLoading(true);
    try {
      const url = emailQuery
        ? `/api/orders?email=${encodeURIComponent(emailQuery)}`
        : '/api/orders';
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestEmail.trim()) {
      fetchOrders(guestEmail.trim());
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6DCD0]">
        <div>
          <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
            Shipment Updates
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
            Order History &amp; Tracking
          </h1>
        </div>

        {!user && (
          <form onSubmit={handleGuestLookup} className="flex gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8C7E77] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Lookup by order email..."
                className="pl-8 pr-3 py-2 rounded-lg bg-white border border-[#D8CBB8] text-xs text-[#1E1614]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white cursor-pointer"
            >
              Track
            </button>
          </form>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-44 rounded-2xl bg-white border border-[#E6DCD0]"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-12 text-center">
          <Package className="w-10 h-10 text-[#B88628] mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-[#1E1614]">
            No orders found
          </h2>
          <p className="text-xs text-[#6E6059] mt-1">
            {user
              ? 'You have not placed any orders yet.'
              : 'Sign in or enter your checkout email above to track an order.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-5 px-5 py-2.5 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStageIdx = STAGES.indexOf(order.deliveryStatus);
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E6DCD0]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-[#1E1614]">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-[#6B1D2F] font-semibold">
                        {order.deliveryStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E6059] mt-1">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN')} ·{' '}
                      {order.paymentMethod === 'razorpay'
                        ? 'Razorpay Verified'
                        : 'Cash on Delivery'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#6E6059] block">Total</span>
                    <span className="font-mono text-lg font-bold text-[#6B1D2F]">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 5-Stage Visual Tracking Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {STAGES.map((stage, idx) => {
                    const reached = idx <= currentStageIdx;
                    return (
                      <div
                        key={stage}
                        className={`p-3 rounded-xl border text-xs ${
                          reached
                            ? 'border-[#6B1D2F] bg-[#FAF6F0] text-[#1E1614]'
                            : 'border-[#E6DCD0] bg-white text-[#8C7E77]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold">
                          {reached ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#6B1D2F] shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-[#B5A89F] shrink-0" />
                          )}
                          <span className="truncate">{stage}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-[#FAF6F0] border border-[#E6DCD0] rounded-lg px-4 py-2.5"
                    >
                      <div>
                        <span className="text-[#1E1614] font-medium">
                          {item.name}
                        </span>
                        <span className="text-[#6E6059] ml-2">
                          ({item.variantName}) × {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono text-[#1E1614]">
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
