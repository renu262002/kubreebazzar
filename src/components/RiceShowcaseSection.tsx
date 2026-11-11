import React, { useRef, useState } from 'react';
import { ArrowRight, ShoppingBag, Eye, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { UPLOADED_PRODUCT_IMAGES } from '../data/uploadedProducts';
import { useStore } from '../context/StoreContext';

export const RiceShowcaseSection: React.FC = () => {
  const { navigate, addToCart } = useStore();
  const rice = UPLOADED_PRODUCT_IMAGES.rice;
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
        id: rice.id,
        name: rice.name,
        slug: rice.slug,
        category: 'Rice',
        subcategory: rice.subcategory,
        brand: 'Kaveri Harvest',
        price: rice.price,
        discountPercent: rice.discountPercent,
        images: [rice.src],
        shortDescription: rice.description,
        description: rice.description,
        rating: rice.rating,
        reviewCount: rice.reviewsCount,
        stock: 50,
        tags: ['Featured', 'Aged'],
        modelType: 'rice',
        createdAt: '2024-01-01T00:00:00.000Z',
        featured: true,
        trending: true,
        bestSeller: true,
        newArrival: true,
        variants: [
          { id: 'var-5kg', name: '5 kg Sack', label: '5 kg Sack', priceDelta: 0, stock: 50 },
          { id: 'var-10kg', name: '10 kg Sack', label: '10 kg Sack', priceDelta: 850, stock: 35 },
          { id: 'var-25kg', name: '25 kg Family Sack', label: '25 kg Family Sack', priceDelta: 3100, stock: 20 },
        ],
        specs: [
          { label: 'Grain Age', value: '24 Months Naturally Aged' },
          { label: 'Variety', value: 'Traditional Royal Basmati' },
          { label: 'Packaging', value: 'Aroma-Sealed Rustic Jute Sack' },
        ],
      },
      'var-5kg',
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="reveal-section relative overflow-hidden bg-gradient-to-br from-[#FFFDF8] via-[#FAF6ED] to-[#F2E8D5] border-y border-[#E8DEC8] py-16 lg:py-20">
      {/* Floating rice grain decorations */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-12 w-24 h-24 rounded-full bg-[#E5D7BE]/30 blur-2xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-16 w-48 h-48 rounded-full bg-[#FF6B1A]/10 blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Interactive 3D Tilted Rice Image Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: 'transform 180ms ease-out',
              }}
              className="relative w-full max-w-lg rounded-3xl bg-white p-4 sm:p-6 border-2 border-[#DCE6F2] shadow-2xl group cursor-pointer"
              onClick={() => navigate('/rice')}
            >
              {/* Product Badge */}
              <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B3B78] text-white text-xs font-bold shadow-md">
                <Sparkles className="w-3 h-3 text-[#FF6B1A]" />
                <span>Featured Rice Harvest</span>
              </div>

              {/* Main Uploaded Rice Photo */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FAF6F0] flex items-center justify-center">
                <img
                  src={rice.src}
                  alt={rice.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 pointer-events-none"
                />
                <span className="absolute bottom-3 left-4 text-white text-xs font-semibold drop-shadow-md">
                  Original Harvest Photography · 100% Authentic Grains
                </span>
              </div>

              {/* Quick specs ribbon under image */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#EEF4FB]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Aging</p>
                  <p className="text-xs font-bold text-[#0B3B78]">24 Months</p>
                </div>
                <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#EEF4FB]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Separation</p>
                  <p className="text-xs font-bold text-[#0B3B78]">Non-Sticky</p>
                </div>
                <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#EEF4FB]">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase">Pack Size</p>
                  <p className="text-xs font-bold text-[#0B3B78]">5 kg / 10 kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7EC] text-[#2E7D32] border border-[#4CAF50]/30 text-xs font-bold">
              <span>Farm Fresh · Aged Basmati & Traditional Rice</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B3B78] leading-tight">
              Quality Rice for Every Kitchen.
            </h2>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Every grain tells a story of golden harvests, patient aging, and
              unmatched aroma. From everyday steamed Ponni and soft Sona Masoori
              to regal aged Basmati biryanis, experience authentic grains delivered
              in sturdy, aroma-sealed sacks.
            </p>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-mono-tabular text-3xl font-bold text-[#0B3B78]">
                ₹{rice.price}
              </span>
              <span className="font-mono-tabular text-sm text-[#94A3B8] line-through">
                ₹{Math.round(rice.price / (1 - rice.discountPercent / 100))}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#FF6B1A] text-white text-xs font-bold">
                {rice.discountPercent}% OFF
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="px-7 py-3.5 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-sm font-bold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add 5kg Sack to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/rice')}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#F0F6FF] text-[#0B3B78] border-2 border-[#0B3B78] text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Shop Rice Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
