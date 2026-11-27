import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Check,
  Heart,
  Package,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from '../components/ResilientImage';
import type { Product } from '../types';

gsap.registerPlugin(ScrollTrigger);

const HERO_PREVIEW_TILES = [
  {
    src: '/images/baby-kit/baby shampoo.png',
    label: 'Baby Shampoo',
    floatClass: 'babykit-float-a',
  },
  {
    src: '/images/baby-kit/baby powder.png',
    label: 'Baby Powder',
    floatClass: 'babykit-float-b',
  },
  {
    src: '/images/baby-kit/baby soap.png',
    label: 'Baby Soap',
    floatClass: 'babykit-float-c',
  },
  {
    src: '/images/baby-kit/baby oil.png',
    label: 'Baby Oil',
    floatClass: 'babykit-float-b',
  },
  {
    src: '/images/baby-kit/thirusti kaairu.png',
    label: 'Drishti Kayiru',
    floatClass: 'babykit-float-a',
  },
  {
    src: '/images/baby-kit/valayal.png',
    label: 'Baby Bangles',
    floatClass: 'babykit-float-c',
  },
];

function classifyBabyKitGroup(product: Product): string {
  const itemType =
    product.specs
      .find((s) => s.label.toLowerCase() === 'item type')
      ?.value.toLowerCase() || '';
  if (itemType.includes('traditional')) return 'Traditional';
  if (itemType.includes('accessory')) return 'Accessories';
  return 'Daily Care';
}

