import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { UPLOADED_PRODUCT_IMAGES } from '../data/uploadedProducts';
import { useStore } from '../context/StoreContext';

export const HoneySpotlightSection: React.FC = () => {
  const { navigate, addToCart } = useStore();
  const honey = UPLOADED_PRODUCT_IMAGES.honey;
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
        id: honey.id,
        name: honey.name,
        slug: honey.slug,
        category: 'Honey',
        subcategory: honey.subcategory,
        brand: 'Nilgiri Hive',
        price: honey.price,
        discountPercent: honey.discountPercent,
        images: [honey.src],
        shortDescription: honey.description,
        description: honey.description,
        rating: honey.rating,
        reviewCount: honey.reviewsCount,
        stock: 60,
        tags: ['Raw Honey', 'Wild Forest'],
        modelType: 'honey',
        createdAt: '2024-01-01T00:00:00.000Z',
        featured: true,
        trending: true,
        bestSeller: true,
        newArrival: true,
        variants: [
          { id: 'var-500g', name: '500 g Glass Jar', label: '500 g Glass Jar', priceDelta: 0, stock: 60 },
          { id: 'var-1kg', name: '1 kg Family Jar', label: '1 kg Family Jar', priceDelta: 450, stock: 40 },
        ],
        specs: [
          { label: 'Origin', value: 'Nilgiri Biosphere Forest Reserve' },
          { label: 'Harvest Style', value: 'Unfiltered, Cold-Extracted' },
          { label: 'Container', value: 'Heavy Food-Grade Ribbed Glass Jar' },
        ],
      },
      'var-500g',
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="reveal-section relative overflow-hidden bg-gradient-to-br from-[#FFF9E6] via-[#FFF3CC] to-[#FFE699] border-y border-[#F0D582] py-16 lg:py-20">
      {/* Golden glow light particles */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 rounded-full bg-[#FFB800]/25 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-5 right-10 w-96 h-96 rounded-full bg-[#FF6B1A]/15 blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Value Props */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 text-[#B87A00] border border-[#E6B800]/40 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Pure Wild Forest Harvest</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A3200] leading-tight">
              Golden Goodness in Every Drop.
            </h2>

            <p className="text-sm sm:text-base text-[#664900] leading-relaxed">
              Harvested directly from high-canopy forest hives and wild blossom
              meadows. Bottled fresh in heavy ribbed glass jars with authentic
              floral nectar notes, natural enzymes, and rich amber viscosity.
            </p>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-mono-tabular text-3xl font-bold text-[#4A3200]">
                ₹{honey.price}
              </span>
              <span className="font-mono-tabular text-sm text-[#8C6D23] line-through">
                ₹{Math.round(honey.price / (1 - honey.discountPercent / 100))}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#D97706] text-white text-xs font-bold">
                {honey.discountPercent}% OFF
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/80 border border-[#F0D582]">
                <p className="font-bold text-[#4A3200]">Heavy Glass Jar</p>
                <p className="text-[#664900] text-[11px] mt-0.5">Tamper-evident lid, zero plastic</p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#F0D582]">
                <p className="font-bold text-[#4A3200]">Unfiltered Raw</p>
                <p className="text-[#664900] text-[11px] mt-0.5">Naturally crystallized amber nectar</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="px-7 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-bold inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add 500g Honey Jar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/honey')}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#FFF9E6] text-[#4A3200] border-2 border-[#4A3200] text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Shop Honey Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Image with 3D Tilt */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: 'transform 180ms ease-out',
              }}
              className="relative w-full max-w-lg rounded-3xl bg-white p-4 sm:p-6 border-2 border-[#F0D582] shadow-2xl group cursor-pointer"
              onClick={() => navigate('/honey')}
            >
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FFFDF0] flex items-center justify-center">
                <img
                  src={honey.src}
                  alt={honey.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 pointer-events-none"
                />
                <span className="absolute bottom-3 left-4 text-white text-xs font-semibold drop-shadow-md">
                  Original Honey Photography · Natural Golden Amber Glow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
