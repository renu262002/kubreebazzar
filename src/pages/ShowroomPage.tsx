import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Box,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useStore, getEffectivePrice } from '../context/StoreContext';
import { Product3DViewer } from '../components/Product3DViewer';
import { ResilientImage } from '../components/ResilientImage';
import type { ProductCategory } from '../types';

const ENVIRONMENTS: {
  category: ProductCategory;
  roomName: string;
  atmosphere: string;
}[] = [
  {
    category: 'Rice',
    roomName: 'Heritage Grain & Rice Pavilion',
    atmosphere: 'Aged Basmati, Boiled Ponni, Sona Masoori & Traditional Rice',
  },
  {
    category: 'Grocery',
    roomName: 'Everyday Kitchen & Pantry Gallery',
    atmosphere: 'Cold-pressed oils, unpolished dals, whole spices & flours',
  },
  {
    category: 'Honey',
    roomName: 'Floral & Forest Honey Conservatory',
    atmosphere: 'Single-origin forest, blossom & multiflora glass jars',
  },
  {
    category: 'Watches',
    roomName: 'Kaveri Horology & Timepiece Vault',
    atmosphere: 'Automatic movements, chronographs & classic dress dials',
  },
];

export function ShowroomPage() {
  const { products, navigate, addToCart } = useStore();

  const initialCat = (() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'Rice';
  })();

  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>(initialCat);
  const [productIndex, setProductIndex] = useState(0);
  const [variantId, setVariantId] = useState('');

  const roomProducts = products.filter(
    (p) => p.category === selectedCategory
  );
  const activeProduct =
    roomProducts[productIndex % Math.max(roomProducts.length, 1)] || products[0];
  const activeEnv =
    ENVIRONMENTS.find((e) => e.category === selectedCategory) ||
    ENVIRONMENTS[0];

  useEffect(() => {
    setProductIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    if (activeProduct?.variants.length) {
      setVariantId(activeProduct.variants[0].id);
    }
  }, [activeProduct?.id]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }
      if (e.key === 'ArrowRight' && roomProducts.length > 0) {
        setProductIndex((i) => (i + 1) % roomProducts.length);
      } else if (e.key === 'ArrowLeft' && roomProducts.length > 0) {
        setProductIndex(
          (i) => (i - 1 + roomProducts.length) % roomProducts.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [roomProducts.length]);

  const activeVariant =
    activeProduct?.variants.find((v) => v.id === variantId) ||
    activeProduct?.variants[0];
  const has3D = activeProduct
    ? activeProduct.has3DModel !== false || Boolean(activeProduct.glbUrl)
    : true;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DCD0]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1.5">
            <Compass className="w-4 h-4" />
            <span>Virtual 3D Shopping Showroom</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
            {activeEnv.roomName}
          </h1>
          <p className="text-xs text-[#6E6059] mt-1">
            {activeEnv.atmosphere} · Use Left/Right arrow keys or click items
            below to switch displays
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="px-4 py-2.5 rounded-lg bg-white border border-[#D8CBB8] hover:border-[#6B1D2F] text-xs font-semibold text-[#1E1614] inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Main Store</span>
        </button>
      </div>

      {/* Virtual Environment Portal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {ENVIRONMENTS.map((env) => {
          const active = env.category === selectedCategory;
          return (
            <button
              key={env.category}
              type="button"
              onClick={() => setSelectedCategory(env.category)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'bg-[#6B1D2F] text-white'
                  : 'bg-white text-[#5C4F49] border border-[#E6DCD0] hover:border-[#6B1D2F]'
              }`}
            >
              {env.category}
            </button>
          );
        })}
      </div>

      {/* Main 3D Showroom Stage + Detail Panel */}
      {activeProduct && (
        <div className="rounded-2xl bg-gradient-to-br from-[#FAF6F0] via-[#F3ECE1] to-[#EADBC6] border border-[#E6DCD0] p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 h-[420px] sm:h-[500px] relative rounded-xl overflow-hidden bg-white border border-[#E6DCD0]">
            {has3D ? (
              <Product3DViewer
                preset={activeProduct.modelType}
                glbUrl={activeProduct.glbUrl}
                productName={activeProduct.name}
              />
            ) : (
              <div className="w-full h-full relative">
                <ResilientImage
                  src={activeProduct.images[0]}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E6DCD0] p-6 space-y-5">
            <div className="flex items-center justify-between text-xs text-[#6E6059]">
              <span>
                Display {productIndex + 1} of {roomProducts.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setProductIndex(
                      (i) => (i - 1 + roomProducts.length) % roomProducts.length
                    )
                  }
                  aria-label="Previous display"
                  className="w-8 h-8 rounded-lg bg-[#FAF6F0] border border-[#E6DCD0] flex items-center justify-center text-[#1E1614] hover:border-[#6B1D2F] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setProductIndex((i) => (i + 1) % roomProducts.length)
                  }
                  aria-label="Next display"
                  className="w-8 h-8 rounded-lg bg-[#FAF6F0] border border-[#E6DCD0] flex items-center justify-center text-[#1E1614] hover:border-[#6B1D2F] cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-[#B88628] font-semibold">
                {activeProduct.brand} · {activeProduct.category}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#1E1614] mt-1">
                {activeProduct.name}
              </h2>
              <p className="font-mono text-xl font-bold text-[#6B1D2F] mt-2">
                ₹
                {getEffectivePrice(
                  activeProduct,
                  activeVariant?.id
                ).toLocaleString('en-IN')}
              </p>
            </div>

            <p className="text-xs text-[#5C4F49] leading-relaxed">
              {activeProduct.description}
            </p>

            {activeProduct.variants.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-[#6E6059] block">
                  Pack / Variant: {activeVariant?.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer ${
                        v.id === activeVariant?.id
                          ? 'border-[#6B1D2F] bg-[#FAF6F0] text-[#1E1614] font-semibold'
                          : 'border-[#E6DCD0] bg-white text-[#5C4F49]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/15"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => addToCart(activeProduct, activeVariant?.id, 1)}
                className="flex-1 py-3 px-4 rounded-lg bg-[#6B1D2F] hover:bg-[#521422] text-xs font-semibold text-white flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(`/product/${activeProduct.slug}`)}
                className="py-3 px-4 rounded-lg border border-[#D8CBB8] hover:bg-[#FAF6F0] text-xs font-semibold text-[#1E1614] whitespace-nowrap cursor-pointer"
              >
                Full Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Environment Product Strip */}
      <div>
        <h3 className="text-xs font-semibold text-[#6E6059] uppercase tracking-wider mb-4">
          All Exhibits in {selectedCategory} ({roomProducts.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {roomProducts.map((p, idx) => {
            const selected = idx === productIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProductIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  selected
                    ? 'bg-white border-[#6B1D2F] text-[#1E1614] shadow-sm'
                    : 'bg-white border-[#E6DCD0] text-[#5C4F49] hover:border-[#B88628]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#6E6059] mb-1.5">
                  <span className="font-mono text-[#6B1D2F] font-semibold">
                    ₹{getEffectivePrice(p).toLocaleString('en-IN')}
                  </span>
                  {p.has3DModel !== false ? (
                    <Box className="w-3 h-3 text-[#B88628]" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-[#6B1D2F]" />
                  )}
                </div>
                <p className="text-xs font-medium line-clamp-2">{p.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
