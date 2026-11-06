import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category3DShowcase } from '../components/Category3DShowcase';
import type { ModelPreset } from '../types';

const CATEGORY_IMAGES: Record<string, string> = {
  Rice: '/src/assets/images/product_rice_basmati_1793935955754.jpg',
  Grocery: '/src/assets/images/product_grocery_spices_1793935955305.jpg',
  Honey: '/src/assets/images/product_honey_forest_1793935955585.jpg',
  Watches: '/src/assets/images/product_watch_chronograph_1793935956352.jpg',
};

export function CollectionsPage() {
  const { categories, navigate } = useStore();
  const [activePreset, setActivePreset] = useState<ModelPreset>('rice');

  const pathMap: Record<string, string> = {
    Rice: '/rice',
    Grocery: '/grocery',
    Honey: '/honey',
    Watches: '/watches',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="pb-6 border-b border-[#E6DCD0]">
        <p className="text-xs font-semibold text-[#B88628] uppercase tracking-[0.2em] mb-1">
          Curated Aisles
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1614]">
          3D Department Collections
        </h1>
      </div>

      {/* Interactive 3D Stage */}
      <div className="h-[380px] rounded-2xl bg-[#F3ECE1] border border-[#E6DCD0] overflow-hidden relative">
        <Category3DShowcase activePreset={activePreset} />
        <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-white/90 border border-[#E6DCD0] text-xs text-[#5C4F49] pointer-events-none">
          Hover or select a collection below to inspect its 3D centerpiece
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onMouseEnter={() => setActivePreset(cat.modelType)}
            onClick={() => navigate(pathMap[cat.id] || '/shop')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(pathMap[cat.id] || '/shop');
              }
            }}
            className="cursor-pointer rounded-2xl bg-white border border-[#E6DCD0] hover:border-[#6B1D2F] p-6 flex flex-col justify-between transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#B88628] font-semibold">
                  {cat.itemCount ?? 12} products
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1E1614] mt-1">
                  {cat.title}
                </h2>
                <p className="text-xs text-[#5C4F49] mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <img
                src={
                  CATEGORY_IMAGES[cat.id] ||
                  '/src/assets/images/product_rice_basmati_1793935955754.jpg'
                }
                alt={cat.title}
                className="w-20 h-20 rounded-xl object-cover border border-[#E6DCD0] shrink-0"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0E7DA] flex items-center justify-between text-xs font-semibold text-[#6B1D2F]">
              <span>Browse {cat.id}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
