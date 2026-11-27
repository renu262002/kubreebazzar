import { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Box,
  Image as ImageIcon,
  Heart,
  Star,
  Plus,
  Minus,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { Product3DViewer } from './Product3DViewer';
import { ResilientImage } from './ResilientImage';
import {
  resolveCategoryFallbackImage,
  resolveProductGlb,
} from '../three/resolveProductGlb';
import {
  extractFashionColours,
  extractFashionFabric,
  extractFashionSizes,
  getFashionPricing,
  getRealProductRating,
  getVariantSize,
  isFashionClothingProduct,
  resolveFashionVariant,
} from '../utils/fashionUtils';

export function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    navigate,
    showToast,
  } = useStore();
  const [variantId, setVariantId] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColourKey, setSelectedColourKey] = useState<string | null>(
    null
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<'3d' | 'photo'>('photo');

  const resolvedGlb = useMemo(
    () => resolveProductGlb(quickViewProduct),
    [quickViewProduct]
  );
  const hasReal3D = Boolean(resolvedGlb);
  const isFashion = quickViewProduct
    ? isFashionClothingProduct(quickViewProduct)
    : false;

  const variants = useMemo(
    () =>
      quickViewProduct && Array.isArray(quickViewProduct.variants)
        ? quickViewProduct.variants
        : [],
    [quickViewProduct]
  );

  const sizes = useMemo(() => extractFashionSizes(variants), [variants]);
  const colours = useMemo(() => extractFashionColours(variants), [variants]);

  useEffect(() => {
    if (quickViewProduct) {
      const initialV =
        variants.find((v) => Number(v.stock || 0) > 0) || variants[0];
      setVariantId(initialV?.id || '');
      setSelectedSize(
        initialV ? getVariantSize(initialV) : sizes[0] || null
      );
      setSelectedColourKey(
        initialV?.colorHex
          ? initialV.colorHex.trim().toLowerCase()
          : colours[0]?.key || null
      );
      setActiveImageIdx(0);
      setQuantity(1);
      setMode(!isFashion && resolvedGlb ? '3d' : 'photo');
    }
  }, [quickViewProduct?.id, resolvedGlb, isFashion]);

  if (!quickViewProduct) return null;

  const activeVariant =
    isFashion && (sizes.length > 0 || colours.length > 0)
      ? resolveFashionVariant(variants, selectedSize, selectedColourKey)
      : variants.find((v) => v.id === variantId) || variants[0];

  const pricing = isFashion
    ? getFashionPricing(quickViewProduct, activeVariant)
    : (() => {
        const sellingPrice = getEffectivePrice(
          quickViewProduct,
          activeVariant?.id
        );
        const baseDelta =
          quickViewProduct.price + (activeVariant?.priceDelta || 0);
        const mrp =
          quickViewProduct.originalPrice &&
          quickViewProduct.originalPrice > sellingPrice
            ? Math.round(quickViewProduct.originalPrice)
            : quickViewProduct.discountPercent > 0
              ? Math.round(baseDelta)
              : 0;
        const discountPercent =
          mrp > sellingPrice && sellingPrice > 0
            ? Math.round(((mrp - sellingPrice) / mrp) * 100)
            : quickViewProduct.discountPercent || 0;
        return {
          sellingPrice,
          mrp,
          discountPercent,
          hasPrice: sellingPrice > 0,
          hasDiscount: discountPercent > 0 && mrp > sellingPrice,
        };
      })();

  const isUsedVehicle =
    quickViewProduct.category.toLowerCase().includes('used') ||
    quickViewProduct.category.toLowerCase().includes('bike');
  const fallbackImg = isUsedVehicle
    ? undefined
    : resolveCategoryFallbackImage(quickViewProduct.category);
  const galleryImages =
    Array.isArray(quickViewProduct.images) && quickViewProduct.images.length > 0
      ? quickViewProduct.images
      : fallbackImg
        ? [fallbackImg]
        : [];

  const displayedPhoto =
    activeVariant?.image ||
    galleryImages[activeImageIdx] ||
    galleryImages[0] ||
    fallbackImg ||
    '';

  const availableStock =
    activeVariant !== undefined
      ? Math.min(Number(quickViewProduct.stock || 0), Number(activeVariant.stock || 0))
      : Number(quickViewProduct.stock || 0);
  const inStock = Number(quickViewProduct.stock || 0) > 0 && availableStock > 0;
  const canPurchase = pricing.hasPrice && inStock;
  const isSaved = wishlist.includes(quickViewProduct.id);
  const fabric = isFashion ? extractFashionFabric(quickViewProduct) : null;
  const realRating = getRealProductRating(quickViewProduct, reviews);

  const handleAddToCart = () => {
    if (isFashion) {
      if (sizes.length > 0 && !selectedSize) {
        showToast('Please select a size');
        return;
      }
      if (colours.length > 0 && !selectedColourKey) {
        showToast('Please select a colour');
        return;
      }
    }
    if (!pricing.hasPrice) {
      showToast('Price is not yet configured for this item');
      return;
    }
    if (!inStock) {
      showToast('Selected variant is out of stock');
      return;
    }
    addToCart(quickViewProduct, activeVariant?.id, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B3B78]/50 p-2.5 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${quickViewProduct.name}`}
    >
      <div
        className="fixed inset-0"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[92dvh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white border border-[#DCE6F2] shadow-2xl grid grid-cols-1 md:grid-cols-12">
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(quickViewProduct.id)}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer shadow-xs transition-colors ${
              isSaved
                ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white'
                : 'bg-white border-[#DCE6F2] text-[#0B3B78] hover:text-[#FF6B1A]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            aria-label="Close quick view"
            className="w-10 h-10 rounded-xl bg-white border border-[#DCE6F2] flex items-center justify-center text-[#0B3B78] hover:text-[#FF6B1A] cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Left 3D / Photo Stage + Additional Photographs */}
        <div
          className={`md:col-span-7 flex flex-col justify-between relative ${
            isFashion ? 'bg-[#F5F6F8]' : 'bg-[#F0F6FF]'
          }`}
        >
          <div className="h-64 sm:h-80 md:h-[400px] relative w-full flex items-center justify-center p-3">
            {!isFashion && (
              <div className="absolute top-4 left-4 z-10 inline-flex p-1 rounded-xl bg-white border border-[#DCE6F2] shadow-xs">
                {hasReal3D && (
                  <button
                    type="button"
                    onClick={() => setMode('3d')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      mode === '3d'
                        ? 'bg-[#0B3B78] text-white'
                        : 'text-[#0B3B78] hover:bg-[#F0F6FF]'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Model</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMode('photo')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    mode === 'photo' || !hasReal3D
                      ? 'bg-[#0B3B78] text-white'
                      : 'text-[#0B3B78] hover:bg-[#F0F6FF]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photo</span>
                </button>
              </div>
            )}

            {mode === '3d' && hasReal3D && !isFashion ? (
              <Product3DViewer
                preset={quickViewProduct.modelType}
                glbUrl={resolvedGlb || undefined}
                productName={quickViewProduct.name}
              />
            ) : (
              <ResilientImage
                src={displayedPhoto || undefined}
                fallbackSrc={fallbackImg}
                emptyLabel={
                  isUsedVehicle
                    ? 'Verified Vehicle Photo Needed · Image Pending'
                    : undefined
                }
                alt={quickViewProduct.name}
                className={`w-full h-full ${
                  isFashion ||
                  displayedPhoto.includes('/images/millets/') ||
                  (quickViewProduct.subcategory || '').toLowerCase() === 'millets'
                    ? 'object-contain'
                    : 'object-contain sm:object-cover'
                } rounded-xl`}
              />
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto">
              {galleryImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => {
                    setMode('photo');
                    setActiveImageIdx(idx);
                  }}
                  aria-label={`Preview photo ${idx + 1}`}
                  className={`w-14 h-14 rounded-xl overflow-hidden border bg-white p-1 shrink-0 cursor-pointer transition-all ${
                    activeImageIdx === idx
                      ? 'border-[#1D6FD8] ring-2 ring-[#1D6FD8]/30'
                      : 'border-[#DCE6F2] hover:border-[#1D6FD8]'
                  }`}
                >
                  <ResilientImage
                    src={img}
                    fallbackSrc={fallbackImg}
                    alt={`${quickViewProduct.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="md:col-span-5 p-4 sm:p-6 flex flex-col justify-between space-y-4 bg-white">
          <div className="space-y-2.5 sm:space-y-3 pr-20 md:pr-16">
            {quickViewProduct.brand && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                {quickViewProduct.brand}
              </p>
            )}

            <h2 className="font-display text-lg sm:text-2xl font-bold text-[#0B3B78] leading-snug">
              {quickViewProduct.name}
            </h2>

            {fabric && (
              <p className="text-xs font-medium text-[#475569]">
                Fabric: <span className="text-[#132238]">{fabric}</span>
              </p>
            )}

            {realRating.hasRating && (
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex items-center text-[#FF6B1A]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(realRating.rating)
                          ? 'fill-current'
                          : 'text-[#CBD5E1]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono-tabular font-bold text-[#0B3B78]">
                  {realRating.rating.toFixed(1)}
                </span>
                <span className="text-[#64748B] font-mono-tabular">
                  ({realRating.reviewCount}{' '}
                  {realRating.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Pricing Hierarchy */}
            {pricing.hasPrice ? (
              <div className="space-y-0.5 pt-0.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono-tabular text-2xl font-extrabold text-[#0B3B78]">
                    ₹{pricing.sellingPrice.toLocaleString('en-IN')}
                  </span>
                  {pricing.hasDiscount && (
                    <span className="text-xs font-bold text-[#FF6B1A]">
                      ({pricing.discountPercent}% off)
                    </span>
                  )}
                </div>
                {pricing.hasDiscount && pricing.mrp > pricing.sellingPrice && (
                  <p className="text-xs text-[#64748B] font-mono-tabular">
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

            <p
              className={`text-xs font-semibold ${
                !pricing.hasPrice
                  ? 'text-[#64748B]'
                  : !inStock
                    ? 'text-[#DC2626]'
                    : availableStock <= 5
                      ? 'text-[#FF6B1A]'
                      : 'text-[#2E7D32]'
              }`}
            >
              {!pricing.hasPrice
                ? 'Price & availability pending'
                : inStock
                  ? `In Stock · ${availableStock} available`
                  : 'Currently Out of Stock'}
            </p>

            <p className="text-xs text-[#475569] leading-relaxed">
              {quickViewProduct.shortDescription}
            </p>

            {/* Fashion Colour Swatches */}
            {isFashion && colours.length > 0 && (
              <div className="pt-1 space-y-1.5">
                <span className="text-xs font-semibold text-[#64748B] block">
                  Colour:{' '}
                  <strong className="text-[#0B3B78]">
                    {colours.find((c) => c.key === selectedColourKey)?.name ||
                      'Select colour'}
                  </strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {colours.map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => {
                        setSelectedColourKey(col.key);
                        setQuantity(1);
                      }}
                      aria-label={`Select colour ${col.name}`}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        selectedColourKey === col.key
                          ? 'border-[#1D6FD8] bg-[#F0F6FF] text-[#0B3B78]'
                          : 'border-[#DCE6F2] bg-white text-[#475569] hover:border-[#1D6FD8]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: col.colorHex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fashion Size Selection */}
            {isFashion && sizes.length > 0 && (
              <div className="pt-1 space-y-1.5">
                <span className="text-xs font-semibold text-[#64748B] block">
                  Size:{' '}
                  <strong className="text-[#0B3B78]">
                    {selectedSize || 'Select size'}
                  </strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((sz) => {
                    const variantForSize = variants.find(
                      (v) =>
                        (getVariantSize(v) || '').toLowerCase() ===
                          sz.toLowerCase() &&
                        (!selectedColourKey ||
                          !v.colorHex ||
                          v.colorHex.trim().toLowerCase() ===
                            selectedColourKey)
                    );
                    const disabled =
                      variantForSize !== undefined &&
                      Number(variantForSize.stock || 0) <= 0;
                    const active =
                      selectedSize?.toLowerCase() === sz.toLowerCase();
                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setSelectedSize(sz);
                          setQuantity(1);
                        }}
                        className={`min-w-[40px] px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                          disabled
                            ? 'border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] line-through cursor-not-allowed'
                            : active
                              ? 'border-[#1D6FD8] bg-[#F0F6FF] text-[#0B3B78]'
                              : 'border-[#DCE6F2] bg-white text-[#475569] hover:border-[#1D6FD8]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Standard Non-Fashion Variant Chips (or custom fashion variants with no size/colourHex) */}
            {(!isFashion || (sizes.length === 0 && colours.length === 0)) &&
              variants.length > 0 && (
                <div className="pt-1 space-y-2">
                  <span className="text-xs font-semibold text-[#64748B] block">
                    Variant: {activeVariant?.name}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setVariantId(v.id);
                          setQuantity(1);
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          v.id === activeVariant?.id
                            ? 'border-[#1D6FD8] bg-[#F0F6FF] text-[#0B3B78]'
                            : 'border-[#DCE6F2] bg-white text-[#475569] hover:border-[#1D6FD8]'
                        }`}
                      >
                        {v.colorHex && (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/15"
                            style={{ backgroundColor: v.colorHex }}
                          />
                        )}
                        <span>{v.label || v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Quantity Selector */}
            {canPurchase && (
              <div className="pt-1 flex items-center gap-3">
                <span className="text-xs font-semibold text-[#64748B]">
                  Quantity:
                </span>
                <div className="inline-flex items-center border border-[#DCE6F2] rounded-xl bg-[#F8FAFC]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-[#0B3B78] hover:text-[#FF6B1A] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono-tabular text-xs font-bold text-[#132238]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(Math.max(1, availableStock), q + 1)
                      )
                    }
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-[#0B3B78] hover:text-[#FF6B1A] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#EEF4FB]">
            <button
              type="button"
              disabled={!canPurchase}
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                canPurchase
                  ? 'bg-[#FF6B1A] hover:bg-[#E5580D] text-white cursor-pointer'
                  : 'bg-[#E2E8F0] text-[#64748B] cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {canPurchase
                  ? 'Add to Cart'
                  : pricing.hasPrice
                    ? 'Out of Stock'
                    : 'Unavailable'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                const slug = quickViewProduct.slug;
                setQuickViewProduct(null);
                navigate(`/product/${slug}`);
              }}
              className="w-full py-2.5 rounded-xl border border-[#DCE6F2] hover:bg-[#F0F6FF] text-xs font-bold text-[#0B3B78] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Full Product Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
