import React, { useMemo, useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Box, Check } from 'lucide-react';
import type { Product } from '../types';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';
import {
  getCategoryDisplayName,
  getSubcategoryDisplayName,
} from '../data/categoryHierarchy';
import {
  resolveCategoryFallbackImage,
  resolveProductGlb,
} from '../three/resolveProductGlb';
import { FashionProductCard } from './FashionProductCard';
import { isFashionClothingProduct } from '../utils/fashionUtils';

interface ProductCardProps {
  product: Product;
  compactMobile?: boolean;
}

export function ProductCard({
  product,
  compactMobile = false,
}: ProductCardProps) {
  if (isFashionClothingProduct(product)) {
    return <FashionProductCard product={product} />;
  }

  const {
    navigate,
    addToCart,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    categories,
  } = useStore();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovered: false });
  const [addedPulse, setAddedPulse] = useState(false);

  const isSaved = wishlist.includes(product.id);

  const activeVariant = useMemo(
    () =>
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0],
    [product.variants, selectedVariantId]
  );

  const finalPrice = getEffectivePrice(product, activeVariant?.id);
  const hasPrice = finalPrice > 0;
  const hasDiscount = hasPrice && product.discountPercent > 0;
  const baseWithDelta = Math.max(
    0,
    product.price + (activeVariant?.priceDelta || 0)
  );
  const strikePrice =
    product.originalPrice && product.originalPrice > finalPrice
      ? product.originalPrice
      : baseWithDelta;

  const variantStock =
    activeVariant !== undefined ? activeVariant.stock : product.stock;
  const inStock = product.stock > 0 && variantStock > 0;
  const canPurchase = hasPrice && inStock;
  const activeImgSrc = product.images[0] || '';
  const isDarkStudioMasalaJpg =
    activeImgSrc.endsWith('sambar-powder.jpg') ||
    activeImgSrc.endsWith('rasam-powder.jpg') ||
    activeImgSrc.endsWith('biryani-masala.jpg') ||
    activeImgSrc.endsWith('chicken-masala.jpg') ||
    activeImgSrc.endsWith('mutton-masala.jpg') ||
    activeImgSrc.endsWith('fish-curry-masala.jpg') ||
    activeImgSrc.endsWith('curry-masala.jpg');
  const isMilletOrCerealProduct =
    activeImgSrc.includes('/images/millets/') ||
    activeImgSrc.includes('/images/cereals/') ||
    (product.subcategory || '').toLowerCase() === 'millets' ||
    (product.subcategory || '').toLowerCase() === 'cereals';
  const isHoneyProduct =
    activeImgSrc.includes('/images/honey/') ||
    product.id.startsWith('prod-honey-') ||
    product.id === 'prod-groc-honey';
  const isReadyToCookProduct =
    activeImgSrc.includes('/images/ready-to-cook/') ||
    (product.subcategory || '').toLowerCase() === 'ready-to-cook foods' ||
    product.id.startsWith('prod-rtc-') ||
    product.id === 'prod-groc-ready-1';
  const isCleanContainProduct =
    isMilletOrCerealProduct || isHoneyProduct || isReadyToCookProduct;
  const isDarkStudioCutout =
    !isCleanContainProduct &&
    (activeImgSrc.includes('/baby-kit/') ||
      activeImgSrc.includes('/temple-kit/') ||
      activeImgSrc.includes('/school-kit/') ||
      isDarkStudioMasalaJpg ||
      (activeImgSrc.endsWith('.png') &&
        !activeImgSrc.endsWith('lavangam.png') &&
        !activeImgSrc.endsWith('watches.png')));
  const isBabyKitStudio =
    isDarkStudioCutout ||
    (!activeImgSrc.endsWith('.webp') &&
      (product.category.toLowerCase() === 'baby kit' ||
        (product.subcategory || '').toLowerCase() === 'baby kit' ||
        (product.subcategory || '').toLowerCase() === 'temple kit' ||
        (product.subcategory || '').toLowerCase() === 'school kit'));

  const isUsedVehicle =
    product.category.toLowerCase().includes('used') ||
    product.category.toLowerCase().includes('bike');
  const displayCategory = getCategoryDisplayName(product.category, categories);
  const displaySubcategory = getSubcategoryDisplayName(product.subcategory);
  const glbUrl = useMemo(() => resolveProductGlb(product), [product]);
  const fallbackImg = useMemo(
    () =>
      isUsedVehicle ? undefined : resolveCategoryFallbackImage(product.category),
    [product.category, isUsedVehicle]
  );

  const showRealReviews = product.reviewCount > 0 && !product.isDemoRating;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
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
    setTilt({ rx: -y * 4.5, ry: x * 4.5, hovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, hovered: false });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canPurchase) return;
    const added = addToCart(product, activeVariant?.id, 1);
    if (!added) return;
    setAddedPulse(true);
    window.setTimeout(() => setAddedPulse(false), 900);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(glbUrl ? { ...product, glbUrl } : product);
  };

  const visibleVariants = product.variants.slice(0, 5);
  const extraVariantsCount = Math.max(0, product.variants.length - 5);

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${
          tilt.hovered ? '-6px' : '0px'
        })`,
        transformStyle: 'preserve-3d',
        transition:
          'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms ease, border-color 220ms ease',
      }}
      className="group h-full cursor-pointer rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#1D6FD8] shadow-[0_4px_16px_-6px_rgba(11,59,120,0.08)] hover:shadow-[0_20px_38px_-14px_rgba(11,59,120,0.18)] overflow-hidden flex flex-col justify-between"
    >
      {/* TOP: High-Resolution Product Photography + Offers & Wishlist */}
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden border-b border-[#EEF4FB] ${
          isBabyKitStudio
            ? 'bg-[#090C12] p-2.5'
            : isCleanContainProduct
              ? 'bg-[#F8FAFC] p-2.5'
              : 'bg-[#F8FAFC] p-2 sm:p-0'
        }`}
      >
        <div
          style={{
            transform: tilt.hovered
              ? 'translateZ(16px) scale(1.045)'
              : 'translateZ(0px) scale(1)',
            transition: 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <ResilientImage
            src={product.images[0]}
            fallbackSrc={fallbackImg}
            emptyLabel={
              isUsedVehicle
                ? 'Verified Vehicle Photo Needed · Image Pending'
                : undefined
            }
            alt={product.name}
            className={`w-full h-full ${
              isBabyKitStudio || isCleanContainProduct
                ? 'object-contain'
                : 'object-contain sm:object-cover'
            }`}
          />
        </div>

        {/* Offer & Optional New Arrival Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col items-start gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#FF6B1A] text-white text-[10px] sm:text-[11px] font-bold tracking-tight shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.newArrival && (
            <span className="px-2 py-0.5 rounded-md bg-[#0B3B78] text-white text-[10px] font-bold tracking-wide">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border shadow-xs transition-colors cursor-pointer ${
            isSaved
              ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white'
              : 'bg-white border-[#DCE6F2] text-[#0B3B78] hover:text-[#FF6B1A] hover:border-[#FF6B1A]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions (3D badge visible on mobile touch; hover Quick View on desktop) */}
        <div
          className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10 flex items-center gap-1.5 transition-all duration-200 ${
            tilt.hovered
              ? 'opacity-100 translate-y-0'
              : 'lg:opacity-0 lg:translate-y-1.5 lg:pointer-events-none lg:group-focus-within:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:pointer-events-auto'
          }`}
        >
          {glbUrl && (
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`View ${product.name} in 3D`}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#0B3B78] hover:bg-[#1D6FD8] text-white text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Box className="w-3 h-3 text-[#FF6B1A]" />
              <span>3D</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F0F6FF] border border-[#DCE6F2] text-[#0B3B78] text-[11px] font-bold items-center gap-1 shadow-sm cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* MIDDLE: Category, Title, Description, Rating & Variants */}
      <div
        className={`flex-1 flex flex-col justify-between ${
          compactMobile
            ? 'p-2.5 sm:p-5 gap-2 sm:gap-3.5'
            : 'p-4 sm:p-5 gap-3 sm:gap-3.5'
        }`}
      >
        <div className={compactMobile ? 'space-y-1.5 sm:space-y-2' : 'space-y-2'}>
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#64748B]">
            <span className="font-semibold text-[#1D6FD8] truncate">
              {displayCategory}
              {displaySubcategory ? ` · ${displaySubcategory}` : ''}
            </span>
            {product.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[#132238] font-semibold shrink-0">
                <Star className="w-3 h-3 text-[#FF6B1A] fill-current" />
                <span className="font-mono-tabular">{product.rating.toFixed(1)}</span>
                {showRealReviews && (
                  <span className="hidden sm:inline text-[#64748B] font-normal">
                    ({product.reviewCount})
                  </span>
                )}
              </span>
            )}
          </div>

          <h3
            className={`font-display font-bold text-[#0B3B78] group-hover:text-[#1D6FD8] transition-colors line-clamp-2 leading-snug ${
              product.tamilName ? '' : 'min-h-[2.5em]'
            } ${
              compactMobile
                ? 'text-xs sm:text-base lg:text-[17px]'
                : 'text-base lg:text-[17px]'
            }`}
          >
            {product.name}
          </h3>
          {product.tamilName && (
            <p className="text-xs font-semibold text-[#1D6FD8] leading-snug">
              {product.tamilName}
            </p>
          )}

          <p
            className={`text-[#475569] line-clamp-2 leading-relaxed ${
              compactMobile ? 'hidden sm:block text-xs' : 'text-xs'
            }`}
          >
            {product.shortDescription}
          </p>

          {/* Interactive Product Variants Selector */}
          {visibleVariants.length > 0 && (
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              {visibleVariants.map((variant) => {
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
                    className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold border transition-colors cursor-pointer inline-flex items-center gap-1 max-w-[110px] truncate ${
                      isSelected
                        ? 'bg-[#F0F6FF] border-[#1D6FD8] text-[#0B3B78]'
                        : 'bg-white border-[#DCE6F2] text-[#475569] hover:border-[#1D6FD8]'
                    }`}
                  >
                    {variant.colorHex && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0 border border-black/15"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                    )}
                    <span className="truncate">{variantText}</span>
                  </button>
                );
              })}
              {extraVariantsCount > 0 && (
                <span className="text-[10px] font-medium text-[#64748B]">
                  +{extraVariantsCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM: Selling Price, Strikethrough Price, Quick View & Add to Cart */}
        <div
          className={`pt-2 sm:pt-3 border-t border-[#EEF4FB] flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${
            compactMobile ? 'gap-2 sm:gap-2' : 'gap-2.5 sm:gap-2'
          }`}
        >
          <div className="flex flex-col min-w-0">
            {hasPrice ? (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span
                  className={`font-mono-tabular font-bold text-[#0B3B78] ${
                    compactMobile ? 'text-sm sm:text-lg' : 'text-base sm:text-lg'
                  }`}
                >
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="font-mono-tabular text-[10px] sm:text-xs text-[#94A3B8] line-through">
                    ₹{strikePrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[11px] sm:text-xs font-semibold text-[#64748B]">
                Price Pending
              </span>
            )}
            <span className="text-[10px] font-medium text-[#64748B] truncate">
              {inStock
                ? `In Stock · ${variantStock} available`
                : hasPrice
                  ? 'Out of Stock'
                  : 'Price & stock pending'}
            </span>
          </div>

          <div
            className={`flex items-center w-full sm:w-auto sm:shrink-0 ${
              compactMobile ? 'gap-1.5 sm:gap-2' : 'gap-2'
            }`}
          >
            <button
              type="button"
              onClick={handleQuickView}
              aria-label={`Quick view ${product.name}`}
              className={`rounded-xl border border-[#DCE6F2] bg-[#F8FAFC] hover:bg-[#F0F6FF] hover:border-[#1D6FD8] text-[#0B3B78] flex items-center justify-center transition-colors cursor-pointer sm:hidden shrink-0 ${
                compactMobile ? 'w-8 h-9' : 'w-10 h-10'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={!canPurchase}
              onClick={handleQuickAdd}
              className={`flex-1 sm:flex-initial min-w-0 justify-center rounded-xl font-bold inline-flex items-center transition-all whitespace-nowrap cursor-pointer ${
                compactMobile
                  ? 'px-2 py-2 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs gap-1 sm:gap-1.5 min-h-[36px] sm:min-h-[38px]'
                  : 'px-3 py-2.5 sm:px-3.5 sm:py-2 text-xs gap-1.5 shrink-0 min-h-[40px] sm:min-h-[38px]'
              } ${
                !canPurchase
                  ? 'bg-[#E2E8F0] text-[#64748B] cursor-not-allowed'
                  : addedPulse
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#FF6B1A] hover:bg-[#E5580D] text-white shadow-xs'
              }`}
            >
              {addedPulse ? (
                <>
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {canPurchase
                      ? 'Add to Cart'
                      : hasPrice
                        ? 'Sold Out'
                        : 'Configure'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
