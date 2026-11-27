import React, { useMemo, useState } from 'react';
import { Eye, Heart, ShoppingBag, Star, Check } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ResilientImage } from './ResilientImage';
import { resolveCategoryFallbackImage } from '../three/resolveProductGlb';
import {
  extractFashionColours,
  extractFashionFabric,
  extractFashionSizes,
  getFashionPricing,
  getRealProductRating,
  getVariantSize,
  resolveFashionVariant,
} from '../utils/fashionUtils';

interface FashionProductCardProps {
  product: Product;
}

export function FashionProductCard({ product }: FashionProductCardProps) {
  const {
    navigate,
    addToCart,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    reviews,
    showToast,
  } = useStore();

  const variants = useMemo(
    () => (Array.isArray(product.variants) ? product.variants : []),
    [product.variants]
  );

  const sizes = useMemo(() => extractFashionSizes(variants), [variants]);
  const colours = useMemo(() => extractFashionColours(variants), [variants]);

  const initialVariant = useMemo(
    () =>
      variants.find((v) => Number(v.stock || 0) > 0) ||
      variants[0] ||
      undefined,
    [variants]
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(() =>
    initialVariant ? getVariantSize(initialVariant) : sizes[0] || null
  );
  const [selectedColourKey, setSelectedColourKey] = useState<string | null>(
    () =>
      initialVariant?.colorHex
        ? initialVariant.colorHex.trim().toLowerCase()
        : colours[0]?.key || null
  );
  const [selectedGenericVariantId, setSelectedGenericVariantId] = useState<
    string | null
  >(() => initialVariant?.id || null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [addedPulse, setAddedPulse] = useState(false);

  const activeVariant = useMemo(() => {
    if (sizes.length === 0 && colours.length === 0 && selectedGenericVariantId) {
      return (
        variants.find((v) => v.id === selectedGenericVariantId) ||
        variants[0]
      );
    }
    return resolveFashionVariant(variants, selectedSize, selectedColourKey);
  }, [
    variants,
    sizes.length,
    colours.length,
    selectedGenericVariantId,
    selectedSize,
    selectedColourKey,
  ]);

  const pricing = useMemo(
    () => getFashionPricing(product, activeVariant),
    [product, activeVariant]
  );

  const realRating = useMemo(
    () => getRealProductRating(product, reviews),
    [product, reviews]
  );

  const fabric = useMemo(() => extractFashionFabric(product), [product]);
  const isUsedVehicle =
    product.category.toLowerCase().includes('used') ||
    product.category.toLowerCase().includes('bike');
  const fallbackImg = useMemo(
    () =>
      isUsedVehicle ? undefined : resolveCategoryFallbackImage(product.category),
    [product.category, isUsedVehicle]
  );

  const images = useMemo(
    () =>
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : fallbackImg
          ? [fallbackImg]
          : [],
    [product.images, fallbackImg]
  );

  const primaryImage =
    activeVariant?.image || images[galleryIdx] || images[0] || fallbackImg;
  const hoverSecondaryImage =
    !activeVariant?.image && images.length > 1 ? images[1] : null;

  const variantStock =
    activeVariant !== undefined ? Number(activeVariant.stock || 0) : product.stock;
  const inStock = Number(product.stock || 0) > 0 && variantStock > 0;
  const canPurchase = pricing.hasPrice && inStock;
  const isSaved = wishlist.includes(product.id);

  // Non-size / non-colour custom variant pills if variants exist without size/colourHex
  const showGenericVariants =
    sizes.length === 0 &&
    colours.length === 0 &&
    variants.length > 1;

  const handleColourClick = (e: React.MouseEvent, colourKey: string) => {
    e.stopPropagation();
    setSelectedColourKey(colourKey);
    // Keep current size if available for that colour, otherwise let resolveFashionVariant match best variant
    const match = resolveFashionVariant(variants, selectedSize, colourKey);
    if (match) {
      const mSize = getVariantSize(match);
      if (mSize) setSelectedSize(mSize);
    }
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sizes.length > 0 && !selectedSize) {
      showToast('Please select a size first');
      return;
    }
    if (colours.length > 0 && !selectedColourKey) {
      showToast('Please select a colour first');
      return;
    }
    if (!pricing.hasPrice) {
      showToast('Price is not yet configured for this item');
      return;
    }
    if (!inStock) {
      showToast('Selected variant is currently out of stock');
      return;
    }
    const added = addToCart(product, activeVariant?.id, 1);
    if (!added) return;
    setAddedPulse(true);
    window.setTimeout(() => setAddedPulse(false), 900);
  };

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group h-full cursor-pointer rounded-xl sm:rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1D6FD8] shadow-[0_2px_10px_-4px_rgba(11,59,120,0.06)] hover:shadow-[0_14px_30px_-10px_rgba(11,59,120,0.16)] transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between"
    >
      {/* TOP SECTION: Portrait Dress Showcase + Discount + Wishlist + Multi-Image Hover */}
      <div className="relative aspect-[4/5] w-full bg-[#F5F6F8] border-b border-[#EEF2F6] overflow-hidden p-1.5 sm:p-2">
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-lg">
          <ResilientImage
            src={primaryImage}
            fallbackSrc={fallbackImg}
            emptyLabel={
              isUsedVehicle
                ? 'Verified Vehicle Photo Needed · Image Pending'
                : undefined
            }
            alt={product.name}
            className={`w-full h-full object-contain transition-transform duration-300 ease-out ${
              hoverSecondaryImage
                ? 'group-hover:opacity-0 group-hover:scale-[1.03]'
                : 'group-hover:scale-[1.05]'
            }`}
          />
          {hoverSecondaryImage && (
            <ResilientImage
              src={hoverSecondaryImage}
              fallbackSrc={primaryImage}
              alt={`${product.name} alternate view`}
              className="hidden sm:block absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-300 ease-out pointer-events-none"
            />
          )}
        </div>

        {/* Discount Badge (only when real discount exists) */}
        {pricing.hasDiscount && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 px-2 py-0.5 rounded-md bg-[#FF6B1A] text-white text-[10px] sm:text-[11px] font-bold tracking-tight shadow-xs">
            {pricing.discountPercent}% off
          </span>
        )}

        {/* Top-Right Wishlist Heart (highlights cleanly on hover) */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border shadow-xs transition-all duration-300 cursor-pointer ${
            isSaved
              ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white'
              : 'bg-white/95 border-[#E2E8F0] text-[#0B3B78] group-hover:border-[#FF6B1A] group-hover:text-[#FF6B1A] group-hover:shadow-md'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Image Gallery Indicator (only when multiple images exist) */}
        {images.length > 1 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 left-2 z-10 flex items-center gap-1 px-1.5 py-1 rounded-full bg-white/90 border border-[#E2E8F0] shadow-xs"
            aria-label={`Product gallery (${images.length} images)`}
          >
            {images.slice(0, 4).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryIdx(idx);
                }}
                aria-label={`View image ${idx + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                  galleryIdx === idx ? 'bg-[#1D6FD8]' : 'bg-[#CBD5E1]'
                }`}
              />
            ))}
          </div>
        )}

        {/* Desktop Hover Quick View Pill Button */}
        <div className="hidden sm:flex absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 opacity-0 translate-y-1.5 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-[#F0F6FF] border border-[#DCE6F2] hover:border-[#1D6FD8] text-[#0B3B78] text-[11px] font-bold inline-flex items-center gap-1.5 shadow-md whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#1D6FD8]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* MIDDLE + BOTTOM SECTION: Amazon India-inspired Fashion Hierarchy with KubreeBazzar Palette */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between gap-2.5 sm:gap-3">
        <div className="space-y-1.5">
          {/* Brand Name (only when available) */}
          {product.brand && (
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#64748B] truncate">
              {product.brand}
            </p>
          )}

          {/* Product Title */}
          <h3 className="font-display text-xs sm:text-sm font-semibold text-[#132238] group-hover:text-[#1D6FD8] transition-colors line-clamp-2 leading-snug min-h-[2.6em]">
            {product.name}
          </h3>

          {/* Fabric / Material (only when configured in specs) */}
          {fabric && (
            <p className="text-[10px] sm:text-[11px] text-[#64748B] truncate">
              {fabric}
            </p>
          )}

          {/* Actual Customer Rating & Review Count (only shown when genuine reviews exist) */}
          {realRating.hasRating && (
            <div className="flex items-center gap-1 text-[11px]">
              <div className="flex items-center text-[#FF6B1A]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= Math.round(realRating.rating)
                        ? 'fill-current'
                        : 'text-[#CBD5E1]'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono-tabular font-semibold text-[#0B3B78]">
                {realRating.rating.toFixed(1)}
              </span>
              <span className="text-[#64748B] font-mono-tabular">
                ({realRating.reviewCount})
              </span>
            </div>
          )}

          {/* Amazon-inspired Pricing Hierarchy */}
          <div className="pt-0.5">
            {pricing.hasPrice ? (
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-mono-tabular text-base sm:text-lg font-extrabold text-[#132238]">
                    ₹{pricing.sellingPrice.toLocaleString('en-IN')}
                  </span>
                  {pricing.hasDiscount && (
                    <span className="text-[11px] font-bold text-[#FF6B1A]">
                      ({pricing.discountPercent}% off)
                    </span>
                  )}
                </div>
                {pricing.hasDiscount && pricing.mrp > pricing.sellingPrice && (
                  <p className="text-[10px] sm:text-[11px] text-[#64748B] font-mono-tabular">
                    M.R.P.:{' '}
                    <span className="line-through">
                      ₹{pricing.mrp.toLocaleString('en-IN')}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs font-semibold text-[#64748B]">
                Price Pending
              </p>
            )}
          </div>

          {/* Colour Swatches (only when actual colorHex variants exist) */}
          {colours.length > 0 && (
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              {colours.map((col) => {
                const isSelected = selectedColourKey === col.key;
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={(e) => handleColourClick(e, col.key)}
                    title={col.name}
                    aria-label={`Select colour ${col.name}`}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#1D6FD8] ring-offset-1 border-white'
                        : 'border-[#CBD5E1] hover:scale-110'
                    }`}
                    style={{ backgroundColor: col.colorHex }}
                  />
                );
              })}
            </div>
          )}

          {/* Size Selection Chips (only sizes configured on this product) */}
          {sizes.length > 0 && (
            <div className="pt-0.5 flex items-center gap-1 flex-wrap">
              {sizes.slice(0, 6).map((sz) => {
                const variantForSize = variants.find(
                  (v) =>
                    (getVariantSize(v) || '').toLowerCase() ===
                      sz.toLowerCase() &&
                    (!selectedColourKey ||
                      !v.colorHex ||
                      v.colorHex.trim().toLowerCase() === selectedColourKey)
                );
                const sizeOutOfStock =
                  variantForSize !== undefined &&
                  Number(variantForSize.stock || 0) <= 0;
                const isSelected =
                  selectedSize?.toLowerCase() === sz.toLowerCase();
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={(e) => handleSizeClick(e, sz)}
                    disabled={sizeOutOfStock}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                      sizeOutOfStock
                        ? 'border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] line-through cursor-not-allowed'
                        : isSelected
                          ? 'border-[#1D6FD8] bg-[#F0F6FF] text-[#0B3B78]'
                          : 'border-[#DCE6F2] bg-white text-[#475569] hover:border-[#1D6FD8]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          )}

          {/* Other Fashion Variant Options (if >1 non-size/non-colour variants exist) */}
          {showGenericVariants && (
            <div className="pt-0.5 flex items-center gap-1 flex-wrap">
              {variants.slice(0, 4).map((v) => {
                const isSelected = v.id === activeVariant?.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGenericVariantId(v.id);
                    }}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold border truncate max-w-[96px] ${
                      isSelected
                        ? 'border-[#1D6FD8] bg-[#F0F6FF] text-[#0B3B78]'
                        : 'border-[#DCE6F2] bg-white text-[#475569]'
                    }`}
                  >
                    {v.label || v.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Stock Availability */}
          <p
            className={`text-[10px] sm:text-[11px] font-semibold truncate ${
              !pricing.hasPrice
                ? 'text-[#64748B]'
                : !inStock
                  ? 'text-[#DC2626]'
                  : variantStock <= 5
                    ? 'text-[#FF6B1A]'
                    : 'text-[#2E7D32]'
            }`}
          >
            {!pricing.hasPrice
              ? 'Availability pending'
              : !inStock
                ? 'Out of Stock'
                : variantStock <= 5
                  ? `Only ${variantStock} left in stock`
                  : 'In Stock'}
          </p>
        </div>

        {/* BOTTOM SECTION: Add to Cart + Mobile/Secondary Quick View */}
        <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            disabled={!canPurchase}
            onClick={handleAddToCart}
            className={`flex-1 min-w-0 min-h-[36px] sm:min-h-[38px] px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold inline-flex items-center justify-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
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
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {canPurchase
                    ? 'Add to Cart'
                    : pricing.hasPrice
                      ? 'Out of Stock'
                      : 'Unavailable'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            title="Quick View"
            className="w-8 h-9 sm:w-[38px] sm:h-[38px] rounded-xl border border-[#DCE6F2] bg-[#F8FAFC] hover:bg-[#F0F6FF] hover:border-[#1D6FD8] text-[#0B3B78] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
