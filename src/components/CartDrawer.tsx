import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';

export function CartDrawer() {
  const {
    cart,
    cartSubtotal,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useStore();

  if (!cartDrawerOpen) return null;

  const freeShippingThreshold = 1500;
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <div
        className="fixed inset-0"
        onClick={() => setCartDrawerOpen(false)}
      />

      <aside className="relative z-10 w-full max-w-md bg-white border-l border-[#E6DDD0] h-full flex flex-col justify-between shadow-2xl">
        <div className="p-5 border-b border-[#EFE6D8] flex items-center justify-between bg-[#FAF6F0]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#6B1D2F]" />
            <h2 className="font-display text-xl font-bold text-[#1E1614]">
              Your Shopping Cart
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(false)}
            aria-label="Close cart"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#4A3F3B] hover:text-[#6B1D2F] hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress */}
        <div className="px-5 py-3 bg-[#FDF4F6] border-b border-[#EFE6D8] text-xs text-[#6B1D2F] font-medium">
          {remainingForFree === 0
            ? 'Complimentary Express Delivery unlocked on this order'
            : `Add ₹${remainingForFree.toLocaleString(
                'en-IN'
              )} more for complimentary delivery`}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-sm text-[#786B65]">
                Your shopping cart is currently empty.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/shop');
                }}
                className="px-5 py-2.5 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white"
              >
                Explore Products
              </button>
            </div>
          ) : (
            cart.map((item) => {
              if (!item.product) return null;
              const variant =
                item.product.variants.find((v) => v.id === item.variantId) ||
                item.product.variants[0];
              const unitPrice = getEffectivePrice(item.product, item.variantId);

              return (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3.5 p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E6DDD0]"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-[#E6DDD0]">
                    <ResilientImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1E1614] truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-[#786B65]">
                        {variant?.name || 'Standard'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#E6DDD0] rounded-lg bg-white">
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
                          className="w-7 h-7 flex items-center justify-center text-[#4A3F3B] hover:text-[#6B1D2F]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-tabular px-2.5 text-xs font-semibold text-[#1E1614]">
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
                          className="w-7 h-7 flex items-center justify-center text-[#4A3F3B] hover:text-[#6B1D2F]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="font-mono-tabular text-sm font-bold text-[#6B1D2F]">
                          ₹
                          {(unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.productId, item.variantId)
                          }
                          aria-label="Remove item"
                          className="text-[#786B65] hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E6DDD0] bg-[#FAF6F0] space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#4A3F3B] font-medium">Subtotal</span>
              <span className="font-mono-tabular text-lg font-bold text-[#6B1D2F]">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/cart');
                }}
                className="py-3 px-4 rounded-lg border border-[#D8CBB8] bg-white hover:bg-[#F3ECE1] text-xs font-semibold text-[#1E1614]"
              >
                View Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/checkout');
                }}
                className="py-3 px-4 rounded-lg bg-[#6B1D2F] hover:bg-[#541524] text-xs font-semibold text-white flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
