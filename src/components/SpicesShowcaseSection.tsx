import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Eye, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { SPICE_COLLECTION_ITEMS, UploadedProductImage } from '../data/uploadedProducts';
import { useStore } from '../context/StoreContext';

export const SpicesShowcaseSection: React.FC = () => {
  const { navigate, addToCart, wishlist, toggleWishlist } = useStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (spice: UploadedProductImage, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      {
        id: spice.id,
        name: spice.name,
        slug: spice.slug,
        category: 'Grocery',
        subcategory: spice.subcategory,
        brand: 'Spice Route',
        price: spice.price,
        discountPercent: spice.discountPercent,
        images: [spice.src],
        shortDescription: spice.description,
        description: spice.description,
        rating: spice.rating,
        reviewCount: spice.reviewsCount,
        stock: 40,
        tags: ['Spices', 'Pure'],
        modelType: 'grocery',
        createdAt: '2024-01-01T00:00:00.000Z',
        featured: true,
        trending: true,
        bestSeller: true,
        newArrival: true,
        variants: [
          { id: 'var-std', name: spice.unit, label: spice.unit, priceDelta: 0, stock: 40 },
          { id: 'var-double', name: `2x ${spice.unit}`, label: `2x ${spice.unit}`, priceDelta: spice.price * 0.9, stock: 25 },
        ],
        specs: [
          { label: 'Origin', value: 'High-Altitude Indian Estates' },
          { label: 'Form', value: 'Whole Unadulterated Pods / Seeds' },
          { label: 'Packaging', value: 'Moisture-Locked Food Grade Pouch' },
        ],
      },
      'var-std',
      1
    );
    setAddedId(spice.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="reveal-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3E8] text-[#D9530F] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>Pure South Indian &amp; Ceylon Spices</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B3B78]">
            Bring Flavour to Every Meal.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/grocery')}
            className="text-sm font-bold text-[#FF6B1A] hover:text-[#E5580D] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore All Groceries &amp; Spices</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Spice Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SPICE_COLLECTION_ITEMS.map((spice) => {
          const isHovered = hoveredId === spice.id;
          const isSaved = wishlist.includes(spice.id);
          const wasJustAdded = addedId === spice.id;

          return (
            <div
              key={spice.id}
              onMouseEnter={() => setHoveredId(spice.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(spice.targetPath)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#FF6B1A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              style={{
                transform: isHovered ? 'translateY(-6px)' : 'none',
              }}
            >
              <div>
                {/* Uploaded Product Image Showcase */}
                <div className="relative aspect-square w-full bg-[#F8FAFC] flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src={spice.src}
                    alt={spice.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0B3B78] text-white text-[11px] font-bold shadow-xs">
                    {spice.label}
                  </span>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(spice.id);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border shadow-xs transition-colors ${
                      isSaved
                        ? 'bg-[#FF6B1A] border-[#FF6B1A] text-white'
                        : 'bg-white/90 border-[#DCE6F2] text-[#0B3B78] hover:text-[#FF6B1A]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <span className="absolute bottom-2 right-2 text-[10px] font-semibold text-[#64748B] bg-white/80 px-2 py-0.5 rounded">
                    {spice.unit}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#4CAF50]">
                    {spice.subcategory}
                  </p>
                  <h3 className="font-display text-lg font-bold text-[#0B3B78] group-hover:text-[#FF6B1A] transition-colors line-clamp-1 mt-0.5">
                    {spice.name}
                  </h3>
                  <p className="text-xs text-[#475569] mt-1 line-clamp-2 leading-relaxed">
                    {spice.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-[#EEF4FB]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono-tabular text-lg font-bold text-[#0B3B78]">
                      ₹{spice.price}
                    </span>
                    {spice.discountPercent > 0 && (
                      <span className="font-mono-tabular text-xs text-[#94A3B8] line-through">
                        ₹{Math.round(spice.price / (1 - spice.discountPercent / 100))}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(spice, e)}
                    className="px-3.5 py-2 rounded-xl bg-[#FF6B1A] hover:bg-[#E5580D] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {wasJustAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
