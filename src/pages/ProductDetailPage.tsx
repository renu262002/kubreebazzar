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
import { apiFetch } from '../utils/apiClient';
import {
  getCategoryBySlug,
  getCategoryDisplayName,
  getSubcategoryDisplayName,
  getThirdLevelDisplayName,
} from '../data/categoryHierarchy';

interface ProductDetailPageProps {
  slugOrId: string;
}

export function ProductDetailPage({ slugOrId }: ProductDetailPageProps) {
  const {
    products,
    categories,
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
    (p) =>
      p.slug === slugOrId ||
      p.id === slugOrId ||
      (slugOrId === 'idukki-whole-green-cardamom-elaka' &&
        p.id === 'prod-groc-elaka') ||
      (slugOrId === 'ceylon-cinnamon-quills-star-anise-patai' &&
        p.id === 'prod-groc-patai') ||
      (slugOrId === 'pastel-embroidered-anarkali-chudithar-suit-set' &&
        p.id === 'prod-fash-women-2') ||
      (slugOrId === 'pearl-millet-bajra' && p.id === 'prod-draft-bajra') ||
      (slugOrId === 'pearl-millet-kambu' && p.id === 'prod-draft-bajra') ||
      (slugOrId === 'proso-millet-panivaragu' && p.id === 'prod-millet-proso') ||
      (slugOrId === 'sorghum-jowar-solam' && p.id === 'prod-millet-sorghum') ||
      (slugOrId === 'kodo-millet-varagu' && p.id === 'prod-millet-kodo') ||
      (slugOrId === 'little-millet-samai' && p.id === 'prod-millet-little') ||
      (slugOrId === 'browntop-millet-korali' &&
        p.id === 'prod-millet-browntop') ||
      (slugOrId === 'barnyard-millet-kuthiraivali' &&
        p.id === 'prod-millet-barnyard') ||
      (slugOrId === 'organic-foxtail-millet-thinai' &&
        p.id === 'prod-groc-millets-1') ||
      (slugOrId === 'finger-millet-ragi-flour' &&
        p.id === 'prod-draft-ragi-flour') ||
      (slugOrId === 'rolled-whole-grain-golden-oats' &&
        p.id === 'prod-groc-cereals-1') ||
      (slugOrId === 'nilgiri-raw-wild-forest-honey-jar' &&
        p.id === 'prod-groc-honey') ||
      (slugOrId === 'crispy-traditional-rava-dosa-ready-mix' &&
        p.id === 'prod-groc-ready-1')
  );

  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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
      setActiveImageIndex(0);
      setViewMode(
        product.has3DModel !== false || Boolean(product.glbUrl) ? '3d' : 'photo'
      );
      setQuantity(1);
      recordRecentlyViewed(product.id);
      const catLabel = getCategoryDisplayName(product.category, categories);
      document.title = `${product.name} | ${catLabel} | KubreeBazzar`;
    }
  }, [product?.id, product?.name, product?.category, categories, recordRecentlyViewed]);

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
  const hasPrice = unitPrice > 0;
  const baseWithVariant = product.price + (activeVariant?.priceDelta || 0);
  const availableStock = activeVariant ? activeVariant.stock : product.stock;
  const canPurchase = hasPrice && availableStock > 0 && product.enabled !== false;
  const isSaved = wishlist.includes(product.id);
  const activePhotoSrc =
    product.images[activeImageIndex] || product.images[0] || '';
  const isDarkStudioMasalaJpg =
    activePhotoSrc.endsWith('sambar-powder.jpg') ||
    activePhotoSrc.endsWith('rasam-powder.jpg') ||
    activePhotoSrc.endsWith('biryani-masala.jpg') ||
    activePhotoSrc.endsWith('chicken-masala.jpg') ||
    activePhotoSrc.endsWith('mutton-masala.jpg') ||
    activePhotoSrc.endsWith('fish-curry-masala.jpg') ||
    activePhotoSrc.endsWith('curry-masala.jpg');
  const isMilletOrCerealProduct =
    activePhotoSrc.includes('/images/millets/') ||
    activePhotoSrc.includes('/images/cereals/') ||
    (product.subcategory || '').toLowerCase() === 'millets' ||
    (product.subcategory || '').toLowerCase() === 'cereals';
  const isHoneyProduct =
    activePhotoSrc.includes('/images/honey/') ||
    product.id.startsWith('prod-honey-') ||
    product.id === 'prod-groc-honey';
  const isReadyToCookProduct =
    activePhotoSrc.includes('/images/ready-to-cook/') ||
    (product.subcategory || '').toLowerCase() === 'ready-to-cook foods' ||
    product.id.startsWith('prod-rtc-') ||
    product.id === 'prod-groc-ready-1';
  const isCleanContainProduct =
    isMilletOrCerealProduct || isHoneyProduct || isReadyToCookProduct;
  const isDarkStudioCutout =
    !isCleanContainProduct &&
    (activePhotoSrc.includes('/baby-kit/') ||
      activePhotoSrc.includes('/temple-kit/') ||
      activePhotoSrc.includes('/school-kit/') ||
      isDarkStudioMasalaJpg ||
      (activePhotoSrc.endsWith('.png') &&
        !activePhotoSrc.endsWith('lavangam.png') &&
        !activePhotoSrc.endsWith('watches.png')));
  const isBabyKitStudio =
    isDarkStudioCutout ||
    (!activePhotoSrc.endsWith('.webp') &&
      (product.category.toLowerCase() === 'baby kit' ||
        (product.subcategory || '').toLowerCase() === 'baby kit' ||
        (product.subcategory || '').toLowerCase() === 'temple kit' ||
        (product.subcategory || '').toLowerCase() === 'school kit'));
  const isUsedVehicle =
    product.category.toLowerCase().includes('used') ||
    product.category.toLowerCase().includes('bike');
  const isTempleKit =
    (product.subcategory || '').toLowerCase() === 'temple kit' ||
    product.id.startsWith('prod-templekit-');
  const isSchoolKit =
    product.category.toLowerCase() === 'school kit' ||
    product.category.toLowerCase() === 'school-kit' ||
    (product.subcategory || '').toLowerCase() === 'school kit' ||
    product.id.startsWith('prod-schoolkit-');

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = (() => {
    const enabledPool = products.filter(
      (p) => p.enabled !== false && !p.isBundle && p.id !== product.id
    );
    if (isHoneyProduct) {
      const isHoneyMatch = (p: typeof product) =>
        p.id.startsWith('prod-honey-') ||
        p.id === 'prod-groc-honey' ||
        Boolean(p.images?.[0]?.includes('/images/honey/'));
      const honeyFirst = enabledPool.filter(isHoneyMatch);
      const healthFallback = enabledPool.filter(
        (p) =>
          !isHoneyMatch(p) &&
          (p.subcategory || '').toLowerCase() === 'health foods'
      );
      const groceryFallback = enabledPool.filter(
        (p) =>
          !isHoneyMatch(p) &&
          p.category === product.category &&
          (p.subcategory || '').toLowerCase() !== 'health foods'
      );
      return [...honeyFirst, ...healthFallback, ...groceryFallback].slice(0, 4);
    }
    if (isReadyToCookProduct) {
      const rtcFirst = enabledPool.filter(
        (p) =>
          (p.subcategory || '').toLowerCase() === 'ready-to-cook foods' ||
          p.id.startsWith('prod-rtc-') ||
          p.id === 'prod-groc-ready-1'
      );
      const groceryFallback = enabledPool.filter(
        (p) =>
          p.category === product.category &&
          (p.subcategory || '').toLowerCase() !== 'ready-to-cook foods'
      );
      return [...rtcFirst, ...groceryFallback].slice(0, 4);
    }
    return enabledPool
      .filter((p) => p.category === product.category)
      .slice(0, 3);
  })();

  const handleAdd = () => {
    if (!canPurchase) return;
    const added = addToCart(product, activeVariant?.id, quantity);
    if (!added) return;
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1200);
  };

  const handleBuyNow = () => {
    if (!canPurchase) return;
    const added = addToCart(product, activeVariant?.id, quantity, {
      redirectTo: '/checkout',
    });
    if (!added) return;
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch(`/api/products/${product.id}/reviews`, {
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

  const matchedCategory = getCategoryBySlug(product.category, categories);
  const categorySlug =
    matchedCategory?.slug || product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const displayCategory = getCategoryDisplayName(product.category, categories);
  const displaySubcategory = getSubcategoryDisplayName(product.subcategory);
  const displayThirdLevel = getThirdLevelDisplayName(product.subSubcategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-32 lg:pb-16 space-y-12 sm:space-y-20">
      <div>
        <button
          type="button"
          onClick={() =>
            navigate(
              isTempleKit
                ? '/temple-pooja-essentials'
                : isSchoolKit
                  ? '/school-kit'
                  : isHoneyProduct
                    ? '/groceries/health-foods/healthy-sweets'
                    : isReadyToCookProduct
                      ? '/groceries/ready-to-cook-foods'
                      : product.category.toLowerCase() === 'baby kit' ||
                          (product.subcategory || '').toLowerCase() === 'baby kit'
                        ? '/baby-kit'
                        : `/${categorySlug}`
            )
          }
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B1D2F] hover:underline mb-5 sm:mb-8 min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            Back to{' '}
            {isTempleKit
              ? 'Temple & Pooja Essentials'
              : isSchoolKit
                ? 'School Kit'
                : isHoneyProduct
                  ? 'Healthy Sweets'
                  : isReadyToCookProduct
                    ? 'Ready-to-Cook Foods'
                    : product.category.toLowerCase() === 'baby kit' ||
                        (product.subcategory || '').toLowerCase() === 'baby kit'
                      ? 'Baby Kit'
                      : displayCategory}
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
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

            <div className="h-[280px] min-[380px]:h-[320px] sm:h-[460px] lg:h-[520px] w-full">
              {viewMode === '3d' && has3D ? (
                <Product3DViewer
                  preset={product.modelType}
                  glbUrl={product.glbUrl}
                  productName={product.name}
                />
              ) : (
                <div
                  className={`w-full h-full rounded-xl overflow-hidden border border-[#E6DDD0] flex items-center justify-center ${
                    isBabyKitStudio
                      ? 'bg-[#090C12] p-4 sm:p-6'
                      : isCleanContainProduct
                        ? 'bg-[#F8FAFC] p-4 sm:p-6'
                        : 'bg-white'
                  }`}
                >
                  <ResilientImage
                    src={activePhotoSrc}
                    emptyLabel={
                      isUsedVehicle
                        ? 'Verified Vehicle Photo Needed · Image Pending'
                        : undefined
                    }
                    alt={product.name}
                    className={`w-full h-full ${
                      isBabyKitStudio || isCleanContainProduct
                        ? 'object-contain'
                        : 'object-cover'
                    }`}
                  />
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((imgUrl, idx) => {
                  const isDarkThumb =
                    !imgUrl.includes('/images/millets/') &&
                    !imgUrl.includes('/images/cereals/') &&
                    !imgUrl.includes('/images/honey/') &&
                    (imgUrl.includes('/baby-kit/') ||
                      imgUrl.includes('/temple-kit/') ||
                      imgUrl.includes('/school-kit/') ||
                      imgUrl.endsWith('sambar-powder.jpg') ||
                      imgUrl.endsWith('rasam-powder.jpg') ||
                      imgUrl.endsWith('biryani-masala.jpg') ||
                      imgUrl.endsWith('chicken-masala.jpg') ||
                      imgUrl.endsWith('mutton-masala.jpg') ||
                      imgUrl.endsWith('fish-curry-masala.jpg') ||
                      imgUrl.endsWith('curry-masala.jpg') ||
                      (imgUrl.endsWith('.png') &&
                        !imgUrl.endsWith('lavangam.png') &&
                        !imgUrl.endsWith('watches.png')));
                  const isSelected = viewMode === 'photo' && activeImageIndex === idx;
                  return (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setViewMode('photo');
                      }}
                      aria-label={`View photo ${idx + 1} of ${product.name}`}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF6B1A] ring-2 ring-[#FF6B1A]/25'
                          : 'border-[#DCE6F2] hover:border-[#1D6FD8]'
                      } ${isDarkThumb ? 'bg-[#090C12] p-1.5' : 'bg-white'}`}
                    >
                      <ResilientImage
                        src={imgUrl}
                        alt={`${product.name} view ${idx + 1}`}
                        className={`w-full h-full ${
                          isDarkThumb ? 'object-contain' : 'object-cover'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sticky Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 rounded-2xl bg-white border border-[#E6DDD0] p-4 sm:p-8 flex flex-col gap-5 sm:gap-6 shadow-xs">
            <div className="order-1 lg:order-none">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#786B65] mb-2">
                <span className="font-semibold text-[#6B1D2F]">
                  {displayCategory}
                </span>
                {displaySubcategory && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{displaySubcategory}</span>
                  </>
                )}
                {displayThirdLevel && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{displayThirdLevel}</span>
                  </>
                )}
                {product.rating > 0 && (
                  <>
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
                  </>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E1614] text-balance">
                {product.name}
              </h1>
              {product.tamilName && (
                <p className="text-base sm:text-lg font-semibold text-[#1D6FD8] mt-1">
                  {product.tamilName}
                </p>
              )}

              <div className="mt-4 flex items-baseline gap-3">
                {hasPrice ? (
                  <>
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
                  </>
                ) : (
                  <span className="text-sm font-semibold text-[#786B65]">
                    Price to be configured in Admin Dashboard
                  </span>
                )}
              </div>
              <p className="text-xs text-[#786B65] mt-1">
                {availableStock > 0
                  ? `In Stock (${availableStock} units ready to dispatch)`
                  : hasPrice
                    ? 'Currently Out of Stock'
                    : 'Stock & pricing configurable by Admin'}
              </p>
            </div>

            <p className="order-3 lg:order-none text-sm text-[#4A3F3B] leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector (Weight / Jar Size / Strap) */}
            {product.variants.length > 0 && (
              <div className="order-2 lg:order-none space-y-2.5 pt-3 border-t border-[#EFE6D8]">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-[#786B65]">
                    {isHoneyProduct || product.category === 'Honey'
                      ? 'Select Jar Size'
                      : product.category === 'Rice' ||
                          product.category === 'Grocery' ||
                          product.category === 'Groceries'
                        ? 'Select Pack Weight / Size'
                        : 'Select Edition / Finish'}
                  </span>
                  <span className="font-semibold text-[#1E1614] shrink-0">
                    {activeVariant?.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const selected = v.id === activeVariant?.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3.5 py-2 min-h-[40px] rounded-lg border text-xs font-semibold flex items-center gap-2 transition-colors ${
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
            <div className="order-4 lg:order-none space-y-3 pt-3 border-t border-[#EFE6D8]">
              <div className="flex items-center justify-between lg:justify-start gap-3">
                <span className="text-xs font-semibold text-[#786B65] lg:hidden">
                  Quantity
                </span>
                <div className="flex items-center gap-3 flex-1 lg:flex-initial justify-end lg:justify-start">
                  <div className="flex items-center border border-[#E6DDD0] rounded-lg bg-[#FAF6F0]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-11 h-11 flex items-center justify-center text-[#4A3F3B] hover:text-[#6B1D2F]"
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
                      className="w-11 h-11 flex items-center justify-center text-[#4A3F3B] hover:text-[#6B1D2F]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!canPurchase}
                    onClick={handleAdd}
                    className={`hidden lg:flex flex-1 h-11 px-5 rounded-lg text-sm font-semibold items-center justify-center gap-2 transition-all ${
                      !canPurchase
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
              </div>

              <button
                type="button"
                disabled={!canPurchase}
                onClick={handleBuyNow}
                className="hidden lg:block w-full py-3 rounded-lg bg-[#B88628] hover:bg-[#9E711E] disabled:opacity-40 text-xs font-bold text-white transition-all"
              >
                Buy Now — Express Checkout
              </button>
            </div>

            {/* Delivery & Return Summary */}
            <div className="order-5 lg:order-none pt-4 border-t border-[#EFE6D8] space-y-2.5 text-xs text-[#4A3F3B]">
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

            {/* Configured Usage / Age / Safety Guidance (Displayed Only When Provided) */}
            {(product.usageInstructions || product.ageSuitability) && (
              <div className="order-5 lg:order-none pt-4 border-t border-[#EFE6D8] space-y-2 text-xs text-[#4A3F3B]">
                <h2 className="text-xs font-bold text-[#1E1614] uppercase tracking-wider">
                  {isTempleKit || isSchoolKit
                    ? 'Safety & Usage Information'
                    : 'Care & Label Details'}
                </h2>
                {product.ageSuitability && (
                  <p>
                    <strong className="text-[#1E1614]">Age Suitability:</strong>{' '}
                    {product.ageSuitability}
                  </p>
                )}
                {product.usageInstructions && (
                  <div
                    className={`leading-relaxed ${
                      (isTempleKit &&
                        (product.usageInstructions.includes('Fire Safety') ||
                          product.usageInstructions.includes('NOT an edible'))) ||
                      (isSchoolKit &&
                        product.usageInstructions.includes('Safety Note:'))
                        ? 'p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]'
                        : ''
                    }`}
                  >
                    <strong className="text-[#1E1614]">
                      {isTempleKit || isSchoolKit
                        ? 'Safety & Care: '
                        : 'Instructions: '}
                    </strong>
                    {product.usageInstructions}
                  </div>
                )}
              </div>
            )}

            {/* Bundle Included Items (Baby Kit or Temple Pooja Kit) */}
            {product.isBundle &&
              Array.isArray(product.bundleItems) &&
              product.bundleItems.some((i) => i.enabled !== false) && (
                <div className="order-5 lg:order-none pt-4 border-t border-[#EFE6D8] space-y-3">
                  <h2 className="text-xs font-bold text-[#1E1614] uppercase tracking-wider">
                    Included Kit Contents (
                    {product.bundleItems.filter((i) => i.enabled !== false).length}{' '}
                    Items)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {product.bundleItems
                      .filter((i) => i.enabled !== false)
                      .map((bItem) => {
                        const targetProd = products.find(
                          (p) => p.id === bItem.productId
                        );
                        return (
                          <button
                            key={bItem.productId}
                            type="button"
                            onClick={() =>
                              targetProd &&
                              navigate(`/product/${targetProd.slug}`)
                            }
                            className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] hover:border-[#6B1D2F] text-left cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded bg-[#090C12] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                              <ResilientImage
                                src={bItem.image}
                                alt={bItem.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-[#1E1614] truncate">
                                {bItem.name}
                              </p>
                              <p className="text-[10px] text-[#786B65] font-mono-tabular">
                                Qty: {bItem.quantity}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

            {/* Specifications */}
            {product.specs.length > 0 && (
              <div className="order-5 lg:order-none pt-4 border-t border-[#EFE6D8]">
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
            className="rounded-xl bg-white border border-[#E6DDD0] p-4 sm:p-6 space-y-4"
          >
            <h3 className="font-display text-xl font-bold text-[#1E1614]">
              Write a Review
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={revAuthor}
                onChange={(e) => setRevAuthor(e.target.value)}
                className="px-3 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-base sm:text-xs text-[#1E1614]"
              />
              <select
                value={revRating}
                onChange={(e) => setRevRating(Number(e.target.value))}
                className="px-3 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-base sm:text-xs text-[#1E1614]"
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
              className="w-full px-3 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-base sm:text-xs text-[#1E1614]"
            />
            <textarea
              rows={3}
              required
              placeholder="Share your feedback on quality, packaging, and delivery..."
              value={revComment}
              onChange={(e) => setRevComment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-[#FAF6F0] border border-[#E6DDD0] text-base sm:text-xs text-[#1E1614]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-lg bg-[#6B1D2F] hover:bg-[#541524] text-xs font-semibold text-white"
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
            {isHoneyProduct
              ? 'Related Honey Products'
              : `More in ${product.category}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#E6DDD0] px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-2.5 shadow-[0_-8px_24px_-12px_rgba(30,22,20,0.2)]">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-[#786B65] truncate">
            {product.name}
          </p>
          <p className="font-mono-tabular text-sm min-[380px]:text-base font-bold text-[#6B1D2F]">
            {hasPrice
              ? `₹${unitPrice.toLocaleString('en-IN')}`
              : 'Price Pending'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={!canPurchase}
            onClick={handleAdd}
            className="min-h-[44px] px-3.5 min-[380px]:px-4 py-2 rounded-lg bg-[#6B1D2F] hover:bg-[#541524] disabled:opacity-50 text-xs font-semibold text-white whitespace-nowrap inline-flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F3D88B] hidden min-[380px]:block" />
            <span>
              {addedFeedback
                ? 'Added'
                : canPurchase
                  ? 'Add to Cart'
                  : hasPrice
                    ? 'Sold Out'
                    : 'Pending'}
            </span>
          </button>
          {canPurchase && (
            <button
              type="button"
              onClick={handleBuyNow}
              className="min-h-[44px] px-3 min-[380px]:px-4 py-2 rounded-lg bg-[#B88628] hover:bg-[#9E711E] text-xs font-bold text-white whitespace-nowrap"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
