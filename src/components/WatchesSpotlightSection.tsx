import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { UPLOADED_PRODUCT_IMAGES } from '../data/uploadedProducts';
import { useStore } from '../context/StoreContext';

export const WatchesSpotlightSection: React.FC = () => {
  const { navigate, addToCart } = useStore();
  const watch = UPLOADED_PRODUCT_IMAGES.watches;
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [added, setAdded] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const handleQuickAdd = () => {
    addToCart(
      {
        id: watch.id,
        name: watch.name,
        slug: watch.slug,
        category: 'Watches',
        subcategory: watch.subcategory,
        brand: 'Kaveri Horology',
        price: watch.price,
        discountPercent: watch.discountPercent,
        images: [watch.src],
        shortDescription: watch.description,
        description: watch.description,
        rating: watch.rating,
        reviewCount: watch.reviewsCount,
        stock: 18,
        tags: ['Luxury Watch', 'Automatic'],
        modelType: 'watch',
        createdAt: '2024-01-01T00:00:00.000Z',
        featured: true,
        trending: true,
        bestSeller: true,
        newArrival: true,
        variants: [
          { id: 'var-brown', name: 'Brown Stitched Leather Strap', label: 'Brown Stitched Leather Strap', priceDelta: 0, stock: 12 },
          { id: 'var-black', name: 'Black Alligator Embossed Strap', label: 'Black Alligator Embossed Strap', priceDelta: 400, stock: 6 },
        ],
        specs: [
          { label: 'Movement', value: '24-Jewel Skeleton Automatic' },
          { label: 'Case Diameter', value: '42mm Gold-Toned Stainless Steel' },
          { label: 'Crystal', value: 'Scratch-Resistant Sapphire Crystal' },
          { label: 'Water Resistance', value: '5 ATM (50 Meters)' },
        ],
      },
      'var-brown',
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="reveal-section relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 lg:py-20 border-y border-[#334155]">
      {/* Luxury ambient light */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#38BDF8]/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-5 right-10 w-96 h-96 rounded-full bg-[#FF6B1A]/10 blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: 3D Tilt Watch Image Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: 'transform 180ms ease-out',
              }}
              className="relative w-full max-w-lg rounded-3xl bg-[#1E293B]/80 backdrop-blur-md p-6 sm:p-8 border border-[#475569] shadow-2xl group cursor-pointer"
              onClick={() => navigate('/watches')}
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#334155]/40 to-transparent flex items-center justify-center p-4">
                <img
                  src={watch.src}
                  alt={watch.name}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
                />
              </div>

              {/* Watch Specs Ribbon */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded-xl bg-[#0F172A]/80 border border-[#334155]">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase">Movement</p>
                  <p className="text-xs font-bold text-white">Skeleton Auto</p>
                </div>
                <div className="p-2 rounded-xl bg-[#0F172A]/80 border border-[#334155]">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase">Case</p>
                  <p className="text-xs font-bold text-white">42mm Gold</p>
                </div>
                <div className="p-2 rounded-xl bg-[#0F172A]/80 border border-[#334155]">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase">Strap</p>
                  <p className="text-xs font-bold text-white">Genuine Leather</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Watch Details & CTA */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Heritage Horology &amp; Contemporary Craft</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Timeless Style, Every Day.
            </h2>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Exposed skeleton mechanical movement with vivid blued steel hands,
              sculpted gold-toned bezel, and supple hand-stitched leather strap.
              Engineered for celebratory occasions and everyday distinction.
            </p>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-mono-tabular text-3xl font-bold text-[#38BDF8]">
                ₹{watch.price.toLocaleString('en-IN')}
              </span>
              <span className="font-mono-tabular text-sm text-[#64748B] line-through">
                ₹{Math.round(watch.price / (1 - watch.discountPercent / 100)).toLocaleString('en-IN')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#FF6B1A] text-white text-xs font-bold">
                {watch.discountPercent}% OFF
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="px-7 py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold inline-flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/watches')}
                className="px-7 py-3.5 rounded-xl bg-transparent hover:bg-white/10 text-white border-2 border-white text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Shop Watch Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
