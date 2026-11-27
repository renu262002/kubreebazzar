import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Eye, Box, CheckCircle2, Star } from 'lucide-react';
import { UPLOADED_PRODUCT_IMAGES } from '../data/uploadedProducts';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';
import { resolveProductGlb } from '../three/resolveProductGlb';

export const RiceShowcaseSection: React.FC = () => {
  const { navigate, addToCart, products, setQuickViewProduct } = useStore();
  const rice = UPLOADED_PRODUCT_IMAGES.rice;
  const liveRice = products.find((p) => p.slug === 'royal-aged-basmati-rice-5kg');
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovered: false });
  const [added, setAdded] = useState(false);

  const displayProduct = liveRice || {
    id: 'prod-groc-rice-1',
    name: rice.name,
    slug: rice.slug,
    category: 'Groceries',
    subcategory: 'Rice',
    brand: 'Kaveri Harvest',
    price: rice.price,
    discountPercent: rice.discountPercent,
    images: [rice.src],
    shortDescription: rice.description,
    description: rice.description,
    rating: rice.rating,
    reviewCount: rice.reviewsCount,
    stock: 50,
    tags: ['Featured', 'Aged'],
    modelType: 'rice' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    variants: [
      { id: 'var-5kg', name: '5 kg Sack', label: '5 kg Sack', priceDelta: 0, stock: 50 },
    ],
    specs: [
      { label: 'Grain Age', value: '24 Months Naturally Aged' },
      { label: 'Variety', value: 'Traditional Royal Basmati' },
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
      <div className="rounded-3xl bg-white border border-[#DCE6F2] shadow-[0_8px_30px_-12px_rgba(11,59,120,0.1)] p-4 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left: Interactive 3D Tilted Rice Card */}
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
              className="group relative rounded-2xl bg-[#F0F6FF] border border-[#DCE6F2] p-3 sm:p-4 cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white">
                <div
                  style={{
                    transform: tilt.hovered
                      ? 'translateZ(14px) scale(1.045)'
                      : 'translateZ(0px) scale(1)',
                    transition: 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="w-full h-full"
                >
                  <ResilientImage
                    src={displayProduct.images[0]}
                    fallbackSrc="/images/products/Rice.jpg"
                    alt={displayProduct.name}
                    className="w-full h-full object-cover"
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
                    aria-label="Quick view rice product"
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F0F6FF] border border-[#DCE6F2] text-[#0B3B78] text-xs font-bold inline-flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2 sm:gap-2.5 mt-3 text-center">
                <div className="py-2 px-2.5 sm:px-3 rounded-xl bg-white border border-[#DCE6F2]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Aging</p>
                  <p className="text-xs font-bold text-[#0B3B78] mt-0.5">24 Months</p>
                </div>
                <div className="py-2 px-2.5 sm:px-3 rounded-xl bg-white border border-[#DCE6F2]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Texture</p>
                  <p className="text-xs font-bold text-[#0B3B78] mt-0.5">Fluffy &amp; Long</p>
                </div>
                <div className="py-2 px-2.5 sm:px-3 rounded-xl bg-white border border-[#DCE6F2]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Packs</p>
                  <p className="text-xs font-bold text-[#0B3B78] mt-0.5">5 kg / 10 kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Story & Purchase Actions */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1D6FD8]">
              <span>Featured Harvest</span>
              <span aria-hidden="true" className="text-[#94A3B8]">·</span>
              <span>Groceries / Rice</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#0B3B78] leading-tight text-balance">
              Quality Rice for Every Kitchen.
            </h2>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Every grain tells a story of golden harvests, patient 24-month
              aging, and natural aroma. From everyday steamed Ponni and Sona
              Masoori to celebratory Basmati biryanis, delivered fresh in
              breathable woven jute sacks.
            </p>

            {displayProduct.rating > 0 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#132238]">
                <Star className="w-4 h-4 text-[#FF6B1A] fill-current" />
                <span className="font-mono-tabular">{displayProduct.rating.toFixed(1)}</span>
                {displayProduct.reviewCount > 0 && !displayProduct.isDemoRating && (
                  <span className="text-[#64748B]">
                    ({displayProduct.reviewCount} verified reviews)
                  </span>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-mono-tabular text-3xl font-bold text-[#0B3B78]">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {displayProduct.discountPercent > 0 && (
                <>
                  <span className="font-mono-tabular text-sm text-[#94A3B8] line-through">
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
                    <span>Add 5 kg Sack</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/rice')}
                className="px-6 py-3 sm:py-3.5 rounded-xl bg-[#F0F6FF] hover:bg-[#0B3B78] text-[#0B3B78] hover:text-white border border-[#DCE6F2] text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Shop Rice Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
