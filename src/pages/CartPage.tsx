import { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from '../components/ResilientImage';
import { ProductCard } from '../components/ProductCard';

export function CartPage() {
  const {
    cart,
    products,
    wishlist,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    navigate,
    showToast,
  } = useStore();

  const [tab, setTab] = useState<'cart' | 'wishlist'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, subtotal: cartSubtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCouponError(data.error || 'Invalid coupon');
      setAppliedDiscount(null);
      return;
    }
    setAppliedDiscount({
      code: data.coupon.code,
      amount: data.discountAmount,
    });
    showToast(
      `Applied ${data.coupon.code} (-₹${data.discountAmount.toLocaleString('en-IN')})`
    );
  };

  const afterDiscount = Math.max(
    0,
    cartSubtotal - (appliedDiscount?.amount || 0)
  );
  const shipping = afterDiscount === 0 || afterDiscount >= 1500 ? 0 : 99;
  const total = Number((afterDiscount + shipping).toFixed(2));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6DCD0]">
        <div>
          <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
            Your Selection
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
            Shopping Bag &amp; Wishlist
          </h1>
        </div>

        <div className="inline-flex p-1 rounded-lg bg-white border border-[#E6DCD0] self-start">
          <button
            type="button"
            onClick={() => setTab('cart')}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              tab === 'cart'
                ? 'bg-[#6B1D2F] text-white'
                : 'text-[#5C4F49] hover:text-[#1E1614]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('wishlist')}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              tab === 'wishlist'
                ? 'bg-[#6B1D2F] text-white'
                : 'text-[#5C4F49] hover:text-[#1E1614]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Wishlist ({wishlistProducts.length})</span>
          </button>
        </div>
      </div>

      {tab === 'cart' ? (
        cart.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E6DCD0] p-14 text-center my-10">
            <ShoppingBag className="w-10 h-10 text-[#B88628] mx-auto mb-3" />
            <h2 className="font-serif text-xl font-bold text-[#1E1614]">
              Your bag is currently empty
            </h2>
            <p className="text-xs text-[#6E6059] mt-1">
              Explore our Rice, Grocery, Honey, and Watches aisles to add items.
            </p>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="mt-6 px-5 py-2.5 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white cursor-pointer"
            >
              Explore Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const product = item.product;
                if (!product) return null;
                const variant =
                  product.variants.find((v) => v.id === item.variantId) ||
                  product.variants[0];
                const unit = getEffectivePrice(product, item.variantId);

                return (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="rounded-2xl bg-white border border-[#E6DCD0] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                  >
                    <div
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="w-24 h-24 rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E6DCD0] shrink-0 cursor-pointer"
                    >
                      <ResilientImage
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#B88628] font-medium">
                        {product.category}
                      </p>
                      <h3
                        onClick={() => navigate(`/product/${product.slug}`)}
                        className="font-serif text-lg font-bold text-[#1E1614] hover:text-[#6B1D2F] cursor-pointer truncate"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#6E6059] mt-0.5">
                        Pack / Variant: {variant?.name}
                      </p>
                      <p className="font-mono text-xs text-[#5C4F49] mt-2">
                        ₹{unit.toLocaleString('en-IN')} each
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="flex items-center border border-[#E6DCD0] rounded-lg bg-[#FAF6F0]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          aria-label="Decrease quantity"
                          className="w-9 h-9 flex items-center justify-center text-[#5C4F49] hover:text-[#1E1614] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono px-3 text-xs font-semibold text-[#1E1614]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1
                            )
                          }
                          aria-label="Increase quantity"
                          className="w-9 h-9 flex items-center justify-center text-[#5C4F49] hover:text-[#1E1614] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono text-base font-bold text-[#6B1D2F] w-24 text-right">
                        ₹{(unit * item.quantity).toLocaleString('en-IN')}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.productId, item.variantId)
                        }
                        aria-label={`Remove ${product.name}`}
                        className="p-2 text-[#8C7E77] hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#1E1614]">
                Order Summary
              </h2>

              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label
                  htmlFor="cart-coupon"
                  className="text-xs text-[#5C4F49] block"
                >
                  Promotional Code (try KAVERI10)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8C7E77] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="cart-coupon"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="KAVERI10"
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#D8CBB8] text-xs text-[#1E1614] uppercase focus:outline-none focus:border-[#6B1D2F]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#F3ECE1] hover:bg-[#E6DCD0] text-xs font-semibold text-[#1E1614] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-rose-700">{couponError}</p>
                )}
              </form>

              <dl className="space-y-2.5 text-sm border-t border-[#E6DCD0] pt-4">
                <div className="flex justify-between">
                  <dt className="text-[#5C4F49]">Subtotal</dt>
                  <dd className="font-mono text-[#1E1614]">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </dd>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>Discount ({appliedDiscount.code})</dt>
                    <dd className="font-mono">
                      -₹{appliedDiscount.amount.toLocaleString('en-IN')}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#5C4F49]">Standard Delivery</dt>
                  <dd className="font-mono text-[#1E1614]">
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#E6DCD0] text-base font-bold">
                  <dt className="text-[#1E1614]">Total</dt>
                  <dd className="font-mono text-[#6B1D2F]">
                    ₹{total.toLocaleString('en-IN')}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      ) : wishlistProducts.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E6DCD0] p-14 text-center my-10">
          <Heart className="w-10 h-10 text-[#B88628] mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-[#1E1614]">
            No saved items yet
          </h2>
          <p className="text-xs text-[#6E6059] mt-1">
            Tap the heart icon on any product to save it for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
