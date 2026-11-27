import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Flame,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from '../components/ResilientImage';
import type { Product } from '../types';

const TEMPLE_ITEM_ORDER = [
  'prod-templekit-basket',
  'prod-templekit-kungumam',
  'prod-templekit-panner',
  'prod-templekit-pathi',
  'prod-templekit-santhanam',
  'prod-templekit-sudam',
  'prod-templekit-theruneeer',
  'prod-templekit-thiri',
  'prod-templekit-thurtham',
  'prod-templekit-vilaku-oil',
  'prod-templekit-vilaku',
];

function getDisplayLabel(product: Product): string {
  switch (product.id) {
    case 'prod-templekit-basket':
      return 'Pooja Basket';
    case 'prod-templekit-kungumam':
      return 'Kumkum';
    case 'prod-templekit-panner':
      return 'Rose Water';
    case 'prod-templekit-pathi':
      return 'Incense Sticks';
    case 'prod-templekit-santhanam':
      return 'Sandalwood Paste';
    case 'prod-templekit-sudam':
      return 'Camphor';
    case 'prod-templekit-theruneeer':
      return 'Sacred Ash';
    case 'prod-templekit-thiri':
      return 'Cotton Lamp Wicks';
    case 'prod-templekit-thurtham':
      return 'Thurtham Powder';
    case 'prod-templekit-vilaku-oil':
      return 'Lamp Oil';
    case 'prod-templekit-vilaku':
      return 'Clay Oil Lamp';
    default:
      return product.name;
  }
}

function getSafetyNote(product: Product): {
  tone: 'fire' | 'warning' | 'ritual';
  text: string;
} | null {
  switch (product.id) {
    case 'prod-templekit-sudam':
    case 'prod-templekit-pathi':
      return {
        tone: 'fire',
        text: 'Flammable — burn safely on a heatproof holder; never leave unattended.',
      };
    case 'prod-templekit-vilaku':
    case 'prod-templekit-thiri':
      return {
        tone: 'fire',
        text: 'Open flame care — keep away from drafts, fabrics & children.',
      };
    case 'prod-templekit-vilaku-oil':
      return {
        tone: 'warning',
        text: 'Lamp lighting oil only — NOT edible cooking oil.',
      };
    case 'prod-templekit-thurtham':
    case 'prod-templekit-kungumam':
    case 'prod-templekit-santhanam':
    case 'prod-templekit-theruneeer':
    case 'prod-templekit-panner':
      return {
        tone: 'ritual',
        text: 'For external ritual use only — not food or medicine.',
      };
    default:
      return null;
  }
}

function TempleEssentialCard({ product }: { product: Product }) {
  const { navigate, addToCart, wishlist, toggleWishlist } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [addedPulse, setAddedPulse] = useState(false);

  const isSaved = wishlist.includes(product.id);
  const displayName = getDisplayLabel(product);

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
  const safetyNote = getSafetyNote(product);

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
      className="group h-full cursor-pointer rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#D97706] shadow-[0_4px_20px_-8px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_38px_-14px_rgba(11,59,120,0.16)] transition-all duration-300 ease-out hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
    >
      {/* Large, Consistent Product Image Frame */}
      <div className="p-3 sm:p-4 pb-0 bg-white">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#090C12] flex items-center justify-center p-4">
          <ResilientImage
            src={product.images[0]}
            fallbackSrc="/images/temple-kit/basket.png"
            alt={displayName}
            className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />

          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-[#FF6B1A] text-white text-[10px] font-bold tracking-tight shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-colors cursor-pointer ${
              isSaved
                ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white'
                : 'bg-white border-[#E2E8F0] text-[#0B3B78] hover:text-[#FF6B1A] hover:border-[#FF6B1A]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Details & Shopping Actions */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#64748B]">
            <span className="font-semibold text-[#B45309] truncate">
              Temple &amp; Pooja Essentials
            </span>
            {product.reviewCount > 0 && !product.isDemoRating && (
              <span className="font-mono-tabular text-[#0B3B78] font-semibold shrink-0">
                {product.rating.toFixed(1)}★ ({product.reviewCount})
              </span>
            )}
          </div>

          <h2 className="font-display text-base sm:text-lg font-bold text-[#0B3B78] group-hover:text-[#B45309] transition-colors leading-snug">
            {displayName}
          </h2>

          <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {safetyNote && (
            <p
              className={`text-[11px] leading-snug flex items-start gap-1.5 pt-0.5 ${
                safetyNote.tone === 'fire' || safetyNote.tone === 'warning'
                  ? 'text-[#B45309] font-medium'
                  : 'text-[#64748B]'
              }`}
            >
              {safetyNote.tone === 'fire' ? (
                <Flame className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0 mt-0.5" />
              ) : safetyNote.tone === 'warning' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
              ) : null}
              <span>{safetyNote.text}</span>
            </p>
          )}

          {product.variants.length > 0 && (
            <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
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
                        ? 'bg-[#FFFBEB] border-[#D97706] text-[#92400E]'
                        : 'bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D97706]'
                    }`}
                  >
                    {variantText}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#F1F5F9] space-y-3">
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
              className="px-3 py-2 rounded-xl border border-[#DCE6F2] bg-white hover:bg-[#F8FAFC] hover:border-[#0B3B78] text-xs font-semibold text-[#0B3B78] transition-colors cursor-pointer min-h-[40px] whitespace-nowrap text-center"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TempleKitPage() {
  const { products, navigate } = useStore();

  useEffect(() => {
    document.title = 'Temple & Pooja Essentials | KubreeBazzar';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore traditional essentials for your daily pooja and special occasions at KubreeBazzar.'
      );
    }
  }, []);

  const templeProducts = useMemo(() => {
    const items = products.filter(
      (p) =>
        p.enabled !== false &&
        !p.isBundle &&
        p.id !== 'prod-templekit-bundle' &&
        (TEMPLE_ITEM_ORDER.includes(p.id) ||
          p.id.startsWith('prod-templekit-') ||
          (p.subcategory || '').toLowerCase() === 'temple kit')
    );
    return [...items].sort((a, b) => {
      const idxA = TEMPLE_ITEM_ORDER.indexOf(a.id);
      const idxB = TEMPLE_ITEM_ORDER.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [products]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-10">
        {/* Clean Single-Level Breadcrumb */}
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
            <li className="font-semibold text-[#0B3B78]">
              Temple &amp; Pooja Essentials
            </li>
          </ol>
        </nav>

        {/* Simple, Focused Header */}
        <header className="border-b border-[#E2E8F0] pb-5 sm:pb-6 space-y-2">
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0B3B78] tracking-tight">
            Temple &amp; Pooja Essentials
          </h1>
          <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
            Explore traditional essentials for your daily pooja and special
            occasions.
          </p>
        </header>

        {/* Clean Responsive Product Grid displaying the 11 uploaded products */}
        <section aria-label="Temple and Pooja Essentials Products">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templeProducts.map((product) => (
              <TempleEssentialCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