function BabyKitProductCard({ product }: { product: Product }) {
  const { navigate, addToCart, wishlist, toggleWishlist } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [addedPulse, setAddedPulse] = useState(false);

  const isSaved = wishlist.includes(product.id);

  const activeVariant = useMemo(
    () =>
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0],
    [product.variants, selectedVariantId]
  );

  const effectivePrice = getEffectivePrice(product, activeVariant?.id);
  const hasPrice = effectivePrice > 0;
  const hasDiscount = hasPrice && product.discountPercent > 0;
  const baseWithDelta = Math.max(
    0,
    product.price + (activeVariant?.priceDelta || 0)
  );
  const strikePrice =
    product.originalPrice && product.originalPrice > effectivePrice
      ? product.originalPrice
      : baseWithDelta;

  const variantStock =
    activeVariant !== undefined ? activeVariant.stock : product.stock;
  const inStock = product.stock > 0 && variantStock > 0;
  const canPurchase = hasPrice && inStock;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canPurchase) return;
    if (!addToCart(product, activeVariant?.id, 1)) return;
    setAddedPulse(true);
    window.setTimeout(() => setAddedPulse(false), 950);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      className="babykit-stagger-card group h-full cursor-pointer rounded-2xl bg-white border border-[#FBCFE8]/80 hover:border-[#1D6FD8] shadow-[0_6px_22px_-10px_rgba(11,59,120,0.12)] hover:shadow-[0_18px_36px_-12px_rgba(11,59,120,0.2)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
    >
      {/* Studio Image Window (Preserves dark backdrop & full product labels) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#090C12] p-3 flex items-center justify-center border-b border-[#FCE7F3]">
        <ResilientImage
          src={product.images[0]}
          fallbackSrc="/images/baby-kit/baby powder.png"
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />

        {/* Badges (Strictly real/configured only) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-md bg-[#FF6B1A] text-white text-[10px] font-bold tracking-tight shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-white/90 text-[#0B3B78] text-[10px] font-semibold backdrop-blur-xs">
            {classifyBabyKitGroup(product)}
          </span>
        </div>

        {/* Wishlist Toggle */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs transition-colors cursor-pointer ${
            isSaved
              ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white'
              : 'bg-white/95 border-[#FBCFE8] text-[#0B3B78] hover:text-[#FF6B1A] hover:border-[#FF6B1A]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 bg-gradient-to-b from-white to-[#FFFDF9]">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-semibold text-[#1D6FD8]">
              Baby Kit
            </span>
            {product.reviewCount > 0 && !product.isDemoRating && (
              <span className="font-mono-tabular text-[#0B3B78] font-semibold">
                {product.rating.toFixed(1)}★ ({product.reviewCount})
              </span>
            )}
          </div>

          <h3 className="font-display text-base font-bold text-[#0B3B78] group-hover:text-[#1D6FD8] transition-colors line-clamp-2 leading-snug min-h-[2.4em]">
            {product.name}
          </h3>

          <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Optional Configured Pack Size / Variants */}
          {product.variants.length > 0 && (
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              {product.variants.slice(0, 4).map((variant) => {
                const isSelected = variant.id === activeVariant?.id;
                const variantText = variant.label || variant.name;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariantId(variant.id);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0F6FF] border-[#1D6FD8] text-[#0B3B78]'
                        : 'bg-white border-[#DCE6F2] text-[#475569] hover:border-[#1D6FD8]'
                    }`}
                  >
                    {variantText}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Price, Stock & Actions */}
        <div className="pt-3 border-t border-[#FCE7F3] space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              {hasPrice ? (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-mono-tabular text-base sm:text-lg font-bold text-[#0B3B78]">
                    ₹{effectivePrice.toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <span className="font-mono-tabular text-xs text-[#94A3B8] line-through">
                      ₹{strikePrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-semibold text-[#64748B]">
                  Price to be configured
                </span>
              )}
              <p className="text-[10px] font-medium text-[#64748B] mt-0.5">
                {inStock
                  ? `In Stock · ${variantStock} available`
                  : hasPrice
                    ? 'Out of Stock'
                    : 'Stock & price set by Admin'}
              </p>
            </div>
          </div>

          <div className="flex flex-col min-[360px]:flex-row items-stretch min-[360px]:items-center gap-2">
            <button
              type="button"
              disabled={!canPurchase}
              onClick={handleAdd}
              className={`flex-1 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[42px] sm:min-h-[40px] whitespace-nowrap ${
                !canPurchase
                  ? 'bg-[#F1F5F9] text-[#64748B] cursor-not-allowed'
                  : addedPulse
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#FF6B1A] hover:bg-[#E5580D] text-white shadow-xs'
              }`}
            >
              {addedPulse ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>
                    {canPurchase
                      ? 'Add to Cart'
                      : hasPrice
                        ? 'Out of Stock'
                        : 'Price Pending'}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.slug}`);
              }}
              className="px-3 py-2 rounded-xl border border-[#DCE6F2] bg-white hover:bg-[#F0F6FF] text-xs font-semibold text-[#0B3B78] transition-colors cursor-pointer min-h-[40px] whitespace-nowrap text-center"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function BabyKitPage() {
  const { products, navigate, addToCart } = useStore();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [bundleAddedPulse, setBundleAddedPulse] = useState(false);

  useEffect(() => {
    document.title = 'Baby Kit Collection | KubreeBazzar';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore everyday baby care products, useful accessories and traditional essentials in one convenient Baby Kit collection at KubreeBazzar.'
      );
    }
  }, []);

  const babyKitItems = useMemo(() => {
    return products.filter(
      (p) =>
        p.enabled !== false &&
        !p.isBundle &&
        p.id !== 'prod-baby-1' &&
        p.id !== 'prod-baby-2' &&
        (p.category.toLowerCase() === 'baby kit' ||
          (p.subcategory || '').toLowerCase() === 'baby kit' ||
          p.id.startsWith('prod-babykit-'))
    );
  }, [products]);

  const bundleProduct = useMemo(() => {
    return products.find(
      (p) =>
        p.enabled !== false &&
        (p.id === 'prod-babykit-bundle' ||
          (p.isBundle &&
            (p.category.toLowerCase() === 'baby kit' ||
              (p.subcategory || '').toLowerCase() === 'baby kit')))
    );
  }, [products]);


  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.babykit-hero-item', {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
      });

      gsap.to('.babykit-float-a', {
        y: -8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.babykit-float-b', {
        y: 8,
        duration: 3.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.babykit-float-c', {
        y: -6,
        duration: 3.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const cards = root.querySelectorAll('.babykit-stagger-card');
      if (cards.length > 0) {
        gsap.from(cards, {
          y: 20,
          opacity: 0,
          duration: 0.48,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '#baby-kit-grid',
            start: 'top 88%',
            once: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [babyKitItems.length]);

  const enabledBundleItems = useMemo(() => {
    if (!bundleProduct?.bundleItems) return [];
    return bundleProduct.bundleItems.filter((item) => item.enabled !== false);
  }, [bundleProduct]);

  const bundlePrice = bundleProduct ? getEffectivePrice(bundleProduct) : 0;
  const bundleHasPrice = bundlePrice > 0;
  const bundleHasDiscount =
    bundleHasPrice && (bundleProduct?.discountPercent || 0) > 0;
  const bundleInStock = Boolean(bundleProduct && bundleProduct.stock > 0);
  const canAddBundle = Boolean(bundleProduct && bundleHasPrice && bundleInStock);

  const handleAddCompleteKit = () => {
    if (!bundleProduct || !canAddBundle) return;
    addToCart(bundleProduct, bundleProduct.variants[0]?.id, 1);
    setBundleAddedPulse(true);
    window.setTimeout(() => setBundleAddedPulse(false), 1100);
  };

  return (
    <div
      ref={pageRef}
      className="bg-gradient-to-b from-[#FFF5F9] via-[#FFFDF7] to-[#F8FAFC] min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#64748B]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="hover:text-[#0B3B78] hover:underline cursor-pointer"
              >
                Home
              </button>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-[#0B3B78]">Baby Kit</li>
          </ol>
        </nav>

        {/* Baby Kit Collection Hero */}
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF1F6] via-[#FFFDF7] to-[#EFF6FF] border border-[#FBCFE8] p-4 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center shadow-[0_14px_40px_-20px_rgba(11,59,120,0.16)]">
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="babykit-hero-item inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#FBCFE8] text-[#0B3B78] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>Baby Kit Collection</span>
            </div>

            <h1 className="babykit-hero-item font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3B78] leading-[1.12] tracking-tight">
              Everything Your Little One Needs.
            </h1>

            <p className="babykit-hero-item text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl">
              Explore everyday baby care products, useful accessories and
              traditional essentials in one convenient collection.
            </p>

            <div className="babykit-hero-item pt-1 flex flex-col min-[420px]:flex-row flex-wrap items-stretch min-[420px]:items-center gap-3">
              <a
                href="#baby-kit-grid"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('baby-kit-grid')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 min-h-[44px] rounded-xl bg-[#0B3B78] hover:bg-[#1D6FD8] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Browse All {babyKitItems.length} Essentials</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {bundleProduct && (
                <a
                  href="#complete-baby-kit-bundle"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById('complete-baby-kit-bundle')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 min-h-[44px] rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Complete Baby Essentials Kit</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: Coordinated Floating Product Preview Tiles */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-2 sm:gap-4">
            {HERO_PREVIEW_TILES.map((tile) => (
              <div
                key={tile.label}
                className={`${tile.floatClass} rounded-2xl bg-[#090C12] border border-[#FBCFE8]/60 p-2.5 sm:p-3 shadow-md flex flex-col items-center justify-between aspect-square`}
              >
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                  <ResilientImage
                    src={tile.src}
                    alt={tile.label}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="mt-1.5 text-[10px] sm:text-[11px] font-semibold text-white/90 text-center truncate w-full">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Individual Baby Kit Essentials Grid */}
        <section id="baby-kit-grid" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B3B78]">
              Individual Baby Kit Essentials
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Select individual items or explore the complete bundle kit below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {babyKitItems.map((product) => (
              <BabyKitProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Complete Baby Essentials Kit Bundle Section */}
        {bundleProduct && (
          <section
            id="complete-baby-kit-bundle"
            className="scroll-mt-24 rounded-2xl sm:rounded-3xl bg-white border-2 border-[#FBCFE8] p-4 sm:p-10 shadow-[0_16px_44px_-20px_rgba(11,59,120,0.18)] space-y-6 sm:space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Bundle Main Studio Image */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#090C12] border border-[#FBCFE8] p-5 flex items-center justify-center overflow-hidden">
                  <ResilientImage
                    src={bundleProduct.images[0]}
                    fallbackSrc="/images/baby-kit/baby powder.png"
                    alt={bundleProduct.name}
                    className="w-full h-full object-contain"
                  />
                  {bundleHasDiscount && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#FF6B1A] text-white text-xs font-bold shadow-xs">
                      {bundleProduct.discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Bundle Summary & Action */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1F6] border border-[#FBCFE8] text-[#0B3B78] text-xs font-bold">
                  <Package className="w-3.5 h-3.5 text-[#FF6B1A]" />
                  <span>Complete Bundle Option · {enabledBundleItems.length} Included Items</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B3B78]">
                  {bundleProduct.name}
                </h2>

                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  {bundleProduct.description}
                </p>

                {/* Price & Stock */}
                <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#FBCFE8] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                      Kit Price
                    </p>
                    {bundleHasPrice ? (
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-mono-tabular text-2xl font-extrabold text-[#0B3B78]">
                          ₹{bundlePrice.toLocaleString('en-IN')}
                        </span>
                        {bundleHasDiscount &&
                          bundleProduct.originalPrice &&
                          bundleProduct.originalPrice > bundlePrice && (
                            <span className="font-mono-tabular text-sm text-[#94A3B8] line-through">
                              ₹{bundleProduct.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-[#0B3B78] mt-0.5">
                        Price to be configured in Admin Dashboard
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                      Availability
                    </p>
                    <p className="text-xs font-bold text-[#0B3B78] mt-1">
                      {bundleInStock
                        ? `In Stock · ${bundleProduct.stock} kits ready`
                        : bundleHasPrice
                          ? 'Currently Out of Stock'
                          : 'Pending Admin Setup'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    disabled={!canAddBundle}
                    onClick={handleAddCompleteKit}
                    className={`w-full sm:w-auto px-6 py-3.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      !canAddBundle
                        ? 'bg-[#E2E8F0] text-[#64748B] cursor-not-allowed'
                        : bundleAddedPulse
                          ? 'bg-[#2E7D32] text-white'
                          : 'bg-[#FF6B1A] hover:bg-[#E5580D] text-white shadow-sm'
                    }`}
                  >
                    {bundleAddedPulse ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Complete Kit Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          {canAddBundle
                            ? 'Add Complete Kit to Cart'
                            : bundleHasPrice
                              ? 'Out of Stock'
                              : 'Kit Price Pending'}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/product/${bundleProduct.slug}`)}
                    className="w-full sm:w-auto px-5 py-3.5 min-h-[44px] rounded-xl border border-[#DCE6F2] bg-white hover:bg-[#F0F6FF] text-xs sm:text-sm font-bold text-[#0B3B78] transition-colors cursor-pointer text-center"
                  >
                    View Kit Details
                  </button>
                </div>
              </div>
            </div>

            {/* Included Items List */}
            <div className="pt-6 border-t border-[#FCE7F3] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-display text-lg font-bold text-[#0B3B78]">
                  Included in This Kit ({enabledBundleItems.length} Items)
                </h3>
                <span className="text-xs text-[#64748B]">
                  Click any item to inspect individual details
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {enabledBundleItems.map((item) => {
                  const matchedProd = products.find(
                    (p) => p.id === item.productId
                  );
                  return (
                    <button
                      key={item.productId}
                      type="button"
                      onClick={() =>
                        matchedProd && navigate(`/product/${matchedProd.slug}`)
                      }
                      className="rounded-xl bg-[#FFFDF9] border border-[#FBCFE8]/80 hover:border-[#1D6FD8] p-2.5 text-left transition-all hover:shadow-sm cursor-pointer flex flex-col gap-2"
                    >
                      <div className="aspect-square w-full rounded-lg bg-[#090C12] p-2 flex items-center justify-center overflow-hidden">
                        <ResilientImage
                          src={item.image}
                          fallbackSrc="/images/baby-kit/baby powder.png"
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-[#0B3B78] line-clamp-2 leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-mono-tabular font-semibold text-[#FF6B1A]">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
