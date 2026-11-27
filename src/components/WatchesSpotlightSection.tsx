import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Eye, Box, CheckCircle2, Star } from 'lucide-react';
import { UPLOADED_PRODUCT_IMAGES } from '../data/uploadedProducts';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';
import { resolveProductGlb } from '../three/resolveProductGlb';

export const WatchesSpotlightSection: React.FC = () => {
  const { navigate, addToCart, products, setQuickViewProduct } = useStore();
  const watch = UPLOADED_PRODUCT_IMAGES.watches;
  const liveWatch = products.find((p) => p.slug === 'kubree-chronos-skeleton-automatic-watch');
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovered: false });
  const [added, setAdded] = useState(false);

  const displayProduct = liveWatch || {
    id: 'prod-acc-watch',
    name: watch.name,
    slug: 'kubree-chronos-skeleton-automatic-watch',
    category: 'Accessories',
    subcategory: 'Watches',
    brand: 'Kubree Horology',
    price: watch.price,
    discountPercent: watch.discountPercent,
    images: [watch.src],
    shortDescription: watch.description,
    description: watch.description,
    rating: watch.rating,
    reviewCount: watch.reviewsCount,
    stock: 18,
    tags: ['Luxury Watch', 'Automatic'],
    modelType: 'watch' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    variants: [
      { id: 'var-brown', name: 'Brown Stitched Leather Strap', label: 'Brown Leather Strap', priceDelta: 0, stock: 12 },
    ],
    specs: [
      { label: 'Movement', value: '24-Jewel Skeleton Automatic' },
      { label: 'Case Diameter', value: '42mm Gold-Toned Stainless Steel' },
    ],
  };

  const finalPrice = getEffectivePrice(displayProduct, displayProduct.variants[0]?.id);
  const strikePrice =
    displayProduct.discountPercent > 0
      ? Math.round(finalPrice / (1 - displayProduct.discountPercent / 100))
      : finalPrice;
  const glbUrl = resolveProductGlb(displayProduct);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(pointer: coarse)').matches)
    ) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 5, ry: x * 5, hovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, hovered: false });
  };

  const handleQuickAdd = () => {
    if (!addToCart(displayProduct, displayProduct.variants[0]?.id, 1)) return;
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(glbUrl ? { ...displayProduct, glbUrl } : displayProduct);
  };

  return (
    <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="rounded-3xl bg-[#0B3B78] text-white border border-[#1D6FD8]/40 shadow-[0_14px_40px_-14px_rgba(11,59,120,0.45)] p-4 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left: 3D Tilt Watch Showcase Card */}
          <div className="lg:col-span-6">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate(`/product/${displayProduct.slug}`)}
              style={{
                transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${
                  tilt.hovered ? '-4px' : '0px'
                })`,
                transformStyle: 'preserve-3d',
                transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group relative rounded-2xl bg-white border border-white/15 p-3 sm:p-4 cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F8FAFC] flex items-center justify-center">
                <div
                  style={{
                    transform: tilt.hovered
                      ? 'translateZ(14px) scale(1.045)'
                      : 'translateZ(0px) scale(1)',
                    transition: 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="w-full h-full p-4 flex items-center justify-center"
                >
                  <ResilientImage
                    src={displayProduct.images[0]}
                    fallbackSrc="/images/products/watches.png"
                    alt={displayProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {displayProduct.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#FF6B1A] text-white text-xs font-bold shadow-xs">
                    {displayProduct.discountPercent}% OFF
                  </span>
                )}

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  {glbUrl && (
                    <button
                      type="button"
                      onClick={handleQuickView}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0B3B78] hover:bg-[#1D6FD8] text-white text-xs font-bold inline-flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Box className="w-3.5 h-3.5 text-[#FF6B1A]" />
                      <span>3D View</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleQuickView}
                    aria-label="Quick view watch product"
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F0F6FF] border border-[#DCE6F2] text-[#0B3B78] text-xs font-bold inline-flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2 sm:gap-2.5 mt-3 text-center">
                <div className="py-2 px-2.5 sm:px-3 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Movement</p>
                  <p className="text-xs font-bold text-[#0B3B78] mt-0.5">Skeleton Auto</p>
                </div>
                <div className="py-2 px-2.5 sm:px-3 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Case</p>
                  <p className="text-xs font-bold text-[#0B3B78] mt-0.5">42 mm Steel</p>
                </div>
                <div className="py-2 px-2.5 sm:px-3 rounded-xl bg-[#F0F6FF] border border-[#DCE6F2]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Strap</p>
                  <p className="text-xs font-bold text-[#0B3B78] mt-0.5">Genuine Leather</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Watch Editorial Details & CTA */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#93C5FD]">
              <span>Signature Horology</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span>Accessories / Watches</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight text-balance">
              Timeless Style, Every Day.
            </h2>

            <p className="text-sm sm:text-base text-[#DBEAFE] leading-relaxed">
              Exposed skeleton mechanical movement with vivid blued steel hands,
              sculpted gold-toned bezel, and supple hand-stitched leather strap.
              Engineered for celebratory occasions and everyday distinction.
            </p>

            {displayProduct.rating > 0 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Star className="w-4 h-4 text-[#FF6B1A] fill-current" />
                <span className="font-mono-tabular">{displayProduct.rating.toFixed(1)}</span>
                {displayProduct.reviewCount > 0 && !displayProduct.isDemoRating && (
                  <span className="text-[#DBEAFE]">
                    ({displayProduct.reviewCount} verified reviews)
                  </span>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-mono-tabular text-3xl font-bold text-white">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {displayProduct.discountPercent > 0 && (
                <>
                  <span className="font-mono-tabular text-sm text-[#93C5FD] line-through">
                    ₹{strikePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-[#FF6B1A]">
                    Save {displayProduct.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col min-[380px]:flex-row flex-wrap items-stretch min-[380px]:items-center gap-3 sm:gap-3.5 pt-2">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="px-6 py-3 sm:py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer min-h-[44px]"
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/watches')}
                className="px-6 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white hover:text-[#0B3B78] text-white border border-white/30 text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Shop Watch Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
