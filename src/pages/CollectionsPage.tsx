import { useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category3DShowcase } from '../components/Category3DShowcase';
import { getCategoryDisplayName } from '../data/categoryHierarchy';
import { ResilientImage } from '../components/ResilientImage';
import { resolveCategoryFallbackImage } from '../three/resolveProductGlb';
import type { ModelPreset } from '../types';

export function CollectionsPage() {
  const { categories, navigate } = useStore();
  const [activePreset, setActivePreset] = useState<ModelPreset>('rice');

  const activeCategories = useMemo(
    () =>
      [...categories]
        .filter(
          (c) =>
            c.status !== 'inactive' && !c.parentCategoryId && !c.parentId
        )
        .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99)),
    [categories]
  );

  useEffect(() => {
    document.title = 'All 20 Collections | KubreeBazzar';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-10">
      <div className="pb-5 sm:pb-6 border-b border-[#DCE6F2] flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-xs font-bold text-[#1D6FD8] uppercase tracking-[0.18em] mb-1">
            Explore All 20 Departments
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#0B3B78]">
            Department Collections
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#475569] max-w-md">
          Hover or tap any category card below to preview its interactive 3D
          centerpiece before stepping inside.
        </p>
      </div>

      {/* Interactive 3D Stage */}
      <div className="h-[240px] sm:h-[340px] lg:h-[380px] rounded-2xl bg-[#F0F6FF] border border-[#DCE6F2] overflow-hidden relative shadow-xs">
        <Category3DShowcase activePreset={activePreset} />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 max-w-[calc(100%-1.5rem)] truncate px-3 py-1.5 rounded-lg bg-white border border-[#DCE6F2] text-[11px] sm:text-xs font-medium text-[#0B3B78] pointer-events-none shadow-xs">
          Tap or hover any department card below to inspect 3D
        </div>
      </div>

      {/* Responsive Modern Category Cards */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
        {activeCategories.map((cat) => {
          const displayName = getCategoryDisplayName(cat.id, categories);
          const localFallback = resolveCategoryFallbackImage(cat.id);
          const targetUrl = cat.slug
            ? `/${cat.slug}`
            : `/${cat.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

          return (
            <article
              key={cat.id}
              onMouseEnter={() => setActivePreset(cat.modelType || 'rice')}
              onClick={() => navigate(targetUrl)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(targetUrl);
                }
              }}
              className="group h-full cursor-pointer rounded-2xl bg-white border border-[#DCE6F2] hover:border-[#1D6FD8] shadow-[0_4px_16px_-6px_rgba(11,59,120,0.08)] hover:shadow-[0_20px_38px_-14px_rgba(11,59,120,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div
                  className={`aspect-[4/3] w-full overflow-hidden relative border-b border-[#EEF4FB] ${
                    (cat.image || '').includes('/baby-kit/')
                      ? 'bg-[#090C12] p-3 flex items-center justify-center'
                      : 'bg-[#F0F6FF]'
                  }`}
                >
                  <ResilientImage
                    src={cat.image || localFallback}
                    fallbackSrc={localFallback}
                    alt={displayName}
                    className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out ${
                      (cat.image || '').includes('/baby-kit/')
                        ? 'object-contain'
                        : 'object-cover'
                    }`}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B3B78]/70 via-[#0B3B78]/20 to-transparent pointer-events-none"
                  />
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h2 className="font-display text-sm sm:text-base lg:text-lg font-bold text-white line-clamp-1">
                      {displayName}
                    </h2>
                  </div>
                </div>

                <div className="p-3.5 sm:p-5 space-y-1.5">
                  <p className="text-[11px] sm:text-xs font-bold text-[#1D6FD8] line-clamp-1">
                    {cat.subtitle || cat.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#475569] leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 pt-2">
                <span className="w-full py-2 px-3 rounded-xl bg-[#F0F6FF] group-hover:bg-[#FF6B1A] text-[#0B3B78] group-hover:text-white text-[11px] sm:text-xs font-bold flex items-center justify-between transition-colors duration-200">
                  <span className="truncate">Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
