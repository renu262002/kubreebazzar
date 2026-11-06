import { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Box,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { Product3DViewer } from './Product3DViewer';
import { ResilientImage } from './ResilientImage';

export function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    navigate,
  } = useStore();
  const [variantId, setVariantId] = useState('');
  const [mode, setMode] = useState<'3d' | 'photo'>('3d');

  const has3D =
    quickViewProduct?.has3DModel !== false || Boolean(quickViewProduct?.glbUrl);

  useEffect(() => {
    if (quickViewProduct) {
      setVariantId(quickViewProduct.variants[0]?.id || '');
      setMode(
        quickViewProduct.has3DModel !== false || Boolean(quickViewProduct.glbUrl)
          ? '3d'
          : 'photo'
      );
    }
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const activeVariant =
    quickViewProduct.variants.find((v) => v.id === variantId) ||
    quickViewProduct.variants[0];
  const price = getEffectivePrice(quickViewProduct, activeVariant?.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${quickViewProduct.name}`}
    >
      <div
        className="fixed inset-0"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative z-10 w-full max-w-4xl rounded-2xl bg-white border border-[#E6DDD0] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-lg bg-white/95 border border-[#E6DDD0] flex items-center justify-center text-[#4A3F3B] hover:text-[#6B1D2F]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left 3D / Photo Stage */}
        <div className="md:col-span-7 h-80 md:h-[440px] relative bg-[#FAF6F0]">
          <div className="absolute top-4 left-4 z-10 inline-flex p-1 rounded-lg bg-white/95 border border-[#E6DDD0] shadow-xs">
            {has3D && (
              <button
                type="button"
                onClick={() => setMode('3d')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                  mode === '3d'
                    ? 'bg-[#6B1D2F] text-white'
                    : 'text-[#4A3F3B] hover:text-[#6B1D2F]'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setMode('photo')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                mode === 'photo' || !has3D
                  ? 'bg-[#6B1D2F] text-white'
                  : 'text-[#4A3F3B] hover:text-[#6B1D2F]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>
          </div>

          {mode === '3d' && has3D ? (
            <Product3DViewer
              preset={quickViewProduct.modelType}
              glbUrl={quickViewProduct.glbUrl}
              productName={quickViewProduct.name}
            />
          ) : (
            <ResilientImage
              src={quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Right Details */}
        <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-5 bg-white">
          <div className="space-y-3">
            <p className="text-xs text-[#786B65]">
              {quickViewProduct.category} ·{' '}
              {quickViewProduct.stock > 0 ? 'In Stock' : 'Sold Out'}
            </p>
            <h2 className="font-display text-2xl font-bold text-[#1E1614]">
              {quickViewProduct.name}
            </h2>
            <p className="font-mono-tabular text-xl font-bold text-[#6B1D2F]">
              ₹{price.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-[#4A3F3B] leading-relaxed">
              {quickViewProduct.shortDescription}
            </p>

            {quickViewProduct.variants.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-medium text-[#786B65] block">
                  Pack / Edition: {activeVariant?.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${
                        v.id === activeVariant?.id
                          ? 'border-[#6B1D2F] bg-[#FDF4F6] text-[#6B1D2F]'
                          : 'border-[#E6DDD0] bg-[#FAF6F0] text-[#4A3F3B]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#EFE6D8]">
            <button
              type="button"
              disabled={quickViewProduct.stock <= 0}
              onClick={() => {
                addToCart(quickViewProduct, activeVariant?.id, 1);
                setQuickViewProduct(null);
              }}
              className="w-full py-3 rounded-lg bg-[#6B1D2F] hover:bg-[#541524] text-xs font-semibold text-white flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#F3D88B]" />
              <span>Add to Cart</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const slug = quickViewProduct.slug;
                setQuickViewProduct(null);
                navigate(`/product/${slug}`);
              }}
              className="w-full py-2.5 rounded-lg border border-[#E6DDD0] hover:bg-[#FAF6F0] text-xs font-semibold text-[#1E1614] flex items-center justify-center gap-1.5"
            >
              <span>Full Specifications & 3D View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
