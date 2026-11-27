import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Eye, Box, CheckCircle2, Star } from 'lucide-react';
import { UPLOADED_PRODUCT_IMAGES } from '../data/uploadedProducts';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';
import { resolveProductGlb } from '../three/resolveProductGlb';

export const HoneySpotlightSection: React.FC = () => {
  const { navigate, addToCart, products, setQuickViewProduct } = useStore();
  const honey = UPLOADED_PRODUCT_IMAGES.honey;
  const liveHoney = products.find(
    (p) =>
      p.id === 'prod-groc-honey' ||
      p.slug === 'wild-forest-honey' ||
      p.slug === 'nilgiri-raw-wild-forest-honey-jar'
  );
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovered: false });
  const [added, setAdded] = useState(false);

  const displayProduct = liveHoney || {
    id: 'prod-groc-honey',
    name: 'Wild Forest Honey',
    slug: 'wild-forest-honey',
    category: 'Groceries',
    subcategory: 'Health Foods',
    subSubcategory: 'Healthy Sweets',
    brand: 'Nilgiri Hive',
    price: honey.price,
    discountPercent: honey.discountPercent,
    images: ['/images/honey/wild-forest-honey.png'],
    shortDescription: 'Wild Forest Honey in a 500g glass jar with gold cap.',
    description:
      'Wild Forest Honey stocked in a 500g glass jar under Health Foods and Healthy Sweets.',
    rating: honey.rating,
    reviewCount: honey.reviewsCount,
    stock: 60,
    tags: ['Healthy Sweets', 'Honey', 'Wild Forest Honey'],
    modelType: 'honey' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: true,
    variants: [
      {
        id: 'var-500g',
        name: '500 g',
        label: '500 g',
        priceDelta: 0,
        stock: 60,
      },
    ],
    specs: [
      {
        label: 'Category',
        value: 'Groceries > Health Foods > Healthy Sweets',
      },
      { label: 'Product Name', value: 'Wild Forest Honey' },
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
      <div className="rounded-3xl bg-[#F0F6FF] border border-[#DCE6F2] shadow-[0_8px_30px_-12px_rgba(11,59,120,0.1)] p-4 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left: Story & Price */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1D6FD8]">
              <span>Groceries · Healthy Sweets</span>
              <span aria-hidden="true" className="text-[#94A3B8]">·</span>
              <span>Honey Collection</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#0B3B78] leading-tight text-balance">
              {displayProduct.name}
            </h2>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {displayProduct.description}
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

            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2.5 sm:gap-3 pt-1 text-xs">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#DCE6F2]">
                <p className="font-bold text-[#0B3B78]">Sealed Glass Jar</p>
                <p className="text-[#475569] text-[11px] mt-0.5">Packed in protective glass jars</p>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#DCE6F2]">
                <p className="font-bold text-[#0B3B78]">Pantry Staple</p>
                <p className="text-[#475569] text-[11px] mt-0.5">Available under Health Foods</p>
              </div>
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
                    <span>Add 500 g Honey Jar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/groceries/health-foods/healthy-sweets')}
                className="px-6 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-[#0B3B78] text-[#0B3B78] hover:text-white border border-[#DCE6F2] text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Shop Honey Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: 3D Tilted Honey Card */}
          <div className="lg:col-span-6 order-1 lg:order-2">
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
              className="group relative rounded-2xl bg-white border border-[#DCE6F2] p-3 sm:p-4 cursor-pointer shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F8FAFC] p-3 flex items-center justify-center">
                <div
                  style={{
                    transform: tilt.hovered
                      ? 'translateZ(14px) scale(1.045)'
                      : 'translateZ(0px) scale(1)',
                    transition: 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <ResilientImage
                    src={displayProduct.images[0]}
                    fallbackSrc="/images/honey/wild-forest-honey.png"
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
                    aria-label="Quick view honey product"
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F0F6FF] border border-[#DCE6F2] text-[#0B3B78] text-xs font-bold inline-flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
