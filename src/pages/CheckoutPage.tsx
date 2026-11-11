import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  Tag,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import type { Order, SavedAddress } from '../types';

export function CheckoutPage() {
  const {
    cart,
    cartSubtotal,
    user,
    token,
    clearCart,
    refreshCatalog,
    navigate,
    showToast,
  } = useStore();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [address, setAddress] = useState<SavedAddress>({
    id: 'ship-1',
    label: 'Primary',
    fullName: user?.name || '',
    phone: '+91 98400 12345',
    street: '42 Cathedral Road, Gopalapuram',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600086',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>(
    'razorpay'
  );
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Razorpay Interactive Modal State
  const [razorpayModal, setRazorpayModal] = useState<{
    orderId: string;
    amountPaise: number;
    keyId: string;
    mode: string;
  } | null>(null);

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      setCustomerEmail(user.email);
      if (user.addresses.length > 0) {
        const def =
          user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setAddress(def);
      }
    }
  }, [user]);

  const afterDiscount = Math.max(
    0,
    cartSubtotal - (appliedCoupon?.amount || 0)
  );
  const shippingFee = afterDiscount >= 1500 || afterDiscount === 0 ? 0 : 99;
  const finalTotal = Number((afterDiscount + shippingFee).toFixed(2));

  const applyCoupon = async () => {
    setError('');
    if (!couponCode.trim()) return;
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, subtotal: cartSubtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Invalid coupon');
      return;
    }
    setAppliedCoupon({ code: data.coupon.code, amount: data.discountAmount });
    showToast(`Coupon ${data.coupon.code} applied`);
  };

  const finalizeOrderOnServer = async (paymentDetails?: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        customerName,
        customerEmail,
        shippingAddress: { ...address, fullName: customerName },
        items: cart.map((c) => ({
          productId: c.productId,
          variantId: c.variantId,
          quantity: c.quantity,
        })),
        couponCode: appliedCoupon?.code,
        paymentMethod,
        ...paymentDetails,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to place order');
    }
    clearCart();
    await refreshCatalog();
    setCompletedOrder(data);
    showToast(`Order ${data.orderNumber} confirmed`);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your bag is empty.');
      return;
    }
    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.postalCode.trim()
    ) {
      setError('Please complete all required shipping fields.');
      return;
    }

    setSubmitting(true);
    try {
      if (paymentMethod === 'cod') {
        await finalizeOrderOnServer();
      } else {
        const rzpRes = await fetch('/api/payments/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal, currency: 'INR' }),
        });
        const rzpData = await rzpRes.json();
        if (!rzpRes.ok) {
          throw new Error(rzpData.error || 'Could not initialize Razorpay');
        }
        setRazorpayModal({
          orderId: rzpData.id,
          amountPaise: rzpData.amount,
          keyId: rzpData.keyId,
          mode: rzpData.mode,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteRazorpayPayment = async () => {
    if (!razorpayModal) return;
    setSubmitting(true);
    setError('');
    try {
      const paymentId = `pay_${Math.random().toString(36).slice(2, 12)}`;
      const verifyRes = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayModal.orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: 'sandbox_verified',
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.verified) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }
      setRazorpayModal(null);
      await finalizeOrderOnServer({
        razorpayOrderId: verifyData.razorpay_order_id,
        razorpayPaymentId: verifyData.razorpay_payment_id,
        razorpaySignature: verifyData.signature,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-8 text-center space-y-5">
          <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Order Confirmed
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1614] mt-1">
              Thank you, {completedOrder.customerName}
            </h1>
            <p className="text-sm text-[#5C4F49] mt-2">
              Order{' '}
              <span className="font-mono text-[#6B1D2F] font-semibold">
                {completedOrder.orderNumber}
              </span>{' '}
              is now {completedOrder.deliveryStatus}.
            </p>
          </div>

          <div className="rounded-xl bg-[#FAF6F0] border border-[#E6DCD0] p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6E6059]">Payment Method</span>
              <span className="text-[#1E1614] uppercase font-medium">
                {completedOrder.paymentMethod === 'razorpay'
                  ? 'Razorpay Verified'
                  : 'Cash on Delivery'}
              </span>
            </div>
            {completedOrder.razorpayPaymentId && (
              <div className="flex justify-between">
                <span className="text-[#6E6059]">Transaction ID</span>
                <span className="font-mono text-[#6B1D2F]">
                  {completedOrder.razorpayPaymentId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#6E6059]">Total Paid / Due</span>
              <span className="font-mono text-[#1E1614] font-semibold">
                ₹{completedOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-5 py-2.5 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white cursor-pointer"
            >
              Track Shipment
            </button>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 rounded-lg border border-[#D8CBB8] text-xs font-semibold text-[#1E1614] hover:bg-[#FAF6F0] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="pb-6 border-b border-[#E6DCD0] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
            Encrypted Checkout
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
            Shipping &amp; Payment
          </h1>
        </div>
        <p className="text-xs text-[#6E6059]">
          Demo / Sandbox Mode active when live Razorpay keys are not set in .env
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-rose-50 border border-rose-300 px-4 py-3 text-xs text-rose-800">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCheckoutSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start"
      >
        {/* Left: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Saved Addresses Quick Fill */}
          {user && user.addresses.length > 0 && (
            <div className="rounded-2xl bg-white border border-[#E6DCD0] p-5">
              <h2 className="text-xs font-semibold text-[#5C4F49] uppercase tracking-wider mb-3">
                Saved Addresses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((saved) => (
                  <button
                    key={saved.id}
                    type="button"
                    onClick={() => setAddress(saved)}
                    className={`text-left p-3.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                      address.id === saved.id
                        ? 'border-[#6B1D2F] bg-[#FAF6F0]'
                        : 'border-[#E6DCD0] bg-white hover:border-[#B88628]'
                    }`}
                  >
                    <p className="font-semibold text-[#1E1614]">{saved.label}</p>
                    <p className="text-[#5C4F49] mt-1">{saved.street}</p>
                    <p className="text-[#5C4F49]">
                      {saved.city}, {saved.state} {saved.postalCode}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Form */}
          <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1E1614]">
              Delivery Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#5C4F49] mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#5C4F49] mb-1.5">
                  PIN / Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-sm text-[#1E1614] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1E1614]">
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#6B1D2F] bg-[#FAF6F0]'
                    : 'border-[#E6DCD0] bg-white hover:border-[#B88628]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-[#6B1D2F]" />
                  <span className="text-[11px] font-medium text-[#B88628]">
                    HMAC Verified
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#1E1614]">
                  Razorpay Checkout
                </p>
                <p className="text-xs text-[#6E6059] mt-1">
                  UPI, Cards, NetBanking &amp; Wallets with server signature
                  check.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#6B1D2F] bg-[#FAF6F0]'
                    : 'border-[#E6DCD0] bg-white hover:border-[#B88628]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Truck className="w-5 h-5 text-[#B88628]" />
                  <span className="text-[11px] font-medium text-[#6E6059]">
                    Pay on Arrival
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#1E1614]">
                  Cash on Delivery (COD)
                </p>
                <p className="text-xs text-[#6E6059] mt-1">
                  Pay in person upon insured courier delivery.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-5">
          <h2 className="font-serif text-xl font-bold text-[#1E1614]">
            Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => {
              if (!item.product) return null;
              const unit = getEffectivePrice(item.product, item.variantId);
              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center justify-between text-xs gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[#1E1614] font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[#6E6059]">Qty {item.quantity}</p>
                  </div>
                  <span className="font-mono text-[#1E1614] shrink-0">
                    ₹{(unit * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Coupon */}
          <div className="flex gap-2 pt-3 border-t border-[#E6DCD0]">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-[#8C7E77] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Promo code (e.g. KAVERI10)"
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-xs text-[#1E1614] uppercase"
              />
            </div>
            <button
              type="button"
              onClick={applyCoupon}
              className="px-4 py-2 rounded-lg bg-[#F3ECE1] hover:bg-[#E6DCD0] text-xs font-semibold text-[#1E1614] cursor-pointer"
            >
              Apply
            </button>
          </div>

          <dl className="space-y-2 text-sm border-t border-[#E6DCD0] pt-4">
            <div className="flex justify-between">
              <dt className="text-[#5C4F49]">Subtotal</dt>
              <dd className="font-mono text-[#1E1614]">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </dd>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-700">
                <dt>Coupon ({appliedCoupon.code})</dt>
                <dd className="font-mono">
                  -₹{appliedCoupon.amount.toLocaleString('en-IN')}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#5C4F49]">Standard Delivery</dt>
              <dd className="font-mono text-[#1E1614]">
                {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#E6DCD0] text-base font-bold">
              <dt className="text-[#1E1614]">Total</dt>
              <dd className="font-mono text-[#6B1D2F]">
                ₹{finalTotal.toLocaleString('en-IN')}
              </dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting || cart.length === 0}
            className="w-full py-3.5 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] disabled:opacity-50 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>
              {submitting
                ? 'Processing...'
                : paymentMethod === 'razorpay'
                ? `Pay ₹${finalTotal.toLocaleString('en-IN')} with Razorpay`
                : `Place COD Order (₹${finalTotal.toLocaleString('en-IN')})`}
            </span>
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-[#6E6059]">
            <ShieldCheck className="w-4 h-4 text-[#6B1D2F]" />
            <span>256-bit TLS &amp; Server-Side HMAC Payment Verification</span>
          </div>
        </div>
      </form>

      {/* Razorpay Interactive Gateway Modal */}
      {razorpayModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Razorpay Payment Gateway"
        >
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6DCD0] pb-4">
              <div>
                <p className="text-xs font-semibold text-[#B88628]">
                  Razorpay Secure Gateway ({razorpayModal.mode})
                </p>
                <h3 className="font-serif text-xl font-bold text-[#1E1614]">
                  KubreeBazzar
                </h3>
              </div>
              <span className="font-mono text-lg font-bold text-[#6B1D2F]">
                ₹{(razorpayModal.amountPaise / 100).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="rounded-xl bg-[#FAF6F0] border border-[#E6DCD0] p-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#6E6059]">Order ID</span>
                <span className="font-mono text-[#1E1614]">
                  {razorpayModal.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E6059]">Customer</span>
                <span className="text-[#1E1614]">{customerEmail}</span>
              </div>
            </div>

            <p className="text-xs text-[#5C4F49] leading-relaxed">
              Authorize payment to generate a server-verified HMAC-SHA256
              Razorpay signature and confirm your shipment.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRazorpayModal(null)}
                className="flex-1 py-2.5 rounded-lg border border-[#D8CBB8] text-xs font-semibold text-[#5C4F49] hover:bg-[#FAF6F0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleCompleteRazorpayPayment}
                className="flex-1 py-2.5 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white cursor-pointer"
              >
                {submitting ? 'Verifying...' : 'Authorize Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
