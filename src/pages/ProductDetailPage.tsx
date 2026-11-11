import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Box,
  Image as ImageIcon,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Star,
  Truck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { Product3DViewer } from '../components/Product3DViewer';
import { ResilientImage } from '../components/ResilientImage';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  slugOrId: string;
}

export function ProductDetailPage({ slugOrId }: ProductDetailPageProps) {
  const {
    products,
    reviews,
    user,
    navigate,
    addToCart,
    wishlist,
    toggleWishlist,
    recordRecentlyViewed,
    refreshCatalog,
    showToast,
  } = useStore();

  const product = products.find(
    (p) => p.slug === slugOrId || p.id === slugOrId
  );

  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [revAuthor, setRevAuthor] = useState(user?.name || '');
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');

  const has3D = product
    ? product.has3DModel !== false || Boolean(product.glbUrl)
    : true;

  useEffect(() => {
    if (product) {
      if (product.variants.length > 0) {
        setSelectedVariantId(product.variants[0].id);
      }
      setViewMode(
        product.has3DModel !== false || Boolean(product.glbUrl) ? '3d' : 'photo'
      );
      setQuantity(1);
      recordRecentlyViewed(product.id);
    }
  }, [product?.id, recordRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-[#1E1614]">
          Product not found
        </h1>
        <p className="text-sm text-[#786B65] mt-2">
          The requested item may have been removed or moved.
        </p>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="mt-6 px-5 py-2.5 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];
  const unitPrice = getEffectivePrice(product, activeVariant?.id);
  const baseWithVariant = product.price + (activeVariant?.priceDelta || 0);
  const availableStock = activeVariant ? activeVariant.stock : product.stock;
  const isSaved = wishlist.includes(product.id);

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const handleAdd = () => {
    if (availableStock <= 0) return;
    addToCart(product, activeVariant?.id, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1200);
  };

  const handleBuyNow = () => {
    if (availableStock <= 0) return;
    addToCart(product, activeVariant?.id, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/products/${product.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorName: revAuthor || 'Customer',
        rating: revRating,
        title: revTitle,
        comment: revComment,
      }),
    });
    if (res.ok) {
      setRevTitle('');
      setRevComment('');
      showToast('Review published');
      await refreshCatalog();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-28 lg:pb-16 space-y-20">
      <div>
        <button
          type="button"
          onClick={() => navigate(`/${product.category.toLowerCase()}`)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B1D2F] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {product.category}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Sticky Gallery: 360° 3D Viewer & Studio Photo */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex p-1 rounded-lg bg-white border border-[#E6DDD0]">
                {has3D && (
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      viewMode === '3d'
                        ? 'bg-[#6B1D2F] text-white'
                        : 'text-[#4A3F3B] hover:text-[#6B1D2F]'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>360° 3D Model</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'photo' || !has3D
                      ? 'bg-[#6B1D2F] text-white'
                      : 'text-[#4A3F3B] hover:text-[#6B1D2F]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Studio Photo</span>
                </button>
              </div>

              {product.glbUrl ? (
                <span className="text-xs text-[#6B1D2F] font-semibold">
                  Custom GLB Asset Loaded
                </span>
              ) : !has3D ? (
                <span className="text-xs text-[#786B65]">
                  2D Studio Gallery Edition
                </span>
              ) : null}
            </div>

            <div className="h-[440px] sm:h-[520px] w-full">
              {viewMode === '3d' && has3D ? (
                <Product3DViewer
                  preset={product.modelType}
                  glbUrl={product.glbUrl}
                  productName={product.name}
                />
              ) : (
                <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-[#E6DDD0]">
                  <ResilientImage
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sticky Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 rounded-2xl bg-white border border-[#E6DDD0] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#786B65] mb-2">
                <span className="font-semibold text-[#6B1D2F]">
                  {product.category}
                </span>
                {product.subcategory && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{product.subcategory}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-[#1E1614] font-medium">
                  <Star className="w-3.5 h-3.5 text-[#B88628] fill-current" />
                  <span className="font-mono-tabular">{product.rating}</span>
                  {product.isDemoRating && (
                    <span className="text-[11px] text-[#786B65]">
                      (Demo Rating)
                    </span>
                  )}
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E1614] text-balance">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono-tabular text-2xl font-bold text-[#6B1D2F]">
                  ₹{unitPrice.toLocaleString('en-IN')}
                </span>
                {product.discountPercent > 0 && (
                  <>
                    <span className="font-mono-tabular text-sm text-[#786B65] line-through">
                      ₹{baseWithVariant.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      Save {product.discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#786B65] mt-1">
                {availableStock > 0
                  ? `In Stock (${availableStock} units ready to dispatch)`
                  : 'Currently Out of Stock'}
              </p>
            </div>

            <p className="text-sm text-[#4A3F3B] leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector (Weight / Jar Size / Strap) */}
            {product.variants.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-[#EFE6D8]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#786B65]">
                    {product.category === 'Rice' ||
                    product.category === 'Grocery'
                      ? 'Select Pack Weight'
                      : product.category === 'Honey'
                      ? 'Select Jar Size'
                      : 'Select Strap / Finish'}
                  </span>
                  <span className="font-semibold text-[#1E1614]">
                    {activeVariant?.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const selected = v.id === activeVariant?.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-colors ${
                          selected
                            ? 'border-[#6B1D2F] bg-[#FDF4F6] text-[#6B1D2F]'
                            : 'border-[#E6DDD0] bg-[#FAF6F0] text-[#4A3F3B] hover:border-[#B88628]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span>{v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity, Add to Cart & Buy Now */}
            <div className="space-y-3 pt-3 border-t border-[#EFE6D8]">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E6DDD0] rounded-lg bg-[#FAF6F0]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-10 h-11 flex items-center justify-center text-[#4A3F3B] hover:text-[#6B1D2F]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono-tabular w-10 text-center text-sm font-bold text-[#1E1614]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(availableStock || 1, q + 1))
                    }
                    aria-label="Increase quantity"
                    className="w-10 h-11 flex items-center justify-center text-[#4A3F3B] hover:text-[#6B1D2F]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={availableStock <= 0}
                  onClick={handleAdd}
                  className={`flex-1 h-11 px-5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    availableStock <= 0
                      ? 'bg-[#EFE6D8] text-[#786B65] cursor-not-allowed'
                      : addedFeedback
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#6B1D2F] hover:bg-[#541524] text-white'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#F3D88B]" />
                      <span>
                        {availableStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Save to wishlist"
                  className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                    isSaved
                      ? 'border-[#6B1D2F] bg-[#6B1D2F] text-white'
                      : 'border-[#E6DDD0] bg-[#FAF6F0] text-[#4A3F3B] hover:text-[#6B1D2F]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
                  />
                </button>
              </div>

              <button
                type="button"
                disabled={availableStock <= 0}
                onClick={handleBuyNow}
                className="w-full py-3 rounded-lg bg-[#B88628] hover:bg-[#9E711E] disabled:opacity-40 text-xs font-bold text-white transition-all"
              >
                Buy Now — Express Checkout
              </button>
            </div>

            {/* Delivery & Return Summary */}
            <div className="pt-4 border-t border-[#EFE6D8] space-y-2.5 text-xs text-[#4A3F3B]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#6B1D2F] shrink-0" />
                <span>
                  Free delivery across India on orders over ₹1,500 (2–5
                  business days).
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#B88628] shrink-0" />
                <span>
                  Easy 7-day return & replacement policy on sealed retail packs.
                </span>
              </div>
            </div>

            {/* Specifications */}
            {product.specs.length > 0 && (
              <div className="pt-4 border-t border-[#EFE6D8]">
                <h2 className="text-xs font-bold text-[#1E1614] uppercase tracking-wider mb-3">
                  Product Specifications
                </h2>
                <dl className="divide-y divide-[#EFE6D8] text-xs">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="py-2.5 flex items-center justify-between gap-4"
                    >
                      <dt className="text-[#786B65]">{spec.label}</dt>
                      <dd className="font-mono-tabular text-[#1E1614] font-semibold text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews & Submission */}
      <section className="pt-12 border-t border-[#E6DDD0] grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-5">
          <h2 className="font-display text-2xl font-bold text-[#1E1614]">
            Customer Reviews ({productReviews.length})
          </h2>

          {productReviews.length === 0 ? (
            <p className="text-xs text-[#786B65]">
              No reviews yet for this product. Share your experience on the
              right.
            </p>
          ) : (
            <div className="space-y-4">
              {productReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-xl bg-white border border-[#E6DDD0] p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#B88628]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#1E1614]">
                    {rev.title}
                  </h3>
                  <p className="text-xs text-[#4A3F3B] leading-relaxed">
                    {rev.comment}
                  </p>
                  <p className="text-[11px] text-[#786B65]">
                    {rev.authorName} ·{' '}
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <form
            onSubmit={handleReviewSubmit}
            className="rounded-xl bg-white border border-[#E6DDD0] p-6 space-y-4"
          >
            <h3 className="font-display text-xl font-bold text-[#1E1614]">
              Write a Review
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={revAuthor}
                onChange={(e) => setRevAuthor(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-xs text-[#1E1614]"
              />
              <select
                value={revRating}
                onChange={(e) => setRevRating(Number(e.target.value))}
                className="px-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-xs text-[#1E1614]"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
              </select>
            </div>
            <input
              type="text"
              required
              placeholder="Review Headline"
              value={revTitle}
              onChange={(e) => setRevTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-xs text-[#1E1614]"
            />
            <textarea
              rows={3}
              required
              placeholder="Share your feedback on quality, packaging, and delivery..."
              value={revComment}
              onChange={(e) => setRevComment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-xs text-[#1E1614]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#6B1D2F] hover:bg-[#541524] text-xs font-semibold text-white"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* FAQs */}
      <section className="pt-12 border-t border-[#E6DDD0] space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#1E1614]">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              q: 'How are Rice, Grocery, and Honey packed for transit?',
              a: 'All pantry staples and glass honey jars are cushioned in multi-layer protective cartons and sealed at our dispatch hub.',
            },
            {
              q: 'Does the 360° 3D viewer show actual product proportions?',
              a: 'Yes. You can rotate, zoom, switch finishes, and inspect feature hotspots before placing your order.',
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl bg-white border border-[#E6DDD0] p-5 space-y-2"
            >
              <h3 className="font-display text-base font-bold text-[#1E1614]">
                {faq.q}
              </h3>
              <p className="text-xs text-[#4A3F3B] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#E6DDD0] space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#1E1614]">
            More in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 border-t border-[#E6DDD0] px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
        <div>
          <p className="text-xs text-[#786B65] truncate max-w-[180px]">
            {product.name}
          </p>
          <p className="font-mono-tabular text-base font-bold text-[#6B1D2F]">
            ₹{unitPrice.toLocaleString('en-IN')}
          </p>
        </div>
        <button
          type="button"
          disabled={availableStock <= 0}
          onClick={handleAdd}
          className="px-5 py-2.5 rounded-lg bg-[#6B1D2F] text-xs font-semibold text-white whitespace-nowrap shrink-0"
        >
          {availableStock <= 0 ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
